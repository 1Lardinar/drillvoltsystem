import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Save, 
  ArrowLeft,
  Home,
  Plus,
  Trash2,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { HomepageContent, UpdateHomepageRequest } from "@shared/homepage";
import { Product } from "@shared/products";

export default function AdminHomepage() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const availableIcons = ["Shield", "Truck", "Award", "Star", "Zap", "Globe", "Users", "Settings"];

  useEffect(() => {
    fetchContent();
    fetchProducts();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/homepage");
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error fetching homepage content:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    
    setSaving(true);
    try {
      const updateData: UpdateHomepageRequest = {
        heroBanner: content.heroBanner,
        stats: content.stats,
        featuredProductIds: content.featuredProductIds,
        companyInfo: content.companyInfo,
        ctaSection: content.ctaSection
      };

      const response = await fetch("/api/homepage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedContent = await response.json();
        setContent(updatedContent);
        alert("Homepage content saved successfully!");
      } else {
        alert("Error saving homepage content");
      }
    } catch (error) {
      console.error("Error saving homepage content:", error);
      alert("Error saving homepage content");
    } finally {
      setSaving(false);
    }
  };

  const updateHeroBanner = (field: keyof typeof content.heroBanner, value: string) => {
    if (!content) return;
    setContent({
      ...content,
      heroBanner: {
        ...content.heroBanner,
        [field]: value
      }
    });
  };

  const updateStats = (field: keyof typeof content.stats, value: string) => {
    if (!content) return;
    setContent({
      ...content,
      stats: {
        ...content.stats,
        [field]: value
      }
    });
  };

  const updateCompanyInfo = (field: keyof typeof content.companyInfo, value: any) => {
    if (!content) return;
    setContent({
      ...content,
      companyInfo: {
        ...content.companyInfo,
        [field]: value
      }
    });
  };

  const updateCtaSection = (field: keyof typeof content.ctaSection, value: string) => {
    if (!content) return;
    setContent({
      ...content,
      ctaSection: {
        ...content.ctaSection,
        [field]: value
      }
    });
  };

  const addCompanyFeature = () => {
    if (!content) return;
    updateCompanyInfo("features", [
      ...content.companyInfo.features,
      { icon: "Shield", title: "", description: "" }
    ]);
  };

  const updateCompanyFeature = (index: number, field: string, value: string) => {
    if (!content) return;
    const features = [...content.companyInfo.features];
    features[index] = { ...features[index], [field]: value };
    updateCompanyInfo("features", features);
  };

  const removeCompanyFeature = (index: number) => {
    if (!content) return;
    const features = content.companyInfo.features.filter((_, i) => i !== index);
    updateCompanyInfo("features", features);
  };

  const toggleFeaturedProduct = (productId: string) => {
    if (!content) return;
    const currentIds = content.featuredProductIds;
    const newIds = currentIds.includes(productId)
      ? currentIds.filter(id => id !== productId)
      : [...currentIds, productId];
    
    setContent({
      ...content,
      featuredProductIds: newIds
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-industrial-light-gray py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Home className="h-16 w-16 text-industrial-blue mx-auto mb-4 animate-pulse" />
            <div className="text-xl text-industrial-gray">Loading homepage content...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="min-h-screen bg-industrial-light-gray py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-industrial-dark">Homepage Content</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/" target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-industrial-blue hover:bg-blue-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Hero Banner */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-industrial-blue" />
                Hero Banner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Main Title</Label>
                  <Input
                    id="hero-title"
                    value={content.heroBanner.title}
                    onChange={(e) => updateHeroBanner("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">Subtitle</Label>
                  <Input
                    id="hero-subtitle"
                    value={content.heroBanner.subtitle}
                    onChange={(e) => updateHeroBanner("subtitle", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-description">Description</Label>
                <Textarea
                  id="hero-description"
                  value={content.heroBanner.description}
                  onChange={(e) => updateHeroBanner("description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-primary-btn">Primary Button Text</Label>
                  <Input
                    id="hero-primary-btn"
                    value={content.heroBanner.primaryButtonText}
                    onChange={(e) => updateHeroBanner("primaryButtonText", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-primary-link">Primary Button Link</Label>
                  <Input
                    id="hero-primary-link"
                    value={content.heroBanner.primaryButtonLink}
                    onChange={(e) => updateHeroBanner("primaryButtonLink", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-secondary-btn">Secondary Button Text</Label>
                  <Input
                    id="hero-secondary-btn"
                    value={content.heroBanner.secondaryButtonText}
                    onChange={(e) => updateHeroBanner("secondaryButtonText", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-secondary-link">Secondary Button Link</Label>
                  <Input
                    id="hero-secondary-link"
                    value={content.heroBanner.secondaryButtonLink}
                    onChange={(e) => updateHeroBanner("secondaryButtonLink", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Stats */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Company Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stats-clients">Global Clients</Label>
                  <Input
                    id="stats-clients"
                    value={content.stats.clients}
                    onChange={(e) => updateStats("clients", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stats-countries">Countries Served</Label>
                  <Input
                    id="stats-countries"
                    value={content.stats.countries}
                    onChange={(e) => updateStats("countries", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stats-products">Products Available</Label>
                  <Input
                    id="stats-products"
                    value={content.stats.products}
                    onChange={(e) => updateStats("products", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stats-experience">Years Experience</Label>
                  <Input
                    id="stats-experience"
                    value={content.stats.experience}
                    onChange={(e) => updateStats("experience", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Products */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Featured Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      content.featuredProductIds.includes(product.id)
                        ? "border-industrial-blue bg-industrial-blue/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleFeaturedProduct(product.id)}
                  >
                    <h4 className="font-semibold text-industrial-dark">{product.name}</h4>
                    <p className="text-sm text-industrial-gray">{product.category}</p>
                    {content.featuredProductIds.includes(product.id) && (
                      <span className="text-xs text-industrial-blue font-medium">✓ Featured</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Company Information Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-title">Section Title</Label>
                  <Input
                    id="company-title"
                    value={content.companyInfo.title}
                    onChange={(e) => updateCompanyInfo("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-subtitle">Subtitle</Label>
                  <Input
                    id="company-subtitle"
                    value={content.companyInfo.subtitle}
                    onChange={(e) => updateCompanyInfo("subtitle", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-description">Description</Label>
                <Textarea
                  id="company-description"
                  value={content.companyInfo.description}
                  onChange={(e) => updateCompanyInfo("description", e.target.value)}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Company Features</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addCompanyFeature}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
                {content.companyInfo.features.map((feature, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Select
                        value={feature.icon}
                        onValueChange={(value) => updateCompanyFeature(index, "icon", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableIcons.map((icon) => (
                            <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateCompanyFeature(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={feature.description}
                        onChange={(e) => updateCompanyFeature(index, "description", e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCompanyFeature(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-primary-btn">Primary Button Text</Label>
                  <Input
                    id="company-primary-btn"
                    value={content.companyInfo.primaryButtonText}
                    onChange={(e) => updateCompanyInfo("primaryButtonText", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-primary-link">Primary Button Link</Label>
                  <Input
                    id="company-primary-link"
                    value={content.companyInfo.primaryButtonLink}
                    onChange={(e) => updateCompanyInfo("primaryButtonLink", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-secondary-btn">Secondary Button Text</Label>
                  <Input
                    id="company-secondary-btn"
                    value={content.companyInfo.secondaryButtonText}
                    onChange={(e) => updateCompanyInfo("secondaryButtonText", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-secondary-link">Secondary Button Link</Label>
                  <Input
                    id="company-secondary-link"
                    value={content.companyInfo.secondaryButtonLink}
                    onChange={(e) => updateCompanyInfo("secondaryButtonLink", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Call-to-Action Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta-title">CTA Title</Label>
                  <Input
                    id="cta-title"
                    value={content.ctaSection.title}
                    onChange={(e) => updateCtaSection("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta-bg">Background Gradient</Label>
                  <Input
                    id="cta-bg"
                    value={content.ctaSection.backgroundGradient}
                    onChange={(e) => updateCtaSection("backgroundGradient", e.target.value)}
                    placeholder="e.g., from-industrial-blue to-industrial-dark"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-description">Description</Label>
                <Textarea
                  id="cta-description"
                  value={content.ctaSection.description}
                  onChange={(e) => updateCtaSection("description", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta-primary-btn">Primary Button Text</Label>
                  <Input
                    id="cta-primary-btn"
                    value={content.ctaSection.primaryButtonText}
                    onChange={(e) => updateCtaSection("primaryButtonText", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta-primary-link">Primary Button Link</Label>
                  <Input
                    id="cta-primary-link"
                    value={content.ctaSection.primaryButtonLink}
                    onChange={(e) => updateCtaSection("primaryButtonLink", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta-secondary-btn">Secondary Button Text</Label>
                  <Input
                    id="cta-secondary-btn"
                    value={content.ctaSection.secondaryButtonText}
                    onChange={(e) => updateCtaSection("secondaryButtonText", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta-secondary-link">Secondary Button Link</Label>
                  <Input
                    id="cta-secondary-link"
                    value={content.ctaSection.secondaryButtonLink}
                    onChange={(e) => updateCtaSection("secondaryButtonLink", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            size="lg"
            className="bg-industrial-blue hover:bg-blue-600"
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? "Saving Changes..." : "Save All Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
