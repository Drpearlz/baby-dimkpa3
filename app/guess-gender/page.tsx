"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { ref, push, set, onValue } from "firebase/database";
import CoupleImageCard from "@/components/couple-image-card";

// Define a proper TypeScript interface for the guess data
interface Guess {
  id: string;
  name: string;
  gender: string;
  timestamp: number;
}

export default function GenderGuess() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [daysLeft, setDaysLeft] = useState(0);
  const dueDate = useMemo(() => {
    return new Date("2025-06-30T18:05:00-09:00");
  }, []);
  useEffect(() => {
    // Calculate days left until the due date
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays > 0 ? diffDays : 0);

    // Fetch guesses from Firebase Realtime Database
    const guessesRef = ref(db, "gender-guesses");
    const unsubscribe = onValue(guessesRef, (snapshot) => {
      const data = snapshot.val();
      const fetchedGuesses: Guess[] = [];

      if (data) {
        // Convert object to array
        Object.keys(data).forEach((key) => {
          const guess = data[key];
          if (
            guess &&
            typeof guess === "object" &&
            "name" in guess &&
            "gender" in guess &&
            "timestamp" in guess
          ) {
            fetchedGuesses.push({
              id: key,
              name: guess.name,
              gender: guess.gender,
              timestamp: guess.timestamp,
            });
          }
        });

        // Sort by timestamp (newest first)
        fetchedGuesses.sort((a, b) => b.timestamp - a.timestamp);
      }

      setGuesses(fetchedGuesses);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [dueDate]); // Added dueDate to the dependency array

  const submitGuess = async () => {
    // Check if name is empty
    if (!name.trim()) {
      alert("Please enter your name to submit a guess");
      return;
    }

    // Check if gender is selected
    if (!gender) {
      alert("Please select boy or girl for your guess");
      return;
    }

    try {
      const guessesRef = ref(db, "gender-guesses");

      // Use push to create a new entry with a unique ID
      const newGuessRef = push(guessesRef);

      // Create the new guess object without id
      const newGuess = {
        name: name.trim(),
        gender: gender,
        timestamp: Date.now(),
      };

      // Set the new guess in the database at the newly generated push ID
      await set(newGuessRef, newGuess);

      alert("Thank you for your guess!");

      // Reset form
      setName("");
      setGender("");
    } catch (error) {
      console.error("Error submitting guess:", error);
      alert("There was a problem submitting your guess. Please try again.");
    }
  };

  // Calculate stats
  const boyGuesses = guesses.filter((g) => g.gender === "boy").length;
  const girlGuesses = guesses.filter((g) => g.gender === "girl").length;
  const totalGuesses = guesses.length;

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-2">
          Gender Guessing Game
        </h1>
        <p className="text-center mb-8 text-muted-foreground">
          Submit your guess for our baby&apos;s gender and see what everyone
          else thinks!
        </p>

        <CoupleImageCard />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Guess</CardTitle>
              <CardDescription>
                Enter your information below to make your prediction
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  <Label>I think it&apos;s a...</Label>
                  <RadioGroup
                    value={gender}
                    onValueChange={setGender}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="boy" id="boy" />
                      <Label
                        htmlFor="boy"
                        className="text-blue-500 font-medium"
                      >
                        Boy
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="girl" id="girl" />
                      <Label
                        htmlFor="girl"
                        className="text-pink-500 font-medium"
                      >
                        Girl
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={submitGuess} className="w-full">
                Submit My Guess
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Results</CardTitle>
              <CardDescription>
                {daysLeft > 0
                  ? `${daysLeft} days left until we know!`
                  : "The results are in!"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">
                    Total Guesses: {totalGuesses}
                  </h3>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-blue-500 font-medium">Boy</span>
                        <span>
                          {boyGuesses} (
                          {totalGuesses > 0
                            ? Math.round((boyGuesses / totalGuesses) * 100)
                            : 0}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-2.5">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          style={{
                            width: `${
                              totalGuesses > 0
                                ? (boyGuesses / totalGuesses) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-pink-500 font-medium">Girl</span>
                        <span>
                          {girlGuesses} (
                          {totalGuesses > 0
                            ? Math.round((girlGuesses / totalGuesses) * 100)
                            : 0}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-pink-100 rounded-full h-2.5">
                        <div
                          className="bg-pink-500 h-2.5 rounded-full"
                          style={{
                            width: `${
                              totalGuesses > 0
                                ? (girlGuesses / totalGuesses) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                    Recent Guesses
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {guesses.length > 0 ? (
                      guesses.slice(0, 5).map((guess) => (
                        <div
                          key={guess.id}
                          className={`text-sm p-2 border rounded-md flex justify-between items-start ${
                            guess.gender === "boy"
                              ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30"
                              : "border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-900/30"
                          }`}
                        >
                          <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            {guess.name}
                          </span>{" "}
                          guessed{" "}
                          <span
                            className={
                              guess.gender === "boy"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-pink-600 dark:text-pink-400"
                            }
                          >
                            {guess.gender}
                          </span>{" "}
                          on{" "}
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            {new Date(guess.timestamp).toLocaleString("en-US", {
                              timeZone: "America/Los_Angeles",
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No guesses yet. Be the first!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
