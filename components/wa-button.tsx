import React from "react";
import Image from "next/image";

export default function Wabutton() {
    return (
  
   <div className="flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10">
        <div>
          <a
            title="Get help on WhatsApp"
            href="https://www.wa.link/1j1wsw"
            target="_blank"
            className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12"
          >
            <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png"
                alt="App Interface"
                width={400}
                height={320}
                className="object-cover object-center w-full h-full rounded-full"
              />
          </a>
        </div>
      </div>
    );
}