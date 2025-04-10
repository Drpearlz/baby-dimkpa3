"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Gift, 
  Check, 
  Calendar, 
  Loader2,
  MapPin 
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const BabyShowerInvite = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '0',
    rsvpStatus: 'attending',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Using EmailJS to send the form data
      const emailjsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const emailjsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const emailjsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      
      // Check if the environment variables are defined
      if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
        throw new Error('EmailJS credentials are missing in environment variables');
      }
      
      // Create template parameters object directly
      const templateParams = {
        name: formData.name,
        email: formData.email,
        guests: formData.guests,
        rsvpStatus: formData.rsvpStatus,
        message: formData.message
      };
      
      // Send the email using the direct method
      await emailjs.send(
        emailjsServiceId,
        emailjsTemplateId,
        templateParams,
        emailjsPublicKey
      );
      
      setSubmitted(true);
    } catch (error) {
      console.error('RSVP submission error:', error);
      alert('There was an error sending your RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
    
  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900"
      >
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="flex justify-center mb-4">
              <Check className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Thank You, {formData.name}!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your RSVP for the baby shower has been confirmed.
            </p>
            <Button 
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  guests: '0',
                  rsvpStatus: 'attending',
                  message: ''
                });
              }}
              className="w-full"
            >
              Submit Another RSVP
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl dark:bg-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
              <Gift className="text-pink-500" />
              Baby Dimkpa3 Shower Invitation
            </CardTitle>
            <div className="mt-4 text-gray-600 dark:text-gray-300 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Saturday, June 21, 2025</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>281 Holdom Avenue, Burnaby, BC</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 dark:text-gray-200">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Full Name"
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block mb-2 dark:text-gray-200">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block mb-2 dark:text-gray-200">Number of Guests</label>
                <Select 
                  value={formData.guests} 
                  onValueChange={(value) => handleSelectChange('guests', value)}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Guest{num !== 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-2 dark:text-gray-200">RSVP Status</label>
                <Select 
                  value={formData.rsvpStatus} 
                  onValueChange={(value) => handleSelectChange('rsvpStatus', value)}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <SelectValue placeholder="Select RSVP status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attending">Attending</SelectItem>
                    <SelectItem value="maybe">Maybe</SelectItem>
                    <SelectItem value="not-attending">Not Attending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-2 dark:text-gray-200">Message (Optional)</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Any special notes or dietary requirements?"
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit RSVP"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BabyShowerInvite;
