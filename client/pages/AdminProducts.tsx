import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Save,
  Trash2,
  Edit,
  ArrowLeft,
  X,
  Package
} from "lucide-react";
import { Link } from "react-router-dom";
import { Product, CreateProductRequest, ProductSpec } from "@shared/products";
import ImageUpload from "@/components/ImageUpload";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    description: "",
    category: "",
    price: "",
    images: [""],
    specifications: [{ key: "", value: "" }],
    tags: [],
    featured: false,
    visible: true
  });

  const categories = [
    "Heavy Machinery",
    "Welding Equipment", 
    "Safety Equipment",
    "Industrial Tools",
    "Spare Parts"
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Show user-friendly error message
      alert("Failed to load products. Please check your connection and try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchProducts();
        resetForm();
      } else {
        console.error("Error saving product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      images: [""],
      specifications: [{ key: "", value: "" }],
      tags: [],
      featured: false,
      visible: true
    });
    setIsCreating(false);
    setEditingProduct(null);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      images: product.images.length ? product.images : [""],
      specifications: product.specifications.length ? product.specifications : [{ key: "", value: "" }],
      tags: product.tags,
      featured: product.featured,
      visible: product.visible
    });
    setIsCreating(true);
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }]
    }));
  };

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: images.filter(img => img.trim() !== "")
    }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(",").map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-industrial-light-gray py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Package className="h-16 w-16 text-industrial-blue mx-auto mb-4 animate-pulse" />
            <div className="text-xl text-industrial-gray">Loading products...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-industrial-light-gray py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-industrial-dark">Product Management</h1>
          </div>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)} className="bg-industrial-blue hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>

        {isCreating && (
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{editingProduct ? "Edit Product" : "Create New Product"}</span>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g., Starting at $450,000"
                  />
                </div>

                <ImageUpload
                  images={formData.images}
                  onImagesChange={handleImagesChange}
                  maxImages={5}
                />

                <div className="space-y-2">
                  <Label>Specifications</Label>
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={spec.key}
                        onChange={(e) => updateSpecification(index, "key", e.target.value)}
                        placeholder="Specification name"
                      />
                      <Input
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, "value", e.target.value)}
                        placeholder="Specification value"
                      />
                      {formData.specifications.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSpecification(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Specification
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags.join(", ")}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="e.g., excavator, heavy-duty, construction"
                  />
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                    />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="visible"
                      checked={formData.visible}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visible: checked }))}
                    />
                    <Label htmlFor="visible">Visible on Website</Label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-industrial-blue hover:bg-blue-600">
                    <Save className="h-4 w-4 mr-2" />
                    {editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-industrial-dark">{product.name}</h3>
                      <Badge variant="secondary" className="mt-1">{product.category}</Badge>
                    </div>
                    <div className="flex gap-2">
                      {product.featured && (
                        <Badge className="bg-industrial-orange text-white">Featured</Badge>
                      )}
                      {!product.visible && (
                        <Badge variant="destructive">Hidden</Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-industrial-gray line-clamp-3">{product.description}</p>
                  
                  {product.price && (
                    <div className="text-lg font-bold text-industrial-blue">{product.price}</div>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                    {product.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{product.tags.length - 3}</Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(product)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-industrial-gray mb-2">No products yet</h3>
            <p className="text-industrial-gray mb-6">Create your first product to get started</p>
            <Button onClick={() => setIsCreating(true)} className="bg-industrial-blue hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Add First Product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
