import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowLeft, Loader2, CheckCircle2, XCircle, FileText, Calendar, Hash, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const { id } = useParams();
  const [data, setData] = useState<InvoiceData | null>(null);
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setSyncing(true);
      try {
        const response = await axios.get(`http://localhost:8080/invoice/${id}/data`);
        setData(response.data);
      } catch (error) {
        console.error("Error loading details:", error);
      } finally {
        setSyncing(false);
      }
    };
    loadData();
  }, [id]);

  if (syncing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <div className="text-center">
          <p className="font-medium text-foreground">Synchronizing with SAP BAPI...</p>
          <p className="text-sm text-muted-foreground mt-1">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <XCircle className="w-12 h-12 text-destructive/50 mb-3" />
        <p className="font-medium text-foreground">Invoice data not found</p>
        <Link to="/finance-portal" className="text-sm text-accent hover:underline mt-2">
          Back to Invoice List
        </Link>
      </div>
    );
  }

  const matchCount = data.items_details?.filter((item) => {
    return Number(item.quantity) === Number(item.sap_quantity) && Number(item.rate) === Number(item.sap_price);
  }).length ?? 0;
  const totalItems = data.items_details?.length ?? 0;
  const allMatch = matchCount === totalItems && totalItems > 0;

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Link
          to="/finance-portal"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Invoice List
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Invoice Audit: {data.invoice_no}
            </h1>
            <p className="text-muted-foreground mt-1">3-Way Match Comparison — OCR vs SAP</p>
          </div>
          <Badge className={allMatch
            ? "bg-success/15 text-success border-success/20"
            : "bg-warning/15 text-warning border-warning/20"
          }>
            {matchCount}/{totalItems} Items Matched
          </Badge>
        </div>

        {/* Summary + PDF side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Summary Cards */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="card-elevated rounded-xl p-5">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" /> <span className="text-xs font-medium uppercase tracking-wide">Date</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{data.invoice_date}</p>
              </div>
              <div className="card-elevated rounded-xl p-5">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Hash className="w-4 h-4" /> <span className="text-xs font-medium uppercase tracking-wide">GR Number</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{data.gr_number || "Not Linked"}</p>
              </div>
              <div className="card-elevated rounded-xl p-5 col-span-2">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <DollarSign className="w-4 h-4" /> <span className="text-xs font-medium uppercase tracking-wide">Total (OCR)</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{data.total}</p>
              </div>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="card-elevated rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b bg-muted/30">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Invoice PDF</span>
            </div>
            <iframe
              src={`http://localhost:8080/invoice/${id}/pdf`}
              className="w-full h-[500px] bg-muted/20"
              title="Invoice PDF"
            />
          </div>
        </div>

        {/* 3-Way Match Table */}
        <div className="card-elevated rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b bg-muted/30">
            <h3 className="font-semibold font-display text-foreground">3-Way Match Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Item Code</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Description</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider">OCR Qty</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider">SAP Qty</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider">OCR Rate</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider">SAP Rate</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider">PO / Item</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items_details?.map((item, index) => {
                  const qtyMatch = Number(item.quantity) === Number(item.sap_quantity);
                  const priceMatch = Number(item.rate) === Number(item.sap_price);
                  const isMatch = qtyMatch && priceMatch;

                  return (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.04 }}
                      className={isMatch ? "bg-success/[0.04]" : "bg-destructive/[0.04]"}
                    >
                      <td className="px-5 py-3.5 text-sm font-mono text-foreground">{item.item_code}</td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{item.description}</td>
                      <td className="px-5 py-3.5 text-sm text-right font-mono text-foreground">{item.quantity}</td>
                      <td className={`px-5 py-3.5 text-sm text-right font-mono font-semibold ${qtyMatch ? "text-success" : "text-destructive"}`}>
                        {item.sap_quantity || "0.000"}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-right font-mono text-foreground">{item.rate}</td>
                      <td className={`px-5 py-3.5 text-sm text-right font-mono font-semibold ${priceMatch ? "text-success" : "text-destructive"}`}>
                        {item.sap_price || "0.00"}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-center font-mono text-muted-foreground">
                        {item.po_number ? `${item.po_number} / ${item.po_item}` : "N/A"}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {isMatch ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                            <CheckCircle2 className="w-4 h-4" /> Match
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                            <XCircle className="w-4 h-4" /> Mismatch
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
    </div>
  );
};

export default InvoiceDetail;
