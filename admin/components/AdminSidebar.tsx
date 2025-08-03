import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Home,
  FileText,
  Image,
  Users,
  Mail,
  Palette,
  Settings,
  Factory,
  Globe
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: FolderOpen },
  { name: "Homepage", href: "/homepage", icon: Home },
  { name: "Frontend", href: "/frontend", icon: Globe },
  { name: "Content", href: "/content", icon: FileText },
  { name: "Media Library", href: "/media", icon: Image },
  { name: "Users", href: "/users", icon: Users },
  { name: "Email", href: "/email", icon: Mail },
  { name: "Theme", href: "/theme", icon: Palette },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Factory className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">IndustrialCo</span>
            <span className="text-xs text-gray-500">Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Admin Panel v1.0
        </div>
      </div>
    </div>
  );
}
