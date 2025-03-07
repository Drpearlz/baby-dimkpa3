import { useState } from 'react';
import { Container, Navbar, Nav, Button } from '@/components/ui/button';
import Link from 'next/link';

const NavbarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar className="sticky top-0 z-10 bg-white shadow-md">
      <Container className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-bold mr-4">
              Baby Shower Registry
            </Link>
            <button
              className="lg:hidden flex justify-center w-8 h-8 bg-gray-200 rounded-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <Nav>
              <a href="/guess-the-baby" className="text-gray-600 hover:text-gray-900">
                Guess the Baby
              </a>
              <a href="/leave-a-note" className="text-gray-600 hover:text-gray-900">
                Leave a Note
              </a>
              <a href="/registry" className="text-gray-600 hover:text-gray-900">
                Registry
              </a>
            </Nav>
            <Button href="/contact" className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded">
              Contact
            </Button>
          </div>
        </div>
        {isOpen && (
          <div className="lg:hidden flex flex-col items-center space-y-4 mt-4">
            <Link href="/guess-the-baby" className="text-gray-600 hover:text-gray-900">
              Guess the Baby
            </Link>
            <Link href="/leave-a-note" className="text-gray-600 hover:text-gray-900">
              Leave a Note
            </Link>
            <Link href="/registry" className="text-gray-600 hover:text-gray-900">
              Registry
            </Link>
            <Button href="/contact" className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded">
              Contact
            </Button>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
