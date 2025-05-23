import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import GiveButton from "@/components/give-button";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Baby Dimkpa's website",
  description: "A website for our upcoming baby and kids",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
            <GiveButton/>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
