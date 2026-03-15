import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SubmissionSuccess = () => {
  const location = useLocation();
  const { invoiceNo } = (location.state as { invoiceNo?: string }) || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <Card className="max-w-md w-full border-none shadow-lg">
        <CardContent className="p-10 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Submitted for Approval</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Invoice <span className="font-semibold text-foreground">{invoiceNo || "—"}</span> has been
              submitted for approval. The approver will review and process it.
            </p>
          </div>
          <Link to="/invoices">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Invoices
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SubmissionSuccess;
