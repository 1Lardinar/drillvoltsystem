import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, ArrowLeft, ShoppingCart, Heart, Share2 } from "lucide-react";

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

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-industrial-blue mx-auto"></div>
            <p className="mt-4 text-industrial-gray">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-industrial-dark mb-4">Product Not Found</h1>
            <p className="text-industrial-gray mb-8">{error || "The product you're looking for doesn't exist."}</p>
            <Link to="/products">
              <Button variant="outline" className="border-industrial-blue text-industrial-blue hover:bg-industrial-blue hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
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
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-industrial-gray">
            <Link to="/" className="hover:text-industrial-blue">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-industrial-blue">Products</Link>
            <span>/</span>
            <Link to={`/products/category/${encodeURIComponent(product.category)}`} className="hover:text-industrial-blue">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-industrial-dark">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImageIndex] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? "border-industrial-blue" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{product.category}</Badge>
                {product.featured && (
                  <Badge variant="default" className="bg-industrial-blue">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-industrial-dark mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-industrial-gray">({product.rating}/5)</span>
              </div>
              <p className="text-industrial-gray leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            <div>
              <p className="text-3xl font-bold text-industrial-blue mb-6">{product.price || "Contact for Price"}</p>
              
              <div className="flex gap-4 mb-6">
                <Button className="flex-1 bg-industrial-blue hover:bg-blue-700">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Request Quote
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Specifications */}
            {product.specifications.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-industrial-dark mb-4">Specifications</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {product.specifications.map((spec, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <span className="font-medium text-industrial-gray">{spec.key}</span>
                          <span className="text-industrial-dark">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-industrial-dark mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Products */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link to="/products">
            <Button variant="outline" className="border-industrial-blue text-industrial-blue hover:bg-industrial-blue hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
