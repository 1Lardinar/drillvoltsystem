import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminHomepage from "./pages/AdminHomepage";
import AdminMedia from "./pages/AdminMedia";
import AdminUsers from "./pages/AdminUsers";
import AdminEmail from "./pages/AdminEmail";
import AdminSiteSettings from "./pages/AdminSiteSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ErrorBoundary>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <ErrorBoundary>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/category/:category" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/admin/products" element={<AdminProducts />} />
                        <Route path="/admin/homepage" element={<AdminHomepage />} />
                        <Route path="/admin/media" element={<AdminMedia />} />
                        <Route path="/admin/users" element={<AdminUsers />} />
                        <Route path="/admin/email" element={<AdminEmail />} />
                        <Route path="/admin/settings" element={<AdminSiteSettings />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </ErrorBoundary>
                  </main>
                  <Footer />
                </div>
              </ErrorBoundary>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
