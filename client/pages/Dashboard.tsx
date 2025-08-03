import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  ShoppingCart, 
  FileText, 
  MessageSquare, 
  Download, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Building,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  Target
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  // Redirect admin users to the proper admin dashboard
  if (isAdmin && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  const [recentActivity, setRecentActivity] = useState([
    {
      id: "1",
      action: "Downloaded Product Catalog",
      description: "Heavy Machinery Catalog - 2024 Edition",
      timestamp: "2 hours ago",
      type: "download"
    },
    {
      id: "2", 
      action: "Requested Quote",
      description: "Heavy Duty Excavator X2000",
      timestamp: "1 day ago",
      type: "quote"
    },
    {
      id: "3",
      action: "Viewed Product",
      description: "Industrial Welding Station Pro",
      timestamp: "2 days ago", 
      type: "view"
    }
  ]);

  const [userStats, setUserStats] = useState({
    quotesRequested: 12,
    downloadsThisMonth: 8,
    favoriteProducts: 15,
    accountAge: "6 months"
  });

  const [recentQuotes, setRecentQuotes] = useState([
    {
      id: "Q001",
      products: ["Heavy Duty Excavator X2000", "Safety Helmet with HUD"],
      status: "pending",
      requestedAt: "2024-01-25",
      message: "Need pricing for bulk order of 5 units"
    },
    {
      id: "Q002",
      products: ["Industrial Welding Station Pro"],
      status: "responded",
      requestedAt: "2024-01-20",
      responseAt: "2024-01-22",
      message: "Quote for welding equipment upgrade"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'responded': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'responded': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="min-h-screen bg-industrial-light-gray py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-industrial-dark">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-industrial-gray mt-1">
                Manage your industrial equipment needs from your dashboard
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {isAdmin && (
                <Link to="/admin">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Link to="/products">
                <Button className="bg-industrial-blue hover:bg-blue-600">
                  <Package className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-industrial-orange text-industrial-orange hover:bg-industrial-orange hover:text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Get Support
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Access Notice */}
        {isAdmin && (
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Administrator Access</h3>
                    <p className="text-sm text-gray-600">
                      You have admin privileges. Access the full admin dashboard to manage products, users, emails, and site settings.
                    </p>
                  </div>
                </div>
                <Link to="/admin">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Open Admin Panel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-industrial-gray">Quotes Requested</p>
                  <p className="text-2xl font-bold text-industrial-dark">{userStats.quotesRequested}</p>
                </div>
                <div className="bg-industrial-blue/10 p-3 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-industrial-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-industrial-gray">Downloads This Month</p>
                  <p className="text-2xl font-bold text-industrial-dark">{userStats.downloadsThisMonth}</p>
                </div>
                <div className="bg-industrial-orange/10 p-3 rounded-full">
                  <Download className="h-6 w-6 text-industrial-orange" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-industrial-gray">Favorite Products</p>
                  <p className="text-2xl font-bold text-industrial-dark">{userStats.favoriteProducts}</p>
                </div>
                <div className="bg-yellow-500/10 p-3 rounded-full">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-industrial-gray">Account Age</p>
                  <p className="text-2xl font-bold text-industrial-dark">{userStats.accountAge}</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quotes">My Quotes</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-industrial-blue" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-industrial-blue/10 p-2 rounded-full">
                          {activity.type === 'download' && <Download className="h-4 w-4 text-industrial-blue" />}
                          {activity.type === 'quote' && <ShoppingCart className="h-4 w-4 text-industrial-blue" />}
                          {activity.type === 'view' && <Package className="h-4 w-4 text-industrial-blue" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-industrial-dark">{activity.action}</h4>
                          <p className="text-sm text-industrial-gray">{activity.description}</p>
                          <p className="text-xs text-industrial-gray mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-industrial-blue" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/products">
                      <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-industrial-blue text-industrial-blue hover:bg-industrial-blue hover:text-white">
                        <Package className="h-6 w-6 mb-2" />
                        <span className="text-sm">Browse Products</span>
                      </Button>
                    </Link>
                    
                    <Link to="/categories">
                      <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-industrial-orange text-industrial-orange hover:bg-industrial-orange hover:text-white">
                        <TrendingUp className="h-6 w-6 mb-2" />
                        <span className="text-sm">View Categories</span>
                      </Button>
                    </Link>
                    
                    <Link to="/contact">
                      <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                        <MessageSquare className="h-6 w-6 mb-2" />
                        <span className="text-sm">Contact Support</span>
                      </Button>
                    </Link>
                    
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                      <Download className="h-6 w-6 mb-2" />
                      <span className="text-sm">Download Catalog</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-industrial-blue" />
                    My Quote Requests
                  </div>
                  <Link to="/products">
                    <Button size="sm" className="bg-industrial-blue hover:bg-blue-600">
                      Request New Quote
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQuotes.map((quote) => (
                    <div key={quote.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-industrial-dark">Quote #{quote.id}</h4>
                            <Badge className={`${getStatusColor(quote.status)} text-white`}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(quote.status)}
                                <span className="capitalize">{quote.status}</span>
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm text-industrial-gray mb-2">{quote.message}</p>
                          <div className="text-xs text-industrial-gray">
                            Requested: {quote.requestedAt}
                            {quote.responseAt && ` • Responded: ${quote.responseAt}`}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-industrial-dark">Products:</p>
                        {quote.products.map((product, index) => (
                          <Badge key={index} variant="secondary" className="mr-2">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="downloads">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2 text-industrial-blue" />
                  Download History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Download className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-industrial-dark mb-2">No Downloads Yet</h3>
                  <p className="text-industrial-gray mb-6">
                    Start browsing our products to download catalogs and datasheets
                  </p>
                  <Link to="/products">
                    <Button className="bg-industrial-blue hover:bg-blue-600">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-industrial-blue" />
                  Favorite Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-industrial-dark mb-2">No Favorites Yet</h3>
                  <p className="text-industrial-gray mb-6">
                    Save products you're interested in to access them quickly later
                  </p>
                  <Link to="/products">
                    <Button className="bg-industrial-blue hover:bg-blue-600">
                      Explore Products
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-industrial-blue" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-industrial-blue/10 p-3 rounded-full">
                        <User className="h-6 w-6 text-industrial-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-industrial-dark">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-industrial-gray">Customer</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="bg-industrial-orange/10 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-industrial-orange" />
                      </div>
                      <div>
                        <p className="font-medium text-industrial-dark">{user?.email}</p>
                        <p className="text-sm text-industrial-gray">Email Address</p>
                      </div>
                    </div>

                    {user?.company && (
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-500/10 p-3 rounded-full">
                          <Building className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium text-industrial-dark">{user.company}</p>
                          <p className="text-sm text-industrial-gray">Company</p>
                        </div>
                      </div>
                    )}

                    {user?.phone && (
                      <div className="flex items-center space-x-4">
                        <div className="bg-purple-500/10 p-3 rounded-full">
                          <Phone className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium text-industrial-dark">{user.phone}</p>
                          <p className="text-sm text-industrial-gray">Phone Number</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Button className="w-full bg-industrial-blue hover:bg-blue-600">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Download Account Data
                    </Button>
                    
                    <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
