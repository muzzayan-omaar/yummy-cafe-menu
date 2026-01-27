import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Moon, Sun, ClipboardList, Plus, X } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { API } from "../config";
import { FaCoffee } from "react-icons/fa";
import Greeting from "../components/Greeting";
import SpecialsTitle from "../components/SpecialsTitle";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";



const ALL_CATEGORIES = ["Top Seller", "Coffee", "Tea", "Pastries", "Sandwiches", "Desserts", "Cold Drinks"];




export default function CafeMenu() {
  const { t, i18n } = useTranslation();

    const [orders, setOrders] = useState({});

  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("Top Seller");
  const [sort, setSort] = useState("recommended");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showPayment, setShowPayment] = useState(false);



  const add = useCartStore((s) => s.add);
  const inc = useCartStore((s) => s.inc);
  const dec = useCartStore((s) => s.dec);
  const cartItems = useCartStore((s) => s.items);
const cartCount = Object.values(orders).reduce((acc, it) => acc + it.qty, 0);

const [searchParams] = useSearchParams();
const tableNumber = searchParams.get("table"); // e.g., ?table=5

// Fetch existing order for table
useEffect(()=>{
  if(!tableNumber) return;
  fetch(`/api/tables/order/${tableNumber}`)
    .then(res=>res.json())
    .then(data=>{
      if(data.items?.length){
        data.items.forEach(item => add(item)); // populate cart
      }
    });
}, [tableNumber]);

  // Fetch menu items
useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await fetch(API.MENU);
      const data = await res.json();
      console.log(data); // <-- Check what keys are actually returned
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchMenu();
}, []);

useEffect(() => {
  document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
}, [i18n.language]);



  // Theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

