"use client";

import React, { ReactNode } from "react";
import AdminApp from "./AdminApp";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return <AdminApp>{children}</AdminApp>;
};

export default DashboardLayout;
