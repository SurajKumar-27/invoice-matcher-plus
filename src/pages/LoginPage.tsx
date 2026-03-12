import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Building2 } from "lucide-react";
import logo from "@/assets/ez-invoicing-logo.png";

const LoginPage = () => {
  const [role, setRole] = useState<"vendor" | "finance">("vendor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "vendor") {
      if (email === "vendorinvoice@gmail.com" && password === "1234") {
        navigate("/vendor-portal");
      } else {
        alert("Invalid vendor credentials!");
      }
    } else {
      if (email === "financeinvoice@gmail.com" && password === "1234") {
        navigate("/finance-portal");
      } else {
        alert("Invalid finance credentials!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/[0.03] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img src={logo} alt="EzInvoicing" className="h-16 w-16 mx-auto mb-4 rounded-xl" />
          <h1 className="text-3xl font-bold font-display text-foreground">EzInvoicing</h1>
          <p className="text-muted-foreground mt-1">OCR Invoice Processing & SAP Integration</p>
        </div>

        <div className="card-elevated p-8 rounded-xl">
          {/* Role Toggle */}
          <div className="flex rounded-lg bg-muted p-1 mb-6">
            <button
              onClick={() => setRole("vendor")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                role === "vendor"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Vendor
            </button>
            <button
              onClick={() => setRole("finance")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                role === "finance"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-4 h-4" />
              Finance
            </button>
          </div>

          <h2 className="text-lg font-semibold font-display text-foreground mb-6">
            {role === "vendor" ? "Vendor" : "Finance"} Portal Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
