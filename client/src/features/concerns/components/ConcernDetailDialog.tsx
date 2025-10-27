import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { Concern, ConcernStatus } from "../types";
import { format } from "date-fns";
import { useAuthStore } from "@/features/authentication/useAuthStore";

interface ConcernDetailDialogProps {
  concern: Concern | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updates: { 
    assignedToId?: string; 
    assignedToName?: string;
    cstNotes?: string; 
    externalTicketId?: string; 
    status?: ConcernStatus 
  }) => void;
  isUpdating?: boolean;
}

export const ConcernDetailDialog = ({ 
  concern, 
  open, 
  onOpenChange, 
  onUpdate, 
  isUpdating 
}: ConcernDetailDialogProps) => {
  const { userName } = useAuthStore();
  const [cstNotes, setCstNotes] = useState("");
  const [externalTicketId, setExternalTicketId] = useState("");
  const [status, setStatus] = useState<ConcernStatus>("OPEN");

  useEffect(() => {
    if (concern) {
      setCstNotes(concern.cstNotes || "");
      setExternalTicketId(concern.externalTicketId || "");
      setStatus(concern.status);
    }
  }, [concern]);

  if (!concern) return null;

  const handleAssignToMe = () => {
    onUpdate({
      assignedToId: "current-user",
      assignedToName: userName || "Current User",
      status: "IN_PROGRESS",
    });
  };

  const handleSave = () => {
    onUpdate({
      cstNotes,
      externalTicketId: externalTicketId || null,
      status,
    });
  };

  const isAssigned = concern.assignedToId !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Concern Details - {concern.orderNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Concern Information */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Concern Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Order Number:</span>
                <p className="font-medium">{concern.orderNumber}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Issue Type:</span>
                <p className="font-medium">{concern.issueType}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <div className="mt-1">
                  <StatusBadge status={concern.status} />
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p className="font-medium">
                  {format(new Date(concern.createdAt), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Created By:</span>
                <p className="font-medium">{concern.createdByName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Assigned To:</span>
                <p className="font-medium">{concern.assignedToName || "Unassigned"}</p>
              </div>
            </div>
          </div>

          {/* Logistics Notes */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Logistics Notes</h3>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">{concern.logisticsNotes}</p>
            </div>
          </div>

          {/* Assignment Action */}
          {!isAssigned && (
            <div>
              <Button onClick={handleAssignToMe} disabled={isUpdating}>
                Assign to Me
              </Button>
            </div>
          )}

          {/* CST Response Section */}
          {isAssigned && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">CST Response</h3>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as ConcernStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="SOLVED">Solved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="externalTicketId">External Ticket ID (Optional)</Label>
                <Input
                  id="externalTicketId"
                  placeholder="e.g., ZD-12345"
                  value={externalTicketId}
                  onChange={(e) => setExternalTicketId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cstNotes">CST Notes</Label>
                <Textarea
                  id="cstNotes"
                  placeholder="Add your resolution notes here..."
                  value={cstNotes}
                  onChange={(e) => setCstNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
              Close
            </Button>
            {isAssigned && (
              <Button onClick={handleSave} disabled={isUpdating}>
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
