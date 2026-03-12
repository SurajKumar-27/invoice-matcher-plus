import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle2, XCircle, FileText, Calendar, Hash, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface InvoiceItem {
  item_code: string;
  description: string;
  quantity: string;
  sap_quantity: string;
  rate: string;
  sap_price: string;
  po_number: string;
  po_item: string;
}

interface InvoiceData {
  invoice_no: string;
  invoice_date: string;
  gr_number?: string;
  total: string;
  items_details: InvoiceItem[];
}

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<InvoiceData | null>(null);
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    if (!id) return;
    setSyncing(true);
    api.getInvoiceData(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setSyncing(false));
  }, [id]);

  if (syncing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Synchronizing with SAP...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <XCircle className="w-8 h-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">Invoice not found</p>
        <Link to="/invoices" className="text-xs text-primary hover:underline">Back to list</Link>
      </div>
    );
  }

  const items = data.items_details || [];
  const matchCount = items.filter((item) =>
    Number(item.quantity) === Number(item.sap_quantity) &&
    Number(item.rate) === Number(item.sap_price)
  ).length;
  const allMatch = matchCount === items.length && items.length > 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Breadcrumb */}
      <Link
        to="/invoices"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Invoices
      </Link>

      {/* Title row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">{data.invoice_no}</h1>
          <p className="text-xs text-muted-foreground mt-1">Invoice Audit & 3-Way Match</p>
        </div>
        <Badge className={`text-xs font-semibold border-0 ${
          allMatch ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
        }`}>
          {matchCount}/{items.length} Matched
        </Badge>
      </div>

      {/* Two-column: Summary + PDF */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Calendar, label: "Invoice Date", value: data.invoice_date },
            { icon: Hash, label: "GR Number", value: data.gr_number || "Not linked" },
            { icon: DollarSign, label: "Total (OCR)", value: data.total, span: true },
          ].map((card) => (
            <div
              key={card.label}
              className={`bg-card rounded-xl border p-4 ${card.span ? "col-span-2" : ""}`}
            >
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <card.icon className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">{card.label}</span>
              </div>
              <p className={`font-bold text-foreground ${card.span ? "text-2xl" : "text-base"}`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* PDF viewer */}
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/30">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">Invoice PDF</span>
          </div>
          <iframe
            src={id ? api.getInvoicePdfUrl(id) : ""}
            className="w-full h-[420px]"
            title="Invoice PDF"
          />
        </div>
      </div>

      {/* 3-Way Match Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="px-5 py-3.5 border-b bg-muted/30">
          <h3 className="text-sm font-semibold text-foreground">3-Way Match Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/20">
                {["Item Code", "Description", "OCR Qty", "SAP Qty", "OCR Rate", "SAP Rate", "PO / Item", "Result"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-left last:text-center"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const qtyMatch = Number(item.quantity) === Number(item.sap_quantity);
                const priceMatch = Number(item.rate) === Number(item.sap_price);
                const isMatch = qtyMatch && priceMatch;

                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={`border-b last:border-0 ${isMatch ? "bg-success/[0.03]" : "bg-destructive/[0.03]"}`}
                  >
                    <td className="px-4 py-3 text-xs font-mono text-foreground">{item.item_code}</td>
                    <td className="px-4 py-3 text-xs text-foreground max-w-[180px] truncate">{item.description}</td>
                    <td className="px-4 py-3 text-xs font-mono text-foreground">{item.quantity}</td>
                    <td className={`px-4 py-3 text-xs font-mono font-semibold ${qtyMatch ? "text-success" : "text-destructive"}`}>
                      {item.sap_quantity || "0.000"}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-foreground">{item.rate}</td>
                    <td className={`px-4 py-3 text-xs font-mono font-semibold ${priceMatch ? "text-success" : "text-destructive"}`}>
                      {item.sap_price || "0.00"}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                      {item.po_number ? `${item.po_number} / ${item.po_item}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isMatch ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Match
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive">
                          <XCircle className="w-3.5 h-3.5" /> Mismatch
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceDetail;
