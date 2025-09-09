"use client";

import React, { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Menu } from "lucide-react";
import Image from "next/image";
import Sidebar from "@/app/components/Sidebar";

// Logout button
function LogoutButton() {
  const { logout } = useAuth();
  const handleLogout = () => logout();
  return (
    <button
      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

interface AdminAppProps {
  children: ReactNode;
}

function AdminApp({ children }: AdminAppProps) {
  const { user, accessToken, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  if (!user || !accessToken) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-lg z-30 w-full fixed top-0 left-0">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <Image
                height={40}
                width={150}
                src="/assets/HireCoop.svg"
                alt="HireCoop Logo"
              />
              <span className="pl-10 ext-sm text-gray-600 hidden sm:block">
                Welcome, {user.first_name} {user.last_name}
              </span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.first_name.charAt(0)}
                </span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main content */}
        <main className="flex-1 p-4 md:ml-64 pt-24 overflow-y-auto h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminApp;
