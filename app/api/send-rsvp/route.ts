// File: app/api/send-rsvp/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

export async function POST(request: Request) {
    try {
      // Get form data from request
      const formData = await request.json();
      const { name, email, guests, rsvpStatus, message } = formData;
  
      // === NODEMAILER EMAIL SENDING ===
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const currentDate = new Date().toLocaleString();
      
      let statusClass = '';
      switch (rsvpStatus) {
        case 'attending':
          statusClass = 'color: #4caf50; font-weight: bold;';
          break;
        case 'maybe':
          statusClass = 'color: #ff9800; font-weight: bold;';
          break;
        case 'not-attending':
          statusClass = 'color: #f44336; font-weight: bold;';
          break;
      }
  
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .header {
              background-color: #9370db;
              padding: 15px;
              text-align: center;
              border-radius: 5px 5px 0 0;
              color: white;
            }
            .content {
              padding: 20px;
            }
            .detail {
              margin-bottom: 10px;
            }
            .label {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Baby Shower & Birthdays RSVP 🎁</h1>
            </div>
            <div class="content">
              <div class="detail">
                <span class="label">Name:</span> ${name}
              </div>
              <div class="detail">
                <span class="label">Email:</span> ${email}
              </div>
              <div class="detail">
                <span class="label">Number of Guests:</span> ${guests}
              </div>
              <div class="detail">
                <span class="label">RSVP Status:</span> 
                <span style="${statusClass}">${rsvpStatus}</span>
              </div>
              ${message ? `
              <div class="detail">
                <span class="label">Message:</span>
                <p>${message}</p>
              </div>
              ` : ''}
              <hr>
              <p>Submitted on: ${currentDate}</p>
            </div>
          </div>
        </body>
        </html>
      `;
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL,
        subject: `Baby Shower & Birthdays RSVP from ${name}`,
        html: htmlContent,
        cc: email,
      };
  
      await transporter.sendMail(mailOptions);
  
      // === GOOGLE SHEETS INTEGRATION ===
         // Prepare row data
         const values = [
          [
            name,
            email,
            guests,
            rsvpStatus,
            message || '',
            currentDate
          ]
        ];
      console.log("Appending data to spreadsheet...");

      // Setup Google Sheets API authentication
      const credentials = {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };
      
      // Create a JWT client
      const jwtClient = new google.auth.JWT(
        credentials.client_email,
        undefined,
        credentials.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']
      );

      await jwtClient.authorize();

      const sheets = google.sheets({ version: 'v4', auth: jwtClient });

      // Append data to the spreadsheet
   const sheetResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A:F', // Adjust the sheet name and range as needed
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });
      console.log("Sheets  API response:", sheetResponse.data);
  
      return NextResponse.json({ 
        success: true,
        message: 'RSVP submitted successfully and saved to spreadsheet' 
      }, {status: 200});
      
    } catch (sheetsError) {
      console.error('Google sheets specific error:', sheetsError);
      //still return succcess for email but with a note about sheets error
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to process RSVP', 
          error: sheetsError instanceof Error ? sheetsError.message : 'Unknown error' 
        },
        { status: 500 }
      );
    }
  }  
