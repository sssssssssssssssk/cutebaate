import { useState, useEffect } from 'react';

export const useSessionDuration = (startTime: number) => {
  const [duration, setDuration] = useState(0);
  const [formatted, setFormatted] = useState('00:00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000); // seconds
      setDuration(elapsed);

      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;

      setFormatted(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return { duration, formatted };
};
