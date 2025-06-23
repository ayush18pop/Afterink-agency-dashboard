import React from "react";
import { Outlet } from "react-router-dom";
import FoundingSidebar from "./FoundingSidebar";

export default function FoundingLayout() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 h-full">
        <FoundingSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
