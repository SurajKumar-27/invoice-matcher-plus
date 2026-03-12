import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileUp, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VendorPortal = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
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
      setPdfFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) return alert("Please select a PDF file first.");

    setLoading(true);
    setSuccess(false);
    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });
      await response.json();
      setSuccess(true);
      setPdfFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold font-display text-foreground mb-1">Submit Invoice</h1>
        <p className="text-muted-foreground mb-8">Upload a PDF invoice for OCR processing and SAP matching.</p>

        <form onSubmit={handleUpload}>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`card-elevated rounded-xl border-2 border-dashed transition-all duration-300 ${
              dragActive
                ? "border-accent bg-accent/5"
                : pdfFile
                ? "border-accent/40 bg-accent/[0.03]"
                : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <label className="flex flex-col items-center justify-center py-16 cursor-pointer">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && setPdfFile(e.target.files[0])}
              />
              {pdfFile ? (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
                  <FileUp className="w-12 h-12 text-accent mx-auto mb-3" />
                  <p className="font-medium text-foreground">{pdfFile.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(pdfFile.size / 1024).toFixed(1)} KB — Click to change
                  </p>
                </motion.div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="font-medium text-foreground">Drop your PDF here or click to browse</p>
                  <p className="text-sm text-muted-foreground mt-1">Only PDF files are accepted</p>
                </div>
              )}
            </label>
          </div>

          <Button
            type="submit"
            disabled={!pdfFile || loading}
            className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" /> Upload Invoice
              </>
            )}
          </Button>
        </form>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-4 rounded-lg bg-success/10 border border-success/20 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-sm font-medium text-foreground">
                Invoice uploaded successfully! It will appear in the Finance Portal after OCR processing.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VendorPortal;
