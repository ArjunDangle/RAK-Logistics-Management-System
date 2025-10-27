import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Concern } from "../types";
import { format } from "date-fns";

interface ConcernsTableProps {
  concerns: Concern[];
  onSelectConcern?: (concern: Concern) => void;
}

export const ConcernsTable = ({ concerns, onSelectConcern }: ConcernsTableProps) => {
  if (concerns.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No concerns found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Number</TableHead>
          <TableHead>Issue Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {concerns.map((concern) => (
          <TableRow
            key={concern.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSelectConcern?.(concern)}
          >
            <TableCell className="font-medium">{concern.orderNumber}</TableCell>
            <TableCell>{concern.issueType}</TableCell>
            <TableCell>
              <StatusBadge status={concern.status} />
            </TableCell>
            <TableCell>{concern.createdByName}</TableCell>
            <TableCell>{concern.assignedToName || "Unassigned"}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {format(new Date(concern.createdAt), "MMM dd, yyyy HH:mm")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
