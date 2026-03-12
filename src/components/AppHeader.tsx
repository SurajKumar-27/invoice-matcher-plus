import { Link } from "react-router-dom";
import logo from "@/assets/ez-invoicing-logo.png";

const AppHeader = () => {
  return (
    <header className="h-16 bg-primary border-b border-primary/20 flex items-center px-6 shadow-sm">
      <Link to="/" className="flex items-center gap-3">
        <img src={logo} alt="EzInvoicing" className="h-9 w-9 rounded" />
        <span className="text-xl font-bold font-display text-primary-foreground tracking-tight">
          EzInvoicing
        </span>
      </Link>
    </header>
  );
};

export default AppHeader;
