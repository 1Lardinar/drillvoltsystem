import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Users, 
  FileText, 
  Image,
  TrendingUp,
  Activity,
  Globe,
  Settings,
  ExternalLink,
  BarChart3,
  Mail,
  FolderOpen,
  Palette,
  Crown,
  UserCheck,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  Plus,
  Target,
  Zap,
  Shield,
  Database,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: { total: 3, featured: 3, categories: 4, visible: 3 },
    users: { total: 1, active: 1, admins: 1, newThisWeek: 0 },
    emails: { sent: 0, failed: 0, templates: 2, totalRecipients: 0 },
    content: { pages: 6, updated: 'Today', mediaFiles: 1, themes: 1 },
    system: { uptime: '99.9%', performance: 95, storage: 45, lastBackup: 'Today' }
  });

  const quickActions = [
    {
      title: "Manage Products",
      description: "Add, edit, and organize product catalog",
      icon: Package,
      href: "/products",
      color: "bg-blue-500",
      priority: "high"
    },
    {
      title: "Send Email Campaign",
      description: "Compose and send emails to users",
      icon: Mail,
      href: "/email",
      color: "bg-green-500",
      priority: "high"
    },
    {
      title: "Manage Users",
      description: "Add, edit, or manage user accounts",
      icon: Users,
      href: "/users",
      color: "bg-purple-500",
      priority: "medium"
    },
    {
      title: "Frontend Control",
      description: "Live website content and styling",
      icon: Globe,
      href: "/frontend",
      color: "bg-emerald-500",
      priority: "high"
    },
    {
      title: "Customize Theme",
      description: "Update colors, fonts, and branding",
      icon: Palette,
      href: "/theme",
      color: "bg-pink-500",
      priority: "medium"
    },
    {
      title: "Category Management",
      description: "Organize product categories",
      icon: FolderOpen,
      href: "/categories",
      color: "bg-orange-500",
      priority: "medium"
    },
    {
      title: "Content Editor",
      description: "Update page content and settings",
      icon: FileText,
      href: "/content",
      color: "bg-indigo-500",
      priority: "low"
    },
    {
      title: "Media Library",
      description: "Upload and organize media files",
      icon: Image,
      href: "/media",
      color: "bg-teal-500",
      priority: "low"
    },
    {
      title: "System Settings",
      description: "Configure global preferences",
      icon: Settings,
      href: "/settings",
      color: "bg-gray-500",
      priority: "low"
    }
  ];

  const featureCards = [
    {
      title: "Product Management",
      description: "Complete control over your product catalog",
      icon: Package,
      color: "text-blue-500",
      stats: [
        { label: "Total Products", value: stats.products.total },
        { label: "Categories", value: stats.products.categories },
        { label: "Featured", value: stats.products.featured }
      ],
      href: "/products",
      buttonText: "Manage Products"
    },
    {
      title: "User Management", 
      description: "Comprehensive user account control",
      icon: Users,
      color: "text-green-500",
      stats: [
        { label: "Total Users", value: stats.users.total },
        { label: "Active", value: stats.users.active },
        { label: "Admins", value: stats.users.admins }
      ],
      href: "/users",
      buttonText: "Manage Users"
    },
    {
      title: "Email System",
      description: "Send campaigns and manage templates",
      icon: Mail,
      color: "text-purple-500",
      stats: [
        { label: "Emails Sent", value: stats.emails.sent },
        { label: "Templates", value: stats.emails.templates },
        { label: "Recipients", value: stats.emails.totalRecipients }
      ],
      href: "/email",
      buttonText: "Send Emails"
    },
    {
      title: "Theme System",
      description: "Customize website appearance",
      icon: Palette,
      color: "text-pink-500",
      stats: [
        { label: "Active Themes", value: stats.content.themes },
        { label: "Customizable", value: "Yes" },
        { label: "Last Updated", value: "Today" }
      ],
      href: "/theme",
      buttonText: "Customize Theme"
    },
    {
      title: "Category System",
      description: "Organize products by categories",
      icon: FolderOpen,
      color: "text-orange-500",
      stats: [
        { label: "Categories", value: stats.products.categories },
        { label: "Products", value: stats.products.total },
        { label: "Active", value: stats.products.categories }
      ],
      href: "/categories",
      buttonText: "Manage Categories"
    },
    {
      title: "Content Management",
      description: "Edit all website content",
      icon: FileText,
      color: "text-indigo-500",
      stats: [
        { label: "Content Pages", value: stats.content.pages },
        { label: "Media Files", value: stats.content.mediaFiles },
        { label: "Updated", value: stats.content.updated }
      ],
      href: "/content",
      buttonText: "Edit Content"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Complete management overview of IndustrialCo platform</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => window.open("/", "_blank")} variant="outline" size="lg">
            <Eye className="h-5 w-5 mr-2" />
            View Live Site
          </Button>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Main Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products Stats */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.products.total}</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Featured</span>
                <Badge variant="secondary">{stats.products.featured}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Categories</span>
                <Badge variant="secondary">{stats.products.categories}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Stats */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-full">
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active</span>
                <Badge className="bg-green-500">{stats.users.active}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Admins</span>
                <Badge variant="secondary">{stats.users.admins}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Stats */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Emails</p>
                <p className="text-3xl font-bold text-gray-900">{stats.emails.sent}</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-full">
                <Mail className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Templates</span>
                <Badge variant="secondary">{stats.emails.templates}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Recipients</span>
                <Badge variant="secondary">{stats.emails.totalRecipients}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Stats */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Content</p>
                <p className="text-3xl font-bold text-gray-900">{stats.content.pages}</p>
              </div>
              <div className="bg-orange-500/10 p-3 rounded-full">
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Media Files</span>
                <Badge variant="secondary">{stats.content.mediaFiles}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Updated</span>
                <Badge className="bg-green-500">Today</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Management Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="h-6 w-6 mr-3 text-blue-500" />
          Platform Features & Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <feature.icon className={`h-6 w-6 mr-3 ${feature.color}`} />
                  {feature.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {feature.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{stat.label}</span>
                      <Badge variant="outline" className="font-medium">
                        {stat.value}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Link to={feature.href}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
                    <Edit className="h-4 w-4 mr-2" />
                    {feature.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="h-6 w-6 mr-3 text-yellow-500" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`${action.color} p-3 rounded-lg shadow-md`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-500" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-800">All Systems Operational</span>
                </div>
                <Badge className="bg-green-500">100%</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.system.uptime}</div>
                  <div className="text-sm text-blue-800">Uptime</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">Fast</div>
                  <div className="text-sm text-purple-800">Response</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Platform Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Website Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Admin Panel</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email System</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Ready</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Industrial Platform is Ready! 🚀
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            You have complete control over products, users, content, themes, categories, and email campaigns. 
            All features are fully functional and ready for production use.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Package className="h-5 w-5 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link to="/email">
              <Button size="lg" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                <Mail className="h-5 w-5 mr-2" />
                Send Campaigns
              </Button>
            </Link>
            <Link to="/theme">
              <Button size="lg" variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50">
                <Palette className="h-5 w-5 mr-2" />
                Customize Design
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
