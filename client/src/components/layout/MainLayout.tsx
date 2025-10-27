import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, RefreshCcw, Calculator, Search, LogOut, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/authentication/useAuthStore";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: ReactNode;
}

const logisticsNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Orders", url: "/orders", icon: Package },
  { title: "Returns (RMA)", url: "/returns", icon: RefreshCcw },
  { title: "Cost Calculator", url: "/calculator", icon: Calculator },
];

const supportNavItems = [
  { title: "Search & Support", url: "/", icon: Search },
  { title: "Concerns Tracker", url: "/concerns", icon: AlertCircle },
  { title: "All Orders", url: "/orders", icon: Package },
  { title: "Cost Calculator", url: "/calculator", icon: Calculator },
];

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const { userRole, userName, logout } = useAuthStore();
  
  const navItems = userRole === 'support' ? supportNavItems : logisticsNavItems;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen w-full bg-secondary/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="border-b border-border px-6 py-4">
          <h1 className="text-xl font-bold text-primary">LMS</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {userRole === 'support' ? 'Support Portal' : 'Logistics System'}
          </p>
          {userName && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <p className="text-sm font-medium text-foreground">{userName}</p>
            </div>
          )}
        </div>
        <nav className="space-y-1 p-4 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
