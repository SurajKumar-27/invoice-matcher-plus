import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileUp, CheckCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";

type InvoiceType = "material" | "service" | "direct";

const invoiceTypeLabels: Record<InvoiceType, { label: string; description: string }> = {
  material: { label: "Material Invoice", description: "For goods/material procurement" },
  service: { label: "Service Invoice", description: "For service-based procurement" },
  direct: { label: "Direct Invoice", description: "Direct invoice types" },
};

const UploadInvoice = () => {
  const [file, setFile] = useState<File | null>(null);
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("material");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [success, setSuccess] = useState(false);

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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
      <PageHeader title="Upload Invoice" description="Submit a PDF invoice for OCR extraction and processing." />

      <form onSubmit={handleUpload}>
        {/* Invoice Type Selection */}
        <div className="bg-card rounded-xl border p-5 mb-4">
          <p className="text-sm font-semibold text-foreground mb-3">Invoice Type</p>
          <RadioGroup
            value={invoiceType}
            onValueChange={(v) => setInvoiceType(v as InvoiceType)}
            className="flex flex-col gap-2"
          >
            {(Object.keys(invoiceTypeLabels) as InvoiceType[]).map((type) => (
              <Label
                key={type}
                htmlFor={`type-${type}`}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  invoiceType === type
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <RadioGroupItem value={type} id={`type-${type}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{invoiceTypeLabels[type].label}</p>
                  <p className="text-xs text-muted-foreground">{invoiceTypeLabels[type].description}</p>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`bg-card rounded-xl border-2 border-dashed transition-all duration-200 ${
            dragActive
              ? "border-primary bg-primary/5"
              : file
              ? "border-primary/30"
              : "border-border hover:border-muted-foreground/30"
          }`}
        >
          <label className="flex flex-col items-center justify-center py-20 cursor-pointer px-6">
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
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileUp className="w-7 h-7 text-primary" />
                </div>
                <p className="font-semibold text-foreground text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(file.size / 1024).toFixed(0)} KB • Click or drop to replace
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setFile(null); }}
                  className="mt-3 text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 mx-auto"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              </motion.div>
            ) : (
              <div className="text-center">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="font-semibold text-foreground text-sm">Drop your invoice here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse • PDF only</p>
              </div>
            )}
          </label>
        </div>

        <Button
          type="submit"
          disabled={!file || loading}
          className="w-full mt-4 h-11 font-semibold"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
          ) : (
            <><Upload className="w-4 h-4 mr-2" /> Upload & Process</>
          )}
        </Button>
      </form>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 rounded-xl bg-success/8 border border-success/15 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Invoice uploaded successfully</p>
              <p className="text-xs text-muted-foreground mt-0.5">OCR extraction will begin shortly.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UploadInvoice;
