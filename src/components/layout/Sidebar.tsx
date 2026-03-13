import { NavLink, useLocation } from "react-router-dom";
import { useAuth, type UserRole } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  FileText,
  Upload,
  LogOut,
  ChevronRight,
  List,
} from "lucide-react";
import logo from "@/assets/favicon.png";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["finance", "vendor"] },
  { label: "Invoices", path: "/invoices", icon: FileText, roles: ["finance"] },
  { label: "My Invoices", path: "/my-invoices", icon: List, roles: ["vendor"] },
  { label: "Upload Invoice", path: "/upload", icon: Upload, roles: ["vendor", "finance"] },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const filteredNav = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] sidebar-gradient flex flex-col z-30">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-sidebar-border">
        <img src={logo} alt="EzInvoicing" className="h-8 w-8 rounded-lg" />
        <div>
          <span className="text-[15px] font-bold text-sidebar-accent-foreground">EzInvoicing</span>
          <span className="block text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/50 font-medium">
            {user?.role === "vendor" ? "Vendor Portal" : "Finance Portal"}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === "/invoices" && location.pathname.startsWith("/invoices/"));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-sidebar-primary/25"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="px-3 py-2 mb-2">
          <p className="text-[12px] text-sidebar-foreground/50 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-150"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
