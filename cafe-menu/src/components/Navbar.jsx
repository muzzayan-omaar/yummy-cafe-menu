import React from "react";
import { Link } from "react-scroll";

const Navbar = () => {
  const categories = ["Starters", "Mains", "Desserts", "Drinks"];
  
  return (
    <nav className="fixed w-full top-0 bg-white/50 backdrop-blur-md shadow-md z-50 px-6 py-3 flex justify-center gap-6">
      {categories.map((cat) => (
        <Link
          key={cat}
          to={cat.toLowerCase()}
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-green-700 font-medium"
        >
          {cat}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
