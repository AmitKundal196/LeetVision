import React from 'react';
import CountUpRaw from 'react-countup';

// Safely unwrap ESM default if needed by Vite
const CountUp = (CountUpRaw as any).default || CountUpRaw;

export const AnimatedNumber: React.FC<{ 
  value: number; 
  duration?: number; 
  className?: string; 
  suffix?: string;
}> = ({ value, duration = 2, className, suffix = '' }) => {
  return (
    <span className={className}>
      <CountUp end={value} duration={duration} separator="," suffix={suffix} />
    </span>
  );
};
export default AnimatedNumber;
