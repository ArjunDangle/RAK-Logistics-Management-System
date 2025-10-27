import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { ConcernsTable } from "@/features/concerns/components/ConcernsTable";
import { ConcernForm } from "@/features/concerns/components/ConcernForm";
import { useGetConcernsByOrderId, useCreateConcern } from "@/features/concerns/useConcerns";
import { useAuthStore } from "@/features/authentication/useAuthStore";

const initialOrders = [
  { id: 1, soNumber: "SO-2024-001", orderDate: "2024-01-15", customer: "Acme Corp", source: "Website", status: "Pending", tracking: "-", salesperson: "John Doe" },
  { id: 2, soNumber: "SO-2024-002", orderDate: "2024-01-16", customer: "Tech Solutions", source: "Amazon", status: "In Transit", tracking: "1Z999AA10123456784", salesperson: "Jane Smith" },
  { id: 3, soNumber: "SO-2024-003", orderDate: "2024-01-14", customer: "Global Industries", source: "eBay", status: "Delivered", tracking: "1Z999AA10123456785", salesperson: "Bob Johnson" },
  { id: 4, soNumber: "SO-2024-004", orderDate: "2024-01-17", customer: "StartUp Inc", source: "Website", status: "In Transit", tracking: "1Z999AA10123456786", salesperson: "John Doe" },
  { id: 5, soNumber: "SO-2024-005", orderDate: "2024-01-13", customer: "Enterprise Co", source: "Phone", status: "Cancelled", tracking: "-", salesperson: "Jane Smith" },
];

const Orders = () => {
  const [orders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<typeof initialOrders[0] | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateConcernOpen, setIsCreateConcernOpen] = useState(false);
  
  const { userName } = useAuthStore();
  const { data: concerns } = useGetConcernsByOrderId(selectedOrder?.id.toString() || "");
  const createConcernMutation = useCreateConcern();

  const filteredOrders = orders.filter(
    (order) =>
      order.soNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tracking.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Order created successfully!");
    setIsCreateOpen(false);
  };

  const handleCreateConcern = (data: { issueType: any; logisticsNotes: string }) => {
    if (!selectedOrder) return;
    
    createConcernMutation.mutate(
      {
        orderId: selectedOrder.id.toString(),
        orderNumber: selectedOrder.soNumber,
        issueType: data.issueType,
        logisticsNotes: data.logisticsNotes,
        createdByName: userName || "Current User",
      },
      {
        onSuccess: () => {
          setIsCreateConcernOpen(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your orders</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer Name</Label>
                  <Input id="customer" placeholder="Enter customer name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input id="source" placeholder="e.g., Website, Amazon" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salesperson">Salesperson</Label>
                  <Input id="salesperson" placeholder="Enter salesperson name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderDate">Order Date</Label>
                  <Input id="orderDate" type="date" required />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Order</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by SO Number, Customer, or Tracking..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SO Number</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tracking Number</TableHead>
                <TableHead>Salesperson</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell className="font-medium">{order.soNumber}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.source}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{order.tracking}</TableCell>
                  <TableCell>{order.salesperson}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.soNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Order Details</TabsTrigger>
                <TabsTrigger value="concerns">
                  Support Concerns {concerns && concerns.length > 0 && `(${concerns.length})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3">Customer Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Customer:</span>
                      <p className="font-medium">{selectedOrder.customer}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Order Date:</span>
                      <p className="font-medium">{selectedOrder.orderDate}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3">Shipment Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="courier">Courier</Label>
                      <Input id="courier" defaultValue="FedEx" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tracking">Tracking Number</Label>
                      <Input id="tracking" defaultValue={selectedOrder.tracking} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipDate">Ship Date</Label>
                      <Input id="shipDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="packages">Package Count</Label>
                      <Input id="packages" type="number" defaultValue="1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Gross Weight (kg)</Label>
                      <Input id="weight" type="number" step="0.01" defaultValue="2.5" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="volume">Volume Weight (kg)</Label>
                      <Input id="volume" type="number" step="0.01" defaultValue="3.0" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    toast.success("Order updated successfully!");
                    setSelectedOrder(null);
                  }}>
                    Save Changes
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="concerns" className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Track support concerns for this order
                  </p>
                  <Dialog open={isCreateConcernOpen} onOpenChange={setIsCreateConcernOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create New Concern
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Support Concern</DialogTitle>
                      </DialogHeader>
                      <ConcernForm
                        orderNumber={selectedOrder.soNumber}
                        onSubmit={handleCreateConcern}
                        onCancel={() => setIsCreateConcernOpen(false)}
                        isLoading={createConcernMutation.isPending}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <ConcernsTable concerns={concerns || []} />

                <div className="flex justify-end pt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                    Close
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
