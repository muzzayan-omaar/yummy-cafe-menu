import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Moon, Sun, ClipboardList, Plus, X } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { API } from "../config";
import { FaCoffee } from "react-icons/fa";
import Greeting from "../components/Greeting";
import SpecialsTitle from "../components/SpecialsTitle";

const ALL_CATEGORIES = ["Top Seller", "Coffee", "Tea", "Pastries", "Sandwiches", "Desserts", "Cold Drinks"];




export default function CafeMenu() {
    const [orders, setOrders] = useState({});

  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [sort, setSort] = useState("recommended");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [ordersOpen, setOrdersOpen] = useState(false);

  const add = useCartStore((s) => s.add);
  const inc = useCartStore((s) => s.inc);
  const dec = useCartStore((s) => s.dec);
  const cartItems = useCartStore((s) => s.items);
  const cartCount = useCartStore((s) => s.totalCount());
  const cartTotal = useCartStore((s) => s.totalPrice());

  // Fetch menu items
useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await fetch(API.MENU);  // ✅ USE CONFIG
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchMenu();
}, []);

  // Theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Filtered items
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let res = items.filter((it) => activeCat === "All" ? true : it.category === activeCat);
    if (q) res = res.filter((it) => it.title.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q));
    if (sort === "price-asc") res = res.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") res = res.sort((a, b) => b.price - a.price);
    return res;
  }, [items, activeCat, search, sort]);

  // AI Recommended Items (simple example: first 5 items)
const recommendedItems = items.slice(0, 5);


const handleAddToOrders = (item, change = 1) => {
  setOrders((prev) => {
    const currentQty = prev[item._id]?.qty || 0;
    const newQty = currentQty + change;

    if (newQty <= 0) {
      const updated = { ...prev };
      delete updated[item._id];
      return updated;
    }

    return {
      ...prev,
      [item._id]: {
        ...item,
        qty: newQty,
      },
    };
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
          <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
  <FaCoffee size={20} className="text-gray-800 dark:text-gray-200" />
</div><div>
              <h1 className="font-semibold">Ray Café</h1>
              <p className="text-xs text-gray-500">Brewed Fresh. Served Warm.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative md:hidden flex items-center bg-white/60 dark:bg-white/5 rounded-full px-2 py-1">
              <Search size={14} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="ml-2 bg-transparent outline-none text-sm w-36"
              />
            </div>
            <button
              onClick={() => setOrdersOpen(true)}
              className="relative hidden md:inline-flex p-2 rounded-full bg-white/70 dark:bg-white/5"
            >
              <ClipboardList size={18} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">{cartCount}</span>}
            </button>
          </div>
        </header>

        <Greeting />




{/* AI Recommended Items */}
<div>
<SpecialsTitle />

<div className="flex gap-3 overflow-x-auto py-3 no-scrollbar">
  {recommendedItems.map((it) => (
    <div
      key={it._id}
      className="min-w-[150px] h-44 rounded-xl overflow-hidden relative shadow-md bg-gray-200 dark:bg-[#101d35]"
    >
      <img
        src={it.img}
        alt={it.name}
        className="w-full h-full object-cover"
      />

      {/* Gradient bottom */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <h3 className="text-white text-xs font-medium drop-shadow">
          {it.name}
        </h3>
        <p className="text-white/80 text-[10px]">${it.price}</p>
      </div>

      {/* Add (+) Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart(it, 1, {});
        }}
        className="absolute bottom-2 right-2 w-7 h-7 flex items-center justify-center 
        rounded-full bg-[#A7744A] hover:bg-[#916640] transition text-white shadow-lg"
      >
        +
      </button>
    </div>
  ))}
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
          activeCat === cat ? "bg-[#A7744A] text-white" : "bg-white/60 dark:bg-white/5"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
  <div className="hidden md:flex items-center gap-2">
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className="rounded-md px-2 py-1 bg-white/60 dark:bg-white/5 text-sm"
    >
      <option value="recommended">Recommended</option>
      <option value="price-asc">Price: Low → High</option>
      <option value="price-desc">Price: High → Low</option>
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

          return (
            <motion.div
              key={item._id}
              layout
              whileHover={{ scale: 1.02 }}
              className="relative rounded-xl overflow-hidden shadow-md bg-gray-100 dark:bg-[#14233a]"
            >
              {/* Image */}
              <div
                className="relative w-full aspect-[4/3] cursor-pointer"
                onClick={() =>
                  setSelected({ ...item, qty: qty > 0 ? qty : 1, comment: "" })
                }
              >
                <img
                  src={imgUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                {/* Gradient fade */}
                <div className="absolute bottom-0 inset-x-0 h-[60%] bg-gradient-to-t from-black/70 to-transparent"></div>

                {/* Name + Price */}
                <div className="absolute bottom-2 left-2">
                  <h4 className="text-white font-semibold text-sm drop-shadow-lg">
                    {item.title}
                  </h4>
                  <p className="text-white/90 text-xs drop-shadow-lg">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Qty Selector or + Button */}
              <div className="absolute bottom-2 right-2 z-20">
                {qty > 0 ? (
                  <div className="flex items-center gap-2 bg-white dark:bg-[#1f2d47] rounded-full px-3 py-1 shadow-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToOrders(item, -1);
                      }}
                      className="text-lg font-bold text-gray-700 dark:text-gray-200"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {qty}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToOrders(item, +1);
                      }}
                      className="text-lg font-bold text-gray-700 dark:text-gray-200"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToOrders(item, +1);
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#A7744A] hover:bg-[#8e6340] text-white shadow-xl transition"
                  >
                    +
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
  </div>
</main>


        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-gray-500 p-4">Designed with ♥ — RayWebSolutions</footer>
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
