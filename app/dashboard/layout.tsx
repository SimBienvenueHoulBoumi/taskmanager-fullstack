"use client";

import Sidebar from "../ui/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Contenu principal qui s'ajuste en fonction de la sidebar */}
      <div className="flex-1 flex flex-col">
        {/* Contenu principal avec un bon espace */}
        <div className="flex-1 overflow-auto">
          <div className="m-4 mr-20 ">{children}</div>
        </div>
      </div>
    </div>
  );
}
