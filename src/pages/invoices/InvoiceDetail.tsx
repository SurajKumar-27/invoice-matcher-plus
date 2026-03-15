import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Loader2, CheckCircle2, 
  FileText, Calendar, Hash, DollarSign, Send, ExternalLink, XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

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
  status?: string;
  items_details: InvoiceItem[];
}

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<InvoiceData | null>(null);
  const [syncing, setSyncing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setSyncing(true);
    api.getInvoiceData(id)
      .then(setData)
      .catch(console.error)
      .finally(() => setSyncing(false));
  }, [id]);

  const handleSubmitForApproval = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await api.submitForApproval(id);
      navigate("/submission-success", {
        state: { invoiceNo: data?.invoice_no },
      });
    } catch {
      alert("Failed to submit invoice for approval. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!id) return;
    setIsApproving(true);
    try {
      const result = await api.approveInvoice(id);
      navigate("/sap-success", {
        state: { sap_mairo_number: result.sap_mairo_number || "—", invoiceNo: data?.invoice_no },
      });
    } catch {
      alert("Failed to approve and post invoice to SAP. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!id || !rejectReason.trim()) return;
    setIsRejecting(true);
    try {
      await api.rejectInvoice(id, rejectReason.trim());
      navigate("/approvals");
    } catch {
      alert("Failed to reject invoice. Please try again.");
    } finally {
      setIsRejecting(false);
      setRejectDialogOpen(false);
      setRejectReason("");
    }
  };

  if (syncing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Synchronizing with SAP...</p>
      </div>
    );
  }

  if (!data) return null;

  const items = data.items_details || [];
  const matchCount = items.filter((item) =>
    Number(item.quantity) === Number(item.sap_quantity) &&
    Number(item.rate) === Number(item.sap_price)
  ).length;
  const allMatch = matchCount === items.length && items.length > 0;

  const isFinance = user?.role === "finance";
  const isApprover = user?.role === "approver";
  const backPath = isApprover ? "/approvals" : "/invoices";
  const backLabel = isApprover ? "Back to Approval Queue" : "Back to Invoices";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <Link to={backPath} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </Link>
        <div className="flex items-center gap-3">
          {allMatch && isFinance && (
            <Button onClick={handleSubmitForApproval} disabled={isSubmitting} className="bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90 text-white gap-2">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit for Approval
            </Button>
          )}
          {isApprover && (
            <>
              <Button
                variant="outline"
                onClick={() => setRejectDialogOpen(true)}
                className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
              <Button onClick={handleApprove} disabled={isApproving} className="bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90 text-white gap-2">
                {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Approve & Post to SAP
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="border-none shadow-sm bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">{data.invoice_no}</h1>
                  <Badge className={allMatch ? "bg-success/10 text-success border-0" : "bg-warning/10 text-warning border-0"}>
                    {allMatch ? "Ready for SAP" : "Needs Review"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">3-Way Match Verification Report</p>
              </div>
            </div>
            <div className="flex gap-10">
              <div className="text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">OCR Confidence</p>
                <p className="text-xl font-bold">100%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Validation</p>
                <p className="text-xl font-bold text-success">{matchCount}/{items.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <Card className="h-full">
            <div className="px-5 py-4 border-b bg-muted/20 font-semibold text-sm">Invoice Information</div>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg"><Calendar className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Invoice Date</p>
                  <p className="text-base font-semibold">{data.invoice_date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-accent text-accent-foreground rounded-lg"><Hash className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">GR Number</p>
                  <p className="text-base font-semibold">{data.gr_number || "Not Available"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-success/10 text-success rounded-lg"><DollarSign className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Amount (OCR)</p>
                  <p className="text-xl font-bold">{data.total}</p>
                </div>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Verification ensures quantities and rates extracted via OCR match SAP Purchase Order records.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="overflow-hidden">
            <div className="px-5 py-3 border-b bg-muted/20 flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Original Document
              </span>
              <a href={id ? api.getInvoicePdfUrl(id) : ""} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                Open Fullscreen <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="bg-[#525659] flex items-center justify-center min-h-[400px]">
              <iframe src={id ? api.getInvoicePdfUrl(id) : ""} className="w-full h-[500px] border-0" title="Invoice PDF" />
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="px-6 py-4 border-b bg-muted/20 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <h3 className="text-sm font-semibold">3-Way Match Reconciliation</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/10 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Item Code</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-wider">OCR Qty</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-wider">SAP Qty</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-wider">OCR Rate</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-wider">SAP Rate</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-wider">PO / Item</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item, index) => {
                const isMatch = Number(item.quantity) === Number(item.sap_quantity) && Number(item.rate) === Number(item.sap_price);
                return (
                  <tr key={index} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold">{item.item_code}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground max-w-[250px] truncate">{item.description}</td>
                    <td className="px-6 py-4 text-center font-mono">{item.quantity}</td>
                    <td className={`px-6 py-4 text-center font-mono font-bold ${Number(item.quantity) === Number(item.sap_quantity) ? "text-success" : "text-destructive"}`}>
                      {item.sap_quantity || "0.00"}
                    </td>
                    <td className="px-6 py-4 text-center font-mono">{item.rate}</td>
                    <td className={`px-6 py-4 text-center font-mono font-bold ${Number(item.rate) === Number(item.sap_price) ? "text-success" : "text-destructive"}`}>
                      {item.sap_price || "0.00"}
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-muted-foreground">{item.po_number} / {item.po_item}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge className={isMatch ? "bg-success/10 text-success border-0" : "bg-destructive/10 text-destructive border-0"}>
                        {isMatch ? "Matched" : "Mismatch"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="reject-reason">Reason for rejection</Label>
            <Textarea
              id="reject-reason"
              placeholder="Please provide a reason for rejecting this invoice..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting || !rejectReason.trim()}
            >
              {isRejecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Reject Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default InvoiceDetail;
