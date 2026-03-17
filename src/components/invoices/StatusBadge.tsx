import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status?: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const s = (status || "new").toLowerCase();

  const config: Record<string, { label: string; className: string }> = {
    new: { label: "New", className: "bg-blue-500/10 text-blue-600 border-0" },
    "goods received": { label: "Goods Received", className: "bg-amber-500/10 text-amber-600 border-0" },
    matched: { label: "Matched", className: "bg-success/10 text-success border-0" },
    mismatch: { label: "Mismatch", className: "bg-destructive/10 text-destructive border-0" },
    "ses fetched": { label: "SES Fetched", className: "bg-indigo-500/10 text-indigo-600 border-0" },
    submitted: { label: "Submitted", className: "bg-emerald-500/10 text-emerald-700 border-0" },
    pending: { label: "Pending", className: "bg-muted text-muted-foreground border-0" },
    "pending approval": { label: "Pending Approval", className: "bg-purple-500/10 text-purple-600 border-0" },
    approved: { label: "Approved", className: "bg-success/10 text-success border-0" },
    rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-0" },
  };

  const { label, className } = config[s] || config.new;

  return (
    <Badge className={`${className} font-medium text-xs`}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
