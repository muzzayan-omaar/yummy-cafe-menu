import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../config";

export default function ItemModal({ item, onClose, categories }) {
  const [form, setForm] = useState({
    name: item?.name || "",
    img: item?.img || "",
    desc: item?.desc || "",
    cost: item?.price || "",
    category: item?.category || (categories[0] || ""),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [isSpecial, setIsSpecial] = useState(item?.isSpecial || false);
const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("adminToken");
  if (!token) {
    alert("Not authorized");
    return;
  }

  try {
    const payload = {
      ...form,
      isSpecial,
    };

    if (item) {
      await axios.put(`${API.MENU}/${item._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(API.MENU, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    onClose();
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-6 rounded-2xl w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold text-white mb-4">{item ? "Edit Item" : "Add Item"}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="p-2 rounded bg-white/20 text-white placeholder-white/70 outline-none caret-white"
          />
          <input
            name="img"
            value={form.img}
            onChange={handleChange}
            placeholder="Image URL"
            className="p-2 rounded bg-white/20 text-white placeholder-white/70 outline-none caret-white"
          />
          <input
            name="desc"
            value={form.desc}
            onChange={handleChange}
            placeholder="Description"
            className="p-2 rounded bg-white/20 text-white placeholder-white/70 outline-none caret-white"
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Cost"
            className="p-2 rounded bg-white/20 text-white placeholder-white/70 outline-none caret-white"
          />

          {/* Category select dropdown */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="p-2 rounded bg-white/20 text-dark placeholder-white/70 outline-none caret-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 mt-3">
  <input
    type="checkbox"
    id="isSpecial"
    checked={isSpecial}
    onChange={(e) => setIsSpecial(e.target.checked)}
    className="w-4 h-4 accent-[#A7744A]"
  />
  <label htmlFor="isSpecial" className="text-sm font-medium text-gray-900 dark:text-gray-100">
    Mark as Today's Pick
  </label>
</div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-white/20 text-white hover:bg-white/30 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#A7744A] hover:bg-[#8e6340] text-white transition"
            >
              {item ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
