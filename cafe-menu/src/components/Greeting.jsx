import React from "react";

export default function Greeting() {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Good morning ☀️";
    if (hour >= 12 && hour < 17) return "Good afternoon 🌤️";
    if (hour >= 17 && hour < 21) return "Good evening 🌇";
    return "Good night 🌙";
  };

  return (
    <h2 className="greeting-font text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 mt-3">
      {getGreeting()}
    </h2>
  );
}
