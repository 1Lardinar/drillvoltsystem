import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminHomepage from "./pages/AdminHomepage";
import AdminMedia from "./pages/AdminMedia";
import AdminUsers from "./pages/AdminUsers";
import AdminContent from "./pages/AdminContent";
import AdminSettings from "./pages/AdminSettings";
import AdminTheme from "./pages/AdminTheme";
import AdminEmail from "./pages/AdminEmail";
import AdminFrontend from "./pages/AdminFrontend";
import ProtectedRoute from "./components/ProtectedRoute";

export default function AdminApp() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <BrowserRouter basename="/admin">
          <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex">
                  <AdminSidebar />
                  <div className="flex-1 flex flex-col">
                    <AdminHeader />
                    <main className="flex-1 p-6">
                      <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/products" element={<AdminProducts />} />
                        <Route path="/categories" element={<AdminCategories />} />
                        <Route path="/homepage" element={<AdminHomepage />} />
                        <Route path="/content" element={<AdminContent />} />
                        <Route path="/media" element={<AdminMedia />} />
                        <Route path="/users" element={<AdminUsers />} />
                        <Route path="/email" element={<AdminEmail />} />
                        <Route path="/theme" element={<AdminTheme />} />
                        <Route path="/frontend" element={<AdminFrontend />} />
                        <Route path="/settings" element={<AdminSettings />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  );
}
