import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  LogOut,
  ExternalLink,
  Bell,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      setLoggingOut(false);
      console.error("Logout failed:", error);
    }
  };

  const openMainSite = () => {
    window.open("/", "_blank");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search admin panel..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* View Main Site */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={openMainSite}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Site
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
              title={loggingOut ? "Logging out..." : "Logout"}
            >
              <LogOut className={`h-4 w-4 ${loggingOut ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
