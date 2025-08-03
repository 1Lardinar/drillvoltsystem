import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Filter, Grid, List, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  images: string[];
  specifications: { key: string; value: string }[];
  tags: string[];
  featured: boolean;
  visible: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export default function Products() {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Update selected category when URL changes
  useEffect(() => {
    setSelectedCategory(category || "all");
  }, [category]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Handle both array response and object response with products property
        const products = Array.isArray(data) ? data : data.products || [];
        setProducts(products.filter((product: Product) => product.visible));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "category":
          return a.category.localeCompare(b.category);
        case "rating":
          return b.rating - a.rating;
        case "featured":
          return b.featured ? 1 : -1;
        default:
          return 0;
      }
    });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          {product.featured && (
            <Badge variant="default" className="bg-industrial-blue text-xs">
              Featured
            </Badge>
          )}
        </div>
        <h3 className="text-lg font-semibold text-industrial-dark mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-industrial-gray text-sm mb-3 line-clamp-3">
          {product.description}
        </p>
        <div className="flex items-center gap-1 mb-3">
          {renderStars(product.rating)}
          <span className="text-sm text-industrial-gray ml-1">
            ({product.rating})
          </span>
        </div>
        <p className="text-lg font-bold text-industrial-blue mb-4">
          {product.price}
        </p>
        <Link to={`/products/${product.id}`}>
          <Button className="w-full bg-industrial-blue hover:bg-blue-700">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              {product.featured && (
                <Badge variant="default" className="bg-industrial-blue text-xs">
                  Featured
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-semibold text-industrial-dark mb-2">
              {product.name}
            </h3>
            <p className="text-industrial-gray mb-3">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
                <span className="text-sm text-industrial-gray ml-1">
                  ({product.rating})
                </span>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-bold text-industrial-blue">
                  {product.price}
                </p>
                <Link to={`/products/${product.id}`}>
                  <Button className="bg-industrial-blue hover:bg-blue-700">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-industrial-blue mx-auto"></div>
            <p className="mt-4 text-industrial-gray">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-industrial-dark mb-4">
            Our Products
          </h1>
          <p className="text-lg text-industrial-gray max-w-2xl mx-auto">
            Explore our comprehensive range of industrial equipment and machinery designed for professional use.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex-1"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex-1"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-industrial-gray">
            <span>
              Showing {filteredProducts.length} of {products.length} products
            </span>
            {selectedCategory !== "all" && (
              <span>
                Filtered by: <strong>{selectedCategory}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-industrial-dark mb-2">
              No products found
            </h3>
            <p className="text-industrial-gray">
              Try adjusting your search criteria or browse all categories.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div>
            {filteredProducts.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link to="/">
            <Button variant="outline" className="border-industrial-blue text-industrial-blue hover:bg-industrial-blue hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
