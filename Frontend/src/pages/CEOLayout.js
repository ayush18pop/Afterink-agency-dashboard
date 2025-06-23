import React from "react";
import Sidebar from "../components/Sidebar"; // Sidebar import
import { Outlet } from "react-router-dom"; // Outlet to render child routes

export default function CEOLayout() {
  return (
<<<<<<< HEAD
    <div className="flex h-screen bg-[#17171e]">
=======
    <div className="flex h-screen bg-[#17171e] overflow-hidden">
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
      {/* Sidebar: fixed width, vertical layout */}
      <aside className="w-64 flex-shrink-0 h-full overflow-y-auto">
        <Sidebar /> {/* Sidebar is now visible */}
      </aside>

<<<<<<< HEAD
      {/* Main content: flexible area, scrollable */}
      <main className="flex-1 overflow-y-auto min-h-screen px-10 py-8 space-y-12">
=======
      {/* Main content: flexible area, no scroll */}
      <main className="flex-1 overflow-hidden px-10 py-8 space-y-12">
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
        <Outlet /> {/* Renders child components */}
      </main>
    </div>
  );
}
