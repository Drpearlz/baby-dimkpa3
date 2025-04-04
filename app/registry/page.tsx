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
import { ShoppingCart, Gift, Check } from "lucide-react";
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
      price: "$149.99",
      description: "High-definition video monitor with night vision and two-way audio",
      image: "/api/placeholder/200/200",
      link: "https://www.amazon.ca/baby-reg/peggy-roxy-july-2025-burnaby/3SQRSGBZFKO3W",
      category: "Tech"
    },
    {
      id: "a2",
      name: "Diaper Bag",
      price: "$59.99",
      description: "Stylish and functional diaper bag with multiple compartments",
      image: "/api/placeholder/200/200",
      link: "https://www.amazon.ca/baby-reg/peggy-roxy-july-2025-burnaby/3SQRSGBZFKO3W",
      category: "Accessories"
    },
    {
      id: "a3",
      name: "Baby Swing",
      price: "$129.99",
      description: "Automatic baby swing with multiple speed settings and sounds",
      image: "/api/placeholder/200/200",
      link: "https://www.amazon.ca/baby-reg/peggy-roxy-july-2025-burnaby/3SQRSGBZFKO3W",
      category: "Furniture"
    },
    {
      id: "a4",
      name: "Baby Bottles Set",
      price: "$34.99",
      description: "Set of 5 anti-colic baby bottles with different flow nipples",
      image: "/api/placeholder/200/200",
      link: "https://amazon.com",
      category: "Feeding"
    }
  ];
  
  const bestBuyItems: RegistryItem[] = [
    {
      id: "b1",
      name: "Baby White Noise Machine",
      price: "$39.99",
      description: "Soothing white noise machine with timer function",
      image: "/api/placeholder/200/200",
      link: "https://bestbuy.com",
      category: "Tech"
    },
    {
      id: "b2",
      name: "Baby Room Humidifier",
      price: "$49.99",
      description: "Cool mist humidifier with auto shut-off",
      image: "/api/placeholder/200/200",
      link: "https://bestbuy.com",
      category: "Tech"
    }
  ];
  
  const otherItems: RegistryItem[] = [
    {
      id: "o1",
      name: "Baby Clothes (0-3 months)",
      price: "Any",
      description: "Any gender-neutral onesies, sleepers, or outfits",
      image: "/api/placeholder/200/200",
      category: "Clothing"
    },
    {
      id: "o2",
      name: "Diapers (Newborn)",
      price: "Any",
      description: "Any brand of newborn diapers",
      image: "/api/placeholder/200/200",
      category: "Essentials"
    },
    {
      id: "o3",
      name: "Baby Books",
      price: "Any",
      description: "Board books or fabric books for baby",
      image: "/api/placeholder/200/200",
      category: "Educational"
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
      <h1 className="text-3xl font-bold text-center mb-2">Baby Registry</h1>
      <p className="text-center mb-8 text-muted-foreground">
        Help us prepare for our little one by choosing a gift from our registry
      </p>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="amazon">Amazon</TabsTrigger>
          <TabsTrigger value="bestbuy">Best Buy</TabsTrigger>
          <TabsTrigger value="other">Other Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {[...amazonItems, ...bestBuyItems, ...otherItems].map(renderItem)}
          </div>
        </TabsContent>
        
        <TabsContent value="amazon">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {amazonItems.map(renderItem)}
          </div>
        </TabsContent>
        
        <TabsContent value="bestbuy">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {bestBuyItems.map(renderItem)}
          </div>
        </TabsContent>
        
        <TabsContent value="other">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {otherItems.map(renderItem)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
