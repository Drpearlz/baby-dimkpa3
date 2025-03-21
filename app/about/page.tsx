'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Baby, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "sonner";
import CoupleImageCard from "@/components/couple-image-card";
import { ref, onValue, push } from 'firebase/database';
import { db } from '@/lib/firebase';

// Define interfaces
interface Vote {
  id: string;
  name: string;
  guess: 'boy' | 'girl';
  timestamp: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function GenderRevealApp() {
  // State management
  const [name, setName] = useState<string>("");
  const [gender, setGender] = useState<'boy' | 'girl' | ''>("");
  const [votes, setVotes] = useState<Vote[]>([]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  
  // Configuration
  const revealDate = new Date("2025-06-30T00:09:00"); // Set your reveal date here
  const actualGender: 'boy' | 'girl' = 'boy'; // Set the actual gender (only visible after reveal)
  
  // Set up real-time Firebase listener
  useEffect(() => {
    const votesRef = ref(db, 'gender-votes');
    
    const unsubscribe = onValue(votesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const voteArray = Object.entries(data as Record<string, { name: string; guess: 'boy' | 'girl'; timestamp: string }>)
          .map(([id, vote]) => ({
            id,
            name: vote.name,
            guess: vote.guess,
            timestamp: new Date(vote.timestamp)
          }));
        voteArray.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setVotes(voteArray);
      } else {
        setVotes([]);
      }
    });
  
    return () => unsubscribe();
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const targetDate = revealDate.getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsRevealed(true);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    // Check if we're past reveal date on initial load
    const now = new Date().getTime();
    const targetDate = revealDate.getTime();
    if (now >= targetDate) {
      setIsRevealed(true);
    }

    return () => clearInterval(timer);
  }, []);

  // Submit vote/guess
  const submitGuess = async () => {
    // Validation
    if (!name.trim()) {
      alert("Name Required :description: Please enter your name to submit a guess",
      );
      return;
    }
    
    if (!gender) {
      alert("Selection Required, description: Please select boy or girl for your guess",
      );
      return;
    }
    
    try {
      const newVote = {
        name: name.trim(),
        guess: gender,
        timestamp: new Date().toISOString()
      };

      const votesRef = ref(db, 'gender-votes');
      await push(votesRef, newVote);
      
      alert("Guess submitted!, description: Thank you for your guess!",
      );
      
      // Reset form
      setName("");
      setGender("");
    } catch (error) {
      console.error("Error submitting guess:", error);
      toast("Error - description: There was a problem submitting your guess",
    );
    }
  };
  
  // Calculate stats
  const boyVotes = votes.filter(vote => vote.guess === 'boy').length;
  const girlVotes = votes.filter(vote => vote.guess === 'girl').length;
  const totalVotes = votes.length;
  
