"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="container mx-auto px-4 py-4 relative">
      <div className="flex justify-between items-center">
        {/* Logo - Now wrapped in Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl sm:text-2xl font-bold"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Baby Dimkpa 3
          </Link>
        </motion.div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/guess-gender"
            className="hover:text-primary transition-colors"
          >
            Guess Gender
          </Link>
          <Link
            href="/registry"
            className="hover:text-primary transition-colors"
          >
            Registry
          </Link>
          <Link
            href="/guestbook" // Changed to match typical Next.js routing
            className="hover:text-primary transition-colors"
          >
            Guestbook
          </Link>
          <Button variant="default" size="sm">
            Check on Mum
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full bg-background shadow-lg z-50">
          <div className="flex flex-col items-center space-y-4 p-6">
            <Link
              href="/guess-gender"
              className="w-full text-center py-2 hover:bg-accent rounded"
              onClick={toggleMenu}
            >
              Guess Gender
            </Link>
            <Link
              href="/registry"
              className="w-full text-center py-2 hover:bg-accent rounded"
              onClick={toggleMenu}
            >
              Registry
            </Link>
            <Link
              href="/guestbook" // Changed to match typical Next.js routing
              className="w-full text-center py-2 hover:bg-accent rounded"
              onClick={toggleMenu}
            >
              Guestbook
            </Link>
            <Button variant="default" className="w-full" asChild>
              <Link href="https:/wa.link/b5hb53" target="_blank" rel="noopener noreferrer">
                Check on Mum
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
