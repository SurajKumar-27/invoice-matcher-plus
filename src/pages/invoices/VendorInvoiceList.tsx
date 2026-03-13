import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge from "@/components/invoices/StatusBadge";

interface Invoice {
  id: number;
  invoice_no: string;
  status?: string;
}

const VendorInvoiceList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.getInvoices()
      .then(setInvoices)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="My Invoices" description={`${invoices.length} invoice(s) uploaded`}>
        <Button variant="outline" size="sm" onClick={load} className="gap-2 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </PageHeader>

      <div className="bg-card rounded-xl border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground text-sm">No invoices yet</p>
            <p className="text-xs text-muted-foreground mt-1">Upload an invoice to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Invoice No</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs text-muted-foreground tabular-nums">{index + 1}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-foreground">{invoice.invoice_no}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={invoice.status} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VendorInvoiceList;
