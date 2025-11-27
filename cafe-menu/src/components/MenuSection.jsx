import React from "react";
import MenuCard from "./MenuCard";
import { motion } from "framer-motion";

const MenuSection = ({ category, items }) => {
  return (
    <section className="my-12 px-4">
      <motion.h2
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {category}
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <MenuCard key={idx} item={item} />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
