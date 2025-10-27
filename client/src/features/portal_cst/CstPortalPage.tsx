import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { useGetConcerns } from "@/features/concerns/useConcerns";

const alerts = [
  { id: 1, message: "Order #SO-2024-1042 has been pending shipment for 52 hours", type: "warning" },
  { id: 2, message: "Order #SO-2024-1038 stuck in transit with no updates for 76 hours", type: "error" },
  { id: 3, message: "RMA #RMA-2024-0032 inspection overdue by 51 hours", type: "info" },
];

const CstPortalPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: concerns } = useGetConcerns();
  
  const activeConcernsCount = concerns?.filter(c => c.status !== "SOLVED").length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Customer Support Portal</h1>
        <p className="text-muted-foreground">Search orders and provide customer assistance</p>
      </div>

      {/* Global Search Bar */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by SO Number, Customer Name, or Tracking Number..."
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="lg" className="px-8">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Action */}
      <div className="flex justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" variant="outline" className="gap-2">
              <Plus className="h-5 w-5" />
              Create New Offline Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Offline Order</DialogTitle>
              <DialogDescription>
                Manually create an order for customers who placed orders through phone or email
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input id="customer-name" placeholder="Enter customer name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-email">Email</Label>
                <Input id="customer-email" type="email" placeholder="customer@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Input id="product" placeholder="Product name or SKU" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input id="source" placeholder="Phone/Email" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Create Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Live Alerts Widget */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <CardTitle>Live Alerts</CardTitle>
          </div>
          <CardDescription>Current issues requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Concerns Alert - Priority */}
            <Link to="/concerns">
              <div className="p-4 rounded-lg border-2 border-primary/50 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">Concerns Tracker</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong className="text-primary">{activeConcernsCount}</strong> concern{activeConcernsCount !== 1 ? 's' : ''} awaiting your action
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">View →</span>
                </div>
              </div>
            </Link>

            {/* Other System Alerts */}
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.type === "error"
                    ? "border-destructive/50 bg-destructive/5"
                    : alert.type === "warning"
                    ? "border-warning/50 bg-warning/5"
                    : "border-accent/50 bg-accent/5"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {alert.type === "error" ? "🔴" : alert.type === "warning" ? "⚠️" : "ℹ️"} {alert.message.split(" ")[0]}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CstPortalPage;
