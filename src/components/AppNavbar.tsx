import { NavLink, useNavigate } from "react-router-dom";
import { Home, FileText, Upload, LogOut } from "lucide-react";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Invoice List", path: "/finance-portal", icon: FileText },
  { name: "Upload", path: "/vendor-portal", icon: Upload },
];

const AppNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <nav className="h-11 bg-primary/90 backdrop-blur-sm flex items-center px-6 gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            }`
          }
        >
          <item.icon className="w-4 h-4" />
          {item.name}
        </NavLink>
      ))}
      <button
        onClick={handleLogout}
        className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-200"
      >
        <LogOut className="w-4 h-4" />
        Log Out
      </button>
    </nav>
  );
};

export default AppNavbar;
