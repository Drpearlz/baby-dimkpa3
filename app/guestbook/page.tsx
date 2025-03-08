"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase"; // Ensure this is properly configured for Realtime Database
import { ref, push, set, onValue } from "firebase/database"; // Removed 'off' as we'll use the returned unsubscribe function
import { Heart } from "lucide-react";

// Define types for your data
interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: number;
}

export default function Guestbook() {
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);

  useEffect(() => {
    // Create reference to the guestbook data
    const guestbookRef = ref(db, "guestbook");
    
    // Set up the listener for changes and store the unsubscribe function
    const unsubscribe = onValue(guestbookRef, (snapshot) => {
      const data = snapshot.val();
      const entriesArray: GuestbookEntry[] = [];
      
      if (data) {
        // Loop through each key-value pair in the data object
        Object.keys(data).forEach((key) => {
          const entry = data[key];
          // Check if the entry has the expected structure
          if (entry && typeof entry === 'object' && 'name' in entry && 'message' in entry && 'timestamp' in entry) {
            entriesArray.push({
              id: key,
              name: entry.name,
              message: entry.message,
              timestamp: entry.timestamp,
            });
          }
        });
        
        // Sort entries by timestamp (newest first)
        entriesArray.sort((a, b) => b.timestamp - a.timestamp);
      }
      
      setEntries(entriesArray);
    });
  
    // Clean up subscription when component unmounts
    return () => {
      // Use the unsubscribe function returned by onValue
      unsubscribe();
    };
  }, []);

  const submitEntry = async () => {
    if (!name || !message) {
      alert("Please fill in all fields. Both name and message are required.");
      return;
    }

    try {
      const guestbookRef = ref(db, "guestbook");
      const newEntryRef = push(guestbookRef); // Create a new unique ID for each message

      // Create the new entry object
      const newEntry = {
        name,
        message,
        timestamp: Date.now(), // Current timestamp
      };

      // Set the new entry in the database at the generated ref
      await set(newEntryRef, newEntry); // `set` writes data at the reference

      alert("Thank you for your kind words! Message added successfully.");

      // Reset form
      setName("");
      setMessage("");
    } catch (error) {
      console.error("There was a problem submitting your message", error);
      alert("There was a problem submitting your message. Please try again.");
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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