import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  // Order statuses
  pending: "bg-muted text-muted-foreground",
  "in transit": "bg-primary/10 text-primary",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
  
  // RMA statuses
  "pending approval": "bg-warning/10 text-warning",
  "item received": "bg-primary/10 text-primary",
  closed: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const style = statusStyles[normalizedStatus] || statusStyles.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        style,
        className
      )}
    >
      {status}
    </span>
  );
}
