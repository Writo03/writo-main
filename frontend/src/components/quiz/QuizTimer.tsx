import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
  onTimeUpdate?: (timeLeft: number) => void; // Optional callback for time updates
}

export const QuizTimer = ({ duration, onTimeUp, onTimeUpdate }: QuizTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const updatedTime = prev - 1;
        if (onTimeUpdate) {
          onTimeUpdate(updatedTime); // Call the update function
        }
        return updatedTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, onTimeUpdate]);

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
