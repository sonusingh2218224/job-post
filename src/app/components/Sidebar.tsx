import {
  LayoutDashboard,
  Briefcase,
  Plus,
  Users,
  MessageSquare,
  BarChart3,
  X,
} from "lucide-react";
function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}) {
  const navigationItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: true,
    },
    { name: "Jobs", icon: Briefcase, href: "/jobs" },
    { name: "Create Job", icon: Plus, href: "/create-job" },
    { name: "Candidates", icon: Users, href: "/candidates" },
    { name: "AI Interview", icon: MessageSquare, href: "/ai-interview" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      <aside
        className={`bg-[#5937B7] text-white fixed top-18 left-0 z-20 w-64 h-[calc(100vh-5rem)] flex flex-col shadow-lg
          border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          md:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Mobile close button in sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-purple-400 md:hidden">
          <div className="text-xl font-bold text-white">HireCoop</div>
          <button
            onClick={() => setMobileOpen?.(false)}
            className="p-2 rounded-md hover:bg-purple-600"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 pb-4 pt-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-md text-white transition-colors duration-200 ${
                  item.active ? "bg-[#9085f4] font-semibold" : ""
                }`}
                onClick={() => {
                  // Close mobile sidebar when navigation item is clicked
                  if (window.innerWidth < 768) {
                    setMobileOpen?.(false);
                  }
                }}
              >
                <Icon className="w-5 h-5 mr-3" /> {item.name}
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
