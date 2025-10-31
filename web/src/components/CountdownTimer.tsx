'use client';

import { useEffect, useState } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date('2035-01-01T00:00:00Z').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        ⏰ Time Until Unveiling
      </h2>
      
      {/* Total Days Badge (like README) */}
      <div className="flex justify-center mb-6">
        <div className="px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🕰️</span>
            <div>
              <p className="text-orange-200 text-sm font-medium">Days Until 2035</p>
              <p className="text-3xl font-bold text-white">{timeLeft.days.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Countdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-purple-200 text-sm font-medium uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
