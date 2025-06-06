"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Baby, CalendarDays } from "lucide-react";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("family");

  // Family members data
  const familyMembers = [
    {
      id: "dad",
      name: "Dad",
      role: "Osorochi",
      image: "/dad.jpg", // Replace with actual image path
      description:
        "Amateur chef by night. I love spending time with family and friends.",
      funFacts: [
        "Can name the botanical names of his favourite foods",
        "Makes the best fried rice in the World",
        "Had done up to 50km by foot in one day",
      ],
    },
    {
      id: "mom",
      name: "Mum",
      role: "Peggy",
      image: "/Mum.jpg", // Replace with actual image path
      description:
        "Software engineer by day, amateur chef by night. I love building things, whether it's code or furniture. When I'm not working, you'll find me playing soccer or trying to learn something online.",
      funFacts: [
        "An engineer, a scientist and a lifelong learner",
        "Can speak three languages",
        "Makes bespoke websites for fun",
      ],
    },
    {
      id: "children",
      name: "Kids",
      role: "ChiLiveth and Chimenem",
      image: "/Kids.jpg", // Replace with actual image path
      description:
        "ChiLiveth is a fourth-grader who loves science experiments and ballet. She is excited to be a big sister again and has years of experience with her brother. Her favorite things are playing the piano, crochetting, and playing with my squishy doughs. For Chimenem he enjoys Gecko (PJ Masks), Spidey and Chase (Paw Patrol).",
      funFacts: [
        "Chimenem is the best lawyer in the family.",
        "Their birthdays are in July, a week apart",
        "ChiLiveth has done 4+ dance shows",
      ],
    },
   
    {
      id: "baby",
      name: "Baby",
      role: "Coming Soon",
      image: "/baby.jpg", // Replace with actual image path
      description:
        "The newest member of our family, arriving soon! Everyone is excited to meet this little one and discover their unique personality. The nursery is not ready but filled with books, toys, and lots of love.",
      funFacts: [
        "Already has a collection of hand-me-down books",
        "Dad thinks Baby will be musical",
        "Mom thinks Baby will be athletic",
        "The siblings think they are sure of babys gender",
      ],
    },
  ];

  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold mb-2">Meet The Family</h1>
          <p className="text-xl text-muted-foreground mb-4">
            A family of four (soon to be five!)
          </p>
          <div className="flex justify-center items-center gap-2 mb-6">
            <Heart className="text-pink-500" />
            <span className="text-muted-foreground">Established 2015</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="mb-8">
            <CardHeader>
              <Tabs
                defaultValue="family"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid grid-cols-5 md:grid-cols-5 mb-4">
                  <TabsTrigger value="family">Family</TabsTrigger>
                  {familyMembers.map((member) => (
                    <TabsTrigger key={member.id} value={member.id}>
                      {member.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <CardTitle>
                  {activeTab === "family"
                    ? "Our Story"
                    : familyMembers.find((m) => m.id === activeTab)?.name || ""}
                </CardTitle>
                <CardDescription>
                  {activeTab === "family"
                    ? "A little bit about us"
                    : familyMembers.find((m) => m.id === activeTab)?.role || ""}
                </CardDescription>
              </Tabs>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="family" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                        <Image
                          src="/Fam.jpg"
                          alt="Family together"
                          className="object-cover"
                          fill
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        <span>Fall 2024</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p>
                        We&apos;re the Madukorom-Dimkpa&apos;s family, living in beautiful British Columbia,
                        Canada. Our journey began when Osorochi and Peggy met in the
                        university and married in 2015. Since then, we&apos;ve welcomed
                        two amazing children, ChiLiveth and Chimenem, into our lives.
                      </p>
                      <p>
                        Now we&apos;re eagerly awaiting the arrival of our newest
                        family member! Our days are filled with school and geocery runs,
                        dance practice, weekend activities, and preparing our
                        home and hearts for baby number three.
                      </p>
                      <p>
                        We love traveling, game nights, cooking and eating together with community 
                        . Our home is usually
                        noisy, often messy, but always filled with laughter and
                        love from family and friends.
                      </p>
                      <div className="flex items-center gap-2 mt-4">
                        <Baby className="h-5 w-5 text-cyan-500" />
                        <span className="font-medium">
                          Baby #3 arriving Summer 2025!
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {familyMembers.map((member) => (
                  <TabsContent key={member.id} value={member.id} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
                          <Image
                            src={member.image}
                            alt={member.name}
                            className="object-cover"
                            fill
                          />
                        </div>
                        
                      </div>

                      <div className="space-y-4">
                        <p>{member.description}</p>

                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mt-4">
                          <h3 className="font-medium mb-2">Fun Facts</h3>
                          <ul className="space-y-1">
                            {member.funFacts.map((fact, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{fact}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* <motion.div variants={itemVariants}>
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Family Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <h3 className="font-medium mb-2 text-center">Adventure</h3>
                <p className="text-sm text-center text-muted-foreground">
                  We believe in exploring new places, trying new things, and embracing the unknown together.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <h3 className="font-medium mb-2 text-center">Creativity</h3>
                <p className="text-sm text-center text-muted-foreground">
                  We encourage imagination, expression, and finding unique solutions to life&apos;s challenges.
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <h3 className="font-medium mb-2 text-center">Togetherness</h3>
                <p className="text-sm text-center text-muted-foreground">
                  We prioritize family time, supporting each other, and creating memories that will last forever.
                </p>
              </div>
            </div>
          </div>
        </motion.div> */}

        <motion.div variants={itemVariants} className="text-center">
          <p className="text-muted-foreground">
            Thanks for getting to know our family! We&apos;re excited about this new chapter in our lives.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