const syncOrderToBackend = async (currentOrders) => {
  if(!tableNumber) return; // skip if table not defined
  try {
    const itemsArray = Object.values(currentOrders).map(it => ({
      ...it,
      qty: it.qty
    }));
    const total = itemsArray.reduce((acc, it) => acc + it.price * it.qty, 0);

    await fetch(`/api/tables/order/${tableNumber}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: itemsArray, total }),
    });
  } catch(err) {
    console.error("Failed to sync order:", err);
  }
};


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

  if (sort === "price-asc") res = res.sort((a,b) => a.price - b.price);
  if (sort === "price-desc") res = res.sort((a,b) => b.price - a.price);

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



  // AI Recommended Items (simple example: first 5 items)
const recommendedItems = items.slice(0, 5);


const [toast, setToast] = useState("");

// helper to show toast
const showToast = (message) => {
  setToast(message);
  setTimeout(() => setToast(""), 1500); // hide after 1.5s
};

const handleAddToOrders = (item, change = 1) => {
  if (orderPlaced) return; // 🔒 lock cart after placing order

  setOrders((prev) => {
    const currentQty = prev[item._id]?.qty || 0;
    const newQty = currentQty + change;

    if (change > 0) showToast(`${item.name} ${t("added")} ✅`);

    const updated = { ...prev };
    if (newQty <= 0) delete updated[item._id];
    else updated[item._id] = { ...item, qty: newQty };

    syncOrderToBackend(updated);
    return updated;
  });
};





  // Skeleton card
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white dark:bg-[#071428] rounded-xl p-3 h-48 flex flex-col justify-between shadow-sm">
      <div className="bg-gray-300 dark:bg-gray-700 h-24 rounded-md mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full mt-2"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1020] text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-4 pb-36 pt-6">

{/* Header */}
<header className="flex items-center justify-between">
  {/* Left: Logo + Cafe name */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
      <FaCoffee size={20} className="text-gray-800 dark:text-gray-200" />
    </div>
    <div>
      <h1 className="font-semibold">{t("WHY Cafe")}</h1>
      <p className="text-xs text-gray-500">
        {t("Brewed_Fresh")}, {t("Served_Warm")}
      </p>
    </div>
  </div>

  {/* Right: Search, Language toggle, Cart */}
  <div className="flex items-center gap-2">
    {/* Mobile Search + Language */}
    <div className="flex items-center gap-2 md:hidden">
      {/* Search */}
      <div className="flex items-center bg-white/60 dark:bg-white/5 rounded-full px-2 py-1 flex-1">
        <Search size={14} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search")}
          className="ml-2 bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/* Language toggle */}
      <button
        onClick={() =>
          i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")
        }
        className="px-3 py-1 rounded-full bg-[#A7744A] text-white text-xs font-semibold shadow-sm"
      >
        {i18n.language === "en" ? "AR 🇸🇦" : "EN 🇬🇧"}
      </button>
    </div>

    {/* Desktop Cart button */}
    <button
      onClick={() => setOrdersOpen(true)}
      className="relative hidden md:inline-flex p-2 rounded-full bg-white/70 dark:bg-white/5"
    >
      <ClipboardList size={18} />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
          {cartCount}
        </span>
      )}
    </button>
  </div>
</header>


        <Greeting />




{/* AI Recommended Items */}
<div>
  <SpecialsTitle />

  <div className="flex gap-3 overflow-x-auto py-3 no-scrollbar">
    {recommendedItems.map((it) => {
      const qty = orders[it._id]?.qty || 0;
      const categoryEmoji = {
        Coffee: "☕",
        Tea: "🍵",
        Pastries: "🥐",
        Sandwiches: "🥪",
        Desserts: "🍰",
        "Cold Drinks": "🧊"
      };

      return (
<div
  key={it._id}
  className="min-w-[150px] h-44 rounded-xl overflow-hidden relative shadow-md bg-gray-200 dark:bg-[#101d35] group"
>
  <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
  
  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
    <h3 className="text-white text-sm font-semibold drop-shadow-lg">{it.name}</h3>
    <p className="text-white/90 text-xs italic drop-shadow-lg">
      {categoryEmoji[it.category] || ""} {it.desc}
    </p>
    <p className="text-white/80 text-xs mt-1">{formatPrice(it.price, i18n.language)}</p>
  </div>

  {/* + Button */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleAddToOrders(it, 1);
    }}
    className="absolute bottom-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-[#A7744A] hover:bg-[#916640] text-white shadow-lg"
  >
    +
  </button>
</div>

      );
    })}
  </div>
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
{/* Main Grid */}
<main className="mt-2">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {loading
      ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
      : filtered.map((item) => {
          const qty = orders[item._id]?.qty || 0;

          // Use Cloudinary c_fill to ensure uniform cropping
          const imgUrl = item.img.includes("cloudinary")
            ? item.img.replace("/upload/", "/upload/c_fill,w_600,h_450/")
            : item.img;

          const categoryEmoji = {
            Coffee: "☕",
            Tea: "🍵",
            Pastries: "🥐",
            Sandwiches: "🥪",
            Desserts: "🍰",
            "Cold Drinks": "🧊",
          };

          return (
<motion.div
  key={item._id}
  layout
  whileHover={{ scale: 1.02 }}
  className="relative rounded-xl overflow-hidden shadow-md bg-gray-100 dark:bg-[#14233a] group"
>
  <div className="relative w-full aspect-[4/3]">
    <img src={imgUrl} alt={item.name} className="w-full h-full object-cover" />
    <div className="absolute bottom-0 inset-x-0 h-[60%] bg-gradient-to-t from-black/70 to-transparent"></div>
    <div className="absolute bottom-2 left-2">
      <h4 className="text-white font-semibold text-sm drop-shadow-lg">{item.name}</h4>
      <p className="text-white/90 text-xs italic drop-shadow-lg">
        {categoryEmoji[item.category] || ""} {item.desc}
      </p>
      <p className="text-white/80 text-xs mt-1">{formatPrice(item.price, i18n.language)}</p>
    </div>
  </div>

  {/* Only the + button adds to cart now */}
  <button
    onClick={(e) => {
      e.stopPropagation(); // good measure
      handleAddToOrders(item, 1);
    }}
    className="absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-[#A7744A] hover:bg-[#8e6340] text-white shadow-xl transition"
  >
    +
  </button>
</motion.div>

          );
        })}

    {/* Orders Drawer */}
    <AnimatePresence>
      {ordersOpen && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          className="fixed top-0 right-0 z-50 h-full w-80 bg-white dark:bg-[#0b1020] shadow-xl flex flex-col"
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
<h2 className="font-semibold text-lg">{t("your_orders")}</h2>

            <button onClick={() => setOrdersOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Orders List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {Object.values(orders).length === 0 && (
<p className="text-gray-500 text-sm">{t("no_items")}</p>

            )}
{Object.values(orders).map((it) => (
  <div
    key={it._id}
    className="flex justify-between items-center bg-gray-100 dark:bg-[#14233a] rounded-lg p-2"
  >
    <div>
      <h4 className="text-sm font-semibold flex items-center gap-2">
        {it.name}
        {orderPlaced && (
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
        )}
      </h4>
      <p className="text-xs text-gray-500">
        {formatPrice(it.price, i18n.language)} × {it.qty} ={" "}
        {formatPrice(it.price * it.qty, i18n.language)}
      </p>
    </div>

    {/* ❌ Remove button disappears after order placed */}
    {!orderPlaced && (
      <button
        onClick={() => {
          setOrders((prev) => {
            const updated = { ...prev };
            delete updated[it._id];
            syncOrderToBackend(updated);
            return updated;
          });
        }}
        className="text-red-500 hover:text-red-700"
      >
        <X size={16} />
      </button>
    )}
    {orderPlaced && (
  <button
    onClick={() => setShowPayment(true)}
    className="w-full mt-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold"
  >
    💳 {t("pay_bill")}
  </button>
)}

  </div>
))}


          </div>

          {/* Total */}
<div className="p-4 border-t border-gray-300 dark:border-gray-700">
  <p className="font-semibold mb-3">
    {t("total")}:{" "}
    {formatPrice(
      Object.values(orders).reduce(
        (acc, cur) => acc + cur.price * cur.qty,
        0
      ),
      i18n.language
    )}
  </p>

  {!orderPlaced ? (
    <button
      onClick={async () => {
        await fetch(`/api/tables/order/${tableNumber}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: Object.values(orders),
            status: "placed",
          }),
        });

        setOrderPlaced(true);
        showToast(t("order_sent_success"));
      }}
      className="w-full py-2 rounded-md bg-[#A7744A] hover:bg-[#916640] text-white font-semibold"
    >
      {t("send_order")}
    </button>
  ) : (
    <p className="text-green-500 font-semibold flex items-center gap-2">
      ✅ {t("order_placed")}
    </p>
  )}
