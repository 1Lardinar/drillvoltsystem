import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Settings, Package, Users, BarChart, ArrowRight, Mail, Send, Cog } from "lucide-react";
import { Link } from "react-router-dom";

export default function Admin() {
  return (
    <div className="min-h-screen bg-industrial-light-gray py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-industrial-blue text-white rounded-full px-4 py-2 mb-4">
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Admin Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold text-industrial-dark mb-6">
              Administration Panel
            </h1>
            <p className="text-lg text-industrial-gray mb-8">
              This will be a comprehensive admin dashboard for managing the industrial product showcase website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-industrial-dark">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-industrial-blue" />
                    Product Management
                  </div>
                  <Link to="/admin/products">
                    <Button size="sm" className="bg-industrial-blue hover:bg-blue-600">
                      Manage
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-industrial-gray mb-4">
                  Add, edit, and delete products with full specifications, images, and datasheets.
                </p>
                <ul className="text-xs text-industrial-gray space-y-1">
                  <li>• Product CRUD operations ✅</li>
                  <li>• Image gallery management ✅</li>
                  <li>• Specification tables ✅</li>
                  <li>• PDF datasheet uploads</li>
                  <li>• Category assignment ✅</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-industrial-dark">
                  <Settings className="h-5 w-5 mr-2 text-industrial-blue" />
                  Category Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-industrial-gray mb-4">
                  Organize products into categories with custom attributes and filters.
                </p>
                <ul className="text-xs text-industrial-gray space-y-1">
                  <li>• Create/edit categories</li>
                  <li>• Custom attributes</li>
                  <li>• Filter configurations</li>
                  <li>• Category hierarchy</li>
                  <li>• SEO optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-industrial-dark">
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-industrial-blue" />
                    Homepage Content
                  </div>
                  <Link to="/admin/homepage">
                    <Button size="sm" className="bg-industrial-blue hover:bg-blue-600">
                      Manage
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-industrial-gray mb-4">
                  Manage homepage banners, featured products, and company information.
                </p>
                <ul className="text-xs text-industrial-gray space-y-1">
                  <li>• Hero banner editing ✅</li>
                  <li>• Featured products ✅</li>
                  <li>• Company info sections ✅</li>
                  <li>• Statistics display ✅</li>
                  <li>• CTA section ✅</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-industrial-dark">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-industrial-blue" />
                    User Management
                  </div>
                  <Link to="/admin/users">
                    <Button size="sm" className="bg-industrial-blue hover:bg-blue-600">
                      Manage
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-industrial-gray mb-4">
                  Manage admin users, roles, and authentication settings.
                </p>
                <ul className="text-xs text-industrial-gray space-y-1">
                  <li>• User roles (admin, staff) ✅</li>
                  <li>• Permission management ✅</li>
                  <li>• Login security ✅</li>
                  <li>• Activity logs</li>
                  <li>• Password policies</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-industrial-dark">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-industrial-blue" />
                    Email Management
                  </div>
                  <Link to="/admin/email">
                    <Button size="sm" className="bg-industrial-blue hover:bg-blue-600">
                      Manage
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-industrial-gray mb-4">
                  Send newsletters, manage email campaigns, and create templates.
                </p>
                <ul className="text-xs text-industrial-gray space-y-1">
                  <li>• Email campaigns ✅</li>
                  <li>• Template management ✅</li>
                  <li>• User mailing lists ✅</li>
                  <li>• Custom recipients ✅</li>
                  <li>• Delivery tracking ✅</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-industrial-dark">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-industrial-blue" />
                    Media Library
                  </div>
                  <Link to="/admin/media">
                    <Button size="sm" className="bg-industrial-blue hover:bg-blue-600">
                      Manage
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-industrial-gray mb-4">
                  Upload and manage images, PDFs, and other media files.
                </p>
                <ul className="text-xs text-industrial-gray space-y-1">
                  <li>• File upload system ✅</li>
                  <li>• Image optimization ✅</li>
                  <li>• File management ✅</li>
                  <li>• URL generation ✅</li>
                  <li>• Search & organize ✅</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-industrial-dark">
                  <div className="flex items-center">
                    <Cog className="h-5 w-5 mr-2 text-industrial-blue" />
                    Site Settings
                  </div>
                  <Link to="/admin/settings">
                    <Button size="sm" className="bg-industrial-blue hover:bg-blue-600">
                      Manage
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-industrial-gray mb-4">
                  Configure site branding, theme colors, contact info, and global settings.
                </p>
                <ul className="text-xs text-industrial-gray space-y-1">
                  <li>• Site logo & branding ✅</li>
                  <li>• Theme colors ✅</li>
                  <li>• Contact information ✅</li>
                  <li>• Header & footer ✅</li>
                  <li>• Social media links ✅</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-industrial-dark">
                  <BarChart className="h-5 w-5 mr-2 text-industrial-blue" />
                  Analytics & Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-industrial-gray mb-4">
                  Track inquiries, popular products, and website performance.
                </p>
                <ul className="text-xs text-industrial-gray space-y-1">
                  <li>• Inquiry management</li>
                  <li>• Product analytics</li>
                  <li>• Download tracking</li>
                  <li>• Performance metrics</li>
                  <li>• Export reports</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-industrial-gray mb-8">
              Please continue prompting to build out the full admin dashboard with authentication, 
              database integration, and all the management features listed above.
            </p>
            <Link to="/">
              <Button variant="outline" className="border-industrial-blue text-industrial-blue hover:bg-industrial-blue hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
