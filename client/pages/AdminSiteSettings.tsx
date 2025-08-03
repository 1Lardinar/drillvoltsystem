import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Settings,
  Palette,
  Upload,
  Save,
  RotateCcw,
  Eye,
  ArrowLeft,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";

interface SiteSettings {
  branding: {
    siteName: string;
    tagline: string;
    logo?: string;
    favicon?: string;
    description: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    headerBg: string;
    footerBg: string;
  };
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage?: string;
  };
  features: {
    enableBlog: boolean;
    enableComments: boolean;
    enableNewsletter: boolean;
    enableSearch: boolean;
    enableDarkMode: boolean;
  };
  header: {
    showLogo: boolean;
    showPhone: boolean;
    showEmail: boolean;
    navigationStyle: string;
    headerText?: string;
  };
  footer: {
    copyrightText: string;
    showSocial: boolean;
    showContact: boolean;
    footerText?: string;
    columns: {
      aboutUs: string;
      quickLinks: string[];
      services: string[];
    };
  };
}

const defaultSettings: SiteSettings = {
  branding: {
    siteName: "IndustrialCo",
    tagline: "Your Industrial Solutions Partner",
    description: "Leading provider of industrial equipment and solutions for modern manufacturing."
  },
  contact: {
    email: "contact@industrialco.com",
    phone: "+1 (555) 123-4567",
    address: "123 Industrial Avenue",
    city: "Manufacturing City",
    state: "State",
    zipCode: "12345",
    country: "United States"
  },
  theme: {
    primaryColor: "#1E40AF",
    secondaryColor: "#64748B",
    accentColor: "#F97316",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    headerBg: "#FFFFFF",
    footerBg: "#1F2937"
  },
  social: {},
  seo: {
    metaTitle: "IndustrialCo - Industrial Solutions & Equipment",
    metaDescription: "Leading provider of industrial equipment, heavy machinery, and professional tools for manufacturing and construction.",
    keywords: "industrial equipment, manufacturing, heavy machinery, tools, construction"
  },
  features: {
    enableBlog: false,
    enableComments: false,
    enableNewsletter: true,
    enableSearch: true,
    enableDarkMode: false
  },
  header: {
    showLogo: true,
    showPhone: true,
    showEmail: true,
    navigationStyle: "horizontal"
  },
  footer: {
    copyrightText: "© 2024 IndustrialCo. All rights reserved.",
    showSocial: true,
    showContact: true,
    columns: {
      aboutUs: "IndustrialCo is your trusted partner for industrial solutions and equipment.",
      quickLinks: ["Home", "Products", "About", "Contact"],
      services: ["Heavy Machinery", "Industrial Tools", "Safety Equipment", "Spare Parts"]
    }
  }
};

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Fetch current theme settings
      const themeResponse = await fetch("/api/content/theme", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch homepage content for site info
      const homepageResponse = await fetch("/api/homepage", {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (themeResponse.ok) {
        const themeData = await themeResponse.json();
        if (themeData.colors && themeData.branding) {
          setSettings(prev => ({
            ...prev,
            theme: {
              primaryColor: themeData.colors.primary || prev.theme.primaryColor,
              secondaryColor: themeData.colors.secondary || prev.theme.secondaryColor,
              accentColor: themeData.colors.accent || prev.theme.accentColor,
              backgroundColor: themeData.colors.background || prev.theme.backgroundColor,
              textColor: themeData.colors.text || prev.theme.textColor,
              headerBg: themeData.colors.background || prev.theme.headerBg,
              footerBg: themeData.colors.industrialDark || prev.theme.footerBg
            },
            branding: {
              ...prev.branding,
              siteName: themeData.branding.companyName || prev.branding.siteName,
              tagline: themeData.branding.tagline || prev.branding.tagline,
              logo: themeData.branding.logo || prev.branding.logo,
              favicon: themeData.branding.favicon || prev.branding.favicon
            }
          }));
        }
      }

      if (homepageResponse.ok) {
        const homepageData = await homepageResponse.json();
        setSettings(prev => ({
          ...prev,
          branding: {
            ...prev.branding,
            description: homepageData.heroBanner?.description || prev.branding.description
          }
        }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');

      // Save theme settings
      const themeData = {
        colors: {
          primary: settings.theme.primaryColor,
          secondary: settings.theme.secondaryColor,
          accent: settings.theme.accentColor,
          background: settings.theme.backgroundColor,
          text: settings.theme.textColor,
          industrialBlue: settings.theme.primaryColor,
          industrialOrange: settings.theme.accentColor,
          industrialGray: settings.theme.secondaryColor,
          industrialLightGray: "#F1F5F9",
          industrialDark: settings.theme.footerBg
        },
        branding: {
          companyName: settings.branding.siteName,
          tagline: settings.branding.tagline,
          logo: settings.branding.logo,
          favicon: settings.branding.favicon
        },
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
          darkModeEnabled: settings.features.enableDarkMode,
          animationsEnabled: true,
          compactMode: false
        }
      };

      const themeResponse = await fetch("/api/content/theme", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(themeData)
      });

      // Save site settings (you could create a new API endpoint for this)
      const settingsResponse = await fetch("/api/content/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (themeResponse.ok) {
        // Apply theme immediately to current page
        applyThemeToCurrentPage();
        
        toast({
          title: "Success",
          description: "Site settings saved and applied successfully!"
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save site settings",
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
    Object.entries(settings.theme).forEach(([key, value]) => {
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
          setSettings(prev => ({
            ...prev,
            branding: {
              ...prev.branding,
              [imageType]: imageUrl
            }
          }));
        } else if (imageType === 'ogImage') {
          setSettings(prev => ({
            ...prev,
            seo: {
              ...prev.seo,
              ogImage: imageUrl
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

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    toast({
      title: "Reset",
      description: "Settings reset to default values"
    });
  };

  const previewSite = () => {
    window.open("/", "_blank");
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-industrial-light-gray py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <Shield className="h-8 w-8 mx-auto mb-2" />
              <h2 className="text-xl font-bold mb-2">Access Denied</h2>
              <p>You need administrator privileges to access site settings.</p>
            </div>
            <Link to="/admin">
              <Button variant="outline" className="border-industrial-blue text-industrial-blue hover:bg-industrial-blue hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-industrial-light-gray py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Settings className="h-16 w-16 text-industrial-blue mx-auto mb-4 animate-pulse" />
            <div className="text-xl text-industrial-gray">Loading site settings...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-industrial-light-gray py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center bg-industrial-blue text-white rounded-full px-4 py-2 mb-4">
                <Settings className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Site Settings</span>
              </div>
              <h1 className="text-4xl font-bold text-industrial-dark mb-2">Website Configuration</h1>
              <p className="text-industrial-gray">Customize your site's branding, theme, and global settings</p>
            </div>
            <div className="flex space-x-3">
              <Link to="/admin">
                <Button variant="outline" className="border-industrial-blue text-industrial-blue hover:bg-industrial-blue hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Admin
                </Button>
              </Link>
              <Button variant="outline" onClick={resetToDefaults}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" onClick={previewSite}>
                <Eye className="h-4 w-4 mr-2" />
                Preview Site
              </Button>
              <Button onClick={saveSettings} disabled={saving} className="bg-industrial-blue hover:bg-blue-600">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="branding" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="branding" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="h-5 w-5 mr-2" />
                    Site Branding
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={settings.branding.siteName}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          branding: { ...prev.branding, siteName: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={settings.branding.tagline}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          branding: { ...prev.branding, tagline: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Site Description</Label>
                    <Textarea
                      id="description"
                      value={settings.branding.description}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        branding: { ...prev.branding, description: e.target.value }
                      }))}
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Brand Assets</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: 'logo', label: 'Site Logo', description: 'Main website logo (200x80px recommended)' },
                        { key: 'favicon', label: 'Favicon', description: 'Browser tab icon (32x32px recommended)' }
                      ].map(({ key, label, description }) => (
                        <div key={key}>
                          <Label className="text-base font-medium">{label}</Label>
                          <p className="text-sm text-gray-600 mb-3">{description}</p>
                          
                          <div className="border rounded-lg p-4">
                            {settings.branding[key as keyof typeof settings.branding] ? (
                              <div className="space-y-3">
                                <img 
                                  src={settings.branding[key as keyof typeof settings.branding] as string}
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
                                    onClick={() => setSettings(prev => ({
                                      ...prev,
                                      branding: { ...prev.branding, [key]: undefined }
                                    }))}
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

            <TabsContent value="theme" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Theme Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(settings.theme).map(([key, value]) => (
                      <div key={key}>
                        <Label htmlFor={key} className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </Label>
                        <div className="flex space-x-2">
                          <Input
                            type="color"
                            value={value}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              theme: { ...prev.theme, [key]: e.target.value }
                            }))}
                            className="w-16 h-10"
                          />
                          <Input
                            value={value}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              theme: { ...prev.theme, [key]: e.target.value }
                            }))}
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
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                      {Object.entries(settings.theme).map(([key, value]) => (
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

            <TabsContent value="contact" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          value={settings.contact.email}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            contact: { ...prev.contact, email: e.target.value }
                          }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="phone"
                          value={settings.contact.phone}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            contact: { ...prev.contact, phone: e.target.value }
                          }))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="address"
                        value={settings.contact.address}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          contact: { ...prev.contact, address: e.target.value }
                        }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={settings.contact.city}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          contact: { ...prev.contact, city: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={settings.contact.state}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          contact: { ...prev.contact, state: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        value={settings.contact.zipCode}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          contact: { ...prev.contact, zipCode: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={settings.contact.country}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          contact: { ...prev.contact, country: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Header & Footer Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Header Display</h4>
                        {Object.entries({
                          showLogo: "Show Logo",
                          showPhone: "Show Phone Number",
                          showEmail: "Show Email Address"
                        }).map(([key, label]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Switch
                              checked={settings.header[key as keyof typeof settings.header] as boolean}
                              onCheckedChange={(checked) => setSettings(prev => ({
                                ...prev,
                                header: { ...prev.header, [key]: checked }
                              }))}
                            />
                            <Label>{label}</Label>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Footer Display</h4>
                        {Object.entries({
                          showSocial: "Show Social Media Links",
                          showContact: "Show Contact Information"
                        }).map(([key, label]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Switch
                              checked={settings.footer[key as keyof typeof settings.footer] as boolean}
                              onCheckedChange={(checked) => setSettings(prev => ({
                                ...prev,
                                footer: { ...prev.footer, [key]: checked }
                              }))}
                            />
                            <Label>{label}</Label>
                          </div>
                        ))}
                        
                        <div>
                          <Label htmlFor="copyrightText">Copyright Text</Label>
                          <Input
                            id="copyrightText"
                            value={settings.footer.copyrightText}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              footer: { ...prev.footer, copyrightText: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Social Media Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
                      { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/yourhandle' },
                      { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/yourprofile' },
                      { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/company/yourcompany' },
                      { key: 'youtube', label: 'YouTube', icon: Globe, placeholder: 'https://youtube.com/c/yourchannel' }
                    ].map(({ key, label, icon: Icon, placeholder }) => (
                      <div key={key}>
                        <Label htmlFor={key}>{label}</Label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id={key}
                            type="url"
                            value={settings.social[key as keyof typeof settings.social] || ""}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              social: { ...prev.social, [key]: e.target.value }
                            }))}
                            placeholder={placeholder}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    SEO Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={settings.seo.metaTitle}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        seo: { ...prev.seo, metaTitle: e.target.value }
                      }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                  </div>

                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={settings.seo.metaDescription}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        seo: { ...prev.seo, metaDescription: e.target.value }
                      }))}
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                  </div>

                  <div>
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      value={settings.seo.keywords}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        seo: { ...prev.seo, keywords: e.target.value }
                      }))}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium">Open Graph Image</Label>
                    <p className="text-sm text-gray-600 mb-3">Image for social media sharing (1200x630px recommended)</p>
                    
                    <div className="border rounded-lg p-4">
                      {settings.seo.ogImage ? (
                        <div className="space-y-3">
                          <img 
                            src={settings.seo.ogImage}
                            alt="Open Graph"
                            className="max-w-full h-32 object-cover border rounded"
                          />
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleImageUpload('ogImage')}
                              disabled={uploading === 'ogImage'}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              {uploading === 'ogImage' ? 'Uploading...' : 'Replace'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSettings(prev => ({
                                ...prev,
                                seo: { ...prev.seo, ogImage: undefined }
                              }))}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <Button 
                            onClick={() => handleImageUpload('ogImage')}
                            disabled={uploading === 'ogImage'}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploading === 'ogImage' ? 'Uploading...' : 'Upload OG Image'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Site Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries({
                      enableBlog: "Enable Blog Section",
                      enableComments: "Enable Comments",
                      enableNewsletter: "Enable Newsletter Signup",
                      enableSearch: "Enable Site Search",
                      enableDarkMode: "Enable Dark Mode"
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label className="font-medium">{label}</Label>
                          <p className="text-sm text-gray-600">
                            {key === 'enableBlog' && 'Add a blog section to your website'}
                            {key === 'enableComments' && 'Allow visitors to leave comments'}
                            {key === 'enableNewsletter' && 'Show newsletter signup forms'}
                            {key === 'enableSearch' && 'Add search functionality to the site'}
                            {key === 'enableDarkMode' && 'Allow users to switch to dark theme'}
                          </p>
                        </div>
                        <Switch
                          checked={settings.features[key as keyof typeof settings.features]}
                          onCheckedChange={(checked) => setSettings(prev => ({
                            ...prev,
                            features: { ...prev.features, [key]: checked }
                          }))}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
