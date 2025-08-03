import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Palette,
  Monitor,
  Type,
  Image as ImageIcon,
  Save,
  Eye,
  Upload,
  RotateCcw,
  Wand2,
  Sparkles,
  Globe,
  Brush,
  Settings
} from "lucide-react";

interface FrontendContent {
  homepage: {
    heroBanner: {
      title: string;
      subtitle: string;
      description: string;
      backgroundImage?: string;
    };
    stats: {
      clients: string;
      countries: string;
      products: string;
      experience: string;
    };
    companyInfo: {
      title: string;
      subtitle: string;
      description: string;
    };
  };
  branding: {
    logo?: string;
    companyName: string;
    tagline?: string;
    favicon?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
  };
  images: {
    heroImage?: string;
    aboutImage?: string;
    categoryImages: { [key: string]: string };
  };
}

const defaultContent: FrontendContent = {
  homepage: {
    heroBanner: {
      title: "Industrial Solutions for Modern Manufacturing",
      subtitle: "Trusted by Industry Leaders",
      description: "Discover our comprehensive range of heavy machinery, industrial tools, and safety equipment."
    },
    stats: {
      clients: "2,500+",
      countries: "45+",
      products: "10,000+",
      experience: "25+"
    },
    companyInfo: {
      title: "Built on Trust, Powered by Innovation",
      subtitle: "Industry Leader Since 1999",
      description: "For over 25 years, IndustrialCo has been the trusted partner for manufacturing."
    }
  },
  branding: {
    companyName: "IndustrialCo",
    tagline: "Your Industrial Solutions Partner"
  },
  theme: {
    primaryColor: "#1E40AF",
    secondaryColor: "#64748B",
    accentColor: "#F97316",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937"
  },
  images: {
    categoryImages: {}
  }
};

