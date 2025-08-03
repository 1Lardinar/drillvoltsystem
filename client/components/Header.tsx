import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Menu, 
  ShoppingCart, 
  User, 
  Factory,
  ChevronDown,
  LogOut,
  Settings,
  BarChart3
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-industrial-light-gray">
      {/* Top bar with contact info */}
      <div className="bg-industrial-gray text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span>�� +1 (555) 123-4567</span>
              <span>✉️ info@industrialco.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/contact" className="hover:text-industrial-orange transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-industrial-blue p-2 rounded-lg">
              <Factory className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-industrial-dark">IndustrialCo</span>
              <span className="text-xs text-industrial-gray -mt-1">Industrial Solutions</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-industrial-gray hover:text-industrial-blue font-medium transition-colors">
              Home
            </Link>
            <div className="relative group">
              <button className="flex items-center text-industrial-gray hover:text-industrial-blue font-medium transition-colors">
                Products
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  <Link to="/products" className="block py-2 text-industrial-gray hover:text-industrial-blue transition-colors">
                    All Products
                  </Link>
                  <Link to="/products/category/machinery" className="block py-2 text-industrial-gray hover:text-industrial-blue transition-colors">
                    Heavy Machinery
                  </Link>
                  <Link to="/products/category/tools" className="block py-2 text-industrial-gray hover:text-industrial-blue transition-colors">
                    Industrial Tools
                  </Link>
                  <Link to="/products/category/safety" className="block py-2 text-industrial-gray hover:text-industrial-blue transition-colors">
                    Safety Equipment
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/categories" className="text-industrial-gray hover:text-industrial-blue font-medium transition-colors">
              Categories
            </Link>
            <Link to="/about" className="text-industrial-gray hover:text-industrial-blue font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-industrial-gray hover:text-industrial-blue font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-industrial-blue focus:border-transparent w-64"
              />
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Button size="sm" className="bg-industrial-orange hover:bg-orange-600 text-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Quote
                </Button>
                
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="bg-industrial-blue text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-sm font-medium text-industrial-dark">{user?.firstName} {user?.lastName}</div>
                      <div className="text-xs text-industrial-gray capitalize">{user?.role}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <div className="text-sm font-medium text-industrial-dark">{user?.firstName} {user?.lastName}</div>
                        <div className="text-xs text-industrial-gray">{user?.email}</div>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-3 py-2 text-sm text-industrial-gray hover:text-industrial-blue hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <BarChart3 className="h-4 w-4 mr-3" />
                          My Dashboard
                        </Link>
                        <Link 
                          to="/dashboard" 
                          className="flex items-center px-3 py-2 text-sm text-industrial-gray hover:text-industrial-blue hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          Profile Settings
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="border-industrial-blue text-industrial-blue hover:bg-industrial-blue hover:text-white">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-industrial-orange hover:bg-orange-600 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6 text-industrial-gray" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-industrial-blue"
                />
              </div>
              <Link to="/" className="text-industrial-gray hover:text-industrial-blue font-medium">
                Home
              </Link>
              <Link to="/products" className="text-industrial-gray hover:text-industrial-blue font-medium">
                Products
              </Link>
              <Link to="/categories" className="text-industrial-gray hover:text-industrial-blue font-medium">
                Categories
              </Link>
              <Link to="/about" className="text-industrial-gray hover:text-industrial-blue font-medium">
                About
              </Link>
              <Link to="/contact" className="text-industrial-gray hover:text-industrial-blue font-medium">
                Contact
              </Link>
              
              {isAuthenticated ? (
                <div className="space-y-2 pt-4">
                  <Link to="/dashboard" className="text-industrial-gray hover:text-industrial-blue font-medium block">
                    My Dashboard
                  </Link>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    size="sm" 
                    className="w-full border-red-200 text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2 pt-4">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-industrial-blue text-industrial-blue">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button size="sm" className="w-full bg-industrial-orange hover:bg-orange-600 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
