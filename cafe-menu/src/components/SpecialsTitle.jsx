import React from "react";

export default function SpecialsTitle() {
  const getDaySpecial = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    return `${days[today]}'s picks`;
  };

  return (
    <h2 className="text-lg font-semibold text-black dark:text-white mb-2">
      {getDaySpecial()}
    </h2>
  );
}
