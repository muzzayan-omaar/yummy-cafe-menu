/*
CafeDigitalMenu.jsx
Single-file React component (Tailwind + Framer Motion) for a Digital Café Menu.

How to use:
1. Create a React app (Vite recommended).
2. Install dependencies:
   - TailwindCSS (follow Tailwind + Vite setup)
   - framer-motion: npm i framer-motion
   - lucide-react (optional icons): npm i lucide-react
3. Drop this file into your src/ (e.g. src/CafeDigitalMenu.jsx)
4. Import and render in App.jsx: import CafeDigitalMenu from './CafeDigitalMenu';
5. Make sure Tailwind is configured and index.css includes Tailwind directives.

This component is self-contained for demo purposes — real projects should split into smaller components.

Features included:
- Header with logo + catchphrase
- Category horizontal scroll (pills)
- Responsive product grid (2-3 columns)
- Item detail modal with image zoom and customizations
- Light / Dark mode toggle
- Add-to-cart mock functionality
- Sticky footer nav
- Smooth micro-animations with framer-motion
- Sample images from Unsplash (replace with your assets or Cloudinary links)
*/

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Moon, Sun, ShoppingCart, X, Heart } from 'lucide-react';

const SAMPLE_ITEMS = [
  {
    id: 'latte',
    title: 'Café Latte',
    category: 'Coffee',
    price: 4.5,
    desc: 'Smooth espresso with steamed milk & a light layer of foam.',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1b2b3a2d8d7147a7d2a6b6b0f4d10b3c'
  },
  {
    id: 'flatwhite',
    title: 'Flat White',
    category: 'Coffee',
    price: 4.8,
    desc: 'Velvety microfoam over rich espresso — silky & strong.',
    img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=8a1b5b8712f4a6e2b6a2c0f9e7a8d0a1'
  },
  {
    id: 'matcha',
    title: 'Iced Matcha Latte',
    category: 'Tea',
    price: 5.0,
    desc: 'Premium ceremonial matcha shaken over ice with milk.',
    img: 'https://images.unsplash.com/photo-1610370904468-542c0cc2d3f3?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=5e5c9b9d2b3f4c2f9a1b6c7d8e3f2a4b'
  },
  {
    id: 'croissant',
    title: 'Butter Croissant',
    category: 'Pastries',
    price: 3.2,
    desc: 'Flaky, buttery croissant baked fresh daily.',
    img: 'https://images.unsplash.com/photo-1548365328-8f3b6a8d7b88?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9f0c4b8c6d3f5e8a2d1f6c7b8a9e0b1c'
  },
  {
    id: 'avocado',
    title: 'Avocado Toast',
    category: 'Sandwiches',
    price: 6.0,
    desc: 'Sourdough, smashed avocado, lemon, chili flakes.',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d'
  },
  {
    id: 'cheesecake',
    title: 'Classic Cheesecake',
    category: 'Desserts',
    price: 5.5,
    desc: 'Creamy, rich cheesecake with a buttery base.',
    img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2d3c4b5a6e7f8a9b0c1d2e3f4a5b6c7d'
  },
  {
    id: 'icedcoffee',
    title: 'Iced Cold Brew',
    category: 'Cold Drinks',
    price: 3.8,
    desc: 'Slow-steeped cold brew, smooth and refreshing.',
    img: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4'
  }
];

const ALL_CATEGORIES = ['All', 'Coffee', 'Tea', 'Pastries', 'Sandwiches', 'Desserts', 'Cold Drinks'];

