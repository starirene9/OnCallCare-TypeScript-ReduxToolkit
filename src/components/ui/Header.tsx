import React, { useState, useEffect } from "react";

const Header = () => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleString());
    }, 1000); // update every 1 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-blue-600 p-4 text-white text-center fixed w-full top-0 h-20 flex flex-col justify-center">
      <h1 className="text-lg font-bold">OnCall Care</h1>
      <p className="text-sm">{timestamp}</p>
    </header>
  );
};

export default Header;
