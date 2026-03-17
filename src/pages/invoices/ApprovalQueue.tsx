import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Eye, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/invoices/StatusBadge";
import PageHeader from "@/components/layout/PageHeader";
import { api } from "@/lib/api";

interface PendingInvoice {
  id: number;
  invoice_no: string;
  submitted_by?: string;
  submitted_at?: string;
  total?: string;
  status: string;
}

const ApprovalQueue = () => {
  const [invoices, setInvoices] = useState<PendingInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPendingApprovals()
      .then(setInvoices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Approval Queue"
        description="Review and approve invoices submitted by the finance team"
      />

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading pending approvals...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Inbox className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">No invoices pending approval</p>
            <p className="text-xs text-muted-foreground/60">Invoices submitted for approval will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/10 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Invoice No</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map((inv, index) => (
                  <tr key={inv.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground">{index + 1}</td>
                    <td className="px-6 py-4 font-mono font-semibold">{inv.invoice_no}</td>
                    <td className="px-6 py-4 text-muted-foreground">{inv.submitted_by || "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{inv.submitted_at || "—"}</td>
                    <td className="px-6 py-4 font-mono">{inv.total || "—"}</td>
                    <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/invoices/${inv.id}`}>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="w-3.5 h-3.5" /> Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ApprovalQueue;
