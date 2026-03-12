import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Upload, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Zap,
    title: "OCR Parsing",
    description: "Automatically extract invoice data from PDF documents with high accuracy.",
  },
  {
    icon: Shield,
    title: "3-Way Matching",
    description: "Compare OCR results against SAP Purchase Orders and Goods Receipts.",
  },
  {
    icon: BarChart3,
    title: "SAP Integration",
    description: "Fetch GR numbers and post matched invoices directly to SAP.",
  },
];

const Index = () => {
  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto py-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground leading-tight">
          Invoice Processing,{" "}
          <span className="text-accent">Simplified</span>
        </h1>
        <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
          Upload invoices, run OCR extraction, perform 3-way matching with SAP, and post — all from one unified portal.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link to="/vendor-portal">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 h-11 px-6">
              <Upload className="w-4 h-4" /> Upload Invoice
            </Button>
          </Link>
          <Link to="/finance-portal">
            <Button variant="outline" className="gap-2 h-11 px-6">
              <FileText className="w-4 h-4" /> View Invoices <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pb-16">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className="card-elevated rounded-xl p-6 text-center"
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <feature.icon className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold font-display text-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Index;
