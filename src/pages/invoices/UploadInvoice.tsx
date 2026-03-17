import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileUp, CheckCircle, Loader2, X, 
  Package, UserCog, Receipt, Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";

type InvoiceType = "material" | "service" | "direct";

// Enhanced labels with icons
const invoiceTypeLabels: Record<InvoiceType, { label: string; description: string; icon: any }> = {
  material: { 
    label: "Material", 
    description: "Goods/Procurement", 
    icon: Package 
  },
  service: { 
    label: "Service", 
    description: "Service-based", 
    icon: UserCog 
  },
  direct: { 
    label: "Direct", 
    description: "Direct types", 
    icon: Receipt 
  },
};

const UploadInvoice = () => {
  const [file, setFile] = useState<File | null>(null);
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("material");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [success, setSuccess] = useState(false);

  // ... (handleDrag and handleDrop logic remains the same)
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]?.type === "application/pdf") {
      setFile(e.dataTransfer.files[0]);
      setSuccess(false);
    }
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setSuccess(false);
    try {
      await api.uploadInvoice(file, invoiceType);
      setSuccess(true);
      setFile(null);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
      <PageHeader title="Upload Invoice" description="Submit a PDF invoice for OCR extraction and processing." />

      <form onSubmit={handleUpload} className="space-y-6">
        {/* Horizontal Card Selection */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Select Invoice Type</p>
          <RadioGroup
            value={invoiceType}
            onValueChange={(v) => setInvoiceType(v as InvoiceType)}
            className="grid grid-cols-3 gap-3"
          >
            {(Object.keys(invoiceTypeLabels) as InvoiceType[]).map((type) => {
              const Icon = invoiceTypeLabels[type].icon;
              const isSelected = invoiceType === type;
              
              return (
                <div key={type} className="relative">
                  <RadioGroupItem value={type} id={`type-${type}`} className="sr-only" />
                  <Label
                    htmlFor={`type-${type}`}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 h-full text-center group ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-muted-foreground/30 bg-card"
                    }`}
                  >
                    <div className={`mb-3 p-2.5 rounded-lg transition-colors ${
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <p className="text-sm font-bold leading-none">{invoiceTypeLabels[type].label}</p>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-tight">
                      {invoiceTypeLabels[type].description}
                    </p>

                    {isSelected && (
                      <motion.div 
                        layoutId="active-check"
                        className="absolute top-2 right-2 text-primary"
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    )}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`bg-card rounded-2xl border-2 border-dashed transition-all duration-300 ${
            dragActive
              ? "border-primary bg-primary/5 scale-[1.01]"
              : file
              ? "border-primary/40"
              : "border-border hover:border-primary/20"
          }`}
        >
          <label className="flex flex-col items-center justify-center py-16 cursor-pointer px-6">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                  setSuccess(false);
                }
              }}
            />
            {file ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <FileUp className="w-8 h-8 text-primary" />
                </div>
                <p className="font-bold text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1.5 bg-muted px-2 py-1 rounded-full inline-block">
                  {(file.size / 1024).toFixed(0)} KB • PDF
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setFile(null); }}
                  className="mt-4 text-xs font-medium text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 mx-auto"
                >
                  <X className="w-3.5 h-3.5" /> Remove File
                </button>
              </motion.div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-bold text-foreground">Drop your invoice here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse from your computer</p>
              </div>
            )}
          </label>
        </div>

        <Button
          type="submit"
          disabled={!file || loading}
          className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px]"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing Invoice...</>
          ) : (
            <><Upload className="w-5 h-5 mr-2" /> Upload & Process</>
          )}
        </Button>
      </form>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 p-4 rounded-2xl bg-success/10 border border-success/20 flex items-center gap-4 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Upload Complete</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The document is now in the extraction queue. You'll see the results in the dashboard.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UploadInvoice;