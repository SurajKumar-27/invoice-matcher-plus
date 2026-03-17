import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SapSuccess = () => {
  const location = useLocation();
  const { sap_mairo_number, invoiceNo, isDirect } = (location.state as { sap_mairo_number?: string; invoiceNo?: string; isDirect?: boolean }) || {};

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <Card className="w-[440px] border-none shadow-lg">
          <CardContent className="p-10 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-10 h-10 text-success" />
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {isDirect ? "SAP Document Posted Successfully" : "MIRO Parked Successfully"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Invoice <span className="font-semibold text-foreground">{invoiceNo || "—"}</span> has been posted to SAP.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                {isDirect ? "SAP Document Number" : "MIRO Number"}
              </p>
              <p className="text-3xl font-bold text-primary font-mono tracking-wide">{sap_mairo_number || "—"}</p>
            </div>

            <Link to="/invoices">
              <Button className="w-full h-11 gap-2 font-semibold mt-2">
                Go to Invoices <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SapSuccess;