  // Get winners (correct guesses)
  const getWinners = () => {
    return votes.filter(vote => vote.guess === actualGender)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-100 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-4xl"
      >
        <div className="text-center text-3xl font-bold mb-8">
          <Baby className="inline-block mr-2" />
          Gender Guessing Game
        </div>
        
        <CoupleImageCard />
        
        {/* Countdown Timer Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">
              {isRevealed 
                ? "The Results Are In!" 
                : "Time Until Reveal"
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isRevealed ? (
              <div className="grid grid-cols-4 gap-4 text-center">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="bg-white p-3 rounded-lg shadow">
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-sm text-gray-600 capitalize">{unit}</div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center p-6 bg-gradient-to-r from-blue-100 to-pink-100 rounded-lg"
              >
                <h2 className="text-4xl font-bold mb-4">
                  It&apos;s a {actualGender.toUpperCase()}! 🎉
                </h2>
                <p className="text-lg">Thank you to everyone who participated!</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
        
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div 
              key="voting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Submission Card */}
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
                      <RadioGroup value={gender} onValueChange={(value) => setGender(value as "" | "boy" | "girl")} className="mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="boy" id="boy" />
                          <Label htmlFor="boy" className="text-blue-500 font-medium">Boy</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="girl" id="girl" />
                          <Label htmlFor="girl" className="text-pink-500 font-medium">Girl</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={submitGuess}>Submit My Guess</Button>
                </CardFooter>
              </Card>
              
              {/* Results Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Results</CardTitle>
                  <CardDescription>
                    See what everyone else thinks!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Total Guesses: {totalVotes}</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-blue-500 font-medium">Boy</span>
                            <span>{boyVotes} ({totalVotes > 0 ? Math.round((boyVotes / totalVotes) * 100) : 0}%)</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2.5">
                            <div 
                              className="bg-blue-500 h-2.5 rounded-full" 
                              style={{ width: `${totalVotes > 0 ? (boyVotes / totalVotes) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-pink-500 font-medium">Girl</span>
                            <span>{girlVotes} ({totalVotes > 0 ? Math.round((girlVotes / totalVotes) * 100) : 0}%)</span>
                          </div>
                          <div className="w-full bg-pink-100 rounded-full h-2.5">
                            <div 
                              className="bg-pink-500 h-2.5 rounded-full" 
                              style={{ width: `${totalVotes > 0 ? (girlVotes / totalVotes) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Recent Guesses</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {votes.slice(0, 5).map((vote) => (
                          <div 
                            key={vote.id} 
                            className={`text-sm p-2 border rounded-md ${
                              vote.guess === 'boy' ? 'border-blue-200 bg-blue-50' : 'border-pink-200 bg-pink-50'
                            }`}
                          >
                            <span className="font-medium">{vote.name}</span> guessed{" "}
                            <span className={vote.guess === "boy" ? "text-blue-500" : "text-pink-500"}>
                              {vote.guess}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {vote.timestamp.toLocaleString()}
                            </div>
                          </div>
                        ))}
                        {votes.length === 0 && (
                          <p className="text-sm text-muted-foreground">No guesses yet. Be the first!</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* Reveal Results */
            <motion.div 
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Winners Circle */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-yellow-100 to-yellow-200">
                  <div className="flex items-center justify-center">
                    <Trophy className="text-yellow-600 w-8 h-8 mr-2" />
                    <CardTitle className="text-yellow-800">
                      Winners Circle!
                    </CardTitle>
                  </div>
                  <CardDescription className="text-center text-yellow-700">
                    These people guessed correctly
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {getWinners().map((winner, index) => (
                      <motion.div
                        key={winner.id}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * (index + 1) }}
                        className="bg-green-50 p-4 rounded-lg shadow border border-green-200"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg">
                            {winner.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            Guessed on {winner.timestamp.toLocaleDateString()} at {winner.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {getWinners().length === 0 && (
                      <p className="text-center text-gray-500">No correct guesses yet!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* All Guesses */}
              <Card>
                <CardHeader>
                  <CardTitle>All Guesses</CardTitle>
                  <CardDescription>
                    See all the predictions made
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {votes.map((vote, index) => (
                      <motion.div
                        key={vote.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className={`p-4 rounded-lg border ${
                          vote.guess === actualGender
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{vote.name}</span>
                            <span className="mx-2">guessed</span>
                            <span className={vote.guess === 'boy' ? 'text-blue-500' : 'text-pink-500'}>
                              {vote.guess}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">
                              {vote.guess === actualGender ? '✓ Correct!' : '✗ Incorrect'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {vote.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Final Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold mb-2">
                        {totalVotes} Total Guesses
                      </div>
                      <div className="text-xl">
                        <span className="text-green-600 font-medium">{getWinners().length}</span> correct / 
                        <span className="text-red-600 font-medium"> {totalVotes - getWinners().length}</span> incorrect
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-blue-500 font-bold text-lg mb-2 text-center">Boy Votes</div>
                        <div className="text-center text-3xl font-bold mb-1">{boyVotes}</div>
                        <div className="text-center text-gray-500 text-sm mb-2">
                          ({totalVotes > 0 ? Math.round((boyVotes / totalVotes) * 100) : 0}%)
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-4">
                          <div 
                            className="bg-blue-500 h-4 rounded-full" 
                            style={{ width: `${totalVotes > 0 ? (boyVotes / totalVotes) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-pink-500 font-bold text-lg mb-2 text-center">Girl Votes</div>
                        <div className="text-center text-3xl font-bold mb-1">{girlVotes}</div>
                        <div className="text-center text-gray-500 text-sm mb-2">
                          ({totalVotes > 0 ? Math.round((girlVotes / totalVotes) * 100) : 0}%)
                        </div>
                        <div className="w-full bg-pink-100 rounded-full h-4">
                          <div 
                            className="bg-pink-500 h-4 rounded-full" 
                            style={{ width: `${totalVotes > 0 ? (girlVotes / totalVotes) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}