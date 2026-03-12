import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2, Trash2, Download, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  id: number;
  invoice_no: string;
  gr_number?: string;
  status?: string;
}

const FinancePortal = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [fetchingId, setFetchingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = () => {
    setLoading(true);
    fetch("http://localhost:8080/invoices")
      .then((res) => res.json())
      .then((data) => setInvoices(data))
      .catch((err) => console.error("Error fetching invoices:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleFetchSap = async (id: number, invoiceNo: string) => {
    setFetchingId(id);
    try {
      await axios.post(`http://localhost:8080/fetch-sap/${invoiceNo}`);
      fetchInvoices();
    } catch (err) {
      console.error("Error fetching SAP data:", err);
      alert("Failed to fetch SAP data.");
    } finally {
      setFetchingId(null);
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    fetch(`http://localhost:8080/delete/${id}`)
      .then((response) => {
        if (response.ok) setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      })
      .catch((err) => console.error("Error deleting invoice:", err));
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || "pending").toLowerCase();
    if (s === "matched") return <Badge className="bg-success/15 text-success border-success/20 hover:bg-success/20">Matched</Badge>;
    if (s === "mismatch") return <Badge variant="destructive" className="bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20">Mismatch</Badge>;
    return <Badge variant="secondary" className="text-muted-foreground">Pending</Badge>;
  };

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">Invoice List</h1>
            <p className="text-muted-foreground mt-1">{invoices.length} invoice(s) in the system</p>
          </div>
          <Button variant="outline" onClick={fetchInvoices} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        <div className="card-elevated rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="font-medium text-foreground">No invoices found</p>
              <p className="text-sm text-muted-foreground mt-1">Upload an invoice from the Vendor Portal to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Invoice No</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">GR Number</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-muted-foreground">{index + 1}</td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/invoice/${invoice.id}`}
                          className="text-sm font-medium text-accent hover:text-accent/80 hover:underline transition-colors"
                        >
                          {invoice.invoice_no}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {invoice.gr_number ? (
                          <span className="font-mono text-foreground">{invoice.gr_number}</span>
                        ) : (
                          <span className="text-muted-foreground italic">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFetchSap(invoice.id, invoice.invoice_no)}
                            disabled={fetchingId === invoice.id}
                            className="gap-1.5 text-xs"
                          >
                            {fetchingId === invoice.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            Fetch SAP
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(invoice.id)}
                            className="gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
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
    </div>
  );
};

export default FinancePortal;
