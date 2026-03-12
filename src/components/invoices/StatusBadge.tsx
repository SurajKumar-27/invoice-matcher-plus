import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status?: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const s = (status || "pending").toLowerCase();

  if (s === "matched") {
    return (
      <Badge className="bg-success/10 text-success border-0 font-medium text-xs">
        Matched
      </Badge>
    );
  }
  if (s === "mismatch") {
    return (
      <Badge className="bg-destructive/10 text-destructive border-0 font-medium text-xs">
        Mismatch
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="border-0 font-medium text-xs text-muted-foreground">
      Pending
    </Badge>
  );
};

export default StatusBadge;
