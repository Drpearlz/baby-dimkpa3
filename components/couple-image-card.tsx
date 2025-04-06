import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const CoupleImageCard = () => {
  const imageOptions = ["/bump.png", "/p1.jpg", "/p4.jpg", "/p3.jpg"];
  const [image, setImage] = useState(imageOptions[0]);

  const changeImage = () => {
    const nextImage = imageOptions[(imageOptions.indexOf(image) + 1) % imageOptions.length];
    setImage(nextImage);
  };

  return (
    <div className="w-full flex justify-center items-center p-4">
      <Card className="w-full max-w-2xl overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div 
          className="relative cursor-pointer"
          onClick={changeImage}
        >
          <div className="relative h-[400px]">
            <Image
              src={image}
              alt="Couple Image"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <p className="text-white text-lg font-medium">
              Tap to change image
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CoupleImageCard;