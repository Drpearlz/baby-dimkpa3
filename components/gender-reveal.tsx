'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Baby, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, TimeLeft } from '@/types';
import { ref, onValue, push } from 'firebase/database';
import { database } from '@/lib/firebase';
import CoupleImageCard from './couple-image-card';

const GenderRevealApp: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [votes, setVotes] = useState<Vote[]>([]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const actualGender: 'boy' | 'girl' = 'boy';
  const revealDate = '2025-06-30T15:10:00-08:00';
  // Set up real-time Firestore listener
  useEffect(() => {
    const votesRef = ref(database, 'votes');
    
    const unsubscribe = onValue(votesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const voteArray = Object.entries(data as Record<string, { name: string; guess: 'boy' | 'girl'; timestamp: string }>)
          .map(([id, vote]) => ({
            id,
            ...vote,
            timestamp: new Date(vote.timestamp)
          }));
        voteArray.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
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
      const targetDate = new Date(revealDate).getTime();
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

     // Also check if we're past reveal date on initial load
     const now = new Date().getTime();
     const targetDate = new Date(revealDate).getTime();
     if (now >= targetDate) {
       setIsRevealed(true);
     }

    return () => clearInterval(timer);
  }, []);

  const handleVote = async (gender: 'boy' | 'girl'): Promise<void> => {
    if (!name.trim()) {
      alert('Please enter your name first!');
      return;
    }

    try {
      const newVote = {
        name: name.trim(),
        guess: gender,
        timestamp: new Date().toISOString()
      };

      const votesRef = ref(database, 'votes');
      await push(votesRef, newVote);
      setName('');
    } catch (error) {
      console.error('Error adding vote:', error);
      alert('Failed to submit vote. Please try again.');
    }
  };

  const getVoteStats = () => {
    const boyVotes = votes.filter(vote => vote.guess === 'boy').length;
    const girlVotes = votes.filter(vote => vote.guess === 'girl').length;
    return { boyVotes, girlVotes };
  };

  const getWinners = () => {
    return votes.filter(vote => vote.guess === actualGender)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  const { boyVotes, girlVotes } = getVoteStats();

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-100 p-4 md:p-8">
      <Card className="max-w-2xl mx-auto p-6">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center text-3xl font-bold mb-8"
        >
          <Baby className="inline-block mr-2" />
          The Connor&apos;s Gender Reveal Poll
        </motion.div>
        <CoupleImageCard />

        <AnimatePresence mode='wait'>
          {!isRevealed ? (
            <motion.div 
              key="voting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">Time Until Reveal:</h2>
                <motion.div 
                  className="grid grid-cols-4 gap-2"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <motion.div
                      key={unit}
                      className="bg-white p-2 rounded-lg shadow"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-xl md:text-2xl font-bold">{value}</div>
                      <div className="text-sm text-gray-600">{unit}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="space-y-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </motion.div>
                <motion.div 
                  className="flex gap-4 justify-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={() => handleVote('boy')}
                    className={cn(
                      "w-32",
                      "bg-blue-500 hover:bg-blue-600"
                    )}
                  >
                    Boy
                  </Button>
                  <Button
                    onClick={() => handleVote('girl')}
                    className={cn(
                      "w-32",
                      "bg-pink-500 hover:bg-pink-600"
                    )}
                  >
                    Girl
                  </Button>
                </motion.div>
              </div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-center">Current Votes</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <motion.div 
                    className="bg-blue-100 p-4 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-2xl font-bold text-blue-600">{boyVotes}</div>
                    <div>Boy Votes</div>
                  </motion.div>
                  <motion.div 
                    className="bg-pink-100 p-4 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-2xl font-bold text-pink-600">{girlVotes}</div>
                    <div>Girl Votes</div>
                  </motion.div>
                </div>

                <motion.div 
                  className="mt-6 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {votes.map((vote, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className={cn(
                        "p-2 rounded",
                        vote.guess === 'boy' ? 'bg-blue-50' : 'bg-pink-50'
                      )}
                    >
                      {vote.name} guessed {vote.guess}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <motion.h2 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-4xl font-bold"
              >
                It&apos;s a {actualGender.toUpperCase()}! 🎉
              </motion.h2>

              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-lg shadow-lg"
                >
                  <div className="flex items-center justify-center mb-4">
                    <Trophy className="text-yellow-600 w-8 h-8 mr-2" />
                    <h3 className="text-2xl font-bold text-yellow-800">
                      Winners Circle!
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {getWinners().map((winner, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 * (index + 1) }}
                        className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                      >
                        <span className="font-semibold text-lg">
                          {winner.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          Guessed at {winner.timestamp.toLocaleTimeString()}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold">All Guesses</h3>
                  <div className="space-y-2">
                    {votes.map((vote, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "p-4 rounded-lg shadow transition-all duration-300",
                          vote.guess === actualGender
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{vote.name}</span>
                          <span>
                            {vote.guess === actualGender ? 
                              '✨ Correct! ✨' : 
                              'Better luck next pregnancy!'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};


export default GenderRevealApp;