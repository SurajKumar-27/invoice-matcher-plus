import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth, type UserRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Building2, AlertCircle } from "lucide-react";
import logo from "@/assets/favicon.png";

const Login = () => {
  const [role, setRole] = useState<UserRole>("vendor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, password, role);
    if (success) {
      navigate(role === "vendor" ? "/upload" : "/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-[480px] sidebar-gradient flex-col justify-between p-10">
        <div className="flex items-center gap-3">
          <img src={logo} alt="EzInvoicing" className="h-10 w-10 rounded-xl" />
          <span className="text-xl font-bold text-primary-foreground">EzInvoicing</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-primary-foreground leading-tight mb-4">
            Streamline your invoice processing workflow
          </h2>
          <p className="text-primary-foreground/60 leading-relaxed">
            OCR-powered extraction, automated 3-way matching, and seamless SAP integration — all in one platform.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { value: "3-Way", label: "Auto Matching" },
              { value: "SAP", label: "Integration" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-xs text-primary-foreground/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-primary-foreground/30">© {new Date().getFullYear()} EzInvoicing</p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[380px]"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src={logo} alt="EzInvoicing" className="h-9 w-9 rounded-xl" />
            <span className="text-xl font-bold text-foreground">EzInvoicing</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-8">Sign in to your account to continue</p>

          {/* Role toggle */}
          <div className="flex rounded-lg bg-muted p-1 mb-6">
            {(["vendor", "finance"] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  role === r
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "vendor" ? <Building2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                {r === "vendor" ? "Vendor" : "Finance"}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/8 border border-destructive/15 mb-4">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-sm font-semibold">
              Sign In
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
