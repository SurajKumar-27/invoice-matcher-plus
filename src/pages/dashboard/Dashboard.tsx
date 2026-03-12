import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/layout/PageHeader";
import { FileText, Upload, CheckCircle, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const isFinance = user?.role === "finance";

  const stats = isFinance
    ? [
        { label: "Total Invoices", value: "—", icon: FileText, color: "text-primary" },
        { label: "Matched", value: "—", icon: CheckCircle, color: "text-success" },
        { label: "Pending Review", value: "—", icon: BarChart3, color: "text-warning" },
        { label: "Uploaded Today", value: "—", icon: Upload, color: "text-muted-foreground" },
      ]
    : [
        { label: "Your Uploads", value: "—", icon: Upload, color: "text-primary" },
        { label: "Processing", value: "—", icon: BarChart3, color: "text-warning" },
      ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title={`Welcome back`}
        description={isFinance ? "Finance portal overview" : "Vendor portal overview"}
      />

      <div className={`grid gap-4 mb-8 ${isFinance ? "grid-cols-4" : "grid-cols-2"}`}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/upload"
          className="bg-card rounded-xl border p-5 hover:border-primary/30 hover:shadow-sm transition-all group"
        >
          <Upload className="w-5 h-5 text-primary mb-3" />
          <p className="font-semibold text-foreground text-sm">Upload Invoice</p>
          <p className="text-xs text-muted-foreground mt-1">Submit a new PDF for processing</p>
        </Link>
        {isFinance && (
          <Link
            to="/invoices"
            className="bg-card rounded-xl border p-5 hover:border-primary/30 hover:shadow-sm transition-all group"
          >
            <FileText className="w-5 h-5 text-primary mb-3" />
            <p className="font-semibold text-foreground text-sm">View Invoices</p>
            <p className="text-xs text-muted-foreground mt-1">Review and match invoices with SAP</p>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
