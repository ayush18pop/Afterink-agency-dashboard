import React from "react";
import Sidebar from "../components/Sidebar"; // Sidebar import
import { Outlet } from "react-router-dom"; // Outlet to render child routes

export default function CEOLayout() {
  return (
    <div className="flex h-screen bg-[#17171e]">
      {/* Sidebar: fixed width, vertical layout */}
      <aside className="w-64 flex-shrink-0 h-full overflow-y-auto">
        <Sidebar /> {/* Sidebar is now visible */}
      </aside>

      {/* Main content: flexible area, scrollable */}
      <main className="flex-1 overflow-y-auto min-h-screen px-10 py-8 space-y-12">
        <Outlet /> {/* Renders child components */}
      </main>
    </div>
  );
}
