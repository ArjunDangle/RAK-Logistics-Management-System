import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const initialReturns = [
  { id: 1, rmaNumber: "RMA-001", soNumber: "SO-2024-002", customer: "Tech Solutions", status: "Pending Approval", reason: "Defective item" },
  { id: 2, rmaNumber: "RMA-002", soNumber: "SO-2024-005", customer: "Enterprise Co", status: "Item Received", reason: "Wrong item shipped" },
  { id: 3, rmaNumber: "RMA-003", soNumber: "SO-2024-001", customer: "Acme Corp", status: "Closed", reason: "Customer changed mind" },
];

const Returns = () => {
  const [returns] = useState(initialReturns);
  const [selectedReturn, setSelectedReturn] = useState<typeof initialReturns[0] | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateReturn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Return initiated successfully!");
    setIsCreateOpen(false);
  };

  const handleInspection = () => {
    toast.success("Inspection saved successfully!");
    setSelectedReturn(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Returns (RMA)</h1>
          <p className="text-muted-foreground mt-1">Track and manage return merchandise authorizations</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Initiate Return
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Initiate New Return</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateReturn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="soNumber">Original SO Number</Label>
                <Input id="soNumber" placeholder="e.g., SO-2024-001" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Return</Label>
                <Input id="reason" placeholder="Enter reason" required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create RMA</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Returns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RMA Number</TableHead>
                <TableHead>Original SO Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason for Return</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returns.map((rma) => (
                <TableRow
                  key={rma.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedReturn(rma)}
                >
                  <TableCell className="font-medium">{rma.rmaNumber}</TableCell>
                  <TableCell>{rma.soNumber}</TableCell>
                  <TableCell>{rma.customer}</TableCell>
                  <TableCell>
                    <StatusBadge status={rma.status} />
                  </TableCell>
                  <TableCell>{rma.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* RMA Detail Dialog */}
      <Dialog open={!!selectedReturn} onOpenChange={() => setSelectedReturn(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>RMA Details - {selectedReturn?.rmaNumber}</DialogTitle>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Return Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Customer:</span>
                    <p className="font-medium">{selectedReturn.customer}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Original SO:</span>
                    <p className="font-medium">{selectedReturn.soNumber}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reason:</span>
                    <p className="font-medium">{selectedReturn.reason}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium">{selectedReturn.status}</p>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Return Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Pending Approval</p>
                      <p className="text-sm text-muted-foreground">Request submitted</p>
                    </div>
                  </div>
                  <div className="ml-4 h-8 w-0.5 bg-border" />
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      selectedReturn.status === "Item Received" || selectedReturn.status === "Closed"
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Item Received</p>
                      <p className="text-sm text-muted-foreground">Item returned to warehouse</p>
                    </div>
                  </div>
                  <div className="ml-4 h-8 w-0.5 bg-border" />
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      selectedReturn.status === "Closed"
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Closed</p>
                      <p className="text-sm text-muted-foreground">Return processed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warehouse Inspection */}
              {selectedReturn.status === "Item Received" && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Warehouse Inspection</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="condition">Item Condition</Label>
                      <Select>
                        <SelectTrigger id="condition">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">Good/Resalable</SelectItem>
                          <SelectItem value="damaged">Damaged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="action">Final Action</Label>
                      <Select>
                        <SelectTrigger id="action">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="restock">Restock</SelectItem>
                          <SelectItem value="discard">Discard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleInspection} className="mt-4">
                    Save Inspection
                  </Button>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedReturn(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Returns;
