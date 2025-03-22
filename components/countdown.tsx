// File: components/CountdownTimer.tsx
import React from 'react';
import { CardContent } from '@/components/ui/card';

interface CountdownTimerProps {
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  daysLeft,
  hoursLeft,
  minutesLeft,
  secondsLeft,
}) => {
  return (
    <CardContent>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{daysLeft}</p>
          <p className="text-sm text-slate-700 dark:text-slate-300">Days</p>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{hoursLeft}</p>
          <p className="text-sm text-slate-700 dark:text-slate-300">Hours</p>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{minutesLeft}</p>
          <p className="text-sm text-slate-700 dark:text-slate-300">Minutes</p>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{secondsLeft}</p>
          <p className="text-sm text-slate-700 dark:text-slate-300">Seconds</p>
        </div>
      </div>
    </CardContent>
  );
};

export default CountdownTimer;