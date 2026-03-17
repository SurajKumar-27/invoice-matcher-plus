import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Trash2, Download, FileText, RefreshCw, ExternalLink, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import StatusBadge from "@/components/invoices/StatusBadge";

interface Invoice {
  id: number;
  invoice_no: string;
  invoice_type?: string;
  gr_number?: string;
  ses_number?: string;
  mairo_number?: string;
  status?: string;
}

const InvoiceList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [fetchingId, setFetchingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const load = () => {
    setLoading(true);
    api.getInvoices()
      .then(setInvoices)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch = !searchQuery || 
        inv.invoice_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.gr_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.ses_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.mairo_number?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || inv.invoice_type === typeFilter;
      const matchesStatus = statusFilter === "all" || inv.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [invoices, searchQuery, typeFilter, statusFilter]);

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

  const handleFetchSes = async (id: number, invoiceNo: string) => {
    setFetchingId(id);
    try {
      await api.fetchSes(invoiceNo);
      load();
    } catch {
      alert("Failed to fetch SES data.");
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

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(invoices.map((inv) => inv.status).filter(Boolean));
    return Array.from(statuses) as string[];
  }, [invoices]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Invoices" description={`${filteredInvoices.length} of ${invoices.length} invoice(s)`}>
        <Button variant="outline" size="sm" onClick={load} className="gap-2 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="material">Material</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="direct">Direct</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] h-9 text-sm">
            <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {uniqueStatuses.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground text-sm">No invoices found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {invoices.length > 0 ? "Try adjusting your filters." : "Upload an invoice to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Invoice No</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">GR Number</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">SES Number</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">SAP Document</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => (
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
                    <td className="px-5 py-3.5">
                      {invoice.invoice_type ? (
                        <span className="text-xs font-medium capitalize bg-muted px-2 py-0.5 rounded text-foreground">
                          {invoice.invoice_type}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      {invoice.gr_number ? (
                        <span className="font-mono text-xs text-foreground bg-muted px-2 py-0.5 rounded">{invoice.gr_number}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      {invoice.ses_number ? (
                        <span className="font-mono text-xs text-foreground bg-muted px-2 py-0.5 rounded">{invoice.ses_number}</span>
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
                        {/* Fetch GR for material invoices */}
                        {invoice.invoice_type === "material" && !invoice.gr_number && (
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
                        {/* Fetch SES for service invoices */}
                        {invoice.invoice_type === "service" && !invoice.ses_number && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleFetchSes(invoice.id, invoice.invoice_no)}
                            disabled={fetchingId === invoice.id}
                            className="h-8 px-2.5 text-xs gap-1.5"
                          >
                            {fetchingId === invoice.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            Fetch SES
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
