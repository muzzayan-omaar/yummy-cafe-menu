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
      <div className="min-h-screen flex items-center justify-center bg-[#0b1020]">
        <motion.img
          src="https://res.cloudinary.com/demo/image/upload/sample.jpg"
          alt="Cafe Logo"
          className="w-44 h-44 rounded-full object-cover shadow-2xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </div>
    );
  }

  return (
<div className="relative min-h-screen text-gray-900 dark:text-gray-100">



      <div className="relative z-10 max-w-3xl mx-auto px-4 pb-12 pt-6">

        {/* ===================== HEADER ===================== */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A7744A]/20 flex items-center justify-center">
              <FaCoffee size={20} />
            </div>
            <div>
              <h1 className="font-semibold">{t("WHY Cafe")}</h1>
              <p className="text-xs text-gray-500">
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
                className="ml-2 bg-transparent outline-none text-sm w-28"
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

        {/* ===================== CATEGORIES ===================== */}
        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-1 rounded-full text-sm whitespace-nowrap transition
                ${
                  activeCat === cat
                    ? "bg-[#A7744A] text-white"
                    : "bg-white/60 dark:bg-white/5"
                }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>

        {/* ===================== MENU GRID ===================== */}
        <main className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((item) => (
                <motion.div
                  key={item._id}
                  whileHover={{ scale: 1.03 }}
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
                    <p className="text-xs text-gray-500 line-clamp-2">{item.desc}</p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </motion.div>
              ))}
        </main>

        {/* ===================== ITEM MODAL ===================== */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                className="bg-white dark:bg-[#0b1524] rounded-xl overflow-hidden max-w-lg w-full"
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedItem.img}
                  alt={selectedItem.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {selectedItem.desc}
                  </p>
                  <p className="mt-3 font-semibold">
                    {formatPrice(selectedItem.price)}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-12 text-center text-xs text-gray-500">
          {t("designed_by")}
        </footer>
      </div>
    </div>
  );
}
