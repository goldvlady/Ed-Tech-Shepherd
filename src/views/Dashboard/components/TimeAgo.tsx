import React, { useState, useEffect } from 'react';

interface TimeAgoProps {
  timestamp: string;
}
export const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp }) => {
  const [timeAgoText, setTimeAgoText] = useState<string>('');

  useEffect(() => {
    const calculateTimeAgo = () => {
      const currentTime = new Date();
      const pastTime = new Date(timestamp);
      const timeDifference = currentTime.getTime() - pastTime.getTime();
      const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

      if (hoursDifference >= 24) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (
          pastTime.getDate() === yesterday.getDate() &&
          pastTime.getMonth() === yesterday.getMonth() &&
          pastTime.getFullYear() === yesterday.getFullYear()
        ) {
          setTimeAgoText('Yesterday');
        } else {
          const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
          );
          setTimeAgoText(`${daysDifference} days ago`);
        }
      } else {
        setTimeAgoText(
          `${hoursDifference} ${hoursDifference === 1 ? 'hour' : 'hours'} ago`
        );
      }
    };

    calculateTimeAgo();
  }, [timestamp]);

  return <div>{timeAgoText}</div>;
};
