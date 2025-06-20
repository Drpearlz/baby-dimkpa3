"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Gift, Check, ExternalLink } from "lucide-react";
import Image from "next/image";

interface RegistryItem {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  link?: string; // Optional since some items don't have links
}

export default function Registry() {
  const [reserved, setReserved] = useState<Record<string, boolean>>({});
  
  const toggleReserved = (id: string) => {
    setReserved(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const amazonItems: RegistryItem[] = [
    {
      id: "a1",
      name: "Baby Monitor",
      price: "$39.99",
      description: "High-definition audio monitor with 2parent user",
      image: "/moni.jpg",
      link: "https://www.amazon.ca/baby-reg/peggy-roxy-july-2025-burnaby/3SQRSGBZFKO3W",
      category: "Tech"
    },
    {
      id: "a2",
      name: "Diaper Bag",
      price: "$59.99",
      description: "Stylish and functional diaper bag with multiple compartments",
      image: "/bag2.jpg",
      link: "https://www.amazon.ca/baby-reg/peggy-roxy-july-2025-burnaby/3SQRSGBZFKO3W",
      category: "Accessories"
    },
    {
      id: "a3",
      name: "Playard & Activity Centre",
      price: "$72.99",
      description: "Baby playard and activity centre",
      image: "/playard.jpg",
      link: "https://www.amazon.ca/baby-reg/peggy-roxy-july-2025-burnaby/3SQRSGBZFKO3W",
      category: "Furniture"
    },
    {
      id: "a4",
      name: "Baby Bottles Set",
      price: "$29.97",
      description: "Set of 5 anti-colic baby bottles with different flow nipples",
      image: "/bottle.jpg",
      link: "https://www.amazon.ca/baby-reg/peggy-roxy-july-2025-burnaby/3SQRSGBZFKO3W",
      category: "Feeding"
    }
  ];
  
 
  const otherItems: RegistryItem[] = [
    {
      id: "o1",
      name: "African Pear",
      price: "Any",
      description: "Found in African stores",
      image: "/ube.jpg",
      category: "Feeding"
    },
    {
      id: "o2",
      name: "Gentle used clothing",
      price: "Any",
      description: "Any gender-neutral onesies, sleepers, or outfits",
      image: "/cloth.jpg",
      category: "Essentials"
    },
    {
      id: "o3",
      name: "Lucozade (Mother)",
      price: "Any",
      description: "Found in African stores",
      image: "/lucozade.jpg",
      category: "Essentials"
    },
    {
      id: "o4",
      name: "Blueband",
      price: "Any",
      description: "Found in African stores",
      image: "/blb.jpg",
      category: "Feeding"
    }
  ];
  
  const renderItem = (item: RegistryItem) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={reserved[item.id] ? "border-green-500" : ""}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.price}</CardDescription>
            </div>
            <Badge variant="outline">{item.category}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-square w-full overflow-hidden rounded-md mb-4">
            <Image
              src={item.image}
              alt={item.name}
              width={400}
              height={200}
              className="object-cover transition-all hover:scale-105"
            />
          </div>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          {item.link ? (
            <Button variant="outline" size="sm" asChild>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="h-4 w-4 mr-2" /> View Item
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <Gift className="h-4 w-4 mr-2" /> General Item
            </Button>
          )}
          
          <Button 
            variant={reserved[item.id] ? "outline" : "default"} 
            size="sm"
            onClick={() => toggleReserved(item.id)}
          >
            {reserved[item.id] ? (
              <>
                <Check className="h-4 w-4 mr-2" /> Reserved
              </>
            ) : (
              "I'll Get This"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
  
  return (
    <div className="container mx-auto px-4 py-12">
      <a 
  href="https://www.amazon.ca/baby-reg/peggy-roxy-july-2025-burnaby/3SQRSGBZFKO3W" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="block text-center mb-8 text-muted-foreground hover:underline"
>
  <div className="flex items-center justify-center gap-2">
    <ExternalLink className="h-7 w-7" />
    <h1 className="text-3xl font-bold">Baby Registry</h1>
  </div>
</a>
      <p className="text-center mb-8 text-muted-foreground">
      Hi family and friends, We&apos;ve set up a registry on Amazon for some things we might
       need for baby Dimkpa 3. Don&apos;t feel pressured to get anything. The list is more of a guide. 
       Feel free to shop elsewhere if needed. See you at the shower on June 21 @ 3pm. Cheers. Osorochi & Peggy
      </p>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="amazon">Amazon</TabsTrigger>
          <TabsTrigger value="other">Other Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6">
            {[...amazonItems, ...otherItems].map(renderItem)}
          </div>
        </TabsContent>
        
        <TabsContent value="amazon">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6">
            {amazonItems.map(renderItem)}
          </div>
        </TabsContent>
    
        
        <TabsContent value="other">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6">
            {otherItems.map(renderItem)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
