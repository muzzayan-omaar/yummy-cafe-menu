import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Grid, List, LogOut } from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { icon: <Grid size={20} />, to: "/admin", label: "Dashboard" },
    { icon: <List size={20} />, to: "/admin/items", label: "Items" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-16 bg-gray-800 text-white flex flex-col items-center py-4 space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            title={item.label} // tooltip on hover
            className={`p-2 rounded hover:bg-gray-700 ${
              location.pathname === item.to ? "bg-gray-700" : ""
            }`}
          >
            {item.icon}
          </Link>
        ))}
        <div className="mt-auto p-2 rounded hover:bg-gray-700 cursor-pointer">
          <LogOut size={20} />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
