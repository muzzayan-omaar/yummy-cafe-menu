import React, { useState } from "react";
import { GiKnifeFork } from "react-icons/gi";
import { menuData } from "./data/menuData";
import MenuCard from "./components/MenuCard";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [activeCategory, setActiveCategory] = useState(menuData[0].category);
  const [selectedItem, setSelectedItem] = useState(null);

  const currentItems = menuData.find(m => m.category === activeCategory)?.items;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 pt-16 pb-16 bg-gray-50">

      {/* Heading */}
      <div className="flex flex-col items-center gap-1 mb-8">
        <div className="flex items-center gap-2">
          <GiKnifeFork className="w-5 h-5 text-[#D9A441]" />
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Nawabs Cafe Menu
          </h1>
        </div>
        <p className="text-gray-500 text-sm md:text-base italic">
          “Taste the tradition, savor the moment.”
        </p>
      </div>

      {/* Menu Card */}
      <div className="w-full max-w-xl bg-white/25 backdrop-blur-md rounded-xl shadow-md p-6">

        {/* Category Tabs */}
        <div className="flex justify-around mb-4">
          {menuData.map(section => (
            <button
              key={section.category}
              onClick={() => setActiveCategory(section.category)}
              className={`px-3 py-1 rounded-md font-medium text-sm transition-all
                ${activeCategory === section.category
                  ? "bg-[#D9A441] text-white"
                  : "bg-white/50 text-gray-700 hover:bg-gray-100"}`}
            >
              {section.category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 hide-scrollbar">
          {currentItems.map((item, idx) => (
            <MenuCard key={idx} item={item} onClick={() => setSelectedItem(item)} />
          ))}
        </div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedItem.img}
                alt={selectedItem.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedItem.name} {selectedItem.spicy ? "🔥" : selectedItem.chefSpecial ? "⭐" : ""}
              </h2>
              <p className="text-gray-600 mb-2">{selectedItem.description}</p>
              <p className="text-[#D9A441] font-semibold text-lg">{selectedItem.price}</p>
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
