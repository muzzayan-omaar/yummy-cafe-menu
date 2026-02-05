// cafe-menu/src/components/CafeMenu.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { API } from "../config";
import { FaCoffee } from "react-icons/fa";
import Greeting from "./Greeting";
import SpecialsTitle from "./SpecialsTitle";
import { useTranslation } from "react-i18next";

const ALL_CATEGORIES = ["Top Seller", "Coffee", "Tea", "Pastries", "Sandwiches", "Desserts", "Cold Drinks"];

export default function CafeMenu() {
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("Top Seller");
  const [sort, setSort] = useState("recommended");
  const [items, setItems] = useState([]);
  const [splashVisible, setSplashVisible] = useState(true);

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(API.MENU);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      } finally {
        setTimeout(() => setSplashVisible(false), 2000); // splash for 2s
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // RTL for Arabic
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  // Filtered items
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let res = items.filter(it => activeCat === "All" ? true : it.category === activeCat);

    if (q) {
      res = res.filter(it =>
        (it.title?.toLowerCase().includes(q)) ||
        (it.desc?.toLowerCase().includes(q))
      );
    }

    if (sort === "price-asc") res = res.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") res = res.sort((a, b) => b.price - a.price);

    return res;
  }, [items, activeCat, search, sort]);

  const formatPrice = (amount, language) => {
    return new Intl.NumberFormat(
      language === "ar" ? "ar-AE" : "en-AE",
      {
        style: "currency",
        currency: "AED",
      }
    ).format(amount);
  };

  // Skeleton Card
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white dark:bg-[#071428] rounded-xl p-3 h-48 flex flex-col justify-between shadow-sm">
      <div className="bg-gray-300 dark:bg-gray-700 h-24 rounded-md mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full mt-2"></div>
    </div>
  );

  // Splash Graphic Placeholder
  if (splashVisible) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0b1020]">
        <img
          src="https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg"
          alt="Cafe Logo"
          className="w-48 h-48 object-cover rounded-full shadow-xl animate-pulse"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1020] text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-4 pb-12 pt-6">

        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <FaCoffee size={20} className="text-gray-800 dark:text-gray-200" />
            </div>
            <div>
              <h1 className="font-semibold">{t("WHY Cafe")}</h1>
              <p className="text-xs text-gray-500">{t("Brewed_Fresh")}, {t("Served_Warm")}</p>
            </div>
          </div>

          {/* Search & Language */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/60 dark:bg-white/5 rounded-full px-2 py-1">
              <Search size={14} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search")}
                className="ml-2 bg-transparent outline-none text-sm w-full"
              />
            </div>
            <button
              onClick={() => i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")}
              className="px-3 py-1 rounded-full bg-[#A7744A] text-white text-xs font-semibold shadow-sm"
            >
              {i18n.language === "en" ? "AR 🇸🇦" : "EN 🇬🇧"}
            </button>
          </div>
        </header>

        <Greeting />

        {/* AI Recommended / Specials */}
        <SpecialsTitle />
        <div className="flex gap-3 overflow-x-auto py-3 no-scrollbar">
          {items.slice(0, 5).map((it) => (
            <motion.div
              key={it._id}
              className="min-w-[150px] h-44 rounded-xl overflow-hidden relative shadow-md bg-gray-200 dark:bg-[#101d35]"
              whileHover={{ scale: 1.02 }}
            >
              <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <h3 className="text-white text-sm font-semibold drop-shadow-lg">{it.name}</h3>
                <p className="text-white/90 text-xs italic drop-shadow-lg">{it.desc}</p>
                <p className="text-white/80 text-xs mt-1">{formatPrice(it.price, i18n.language)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`flex-shrink-0 px-3 py-1 rounded-full ${
                  activeCat === cat
                    ? "bg-[#A7744A] text-white"
                    : "bg-white/60 dark:bg-white/5"
                }`}
              >
                {t(cat)}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-md px-2 py-1 bg-white/60 dark:bg-white/5 text-sm"
            >
              <option value="recommended">{t("recommended")}</option>
              <option value="price-asc">{t("price_low_high")}</option>
              <option value="price-desc">{t("price_high_low")}</option>
            </select>
          </div>
        </div>

        {/* Main Grid */}
        <main className="mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-xl overflow-hidden shadow-md bg-gray-100 dark:bg-[#14233a]"
                >
                  <div className="relative w-full aspect-[4/3]">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 h-[60%] bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-2 left-2">
                      <h4 className="text-white font-semibold text-sm drop-shadow-lg">{item.name}</h4>
                      <p className="text-white/90 text-xs italic drop-shadow-lg">{item.desc}</p>
                      <p className="text-white/80 text-xs mt-1">{formatPrice(item.price, i18n.language)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-gray-500 p-4">
          {t("designed_by")}
        </footer>
      </div>
    </div>
  );
}
