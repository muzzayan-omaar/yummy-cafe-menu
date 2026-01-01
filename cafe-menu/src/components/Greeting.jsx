import React from "react";
import { useTranslation } from "react-i18next";

export default function Greeting() {
  const { t } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return { key: "Good_Morning", emoji: "☀️" };
    if (hour >= 12 && hour < 17) return { key: "Good_Afternoon", emoji: "🌤️" };
    if (hour >= 17 && hour < 21) return { key: "Good_Evening", emoji: "🌇" };
    return { key: "Good_Night", emoji: "🌙" };
  };

  const { key, emoji } = getGreeting();

  return (
    <h2 className="greeting-font text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 mt-3">
      {t(key)} {emoji}
    </h2>
  );
}
