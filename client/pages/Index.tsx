import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Star, 
  Shield, 
  Truck, 
  Award, 
  Factory, 
  Wrench, 
  HardHat,
  Download,
  Users,
  Globe,
  Zap,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import { HomepageContent } from "@shared/homepage";
import { Product } from "@shared/products";

// Icon mapping for dynamic icons
const iconMap: { [key: string]: any } = {
  Shield,
  Truck,
  Award,
  Star,
  Zap,
  Globe,
  Users,
  Settings,
  Factory,
  Wrench,
  HardHat
};

export default function Index() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    {
      name: "Heavy Machinery",
      icon: Factory,
      productCount: 156,
      description: "Excavators, cranes, bulldozers and more"
    },
    {
      name: "Industrial Tools",
      icon: Wrench,
      productCount: 423,
      description: "Professional grade tools for any job"
    },
    {
      name: "Safety Equipment",
      icon: HardHat,
      productCount: 287,
      description: "Keep your workforce protected"
    },
    {
      name: "Spare Parts",
      icon: Zap,
      productCount: 1024,
      description: "OEM and compatible replacement parts"
    }
  ];

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      if (isMounted) {
        await fetchContent();
      }
    };

    loadContent();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchContent = async (retryCount = 0) => {
    const maxRetries = 3;
    const retryDelay = 1000 * Math.pow(2, retryCount); // Exponential backoff

    try {
      // Create fetch requests with timeout and proper error handling
      const createFetchWithTimeout = (url: string, timeout = 10000) => {
        return Promise.race([
          fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }),
          new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ]);
      };

      console.log(`Fetching content (attempt ${retryCount + 1}/${maxRetries + 1})...`);

      const [homepageResponse, productsResponse] = await Promise.allSettled([
        createFetchWithTimeout("/api/homepage"),
        createFetchWithTimeout("/api/products")
      ]);

      let homepageData = null;
      let productsData = null;

      // Handle homepage response
      if (homepageResponse.status === 'fulfilled' && homepageResponse.value.ok) {
        try {
          homepageData = await homepageResponse.value.json();
        } catch (parseError) {
          console.warn("Failed to parse homepage JSON:", parseError);
        }
      } else {
        console.warn("Homepage fetch failed:", homepageResponse.status === 'rejected' ? homepageResponse.reason : 'HTTP error');
      }

      // Handle products response
      if (productsResponse.status === 'fulfilled' && productsResponse.value.ok) {
        try {
          productsData = await productsResponse.value.json();
        } catch (parseError) {
          console.warn("Failed to parse products JSON:", parseError);
        }
      } else {
        console.warn("Products fetch failed:", productsResponse.status === 'rejected' ? productsResponse.reason : 'HTTP error');
      }

      // Use fetched data if available, otherwise use fallback
      if (homepageData) {
        setContent(homepageData);
        console.log("✅ Homepage content loaded successfully");
      } else {
        console.log("⚠️ Using fallback homepage content");
        setContent(getFallbackHomepageContent());
      }

      if (productsData && productsData.products) {
        // Filter featured products based on homepage content
        const featuredProductIds = homepageData?.featuredProductIds || [];
        const featured = productsData.products.filter((product: Product) =>
          featuredProductIds.includes(product.id)
        );
        setFeaturedProducts(featured.slice(0, 6)); // Limit to 6 featured products
        console.log("✅ Products loaded successfully");
      } else {
        console.log("⚠️ Using fallback products");
        setFeaturedProducts(getFallbackProducts());
      }

    } catch (error) {
      console.error(`Error fetching content (attempt ${retryCount + 1}):`, error);

      // Retry logic
      if (retryCount < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        setTimeout(() => {
          fetchContent(retryCount + 1);
        }, retryDelay);
        return; // Don't set loading to false yet
      }

      // If all retries failed, use fallback content
      console.log("🔄 All fetch attempts failed, using fallback content");
      setContent(getFallbackHomepageContent());
      setFeaturedProducts(getFallbackProducts());
    }

    // Set loading to false when we're completely done (no more retries)
    if (retryCount >= maxRetries) {
      setLoading(false);
    } else if (retryCount === 0) {
      // If first attempt was successful or we're using fallback, stop loading
      setLoading(false);
    }
  };

  // Fallback homepage content function
  const getFallbackHomepageContent = () => ({
    id: "homepage",
    heroBanner: {
      title: "Industrial Solutions for Modern Manufacturing",
      subtitle: "Trusted by Industry Leaders",
      description: "Discover our comprehensive range of heavy machinery, industrial tools, and safety equipment.",
      primaryButtonText: "Explore Products",
      primaryButtonLink: "/products",
      secondaryButtonText: "Download Catalog",
      secondaryButtonLink: "/catalog.pdf"
    },
    stats: { clients: "2,500+", countries: "45+", products: "10,000+", experience: "25+" },
    featuredProductIds: ["1", "2", "3"],
    companyInfo: {
      title: "Built on Trust, Powered by Innovation",
      subtitle: "Industry Leader Since 1999",
      description: "For over 25 years, IndustrialCo has been the trusted partner for manufacturing.",
      features: [
        { icon: "Shield", title: "Safety First", description: "ISO certified safety standards" },
        { icon: "Truck", title: "Global Delivery", description: "Worldwide shipping network" },
        { icon: "Award", title: "Quality Assured", description: "Premium grade materials" }
      ],
      primaryButtonText: "Learn More About Us",
      primaryButtonLink: "/about",
      secondaryButtonText: "Contact Our Team",
      secondaryButtonLink: "/contact"
    },
    ctaSection: {
      title: "Ready to Transform Your Operations?",
      description: "Get in touch with our experts today for personalized industrial solutions",
      primaryButtonText: "Download Catalog",
      primaryButtonLink: "/catalog.pdf",
      secondaryButtonText: "Request Quote",
      secondaryButtonLink: "/contact",
      backgroundGradient: "from-industrial-blue to-industrial-dark"
    },
    updatedAt: new Date().toISOString()
  });

  // Fallback products function
  const getFallbackProducts = () => [
    {
      id: "1",
      name: "Industrial Excavator X2000",
      description: "Heavy-duty excavator for large construction projects with advanced hydraulic systems.",
      category: "Heavy Machinery",
      price: "Contact for Quote",
      images: [],
      specifications: [
        { key: "Weight", value: "25 tons" },
        { key: "Engine Power", value: "300 HP" },
        { key: "Bucket Capacity", value: "2.5 m³" }
      ],
      tags: ["Excavator", "Construction", "Heavy Duty"],
      featured: true,
      visible: true,
      rating: 4.8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "Professional Welding Kit Pro",
      description: "Complete welding solution for industrial applications with precision controls.",
      category: "Industrial Tools",
      price: "$2,499",
      images: [],
      specifications: [
        { key: "Power", value: "240V" },
        { key: "Welding Range", value: "1-12mm" },
        { key: "Duty Cycle", value: "60%" }
      ],
      tags: ["Welding", "Tools", "Professional"],
      featured: true,
      visible: true,
      rating: 4.6,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "3",
      name: "Safety Helmet Premium",
      description: "Advanced safety helmet with integrated communication and impact protection.",
      category: "Safety Equipment",
      price: "$189",
      images: [],
      specifications: [
        { key: "Material", value: "Carbon Fiber" },
        { key: "Weight", value: "380g" },
        { key: "Protection Level", value: "EN 397" }
      ],
      tags: ["Safety", "Helmet", "Communication"],
      featured: true,
      visible: true,
      rating: 4.9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  if (loading || !content) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Factory className="h-16 w-16 text-industrial-blue mx-auto mb-4 animate-pulse" />
          <div className="text-xl text-industrial-gray mb-2">Loading Industrial Solutions...</div>
          <div className="text-sm text-industrial-gray">
            Connecting to our systems...
          </div>
          <div className="mt-4 w-48 bg-gray-200 rounded-full h-2 mx-auto">
            <div className="bg-industrial-blue h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  const statsArray = [
    { label: "Global Clients", value: content.stats.clients, icon: Users },
    { label: "Countries Served", value: content.stats.countries, icon: Globe },
    { label: "Products Available", value: content.stats.products, icon: Factory },
    { label: "Years Experience", value: content.stats.experience, icon: Award }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-industrial-dark via-gray-900 to-industrial-gray overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-industrial-blue/20 to-industrial-orange/20"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <div className="inline-flex items-center bg-industrial-blue/20 backdrop-blur-sm border border-industrial-blue/30 rounded-full px-4 py-2">
                <Shield className="h-4 w-4 mr-2 text-industrial-blue" />
                <span className="text-sm">{content.heroBanner.subtitle}</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                {content.heroBanner.title}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                {content.heroBanner.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={content.heroBanner.primaryButtonLink}>
                  <Button size="lg" className="bg-industrial-orange hover:bg-orange-600 text-white">
                    {content.heroBanner.primaryButtonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to={content.heroBanner.secondaryButtonLink}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white hover:text-industrial-dark"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    {content.heroBanner.secondaryButtonText}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-industrial-blue/20 to-industrial-orange/20 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <Factory className="h-32 w-32 text-industrial-orange opacity-80" />
              </div>
              <div className="absolute -top-4 -right-4 bg-industrial-orange text-white p-4 rounded-2xl shadow-lg">
                <div className="text-2xl font-bold">{content.stats.experience}</div>
                <div className="text-sm">Years Experience</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-industrial-blue text-white p-4 rounded-2xl shadow-lg">
                <div className="text-2xl font-bold">{content.stats.clients}</div>
                <div className="text-sm">Global Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-industrial-light-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsArray.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-industrial-blue text-white rounded-full mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-industrial-dark">{stat.value}</div>
                <div className="text-industrial-gray">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-industrial-dark mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-industrial-gray max-w-2xl mx-auto">
              Discover our most popular industrial equipment, trusted by professionals worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Factory className="h-20 w-20 text-gray-400" />
                  </div>
                  {product.featured && (
                    <Badge className="absolute top-3 left-3 bg-industrial-orange text-white">
                      Featured
                    </Badge>
                  )}
                  {product.rating && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{product.rating}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-industrial-blue font-medium">{product.category}</div>
                      <h3 className="text-xl font-bold text-industrial-dark group-hover:text-industrial-blue transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-lg font-bold text-industrial-dark">{product.price}</div>
                      <Button size="sm" className="bg-industrial-blue hover:bg-blue-600">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-industrial-blue text-industrial-blue hover:bg-industrial-blue hover:text-white">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-industrial-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-industrial-dark mb-4">
              Product Categories
            </h2>
            <p className="text-xl text-industrial-gray max-w-2xl mx-auto">
              Browse our comprehensive selection organized by industry categories
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={index} to={`/products/category/${category.name.toLowerCase().replace(' ', '-')}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg h-full">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-industrial-blue/10 text-industrial-blue rounded-full mb-4 group-hover:bg-industrial-blue group-hover:text-white transition-all duration-300">
                      <category.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-industrial-dark mb-2 group-hover:text-industrial-blue transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-industrial-gray text-sm mb-3">{category.description}</p>
                    <div className="text-industrial-blue font-medium">{category.productCount} Products</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info/About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-industrial-blue/10 text-industrial-blue rounded-full px-4 py-2">
                <Award className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{content.companyInfo.subtitle}</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-industrial-dark">
                {content.companyInfo.title}
              </h2>
              <p className="text-lg text-industrial-gray leading-relaxed">
                {content.companyInfo.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {content.companyInfo.features.map((feature, index) => {
                  const IconComponent = iconMap[feature.icon] || Shield;
                  return (
                    <div key={index} className="text-center p-4">
                      <IconComponent className="h-8 w-8 text-industrial-blue mx-auto mb-2" />
                      <div className="font-bold text-industrial-dark">{feature.title}</div>
                      <div className="text-sm text-industrial-gray">{feature.description}</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={content.companyInfo.primaryButtonLink}>
                  <Button className="bg-industrial-blue hover:bg-blue-600">
                    {content.companyInfo.primaryButtonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to={content.companyInfo.secondaryButtonLink}>
                  <Button variant="outline" className="border-industrial-orange text-industrial-orange hover:bg-industrial-orange hover:text-white">
                    {content.companyInfo.secondaryButtonText}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-industrial-blue/20 to-industrial-orange/20 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <Factory className="h-32 w-32 text-industrial-blue mx-auto mb-4 opacity-80" />
                  <div className="text-2xl font-bold text-industrial-dark">{content.stats.experience} Years</div>
                  <div className="text-industrial-gray">of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 bg-gradient-to-r ${content.ctaSection.backgroundGradient}`}>
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              {content.ctaSection.title}
            </h2>
            <p className="text-xl text-gray-300">
              {content.ctaSection.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={content.ctaSection.primaryButtonLink}>
                <Button size="lg" className="bg-industrial-orange hover:bg-orange-600 text-white">
                  <Download className="mr-2 h-5 w-5" />
                  {content.ctaSection.primaryButtonText}
                </Button>
              </Link>
              <Link to={content.ctaSection.secondaryButtonLink}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-industrial-blue"
                >
                  {content.ctaSection.secondaryButtonText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
