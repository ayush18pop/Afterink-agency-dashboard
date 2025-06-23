import React from "react";
import { Outlet } from "react-router-dom";
import FoundingSidebar from "./FoundingSidebar";

export default function FoundingLayout() {
  return (
<<<<<<< HEAD
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 h-full">
        <FoundingSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
=======
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar: fixed width, vertical layout */}
      <FoundingSidebar className="flex-shrink-0" />

      {/* Main content: takes the remaining space */}
      <main className="flex-1 p-6 bg-gray-900 text-white overflow-auto">
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
        <Outlet />
      </main>
    </div>
  );
}
