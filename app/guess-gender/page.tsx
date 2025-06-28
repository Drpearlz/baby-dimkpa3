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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { ref, push, set, onValue } from "firebase/database";
import CoupleImageCard from "@/components/couple-image-card";
import { Check, X, Clock, Trophy, CalendarDays } from "lucide-react";

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
  const [hoursLeft, setHoursLeft] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState("stats");

  // Set your due date here
  const dueDate = useMemo(() => {
    return new Date("2025-07-05T18:05:00-09:00");
  }, []);

  // Set the actual gender once revealed (empty string means not revealed yet)
  const actualGender = "boy"; // Change this when gender is revealed (boy/girl)

  useEffect(() => {
    // Update countdown timer every second
    const updateTimer = () => {
      const now = new Date();
      const diffTime = dueDate.getTime() - now.getTime();

      if (diffTime <= 0) {
        // It's reveal time!
        setIsRevealed(true);
        setDaysLeft(0);
        setHoursLeft(0);
        setMinutesLeft(0);
        setSecondsLeft(0);
      } else {
        // Calculate remaining time
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

        setDaysLeft(days);
        setHoursLeft(hours);
        setMinutesLeft(minutes);
        setSecondsLeft(seconds);
      }
    };

    // Initial call
    updateTimer();

    // Set up interval for countdown
    const timerInterval = setInterval(updateTimer, 1000);

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

    // Clean up subscription and interval
    return () => {
      clearInterval(timerInterval);
      unsubscribe();
    };
  }, [dueDate]);

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

  // Format timestamp to readable date
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

  // Calculate stats
  const boyGuesses = guesses.filter((g) => g.gender === "boy").length;
  const girlGuesses = guesses.filter((g) => g.gender === "girl").length;
  const totalGuesses = guesses.length;

  // Calculate winners (those who guessed correctly)
  const winners =
    isRevealed && actualGender
      ? guesses.filter((g) => g.gender === actualGender)
      : [];

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

        {/* Countdown or Reveal Section */}
        <div className="my-8">
          {isRevealed && actualGender ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`text-center p-8 rounded-xl ${
                actualGender === "boy" ? "bg-blue-50" : "bg-pink-50"
              }`}
            >
              <h2 className="text-4xl font-bold mb-4">
                It&apos;s a {actualGender === "boy" ? "BOY!" : "GIRL!"}
              </h2>
              <p className="text-xl">
                We are excited to reveal that we&apos;re having a beautiful{" "}
                {actualGender === "boy" ? "baby boy" : "baby girl"}!
              </p>
              {winners.length > 0 && (
                <p className="mt-4">
                  {winners.length} people guessed correctly! Check the Winners
                  Circle tab below.
                </p>
              )}
            </motion.div>
          ) : (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Countdown to Reveal</CardTitle>
                <CardDescription>
                  Our baby&apos;s gender will be revealed on{" "}
                  {dueDate.toLocaleDateString()} or after.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Fixed: Changed to use flex with flex-wrap for better mobile responsiveness */}
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-full sm:w-36">
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 text-center">
                      {daysLeft}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
                      Days
                    </p>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-full sm:w-36">
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 text-center">
                      {hoursLeft}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
                      Hours
                    </p>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-full sm:w-36">
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 text-center">
                      {minutesLeft}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
                      Minutes
                    </p>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-full sm:w-36">
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 text-center">
                      {secondsLeft}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
                      Seconds
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

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
              <Button
                onClick={submitGuess}
                className="w-full"
                disabled={isRevealed}
              >
                {isRevealed ? "Guessing Closed" : "Submit My Guess"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Tabs
                defaultValue="stats"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                  {isRevealed && (
                    <TabsTrigger value="winners">Winners</TabsTrigger>
                  )}
                  <TabsTrigger value="allGuesses">All Guesses</TabsTrigger>
                </TabsList>

                <CardTitle>
                  {activeTab === "stats" && "Current Results"}
                  {activeTab === "winners" && "Winners Circle"}
                  {activeTab === "allGuesses" && "Everyone's Guesses"}
                </CardTitle>

                <CardDescription>
                  {activeTab === "stats" &&
                    (isRevealed
                      ? "The results are in!"
                      : `${daysLeft} days left until we know!`)}
                  {activeTab === "winners" &&
                    "Congratulations to everyone who guessed correctly!"}
                  {activeTab === "allGuesses" &&
                    `${totalGuesses} total guesses submitted`}
                </CardDescription>
              </Tabs>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="stats" className="mt-0">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">
                        Total Guesses: {totalGuesses}
                      </h3>

                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-blue-500 font-medium">
                              Boy
                            </span>
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
                            <span className="text-pink-500 font-medium">
                              Girl
                            </span>
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
                      <h3 className="font-medium mb-2">Recent Guesses</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {guesses.length > 0 ? (
                          guesses.slice(0, 5).map((guess) => (
                            <div
                              key={guess.id}
                              className="text-sm p-2 border rounded-md"
                            >
                              <span className="font-medium">{guess.name}</span>{" "}
                              guessed{" "}
                              <span
                                className={
                                  guess.gender === "boy"
                                    ? "text-blue-500"
                                    : "text-pink-500"
                                }
                              >
                                {guess.gender}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No guesses yet. Be the first!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="winners" className="mt-0">
                  {isRevealed && actualGender ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-medium">
                          {winners.length}{" "}
                          {winners.length === 1 ? "person" : "people"} guessed
                          correctly!
                        </h3>
                      </div>

                      {winners.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {winners.map((winner) => (
                            <motion.div
                              key={winner.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`p-3 rounded-md flex justify-between items-center ${
                                actualGender === "boy"
                                  ? "bg-blue-50"
                                  : "bg-pink-50"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span className="font-medium">
                                  {winner.name}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(winner.timestamp)}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center p-4 border rounded-lg">
                          No one guessed correctly! What a surprise!
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p>The gender hasn&apos;t been revealed yet!</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="allGuesses" className="mt-0">
                  <div className="space-y-4">
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {guesses.length > 0 ? (
                        guesses.map((guess) => (
                          <div
                            key={guess.id}
                            className={`p-3 rounded-md border flex justify-between items-start ${
                              isRevealed &&
                              actualGender &&
                              guess.gender === actualGender
                                ? "border-green-300 bg-green-50"
                                : ""
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {guess.name}
                                </span>
                                {isRevealed &&
                                  actualGender &&
                                  (guess.gender === actualGender ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-500" />
                                  ))}
                              </div>
                              <div className="flex items-center mt-1 gap-1">
                                <span
                                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                    guess.gender === "boy"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-pink-100 text-pink-700"
                                  }`}
                                >
                                  {guess.gender}
                                </span>
                              </div>
                            </div>

                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {formatDate(guess.timestamp)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-4 border rounded-lg">
                          <p className="text-muted-foreground">
                            No guesses yet. Be the first!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
