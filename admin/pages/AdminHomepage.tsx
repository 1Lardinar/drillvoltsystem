import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Home, Save, Eye } from "lucide-react";

interface HomepageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    backgroundImage: string;
  };
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  stats: {
    clients: string;
    countries: string;
    products: string;
    experience: string;
  };
}

export default function AdminHomepage() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/homepage");
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error("Error fetching homepage content:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    if (!content) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch("/api/homepage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Homepage content updated successfully"
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save homepage content",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Home className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
          <div className="text-xl text-gray-700">Loading homepage content...</div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <div className="text-xl text-gray-700">Failed to load content</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Homepage Content</h1>
        <div className="flex space-x-3">
          <Button onClick={() => window.open("/", "_blank")} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={saveContent} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={content.hero.title}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, title: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={content.hero.subtitle}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, subtitle: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="hero-description">Description</Label>
              <Textarea
                id="hero-description"
                value={content.hero.description}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, description: e.target.value }
                })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary-button">Primary Button Text</Label>
                <Input
                  id="primary-button"
                  value={content.hero.primaryButtonText}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, primaryButtonText: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="secondary-button">Secondary Button Text</Label>
                <Input
                  id="secondary-button"
                  value={content.hero.secondaryButtonText}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, secondaryButtonText: e.target.value }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clients">Clients</Label>
                <Input
                  id="clients"
                  value={content.stats.clients}
                  onChange={(e) => setContent({
                    ...content,
                    stats: { ...content.stats, clients: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="countries">Countries</Label>
                <Input
                  id="countries"
                  value={content.stats.countries}
                  onChange={(e) => setContent({
                    ...content,
                    stats: { ...content.stats, countries: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="products">Products</Label>
                <Input
                  id="products"
                  value={content.stats.products}
                  onChange={(e) => setContent({
                    ...content,
                    stats: { ...content.stats, products: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="experience">Years Experience</Label>
                <Input
                  id="experience"
                  value={content.stats.experience}
                  onChange={(e) => setContent({
                    ...content,
                    stats: { ...content.stats, experience: e.target.value }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