export default function CafeDigitalMenu() {
  const [theme, setTheme] = useState('light');
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [items] = useState(SAMPLE_ITEMS);
  const [selected, setSelected] = useState(null); // item for modal
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (activeCat !== 'All' && it.category !== activeCat) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return it.title.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q);
    });
  }, [items, activeCat, search]);

  function addToCart(item, qty = 1, opts = {}) {
    setCart((c) => {
      const existing = c.find((x) => x.id === item.id && JSON.stringify(x.opts) === JSON.stringify(opts));
      if (existing) {
        return c.map((x) => (x.id === item.id && JSON.stringify(x.opts) === JSON.stringify(opts) ? { ...x, qty: x.qty + qty } : x));
      }
      return [...c, { ...item, qty, opts }];
    });
  }

  function toggleFav(id) {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1020] transition-colors duration-300 text-gray-900 dark:text-gray-100">
<div className="max-w-6xl mx-auto px-4 pb-32 pt-4 md:p-6">

        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-300 to-orange-300 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              R
            </div>
            <div>
              <h1 className="text-xl font-semibold">Ray Café</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Brewed Fresh. Served Warm.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:flex items-center bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu..."
                className="ml-2 outline-none bg-transparent text-sm w-48"
              />
            </div>

            <button
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              className="p-2 rounded-full bg-white/70 dark:bg-white/5 shadow hover:scale-105 transition-transform"
              aria-label="toggle theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <button
              onClick={() => alert('Open cart (Example)')}
              className="relative p-2 rounded-full bg-white/70 dark:bg-white/5 shadow hover:scale-105 transition-transform"
            >
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">{cart.reduce((s, x) => s + x.qty, 0)}</span>
              )}
            </button>
          </div>
        </header>

        {/* Category Scroll */}
        <div className="mt-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm shadow-sm transition-transform whitespace-nowrap ${
                  activeCat === cat ? 'bg-[#A7744A] text-white scale-105' : 'bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main content: grid */}
        <main className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <motion.article
                layout
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-[#071028] rounded-2xl shadow-md overflow-hidden cursor-pointer"
                onClick={() => setSelected({ ...item, qty: 1, size: 'Medium', milk: 'Regular' })}
              >
                <div className="relative h-44 sm:h-40 md:h-44 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transform transition-transform" />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFav(item.id); }}
                    className="absolute top-3 right-3 bg-white/70 dark:bg-white/5 p-2 rounded-full shadow"
                  >
                    <Heart size={16} className={`${favorites.includes(item.id) ? 'text-red-400' : ''}`} />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, 1, {});
                        }}
                        className="px-3 py-1 rounded-full bg-[#A7744A] text-white font-medium shadow hover:scale-105 transition-transform"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="mt-12 text-center text-gray-500">No items match your search.</div>
          )}
        </main>

{/* Footer navigation (mobile) */}
<nav className="fixed bottom-0 left-0 right-0 md:hidden z-30">
  <div className="mx-auto max-w-3xl bg-white/90 dark:bg-[#0d1328]/80 backdrop-blur-xl border-t border-black/10 dark:border-white/10 flex justify-around py-3">
    <button className="flex flex-col items-center text-sm opacity-90">
      🏠
      <span className="text-[10px] mt-0.5">Home</span>
    </button>
    <button className="flex flex-col items-center text-sm opacity-90">
      📦
      <span className="text-[10px] mt-0.5">Orders</span>
    </button>
    <button className="flex flex-col items-center text-sm opacity-90">
      🔍
      <span className="text-[10px] mt-0.5">Search</span>
    </button>
    <button className="flex flex-col items-center text-sm opacity-90">
      👤
      <span className="text-[10px] mt-0.5">Account</span>
    </button>
  </div>
</nav>

      </div>
      {/* Mobile Sticky Cart Button */}
<div className="fixed bottom-20 right-4 z-40 md:hidden">
  <button
    onClick={() => alert('Open cart (Example)')}
    className="relative p-4 rounded-full bg-[#A7744A] text-white shadow-xl shadow-black/20 active:scale-95 transition-transform"
  >
    <ShoppingCart size={22} />
    {cart.length > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
        {cart.reduce((s, x) => s + x.qty, 0)}
      </span>
    )}
  </button>
