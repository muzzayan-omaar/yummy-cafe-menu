import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit3, Trash2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast"; // import toast
import { useTranslation } from "react-i18next";

import ItemModal from "./ItemModal";

export default function ItemsManager() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const { i18n } = useTranslation();


  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("https://yummy-cafe-menu-backend.onrender.com/api/menu");
      setItems(res.data);
    } catch (err) {
      toast.error("Failed to fetch items");
      console.error(err);
    }
  };

  const openModal = (item = null) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalOpen(false);
    fetchItems();
  };
  // Top of your file
const formatPrice = (price, lang = "en") => {
  const currency = lang === "ar" ? "د.إ" : "AED"; // Dirhams symbol
  return new Intl.NumberFormat(lang === "ar" ? "ar-AE" : "en-US", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
  }).format(price);
};


  const handleDelete = async (id) => {
    // Show toast confirmation
    const confirmDelete = await new Promise((resolve) => {
      toast(
        (t) => (
          <div className="backdrop-blur-lg bg-white/20 p-4 rounded-lg shadow flex flex-col gap-3">
            <p className="text-black">Delete this item?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
                onClick={() => { resolve(false); toast.dismiss(t.id); }}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => { resolve(true); toast.dismiss(t.id); }}
              >
                Delete
              </button>
            </div>
          </div>
        ),
        { duration: 5000, position: "top-right" }
      );
    });

    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      toast.success("Item deleted!", {
        style: {
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          color: "#fff",
        },
      });
      fetchItems();
    } catch (err) {
      toast.error("Failed to delete item");
      console.error(err);
    }
  };

  const categories = ["All", ...new Set(items.map((i) => i.category))];
  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
<div className="min-h-screen bg-white p-6">
  <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-wide">
  Menu Items
</h2>

  {/* Toaster container */}
  <Toaster />

  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-bold text-white tracking-wide">Menu Items</h2>

  </div>

  

{/* Category dropdown + Add Item */}
<div className="flex items-center gap-3 mb-6">
  {/* Dropdown */}
  <select
    value={activeCategory}
    onChange={(e) => setActiveCategory(e.target.value)}
    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-medium shadow focus:outline-none focus:ring-2 focus:ring-[#A7744A] transition"
  >
    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>

  {/* Add Item Button */}
  <button
    onClick={() => openModal()}
    className="bg-[#A7744A] text-white px-5 py-2 rounded-lg hover:bg-[#916640] shadow-lg transition transform hover:scale-105"
  >
    Add Item
  </button>
</div>


{/* Items Grid */}
<div className="grid grid-cols-1 gap-4">
  {filteredItems.map((item) => (
    <div
      key={item._id}
      className="flex items-center bg-white/10 backdrop-blur-md p-3 rounded-xl shadow-md hover:shadow-xl transition"
    >
      {/* Left image */}
      <div className="flex-shrink-0 relative w-28 h-20">
        <img
          src={item.img}
          alt={item.name}
          className="h-full w-full object-cover rounded-l-xl rounded-r-none"
        />
        {/* Price badge */}
        <span className="absolute top-1 left-1 bg-[#A7744A]/90 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
          {formatPrice(item.price, i18n.language)}
        </span>
      </div>

      {/* Right info */}
      <div className="flex-1 flex flex-col justify-between ml-4">
        <div>
          <h4 className="font-semibold text-lg">{item.name}</h4>
          <p className="text-sm text-gray-300 truncate">{item.description}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center gap-3 mt-2">
          <Edit3
            size={24}
            className="text-blue-400 hover:text-yellow-400 p-1 cursor-pointer rounded hover:bg-white/10 transition"
            onClick={() => openModal(item)}
          />
          <Trash2
            size={24}
            className="text-red-500 hover:text-red-700 p-1 cursor-pointer rounded hover:bg-white/10 transition"
            onClick={() => handleDelete(item._id)}
          />
        </div>
      </div>
    </div>
  ))}
</div>


  {/* Modal */}
  {modalOpen && (
    <ItemModal
      item={selectedItem}
      onClose={closeModal}
      categories={categories.filter((c) => c !== "All")}
    />
  )}
</div>

  );
}
