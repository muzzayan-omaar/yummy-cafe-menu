import React from "react";
import { useTranslation } from "react-i18next";

export default function SpecialsTitle() {
  const { t } = useTranslation();

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
      {getDaySpecial()}
    </h2>
  );
}