</div>


      {/* Modal: selected item */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}></div>

            <motion.div
              layout
              initial={{ y: 40, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 40, scale: 0.98 }}
              className="relative bg-white dark:bg-[#071428] rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/2 h-64 md:h-auto relative">
                  <motion.img
                    src={selected.img}
                    alt={selected.title}
                    layout
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.03 }}
                    className="w-full h-full object-cover"
                  />

                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/70 dark:bg-white/5 shadow"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="md:w-1/2 p-6">
                  <h2 className="text-2xl font-semibold">{selected.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{selected.desc}</p>

                  <div className="mt-4">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium">Size</label>
                      <select
                        value={selected.size}
                        onChange={(e) => setSelected((s) => ({ ...s, size: e.target.value }))}
                        className="ml-2 rounded-md px-2 py-1 bg-gray-100 dark:bg-white/5"
                      >
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <label className="text-sm font-medium">Milk</label>
                      <select
                        value={selected.milk}
                        onChange={(e) => setSelected((s) => ({ ...s, milk: e.target.value }))}
                        className="ml-2 rounded-md px-2 py-1 bg-gray-100 dark:bg-white/5"
                      >
                        <option>Regular</option>
                        <option>Oat</option>
                        <option>Almond</option>
                        <option>Soy</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <label className="text-sm font-medium">Quantity</label>
                      <div className="ml-2 flex items-center gap-2">
                        <button
                          onClick={() => setSelected((s) => ({ ...s, qty: Math.max(1, s.qty - 1) }))}
                          className="px-3 py-1 rounded-full bg-white/70 dark:bg-white/5"
                        >
                          -
                        </button>
                        <div className="min-w-[32px] text-center">{selected.qty}</div>
                        <button
                          onClick={() => setSelected((s) => ({ ...s, qty: s.qty + 1 }))}
                          className="px-3 py-1 rounded-full bg-[#A7744A] text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Price</div>
                        <div className="text-xl font-bold">${(selected.price * selected.qty).toFixed(2)}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            addToCart(selected, selected.qty, { size: selected.size, milk: selected.milk });
                            setSelected(null);
                          }}
                          className="px-5 py-2 rounded-full bg-[#A7744A] text-white font-semibold shadow hover:scale-105 transition-transform"
                        >
                          Add to Order
                        </button>
                        <button
                          onClick={() => addToCart(selected, 1, { size: selected.size, milk: selected.milk })}
                          className="px-3 py-2 rounded-full bg-white/60 dark:bg-white/5"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple floating cart preview for desktop */}
      <div className="fixed right-6 bottom-6 hidden md:flex flex-col items-end gap-3">
        <div className="bg-white dark:bg-[#071428] rounded-2xl shadow p-3 w-80">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">My Order</h4>
            <span className="text-sm text-gray-500">{cart.length} items</span>
          </div>

          <div className="mt-3 max-h-40 overflow-auto">
            {cart.length === 0 && <div className="text-sm text-gray-500">Cart empty — add something tasty.</div>}
            {cart.map((c) => (
              <div key={`${c.id}-${JSON.stringify(c.opts)}`} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                <div>
                  <div className="font-medium">{c.title} x{c.qty}</div>
                  <div className="text-xs text-gray-500">{c.opts.size} • {c.opts.milk}</div>
                </div>
                <div className="font-semibold">${(c.price * c.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <div className="font-bold">Total</div>
              <div className="font-bold">${cart.reduce((s, x) => s + x.qty * x.price, 0).toFixed(2)}</div>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <button className="flex-1 px-3 py-2 rounded-full bg-white/60 dark:bg-white/5">View</button>
            <button className="px-3 py-2 rounded-full bg-[#A7744A] text-white">Checkout</button>
          </div>
        </div>
      </div>

      {/* small credits/footer */}
      <footer className="mt-12 text-center text-xs text-gray-500 p-4">Designed with ♥ — RayWebSolutions</footer>
    </div>
  );
}
