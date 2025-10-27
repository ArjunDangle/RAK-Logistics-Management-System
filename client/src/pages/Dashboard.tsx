import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, CheckCircle, RefreshCcw, AlertTriangle, Clock, DollarSign } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const orderData = [
  { day: "Mon", orders: 12 },
  { day: "Tue", orders: 19 },
  { day: "Wed", orders: 15 },
  { day: "Thu", orders: 22 },
  { day: "Fri", orders: 18 },
  { day: "Sat", orders: 8 },
  { day: "Sun", orders: 5 },
];

const courierData = [
  { name: "FedEx", value: 35 },
  { name: "UPS", value: 28 },
  { name: "DHL", value: 22 },
  { name: "USPS", value: 15 },
];

const COLORS = ["hsl(220, 70%, 45%)", "hsl(145, 65%, 45%)", "hsl(40, 95%, 55%)", "hsl(220, 15%, 50%)"];

const alerts = [
  { id: 1, type: "Shipping Overdue", description: "Order #12345 pending for 3 days", severity: "warning" },
  { id: 2, type: "Stuck in Transit", description: "Order #12389 no update for 4 days", severity: "error" },
  { id: 3, type: "RMA Inspection Overdue", description: "Return #RMA-456 awaiting inspection", severity: "info" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor your logistics operations at a glance</p>
      </div>

      {/* Live Order Funnel */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders Pending</CardTitle>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting Shipment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders In Transit</CardTitle>
            <Truck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">48</div>
            <p className="text-xs text-muted-foreground mt-1">With Courier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered (Last 7 Days)</CardTitle>
            <CheckCircle className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active RMAs</CardTitle>
            <RefreshCcw className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">Open Returns</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Exceptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Alerts & Exceptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer ${
                  alert.severity === "warning"
                    ? "border-warning/30 bg-warning/5"
                    : alert.severity === "error"
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-primary/30 bg-primary/5"
                }`}
              >
                <Clock className="h-5 w-5 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{alert.type}</p>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance KPIs & Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders Shipped (This Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Volume by Courier (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={courierData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {courierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Total Shipping Cost (Month-to-Date)</CardTitle>
          <DollarSign className="h-5 w-5 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$12,450.00</div>
          <p className="text-xs text-muted-foreground mt-1">+8.2% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