export default function AdminFrontend() {
  const [content, setContent] = useState<FrontendContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Fetch homepage content
      const homepageResponse = await fetch("/api/homepage", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch theme settings
      const themeResponse = await fetch("/api/content/theme", {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (homepageResponse.ok) {
        const homepageData = await homepageResponse.json();
        setContent(prev => ({
          ...prev,
          homepage: {
            heroBanner: homepageData.heroBanner || prev.homepage.heroBanner,
            stats: homepageData.stats || prev.homepage.stats,
            companyInfo: homepageData.companyInfo || prev.homepage.companyInfo
          },
          branding: {
            ...prev.branding,
            companyName: homepageData.companyInfo?.title?.split(',')[0] || prev.branding.companyName
          }
        }));
      }

      if (themeResponse.ok) {
        const themeData = await themeResponse.json();
        if (themeData.colors) {
          setContent(prev => ({
            ...prev,
            theme: {
              primaryColor: themeData.colors.primary || prev.theme.primaryColor,
              secondaryColor: themeData.colors.secondary || prev.theme.secondaryColor,
              accentColor: themeData.colors.accent || prev.theme.accentColor,
              backgroundColor: themeData.colors.background || prev.theme.backgroundColor,
              textColor: themeData.colors.text || prev.theme.textColor
            },
            branding: {
              ...prev.branding,
              ...themeData.branding
            }
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');

      // Save homepage content
      const homepageResponse = await fetch("/api/homepage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          heroBanner: content.homepage.heroBanner,
          stats: content.homepage.stats,
          companyInfo: content.homepage.companyInfo,
          featuredProductIds: [],
          ctaSection: {
            title: "Ready to Transform Your Operations?",
            description: "Get in touch with our experts today for personalized industrial solutions",
            primaryButtonText: "Download Catalog",
            primaryButtonLink: "/catalog.pdf",
            secondaryButtonText: "Request Quote",
            secondaryButtonLink: "/contact",
            backgroundGradient: "from-industrial-blue to-industrial-dark"
          }
        })
      });

      // Save theme settings
      const themeResponse = await fetch("/api/content/theme", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          colors: {
            primary: content.theme.primaryColor,
            secondary: content.theme.secondaryColor,
            accent: content.theme.accentColor,
            background: content.theme.backgroundColor,
            text: content.theme.textColor,
            industrialBlue: content.theme.primaryColor,
            industrialOrange: content.theme.accentColor,
            industrialGray: content.theme.secondaryColor,
            industrialLightGray: "#F1F5F9",
            industrialDark: content.theme.textColor
          },
          branding: content.branding,
          typography: {
            headingFont: "Inter",
            bodyFont: "Inter",
            fontSize: {
              base: "16px",
              heading: "32px",
              small: "14px",
              large: "18px"
            }
          },
          layout: {
            maxWidth: "1200px",
            borderRadius: "8px",
            spacing: "1rem",
            headerHeight: "80px",
            footerHeight: "120px"
          },
          preferences: {
            darkModeEnabled: false,
            animationsEnabled: true,
            compactMode: false
          }
        })
      });

      if (homepageResponse.ok && themeResponse.ok) {
        // Apply theme immediately to current admin panel
        applyThemeToCurrentPage();
        
        toast({
          title: "Success",
          description: "Frontend content saved and applied successfully!"
        });
      } else {
        throw new Error("Failed to save content");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save frontend content",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const applyThemeToCurrentPage = () => {
    const root = document.documentElement;
    
    // Convert hex to HSL for CSS variables
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    // Apply theme colors
    Object.entries(content.theme).forEach(([key, value]) => {
      if (value.startsWith('#')) {
        const hslValue = hexToHsl(value);
        const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(`--${cssVar}`, hslValue);
        
        // Also set industrial theme variables
        if (key === 'primaryColor') {
          root.style.setProperty('--industrial-blue', hslValue);
        } else if (key === 'accentColor') {
          root.style.setProperty('--industrial-orange', hslValue);
        } else if (key === 'secondaryColor') {
          root.style.setProperty('--industrial-gray', hslValue);
        }
      }
    });
  };

  const uploadImage = async (imageType: string, file: File) => {
    setUploading(imageType);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/upload/single', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.url;
        
        if (imageType === 'logo' || imageType === 'favicon') {
          setContent(prev => ({
            ...prev,
            branding: {
              ...prev.branding,
              [imageType]: imageUrl
            }
          }));
        } else {
          setContent(prev => ({
            ...prev,
            images: {
              ...prev.images,
              [imageType]: imageUrl
            }
          }));
        }

        toast({
          title: "Success",
          description: "Image uploaded successfully"
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(null);
    }
  };

  const handleImageUpload = (imageType: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadImage(imageType, file);
      }
    };
    input.click();
  };

  const previewWebsite = () => {
    window.open("/", "_blank");
  };

  const resetToDefaults = () => {
    setContent(defaultContent);
    toast({
      title: "Reset",
      description: "Content reset to default values"
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Globe className="h-16 w-16 text-industrial-blue mx-auto mb-4 animate-pulse" />
          <div className="text-xl text-industrial-gray">Loading frontend settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-industrial-dark">Frontend Management</h1>
          <p className="text-industrial-gray mt-1">Customize your website's content, colors, images, and branding</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" onClick={previewWebsite}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Site
          </Button>
          <Button onClick={saveContent} disabled={saving} className="bg-industrial-blue hover:bg-blue-600">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save & Apply"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="h-5 w-5 mr-2" />
                Homepage Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hero Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Hero Banner</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="heroTitle">Main Title</Label>
                    <Input
                      id="heroTitle"
                      value={content.homepage.heroBanner.title}
                      onChange={(e) => setContent({
                        ...content,
                        homepage: {
                          ...content.homepage,
                          heroBanner: { ...content.homepage.heroBanner, title: e.target.value }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="heroSubtitle">Subtitle</Label>
                    <Input
                      id="heroSubtitle"
                      value={content.homepage.heroBanner.subtitle}
                      onChange={(e) => setContent({
                        ...content,
                        homepage: {
                          ...content.homepage,
                          heroBanner: { ...content.homepage.heroBanner, subtitle: e.target.value }
                        }
                      })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="heroDescription">Description</Label>
                  <Textarea
                    id="heroDescription"
                    value={content.homepage.heroBanner.description}
                    onChange={(e) => setContent({
                      ...content,
                      homepage: {
                        ...content.homepage,
                        heroBanner: { ...content.homepage.heroBanner, description: e.target.value }
                      }
                    })}
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Stats Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(content.homepage.stats).map(([key, value]) => (
                    <div key={key}>
                      <Label htmlFor={key} className="capitalize">{key}</Label>
                      <Input
                        id={key}
                        value={value}
                        onChange={(e) => setContent({
                          ...content,
                          homepage: {
                            ...content.homepage,
                            stats: { ...content.homepage.stats, [key]: e.target.value }
                          }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyTitle">Title</Label>
                    <Input
                      id="companyTitle"
                      value={content.homepage.companyInfo.title}
                      onChange={(e) => setContent({
                        ...content,
                        homepage: {
                          ...content.homepage,
                          companyInfo: { ...content.homepage.companyInfo, title: e.target.value }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companySubtitle">Subtitle</Label>
                    <Input
                      id="companySubtitle"
                      value={content.homepage.companyInfo.subtitle}
                      onChange={(e) => setContent({
                        ...content,
                        homepage: {
                          ...content.homepage,
                          companyInfo: { ...content.homepage.companyInfo, subtitle: e.target.value }
                        }
                      })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="companyDescription">Description</Label>
                  <Textarea
                    id="companyDescription"
                    value={content.homepage.companyInfo.description}
                    onChange={(e) => setContent({
                      ...content,
                      homepage: {
                        ...content.homepage,
                        companyInfo: { ...content.homepage.companyInfo, description: e.target.value }
                      }
                    })}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Website Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(content.theme).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={key} className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => setContent({
                          ...content,
                          theme: { ...content.theme, [key]: e.target.value }
                        })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={value}
                        onChange={(e) => setContent({
                          ...content,
                          theme: { ...content.theme, [key]: e.target.value }
                        })}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Color Preview</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(content.theme).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div 
                        className="w-full h-16 rounded-lg mb-2 border shadow-sm"
                        style={{ backgroundColor: value }}
                      />
                      <div className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div className="text-xs text-gray-500">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Website Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'heroImage', label: 'Hero Background', description: 'Main homepage banner image (1200x600px)' },
                  { key: 'aboutImage', label: 'About Section', description: 'Company about section image (800x600px)' }
                ].map(({ key, label, description }) => (
                  <div key={key}>
                    <Label className="text-base font-medium">{label}</Label>
                    <p className="text-sm text-gray-600 mb-3">{description}</p>
                    
                    <div className="border rounded-lg p-4">
                      {content.images[key as keyof typeof content.images] ? (
                        <div className="space-y-3">
                          <img 
                            src={content.images[key as keyof typeof content.images] as string}
                            alt={label}
                            className="max-w-full h-32 object-cover border rounded"
                          />
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleImageUpload(key)}
                              disabled={uploading === key}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              {uploading === key ? 'Uploading...' : 'Replace'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setContent({
                                ...content,
                                images: { ...content.images, [key]: undefined }
                              })}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <Button 
                            onClick={() => handleImageUpload(key)}
                            disabled={uploading === key}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploading === key ? 'Uploading...' : `Upload ${label}`}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Brand Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={content.branding.companyName}
                    onChange={(e) => setContent({
                      ...content,
                      branding: { ...content.branding, companyName: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={content.branding.tagline || ""}
                    onChange={(e) => setContent({
                      ...content,
                      branding: { ...content.branding, tagline: e.target.value }
                    })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <h3 className="text-lg font-medium">Brand Assets</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'logo', label: 'Company Logo', description: 'Main website logo (200x80px recommended)' },
                    { key: 'favicon', label: 'Favicon', description: 'Browser tab icon (32x32px recommended)' }
                  ].map(({ key, label, description }) => (
                    <div key={key}>
                      <Label className="text-base font-medium">{label}</Label>
                      <p className="text-sm text-gray-600 mb-3">{description}</p>
                      
                      <div className="border rounded-lg p-4">
                        {content.branding[key as keyof typeof content.branding] ? (
                          <div className="space-y-3">
                            <img 
                              src={content.branding[key as keyof typeof content.branding] as string}
                              alt={label}
                              className="max-w-full h-16 object-contain border rounded"
                            />
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleImageUpload(key)}
                                disabled={uploading === key}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                {uploading === key ? 'Uploading...' : 'Replace'}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setContent({
                                  ...content,
                                  branding: { ...content.branding, [key]: undefined }
                                })}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <Button 
                              onClick={() => handleImageUpload(key)}
                              disabled={uploading === key}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {uploading === key ? 'Uploading...' : `Upload ${label}`}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
