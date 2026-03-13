import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Trash2, Download, FileText, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge from "@/components/invoices/StatusBadge";

interface Invoice {
  id: number;
  invoice_no: string;
  gr_number?: string;
  mairo_number?: string;
  status?: string;
}

const InvoiceList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [fetchingId, setFetchingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.getInvoices()
      .then(setInvoices)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleFetchSap = async (id: number, invoiceNo: string) => {
    setFetchingId(id);
    try {
      await api.fetchSapGr(invoiceNo);
      load();
    } catch {
      alert("Failed to fetch SAP data.");
    } finally {
      setFetchingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this invoice? This action cannot be undone.")) return;
    try {
      await api.deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch {
      alert("Delete failed.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Invoices" description={`${invoices.length} invoice(s) in the system`}>
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
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">GR Number</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">MAIRO No</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
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
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1.5"
                      >
                        {invoice.invoice_no}
                        <ExternalLink className="w-3 h-3 opacity-40" />
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      {invoice.gr_number ? (
                        <span className="font-mono text-xs text-foreground bg-muted px-2 py-0.5 rounded">{invoice.gr_number}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      {invoice.mairo_number ? (
                        <span className="font-mono text-xs text-foreground bg-success/10 text-success px-2 py-0.5 rounded">{invoice.mairo_number}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={invoice.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {!invoice.gr_number && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleFetchSap(invoice.id, invoice.invoice_no)}
                            disabled={fetchingId === invoice.id}
                            className="h-8 px-2.5 text-xs gap-1.5"
                          >
                            {fetchingId === invoice.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            Fetch GR
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(invoice.id)}
                          className="h-8 px-2.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
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

export default InvoiceList;