</div>

        </motion.div>
      )}
    </AnimatePresence>

    {showPayment && (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
    <div className="bg-white dark:bg-[#0b1220] rounded-lg p-6 w-[90%] max-w-md">
      <h2 className="text-lg font-bold mb-2">{t("payment")}</h2>

      <p className="mb-4">
        {t("amount_to_pay")}:{" "}
        <strong>
          {formatPrice(
            Object.values(orders).reduce(
              (acc, cur) => acc + cur.price * cur.qty,
              0
            ),
            i18n.language
          )}
        </strong>
      </p>

      <p className="text-sm text-gray-500 mb-4">
        Apple Pay · Google Pay · Cards
      </p>

      <button
        onClick={() => setShowPayment(false)}
        className="w-full py-2 rounded-md bg-gray-300 dark:bg-gray-700"
      >
        {t("close")}
      </button>
    </div>
  </div>
)}


    {/* Toast */}
{toast && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-lg shadow-lg z-50 font-semibold flex items-center gap-2"
  >
    <span>✨</span> {toast}
  </motion.div>
)}

  </div>
</main>



        {/* Footer */}
<footer className="mt-12 text-center text-xs text-gray-500 p-4">
  {t("designed_by")}
</footer>

    </div>

      {/* Mobile sticky orders button */}
      <div className="fixed bottom-20 right-4 z-40 md:hidden">
        <button
          onClick={() => setOrdersOpen(true)}
          className="relative p-4 rounded-full bg-[#A7744A] text-white shadow-xl"
        >
          <ClipboardList size={22} />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">{cartCount}</span>}
        </button>
      </div>

      {/* Orders Drawer & Selected Modal remain unchanged */}
      {/* ...You can paste your previous AnimatePresence code here... */}
 

    </div>
  );
}
