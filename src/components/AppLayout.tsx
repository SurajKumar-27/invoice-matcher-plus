import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppNavbar from "./AppNavbar";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <AppNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="h-12 border-t flex items-center justify-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} EzInvoicing — Powered by Answerthink
        </p>
      </footer>
    </div>
  );
};

export default AppLayout;
