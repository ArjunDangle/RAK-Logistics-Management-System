import { useEffect } from 'react'; // Import useEffect
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Removed Navigate
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/router/ProtectedRoute";
import { useAuthStore } from "./features/authentication/useAuthStore";
import { getCurrentUser } from './features/authentication/api'; // Import getCurrentUser
import LogisticsDashboardPage from "./features/dashboard_logistics/LogisticsDashboardPage";
import CstPortalPage from "./features/portal_cst/CstPortalPage";
import ConcernListPage from "./features/concerns/ConcernListPage";
import Orders from "./pages/Orders";
import Returns from "./pages/Returns";
import Calculator from "./pages/Calculator";
import LoginPage from "./features/authentication/LoginPage";
import NotFound from "./pages/NotFound";

const RoleBasedLanding = () => {
  const userRole = useAuthStore((state) => state.userRole()); // Use selector
  if (userRole === 'support') {
    return <CstPortalPage />;
  }
  return <LogisticsDashboardPage />;
};

const queryClient = new QueryClient();

const App = () => {
  // --- Add this useEffect hook ---
  useEffect(() => {
    const validateSession = async () => {
      const token = useAuthStore.getState().token;
      const logout = useAuthStore.getState().logout;
      const login = useAuthStore.getState().login; // Get login action

      if (token) {
        console.log("Token found, validating session...");
        try {
          const userData = await getCurrentUser();
          console.log("Session validated successfully:", userData);
          // Re-login with fresh data to update user info if necessary
           login(token, {
             role: userData.role,
             name: userData.full_name
             // Add other fields if needed
           });
        } catch (error) {
          console.error("Session validation failed:", error);
          logout(); // Token is invalid or expired, log out
        }
      } else {
        console.log("No token found, user needs to log in.");
      }
    };

    validateSession();
  }, []); // Empty dependency array ensures this runs only once on mount
  // --- End of useEffect hook ---

  return (
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
};

export default App;