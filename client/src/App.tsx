import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/router/ProtectedRoute";
import { useAuthStore } from "./features/authentication/useAuthStore";
import LogisticsDashboardPage from "./features/dashboard_logistics/LogisticsDashboardPage";
import CstPortalPage from "./features/portal_cst/CstPortalPage";
import ConcernListPage from "./features/concerns/ConcernListPage";
import Orders from "./pages/Orders";
import Returns from "./pages/Returns";
import Calculator from "./pages/Calculator";
import LoginPage from "./features/authentication/LoginPage";
import NotFound from "./pages/NotFound";

const RoleBasedLanding = () => {
  const userRole = useAuthStore((state) => state.userRole);
  
  if (userRole === 'support') {
    return <CstPortalPage />;
  }
  
  return <LogisticsDashboardPage />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<RoleBasedLanding />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/concerns" element={<ConcernListPage />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
