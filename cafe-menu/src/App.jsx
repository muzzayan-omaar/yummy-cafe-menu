import React from "react";
import { Routes, Route } from "react-router-dom";

// Frontend
import CafeMenu from "./components/CafeMenu";

// Admin
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import ItemsManager from "./admin/ItemsManager";
import ProtectedRoute from "./admin/ProtectedRoute";
import ArabicAmbience from "./components/ArabicAmbience";

function App() {
  return (
    <>
     
      <ArabicAmbience mouseX={mousePos.x} mouseY={mousePos.y} />
     <ArabicAmbience />   {/* 👈 always rendered */}

      <Routes>
        <Route path="/" element={<CafeMenu />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="items" element={<ItemsManager />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;

