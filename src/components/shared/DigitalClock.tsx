import React, { useState, useEffect } from "react";
import moment from "moment-timezone";

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState<string>(
    moment().tz("Asia/Seoul").format("HH:mm:ss")
  );
  const [date, setDate] = useState<string>(
    moment().tz("Asia/Seoul").format("ddd, MMMM Do, YYYY")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().tz("Asia/Seoul").format("HH:mm:ss"));
      setDate(moment().tz("Asia/Seoul").format("ddd, MMMM Do, YYYY"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-l font-bold">
      <div>{date}</div>
      <div>{time}</div>
    </div>
  );
};

export default DigitalClock;
