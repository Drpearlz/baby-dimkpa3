"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: Timestamp;
}

export default function GuestbookPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  
  useEffect(() => {
    // Set up real-time listener for guestbook entries
    const q = query(collection(db, "guestbook"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const guestbookEntries: GuestbookEntry[] = [];
      querySnapshot.forEach((doc) => {
        guestbookEntries.push({
          id: doc.id,
          ...doc.data() as Omit<GuestbookEntry, 'id'>
        });
      });
      setEntries(guestbookEntries);
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, []);
  
  const submitEntry = async () => {
    if (!name || !message) {
      toast.error("Please fill in all fields", {
        description: "Both name and message are required"
      });
      return;
    }
    
    try {
      await addDoc(collection(db, "guestbook"), {
        name,
        message,
        timestamp: new Date(),
      });
      
      toast.success("Message added!", {
        description: "Thank you for your kind words!"
      });
      
      // Reset form
      setName("");
      setMessage("");
    } catch (error) {
       
      console.error("Submission error:", error);
      
      toast.error("Error", {
        description: "There was a problem submitting your message"
      });
    }
  };
  
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-2">Guestbook</h1>
        <p className="text-center mb-8 text-muted-foreground">
          Leave a message for the parents-to-be and the new baby!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea 
                      id="message" 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      placeholder="Write your message of congratulations or advice..."
                      rows={5}
                    />
                  </div>
                  
                  <Button onClick={submitEntry} className="w-full">
                    Add Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <div className="space-y-4">
              {entries.length === 0 ? (
                <div className="text-center p-8 border rounded-lg">
                  <p className="text-muted-foreground">No messages yet. Be the first to leave a message!</p>
                </div>
              ) : (
                entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{entry.name}</h3>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(entry.timestamp)}
                      </div>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap">{entry.message}</p>
                    <div className="mt-3 flex justify-end">
                      <Heart className="h-4 w-4 text-red-500" />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}