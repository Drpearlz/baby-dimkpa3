// components/Footer.tsx
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="border-t py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-lg font-semibold">
              Baby Dimkpa³ Shower/Registry
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Celebrating #PegOs2015 Children&apos;s birthday and their latest arrival&apos;s shower with love
            </p>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" /> by Peggy
            <span>© {year}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
