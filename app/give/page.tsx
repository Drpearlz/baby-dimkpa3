"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  CreditCard, 
  Gift, 
  Baby, 
  DollarSign 
} from 'lucide-react';

// Payment method icons (could be replaced with actual brand logos)
const PaymentMethodIcons = {
  PayPal: Wallet,
  Interac: CreditCard,
  Flutterwave: Gift,
  Paystack: Baby
};

const DonationPage = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const donationAmounts = [10, 25, 50, 100];
  const paymentMethods = ['PayPal', 'Interac', 'Flutterwave', 'Paystack'];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(value ? parseFloat(value) : null);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleSubmit = () => {
    if (selectedAmount && selectedPaymentMethod) {
      // Implement payment logic here
      console.log(`Donating $${selectedAmount} via ${selectedPaymentMethod}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <DollarSign className="text-pink-500" />
              Support Our Baby&apos;s Journey
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Help us welcome our little one with your generous donation
            </p>
          </CardHeader>
          <CardContent>
            {/* Donation Amount Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Choose Donation Amount</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {donationAmounts.map((amount) => (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg text-center font-bold ${
                      selectedAmount === amount 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-pink-100'
                    }`}
                    onClick={() => handleAmountSelect(amount)}
                  >
                    ${amount}
                  </motion.button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Custom Amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
              />
            </div>

            {/* Payment Method Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Select Payment Method</h3>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = PaymentMethodIcons[method as keyof typeof PaymentMethodIcons];
                  return (
                    <motion.div
                      key={method}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center justify-center p-4 rounded-lg cursor-pointer border-2 ${
                        selectedPaymentMethod === method
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                      onClick={() => handlePaymentMethodSelect(method)}
                    >
                      <Icon className={`mr-2 ${selectedPaymentMethod === method ? 'text-pink-500' : 'text-gray-500'}`} />
                      <span className={`font-medium ${selectedPaymentMethod === method ? 'text-pink-700' : 'text-gray-700'}`}>
                        {method}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!selectedAmount || !selectedPaymentMethod}
              className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white"
            >
              Donate Now
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DonationPage;