import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit3, Trash2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast"; // import toast
import ItemModal from "./ItemModal";

export default function ItemsManager() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

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

  const handleDelete = async (id) => {
    // Show toast confirmation
    const confirmDelete = await new Promise((resolve) => {
      toast(
        (t) => (
          <div className="backdrop-blur-lg bg-white/20 p-4 rounded-lg shadow flex flex-col gap-3">
            <p className="text-white">Delete this item?</p>
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
      await axios.delete(`https://yummy-cafe-menu-backend.onrender.com/api/menu/${id}`, {
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
    <div>
      {/* Toaster container */}
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Menu Items</h2>
        <button
          onClick={() => openModal()}
          className="bg-[#A7744A] text-white px-4 py-2 rounded hover:bg-[#8e6340] shadow"
        >
          Add Item
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded transition ${
              activeCategory === cat
                ? "bg-[#A7744A] text-white shadow"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
<div
  key={item._id}
  className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg hover:shadow-2xl transition relative flex flex-col justify-between"
>
  <div>
    <img
      src={item.img}
      alt={item.name}
      className="h-32 w-full object-cover rounded mb-3"
    />
    <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
    <p className="text-xs text-gray-300 truncate mb-1">{item.description}</p>
  </div>

  <div className="flex justify-between items-center mt-2">
    <p className="font-bold text-sm">${item.price}</p>

    {/* Edit & Delete Icons at bottom-right */}
    <div className="flex gap-2">
      <Edit3
        size={28}
        className="text-blue-400 hover:text-yellow-400 p-1 cursor-pointer rounded hover:bg-white/10 transition"
        onClick={() => openModal(item)}
      />
      <Trash2
        size={28}
        className="text-red-500 hover:text-red-700 cursor-pointer p-1 rounded hover:bg-white/10 transition"
        onClick={() => handleDelete(item._id)}
      />
    </div>
  </div>
</div>

        ))}
      </div>

      {/* Modal */}
{modalOpen && <ItemModal item={selectedItem} onClose={closeModal} categories={categories.filter(c => c !== "All")} />}

    </div>
  );
}
