import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, RefreshCcw, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Orders", url: "/orders", icon: Package },
  { title: "Returns (RMA)", url: "/returns", icon: RefreshCcw },
  { title: "Cost Calculator", url: "/calculator", icon: Calculator },
];

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-secondary/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="flex h-16 items-center border-b border-border px-6">
          <h1 className="text-xl font-bold text-primary">LMS</h1>
        </div>
        <nav className="space-y-1 p-4">
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
