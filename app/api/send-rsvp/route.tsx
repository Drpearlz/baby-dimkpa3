// File: app/api/send-rsvp/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // Get form data from request
    const formData = await request.json();
    const { name, email, guests, rsvpStatus, message } = formData;

    // Create a transporter with your email service credentials
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // e.g., 'gmail', 'outlook', etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Format the date
    const currentDate = new Date().toLocaleString();

    // Determine status class for styling
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

    // Build the HTML email content
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
            <h1>New Baby Shower RSVP 🎁</h1>
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

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL, // Who should receive the RSVP notifications
      subject: `Baby Shower RSVP from ${name}`,
      html: htmlContent,
      // Optional: Send a copy to the person who RSVP'd
      cc: email,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'RSVP submitted successfully' 
    });
  } catch (error) {
    console.error('Error sending RSVP email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send RSVP email' },
      { status: 500 }
    );
  }
}