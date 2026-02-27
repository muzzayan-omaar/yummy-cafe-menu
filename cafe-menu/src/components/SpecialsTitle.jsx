import React from "react";
import { useTranslation } from "react-i18next";

export default function SpecialsTitle() {
  const { t } = useTranslation();

  const isRamadan = () => {
    // ⚠️ Set Ramadan dates manually (update yearly)
    const ramadanStart = new Date("2026-02-17"); // example
    const ramadanEnd = new Date("2026-03-19");   // example

    const today = new Date();
    return today >= ramadanStart && today <= ramadanEnd;
  };

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

    const todayIndex = new Date().getDay();
    const dayKey = days[todayIndex];

    return t("Days_Picks", {
      day: t(dayKey),
    });
  };

  return (
    <h2 className="text-lg font-semibold text-black dark:text-white mb-2">
      {isRamadan() ? t("Ramadan_Picks") : getDaySpecial()}
    </h2>
  );
}