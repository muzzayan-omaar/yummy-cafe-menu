// src/config.js

const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://yummy-cafe-menu-backend.onrender.com"; // <-- replace with your real Render URL

export const API = {
  MENU: `${BACKEND_URL}/api/menu`,
  ORDERS: `${BACKEND_URL}/api/orders`,
};
