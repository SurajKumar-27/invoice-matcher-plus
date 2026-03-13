import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import DashboardShell from "@/components/layout/DashboardShell";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import UploadInvoice from "@/pages/invoices/UploadInvoice";
import InvoiceList from "@/pages/invoices/InvoiceList";
import VendorInvoiceList from "@/pages/invoices/VendorInvoiceList";
import InvoiceDetail from "@/pages/invoices/InvoiceDetail";
import SapSuccess from "@/pages/invoices/SapSuccess";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const FinanceRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (user?.role !== "finance") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<DashboardShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadInvoice />} />
              <Route path="/invoices" element={<FinanceRoute><InvoiceList /></FinanceRoute>} />
              <Route path="/invoices/:id" element={<FinanceRoute><InvoiceDetail /></FinanceRoute>} />
              <Route path="/my-invoices" element={<VendorInvoiceList />} />
              <Route path="/sap-success" element={<FinanceRoute><SapSuccess /></FinanceRoute>} />
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
