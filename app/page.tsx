"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
          Welcome to Our Baby Shower!
        </h1>
        <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
          We&apos;re excited to celebrate this special moment with you
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
          <Link href="/guess-gender" className="block">
            <div className="border rounded-lg p-4 sm:p-6 h-full transition-all hover:shadow-lg hover:border-primary">
              <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 mb-3 sm:mb-4 mx-auto text-pink-500" />
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">Gender Guess</h2>
              <p className="text-sm sm:text-base">
                Submit your guess for the baby&apos;s gender and see what others think!
              </p>
            </div>
          </Link>
          
          <Link href="/registry" className="block">
            <div className="border rounded-lg p-4 sm:p-6 h-full transition-all hover:shadow-lg hover:border-primary">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 sm:h-12 sm:w-12 mb-3 sm:mb-4 mx-auto text-blue-500"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">Gift Registry</h2>
              <p className="text-sm sm:text-base">
                See the items we need for the baby and help us prepare!
              </p>
            </div>
          </Link>
          
          <Link href="/guest-book" className="block">
            <div className="border rounded-lg p-4 sm:p-6 h-full transition-all hover:shadow-lg hover:border-primary">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 sm:h-12 sm:w-12 mb-3 sm:mb-4 mx-auto text-purple-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">Guestbook</h2>
              <p className="text-sm sm:text-base">
                Leave a note of congratulations and well-wishes for our growing family!
              </p>
            </div>
          </Link>
        </div>
        
        <div className="mt-8 sm:mt-12">
          <Link href="/about">
            <Button size="lg" className="font-semibold w-full sm:w-auto">
              Learn More About Our Journey
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}