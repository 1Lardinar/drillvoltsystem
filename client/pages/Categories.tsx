import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Factory, 
  Wrench, 
  HardHat, 
  Zap, 
  Cog, 
  Truck,
  ArrowRight,
  Search,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    {
      name: "Heavy Machinery",
      icon: Factory,
      productCount: 156,
      description: "Excavators, cranes, bulldozers, and earthmoving equipment for construction and mining operations",
      subcategories: ["Excavators", "Cranes", "Bulldozers", "Loaders", "Graders"],
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      name: "Industrial Tools",
      icon: Wrench,
      productCount: 423,
      description: "Professional grade hand tools, power tools, and precision instruments for manufacturing",
      subcategories: ["Hand Tools", "Power Tools", "Measuring Tools", "Cutting Tools", "Fasteners"],
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      name: "Safety Equipment",
      icon: HardHat,
      productCount: 287,
      description: "Personal protective equipment and safety systems to keep your workforce protected",
      subcategories: ["PPE", "Fall Protection", "Respiratory", "Eye Protection", "Hearing Protection"],
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      name: "Spare Parts",
      icon: Zap,
      productCount: 1024,
      description: "OEM and compatible replacement parts for all major industrial equipment brands",
      subcategories: ["Engine Parts", "Hydraulics", "Electronics", "Filters", "Belts & Hoses"],
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      name: "Automation & Controls",
      icon: Cog,
      productCount: 198,
      description: "Industrial automation systems, PLCs, sensors, and control equipment",
      subcategories: ["PLCs", "HMIs", "Sensors", "Motors", "Drives"],
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      name: "Material Handling",
      icon: Truck,
      productCount: 342,
      description: "Forklifts, conveyors, storage systems, and warehouse equipment",
      subcategories: ["Forklifts", "Conveyors", "Storage", "Lifting", "Packaging"],
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      name: "Welding Equipment",
      icon: Zap,
      productCount: 89,
      description: "Professional welding machines, accessories, and consumables",
      subcategories: ["MIG/MAG", "TIG", "Stick", "Plasma", "Accessories"],
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      name: "Hydraulics & Pneumatics",
      icon: Cog,
      productCount: 156,
      description: "Hydraulic and pneumatic systems, components, and accessories",
      subcategories: ["Pumps", "Cylinders", "Valves", "Fittings", "Hoses"],
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      name: "Electrical Equipment",
      icon: Zap,
      productCount: 234,
      description: "Industrial electrical components, panels, and distribution equipment",
      subcategories: ["Panels", "Switches", "Cables", "Transformers", "Lighting"],
      image: "/api/placeholder/400/250",
      featured: false
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const featuredCategories = filteredCategories.filter(cat => cat.featured);
  const otherCategories = filteredCategories.filter(cat => !cat.featured);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-industrial-dark via-gray-900 to-industrial-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center bg-industrial-blue/20 backdrop-blur-sm border border-industrial-blue/30 rounded-full px-4 py-2 mb-6">
              <Factory className="h-4 w-4 mr-2 text-industrial-blue" />
              <span className="text-sm">Product Categories</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Browse Our <span className="text-industrial-orange">Product Categories</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Explore our comprehensive range of industrial equipment and solutions, 
              organized by category for easy navigation.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-300 focus:bg-white focus:text-gray-900 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Stats */}
      <section className="py-16 bg-industrial-light-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-industrial-dark">{categories.length}</div>
              <div className="text-industrial-gray">Product Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-industrial-dark">
                {categories.reduce((acc, cat) => acc + cat.productCount, 0).toLocaleString()}+
              </div>
              <div className="text-industrial-gray">Total Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-industrial-dark">
                {categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)}
              </div>
              <div className="text-industrial-gray">Subcategories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-industrial-dark">45+</div>
              <div className="text-industrial-gray">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {featuredCategories.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-industrial-dark mb-4">
                Featured Categories
              </h2>
              <p className="text-xl text-industrial-gray max-w-2xl mx-auto">
                Our most popular product categories, trusted by industry professionals worldwide
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredCategories.map((category, index) => (
                <Link key={index} to={`/products/category/${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                  <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg h-full overflow-hidden">
                    <div className="relative">
                      <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <category.icon className="h-20 w-20 text-gray-400" />
                      </div>
                      <Badge className="absolute top-3 left-3 bg-industrial-orange text-white">
                        Featured
                      </Badge>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-sm font-medium text-industrial-dark">
                          {category.productCount} Products
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold text-industrial-dark group-hover:text-industrial-blue transition-colors">
                            {category.name}
                          </h3>
                          <category.icon className="h-8 w-8 text-industrial-blue opacity-60 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <p className="text-industrial-gray leading-relaxed">
                          {category.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {category.subcategories.slice(0, 4).map((sub, subIndex) => (
                            <Badge key={subIndex} variant="secondary" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                          {category.subcategories.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{category.subcategories.length - 4} more
                            </Badge>
                          )}
                        </div>
                        
                        <Button 
                          className="w-full bg-industrial-blue hover:bg-blue-600 group-hover:bg-industrial-orange group-hover:hover:bg-orange-600 transition-all duration-300"
                        >
                          Explore Category
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Categories */}
      {otherCategories.length > 0 && (
        <section className="py-20 bg-industrial-light-gray">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-industrial-dark mb-4">
                All Categories
              </h2>
              <p className="text-xl text-industrial-gray max-w-2xl mx-auto">
                Complete range of industrial equipment and solutions for every need
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCategories.map((category, index) => (
                <Link key={index} to={`/products/category/${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg h-full">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="inline-flex items-center justify-center w-12 h-12 bg-industrial-blue/10 text-industrial-blue rounded-lg mr-3 group-hover:bg-industrial-blue group-hover:text-white transition-all duration-300">
                                <category.icon className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-industrial-dark group-hover:text-industrial-blue transition-colors">
                                  {category.name}
                                </h3>
                                <div className="text-sm text-industrial-blue font-medium">
                                  {category.productCount} Products
                                </div>
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-industrial-blue group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                        
                        <p className="text-industrial-gray text-sm leading-relaxed">
                          {category.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 3).map((sub, subIndex) => (
                            <Badge key={subIndex} variant="outline" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                          {category.subcategories.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{category.subcategories.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Results */}
      {filteredCategories.length === 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <Filter className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-industrial-dark mb-4">No Categories Found</h3>
              <p className="text-industrial-gray mb-8">
                No categories match your search term "{searchTerm}". Try searching for something else or browse all categories.
              </p>
              <Button 
                onClick={() => setSearchTerm("")}
                className="bg-industrial-blue hover:bg-blue-600"
              >
                Clear Search
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-industrial-blue to-industrial-dark">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Our experts can help you find the right products for your specific needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-industrial-orange hover:bg-orange-600 text-white">
                  Contact Our Experts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/products">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-industrial-blue"
                >
                  Browse All Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
