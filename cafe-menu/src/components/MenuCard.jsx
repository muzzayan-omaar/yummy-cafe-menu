import React from "react";
import { motion } from "framer-motion";

const MenuCard = ({ item, onClick }) => {
  const getEmoji = () => {
    if (item.spicy) return "🔥";
    if (item.chefSpecial) return "⭐";
    return "";
  };

  return (
    <motion.div
      className="flex items-start justify-between gap-3 p-3 bg-white/20 backdrop-blur-sm rounded-md hover:shadow-lg transition-all cursor-pointer border-b border-gray-200 last:border-b-0"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <img
          src={item.img}
          alt={item.name}
          className="w-14 h-14 object-cover rounded-sm"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-900 text-md">
            {getEmoji()} {item.name}
          </h3>
          <p className="text-gray-500 text-sm leading-snug mt-0.5">{item.description}</p>
        </div>
      </div>
      <span className="font-semibold text-[#D9A441] text-sm">{item.price}</span>
    </motion.div>
  );
};

export default MenuCard;
