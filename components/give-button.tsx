"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Wallet, 
  CreditCard,  
  Baby, 
  HeartHandshake
} from 'lucide-react';

// Payment method configuration
const PaymentMethods = [
  {
    name: 'PayPal',
    icon: Wallet,
    link: 'https://www.paypal.me/drpearlz', // Replace with actual PayPal link
  },
  {
    name: 'Interac',
    icon: CreditCard,
    link: '', // Add Interac e-transfer details or link
    details: 'Email: roxy@sfu.ca'
  },
  {
    name: 'Paystack',
    icon: Baby,
    link: 'https://paystack.com/pay/pegos2025', // Replace with actual Paystack link
  }
];

const GiveButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const handlePaymentMethodSelect = (method: typeof PaymentMethods[number]) => {
    setSelectedPaymentMethod(method.name);
    
    // If a link exists, open it
    if (method.link) {
      window.open(method.link, '_blank', 'noopener,noreferrer');
    }
    
    // If no link but details exist, you might want to show a modal or alert
    if (!method.link && method.details) {
      alert(`Payment Details for ${method.name}: ${method.details}`);
    }
    
    // Close the popup
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Donation Trigger Button */}
      <div className="fixed bottom-14 right-4 z-50">
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => setIsOpen(true)}
    className="bg-cyan-500 text-white dark:bg-cyan-600 rounded-full p-3 shadow-lg hover:bg-cyan-400 dark:hover:bg-cyan-500"
  >
    give <HeartHandshake size={32} />
  </motion.button>
</div>

      {/* Bottom Sheet Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="fixed bottom-5 left-0 right-0 z-50"
            >
              <Card className="w-full max-w-md mx-auto rounded-t-2xl dark:bg-gray-800">
                <CardHeader className="text-center relative">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    ✕
                  </button>
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2">
                    Support Our Baby&apos;s Journey
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Join us welcome our little one with your gift
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Payment Method Selection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
                      Select Your Giving Method
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {PaymentMethods.map((method) => (
                        <motion.div
                          key={method.name}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center justify-center p-4 rounded-lg cursor-pointer border-2 
                            ${selectedPaymentMethod === method.name
                              ? 'border-cyan-500 bg-cyan-50 dark:border-cyan-600 dark:bg-gray-700'
                              : 'border-gray-200 hover:border-cyan-300 dark:border-gray-600 dark:hover:border-cyan-600'
                            }`}
                          onClick={() => handlePaymentMethodSelect(method)}
                        >
                          <method.icon 
                            className={`mr-2 
                              ${selectedPaymentMethod === method.name 
                                ? 'text-cyan-500 dark:text-cyan-400' 
                                : 'text-gray-500 dark:text-gray-400'
                              }`} 
                          />
                          <span 
                            className={`font-medium 
                              ${selectedPaymentMethod === method.name 
                                ? 'text-cyan-700 dark:text-cyan-300' 
                                : 'text-gray-700 dark:text-gray-200'
                              }`}
                          >
                            {method.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GiveButton;
