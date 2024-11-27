import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
  onTimeUpdate?: (timeLeft: number) => void; // Optional callback for time updates
}

const QuizTimer = ({ duration, onTimeUp, onTimeUpdate }: QuizTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const endTimeKey = 'quizEndTime';

    // Calculate end time
    const endTime = localStorage.getItem(endTimeKey)
      ? parseInt(localStorage.getItem(endTimeKey)!, 10)
      : Date.now() + duration * 60 * 1000;

    // Save end time in localStorage if it's not already set
    if (!localStorage.getItem(endTimeKey)) {
      localStorage.setItem(endTimeKey, endTime.toString());
    }

    // Update timeLeft on component mount
    const updateTimer = () => {
      const currentTime = Date.now();
      const timeRemaining = Math.max(0, Math.floor((endTime - currentTime) / 1000));
      setTimeLeft(timeRemaining);
      if (timeRemaining === 0) {
        onTimeUp();
        localStorage.removeItem(endTimeKey); // Clear end time when time is up
      }
      if (onTimeUpdate) {
        onTimeUpdate(timeRemaining);
      }
    };

    // Start interval for countdown
    const timer = setInterval(updateTimer, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [duration, onTimeUp, onTimeUpdate]);

  // Display formatted time
  return (
    <div className="flex items-center space-x-2 text-white">
      <Clock className="h-5 w-5" />
      <span>
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default QuizTimer;
