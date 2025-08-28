import React, { useEffect, useState } from 'react';

interface CountUpProps {
  value: number;
  duration?: number; // in milliseconds
  prefix?: string;
  suffix?: string;
}

const CountUp: React.FC<CountUpProps> = ({ value, duration = 1000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16); // ~60fps

    const step = () => {
      start += increment;
      if (start >= end) {
        setCount(end);
      } else {
        setCount(start);
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString(undefined, {
        minimumFractionDigits: count % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      })}
      {suffix}
    </span>
  );
};

export default CountUp;
