import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { FaCoffee } from "react-icons/fa";
import Greeting from "./Greeting";
import SpecialsTitle from "./SpecialsTitle";
import { API } from "../config";
import { useTranslation } from "react-i18next";

const ALL_CATEGORIES = [
  "Top Seller",
  "Coffee",
  "Tea",
  "Pastries",
  "Sandwiches",
  "Desserts",
  "Cold Drinks",
];

export default function CafeMenu() {
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("Top Seller");
  const [sort, setSort] = useState("recommended");
  const [items, setItems] = useState([]);
  const [splashVisible, setSplashVisible] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  /* ===================== FETCH MENU ===================== */
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(API.MENU);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      } finally {
        setTimeout(() => setSplashVisible(false), 2000);
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

useEffect(() => {
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };
  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);


  /* ===================== RTL SUPPORT ===================== */
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  /* ===================== FILTERING ===================== */
  const filtered = useMemo(() => {
    let res = items.filter((it) =>
      activeCat === "All" ? true : it.category === activeCat
    );

    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(
        (it) =>
          it.name?.toLowerCase().includes(q) ||
          it.desc?.toLowerCase().includes(q)
      );
    }

    if (sort === "price-asc") res = [...res].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") res = [...res].sort((a, b) => b.price - a.price);

    return res;
  }, [items, activeCat, search, sort]);

  const formatPrice = (amount) =>
    new Intl.NumberFormat(
      i18n.language === "ar" ? "ar-AE" : "en-AE",
      { style: "currency", currency: "AED" }
    ).format(amount);

  /* ===================== SKELETON ===================== */
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white/70 dark:bg-white/5 rounded-xl p-3 h-52 shadow-sm">
      <div className="bg-gray-300 dark:bg-gray-700 h-28 rounded-md mb-2" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-1" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
    </div>
  );

/* ===================== SPLASH ===================== */
if (splashVisible) {
  return (
    <div className="fixed inset-0 bg-black z-50">
      <video
        src="https://res.cloudinary.com/diszilwhc/video/upload/v1771933325/whycafe.uae_01a07df291a342a0_wvuwwi.mp4"
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onEnded={() => setSplashVisible(false)} // removes splash when video ends
      />
    </div>
  );
}

  return (
<div className="relative min-h-screen 
  bg-gradient-to-br from-[#f8f6f3] via-white to-[#f1ebe5] 
  dark:bg-gradient-to-br dark:from-[#0b1524] dark:via-[#0f1e33] dark:to-[#0b1524]
  text-gray-900 dark:text-gray-100 transition-colors duration-300">


      <div className="relative z-10 max-w-3xl mx-auto px-4 pb-12 pt-6">

        {/* ===================== HEADER ===================== */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A7744A]/20 flex items-center justify-center">
              <FaCoffee size={20} />
            </div>
            <div>
              <h1 className="font-semibold">{t("WHY Cafe")}</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {t("Brewed_Fresh")}, {t("Served_Warm")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/60 dark:bg-white/5 rounded-full px-3 py-1">
              <Search size={14} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search")}
                className="bg-white/80 dark:bg-[#1a2a44]"
              />
            </div>
            <button
              onClick={() =>
                i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")
              }
              className="px-3 py-1 rounded-full bg-[#A7744A] text-white text-xs font-semibold"
            >
              {i18n.language === "en" ? "AR 🇸🇦" : "EN 🇬🇧"}
            </button>
          </div>
        </header>

        <Greeting />
        <SpecialsTitle />

<div className="relative flex gap-3 overflow-x-auto py-3 px-2 scrollbar-hide">
  {ALL_CATEGORIES.map((cat) => (
    <motion.button
      key={cat}
      onClick={() => setActiveCat(cat)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shadow-sm
        ${
          activeCat === cat
            ? "bg-[#A7744A] text-white shadow-lg"
            : "bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-[#A7744A]/20"
        }`}
    >
      {t(cat)}
    </motion.button>
  ))}
</div>



        {/* ===================== MENU GRID ===================== */}
        <main className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((item) => (
<motion.div
  key={item._id}
  whileHover={{ scale: 1.03, y: -4 }}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", stiffness: 100, damping: 14 }}
  className="rounded-xl overflow-hidden shadow-md bg-gray-100 dark:bg-[#14233a] cursor-pointer"
  onClick={() => setSelectedItem(item)}
>
  <img
    src={item.img}
    alt={item.name}
    className="w-full h-48 object-cover"
  />
  <div className="p-3">
    <h4 className="font-semibold">{item.name}</h4>
    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{item.desc}</p>
    <p className="mt-1 text-sm font-semibold">{formatPrice(item.price)}</p>
  </div>
</motion.div>

              ))}
        </main>

{/* ===================== ITEM MODAL ===================== */}
<AnimatePresence>
  {selectedItem && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedItem(null)}
    >
      <motion.div
        className="relative bg-white/90 dark:bg-[#0b1524]/90 backdrop-blur-xl rounded-2xl overflow-hidden max-w-lg w-[92%] shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={selectedItem.img}
          alt={selectedItem.name}
          className="w-full h-64 object-cover"
        />

        <div className="p-5">
          <h3 className="text-xl font-semibold tracking-tight">
            {selectedItem.name}
          </h3>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {selectedItem.desc}
          </p>

          <p className="mt-4 text-lg font-semibold text-[#A7744A]">
            {formatPrice(selectedItem.price)}
          </p>
        </div>

        {/* Close hint */}
        <span className="absolute top-3 right-4 text-xs text-gray-400">
          Tap outside to close
        </span>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


        <footer className="mt-12 text-center text-xs text-gray-600 dark:text-gray-300">
          {t("designed_by")}
        </footer>
      </div>
    </div>
  );
}
