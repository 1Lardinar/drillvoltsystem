import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Palette,
  Type,
  Layout,
  Monitor,
  Save,
  RotateCcw,
  Eye,
  Upload,
  ImageIcon,
  Download,
  Sparkles,
  Wand2,
  Brush,
  Settings
} from "lucide-react";

interface ThemeSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
    industrialBlue: string;
    industrialOrange: string;
    industrialGray: string;
    industrialLightGray: string;
    industrialDark: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: {
      base: string;
      heading: string;
      small: string;
      large: string;
    };
    fontWeight: {
      normal: string;
      bold: string;
    };
    lineHeight: {
      normal: string;
      relaxed: string;
    };
  };
  layout: {
    maxWidth: string;
    borderRadius: string;
    spacing: string;
    headerHeight: string;
    footerHeight: string;
  };
  branding: {
    logo?: string;
    favicon?: string;
    companyName: string;
    tagline?: string;
    heroImage?: string;
    aboutImage?: string;
  };
  preferences: {
    darkModeEnabled: boolean;
    animationsEnabled: boolean;
    compactMode: boolean;
  };
}

const industrialTheme: ThemeSettings = {
  colors: {
    primary: "#1E40AF",
    secondary: "#64748B", 
    accent: "#F97316",
    background: "#FFFFFF",
    text: "#1F2937",
    muted: "#6B7280",
    industrialBlue: "#1E40AF",
    industrialOrange: "#F97316",
    industrialGray: "#64748B",
    industrialLightGray: "#F1F5F9",
    industrialDark: "#1E293B"
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    fontSize: {
      base: "16px",
      heading: "32px",
      small: "14px",
      large: "18px"
    },
    fontWeight: {
      normal: "400",
      bold: "600"
    },
    lineHeight: {
      normal: "1.5",
      relaxed: "1.7"
    }
  },
  layout: {
    maxWidth: "1200px",
    borderRadius: "8px",
    spacing: "1rem",
    headerHeight: "80px",
    footerHeight: "120px"
  },
  branding: {
    companyName: "IndustrialCo",
    tagline: "Your Industrial Solutions Partner"
  },
  preferences: {
    darkModeEnabled: false,
    animationsEnabled: true,
    compactMode: false
  }
};

const modernTheme: ThemeSettings = {
  colors: {
    primary: "#3B82F6",
    secondary: "#8B5CF6", 
    accent: "#EF4444",
    background: "#FFFFFF",
    text: "#111827",
    muted: "#6B7280",
    industrialBlue: "#3B82F6",
    industrialOrange: "#F59E0B",
    industrialGray: "#6B7280",
    industrialLightGray: "#F9FAFB",
    industrialDark: "#111827"
  },
  typography: {
    headingFont: "Poppins",
    bodyFont: "Inter",
    fontSize: {
      base: "16px",
      heading: "36px",
      small: "14px",
      large: "20px"
    },
    fontWeight: {
      normal: "400",
      bold: "700"
    },
    lineHeight: {
      normal: "1.6",
      relaxed: "1.8"
    }
  },
  layout: {
    maxWidth: "1280px",
    borderRadius: "12px",
    spacing: "1.5rem",
    headerHeight: "72px",
    footerHeight: "100px"
  },
  branding: {
    companyName: "ModernCorp",
    tagline: "Innovation at Its Best"
  },
  preferences: {
    darkModeEnabled: false,
    animationsEnabled: true,
    compactMode: false
  }
};

const fontOptions = [
  { value: "Inter", label: "Inter (Recommended)" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
  { value: "Nunito", label: "Nunito" },
  { value: "Raleway", label: "Raleway" },
  { value: "Work Sans", label: "Work Sans" }
];

const presetThemes = [
  { name: "Industrial", theme: industrialTheme, description: "Professional industrial design" },
  { name: "Modern", theme: modernTheme, description: "Clean and contemporary" }
];

export default function AdminTheme() {
  const [theme, setTheme] = useState<ThemeSettings>(industrialTheme);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch("/api/content/theme", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTheme({ ...industrialTheme, ...data });
      } else {
        setTheme(industrialTheme);
      }
    } catch (error) {
      console.error("Error fetching theme:", error);
      setTheme(industrialTheme);
    } finally {
      setLoading(false);
    }
  };

  const saveTheme = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch("/api/content/theme", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(theme)
      });

      if (response.ok) {
        // Apply theme to CSS variables
        applyThemeToCSS();
        toast({
          title: "Success",
          description: "Theme settings saved and applied successfully"
        });
      } else {
        throw new Error("Failed to save theme");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save theme settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const applyThemeToCSS = () => {
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

    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (value.startsWith('#')) {
        const hslValue = hexToHsl(value);
        root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, hslValue);
      }
    });

    // Apply other theme properties
    root.style.setProperty('--radius', theme.layout.borderRadius);
    
    // Apply fonts
    document.body.style.fontFamily = theme.typography.bodyFont;
  };

  const uploadImage = async (imageType: keyof ThemeSettings['branding'], file: File) => {
    setUploadingImage(imageType);
    
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
        
        setTheme({
          ...theme,
          branding: {
            ...theme.branding,
            [imageType]: imageUrl
          }
        });

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
      setUploadingImage(null);
    }
  };

  const handleImageUpload = (imageType: keyof ThemeSettings['branding']) => {
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

  const applyPresetTheme = (presetTheme: ThemeSettings) => {
    setTheme(presetTheme);
    toast({
      title: "Theme Applied",
      description: "Preset theme has been applied. Don't forget to save!"
    });
  };

  const resetToDefault = () => {
    setTheme(industrialTheme);
    toast({
      title: "Reset",
      description: "Theme reset to default industrial settings"
    });
  };

  const exportTheme = () => {
    const themeJson = JSON.stringify(theme, null, 2);
    const blob = new Blob([themeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Palette className="h-16 w-16 text-industrial-blue mx-auto mb-4 animate-pulse" />
          <div className="text-xl text-industrial-gray">Loading theme settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-industrial-dark">Theme Management</h1>
          <p className="text-industrial-gray mt-1">Customize your website's appearance, colors, fonts, and branding</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={exportTheme}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" onClick={() => applyThemeToCSS()}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={saveTheme} disabled={saving} className="bg-industrial-blue hover:bg-blue-600">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Preset Themes */}
      <Card className="mb-8 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Preset Themes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presetThemes.map((preset, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" 
                   onClick={() => applyPresetTheme(preset.theme)}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-industrial-dark">{preset.name}</h3>
                  <Button size="sm" variant="outline">
                    <Wand2 className="h-4 w-4 mr-1" />
                    Apply
                  </Button>
                </div>
                <p className="text-sm text-industrial-gray mb-3">{preset.description}</p>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.theme.colors.primary }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.theme.colors.accent }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.theme.colors.secondary }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Color Scheme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Colors */}
              <div>
                <h3 className="text-lg font-medium mb-4">Primary Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['primary', 'secondary', 'accent', 'background', 'text', 'muted'].map((colorKey) => (
                    <div key={colorKey}>
                      <Label htmlFor={colorKey} className="capitalize">{colorKey} Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id={colorKey}
                          type="color"
                          value={theme.colors[colorKey as keyof typeof theme.colors]}
                          onChange={(e) => setTheme({
                            ...theme,
                            colors: { ...theme.colors, [colorKey]: e.target.value }
                          })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={theme.colors[colorKey as keyof typeof theme.colors]}
                          onChange={(e) => setTheme({
                            ...theme,
                            colors: { ...theme.colors, [colorKey]: e.target.value }
                          })}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Industrial Colors */}
              <div>
                <h3 className="text-lg font-medium mb-4">Industrial Theme Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['industrialBlue', 'industrialOrange', 'industrialGray', 'industrialLightGray', 'industrialDark'].map((colorKey) => (
                    <div key={colorKey}>
                      <Label htmlFor={colorKey} className="capitalize">
                        {colorKey.replace('industrial', 'Industrial ')}
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id={colorKey}
                          type="color"
                          value={theme.colors[colorKey as keyof typeof theme.colors]}
                          onChange={(e) => setTheme({
                            ...theme,
                            colors: { ...theme.colors, [colorKey]: e.target.value }
                          })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={theme.colors[colorKey as keyof typeof theme.colors]}
                          onChange={(e) => setTheme({
                            ...theme,
                            colors: { ...theme.colors, [colorKey]: e.target.value }
                          })}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Color Preview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Object.entries(theme.colors).map(([key, value]) => (
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

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Type className="h-5 w-5 mr-2" />
                Typography Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="headingFont">Heading Font</Label>
                  <Select 
                    value={theme.typography.headingFont} 
                    onValueChange={(value) => setTheme({
                      ...theme,
                      typography: { ...theme.typography, headingFont: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bodyFont">Body Font</Label>
                  <Select 
                    value={theme.typography.bodyFont} 
                    onValueChange={(value) => setTheme({
                      ...theme,
                      typography: { ...theme.typography, bodyFont: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(theme.typography.fontSize).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={`fontSize-${key}`} className="capitalize">{key} Size</Label>
                    <Input
                      id={`fontSize-${key}`}
                      value={value}
                      onChange={(e) => setTheme({
                        ...theme,
                        typography: { 
                          ...theme.typography, 
                          fontSize: { ...theme.typography.fontSize, [key]: e.target.value }
                        }
                      })}
                      placeholder="16px"
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Typography Preview</h3>
                <div className="space-y-4 p-6 border rounded-lg bg-gray-50">
                  <h1 
                    style={{ 
                      fontFamily: theme.typography.headingFont,
                      fontSize: theme.typography.fontSize.heading,
                      color: theme.colors.text,
                      fontWeight: theme.typography.fontWeight.bold
                    }}
                  >
                    Sample Heading Text
                  </h1>
                  <h2 
                    style={{ 
                      fontFamily: theme.typography.headingFont,
                      fontSize: theme.typography.fontSize.large,
                      color: theme.colors.text,
                      fontWeight: theme.typography.fontWeight.bold
                    }}
                  >
                    Secondary Heading
                  </h2>
                  <p 
                    style={{ 
                      fontFamily: theme.typography.bodyFont,
                      fontSize: theme.typography.fontSize.base,
                      color: theme.colors.text,
                      lineHeight: theme.typography.lineHeight.normal
                    }}
                  >
                    This is sample body text that demonstrates how your chosen typography will appear on your website. 
                    You can adjust the font families, sizes, and other properties to match your brand identity.
                  </p>
                  <p 
                    style={{ 
                      fontFamily: theme.typography.bodyFont,
                      fontSize: theme.typography.fontSize.small,
                      color: theme.colors.muted,
                      lineHeight: theme.typography.lineHeight.relaxed
                    }}
                  >
                    This is smaller, muted text for captions and secondary information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="h-5 w-5 mr-2" />
                Layout Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(theme.layout).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={key} className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </Label>
                    <Input
                      id={key}
                      value={value}
                      onChange={(e) => setTheme({
                        ...theme,
                        layout: { ...theme.layout, [key]: e.target.value }
                      })}
                      placeholder={key === 'maxWidth' ? '1200px' : key === 'borderRadius' ? '8px' : '1rem'}
                    />
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
                Brand Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={theme.branding.companyName}
                    onChange={(e) => setTheme({
                      ...theme,
                      branding: { ...theme.branding, companyName: e.target.value }
                    })}
                    placeholder="IndustrialCo"
                  />
                </div>

                <div>
                  <Label htmlFor="tagline">Tagline (Optional)</Label>
                  <Input
                    id="tagline"
                    value={theme.branding.tagline || ""}
                    onChange={(e) => setTheme({
                      ...theme,
                      branding: { ...theme.branding, tagline: e.target.value }
                    })}
                    placeholder="Your Industrial Solutions Partner"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <h3 className="text-lg font-medium">Brand Images</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'logo', label: 'Logo', description: 'Main company logo (recommended: 200x80px)' },
                    { key: 'favicon', label: 'Favicon', description: 'Browser tab icon (recommended: 32x32px)' },
                    { key: 'heroImage', label: 'Hero Image', description: 'Homepage banner image (recommended: 1200x600px)' },
                    { key: 'aboutImage', label: 'About Image', description: 'About page featured image (recommended: 800x600px)' }
                  ].map(({ key, label, description }) => (
                    <div key={key}>
                      <Label className="text-base font-medium">{label}</Label>
                      <p className="text-sm text-gray-600 mb-3">{description}</p>
                      
                      <div className="border rounded-lg p-4">
                        {theme.branding[key as keyof typeof theme.branding] ? (
                          <div className="space-y-3">
                            <img 
                              src={theme.branding[key as keyof typeof theme.branding] as string}
                              alt={label}
                              className="max-w-full h-32 object-contain border rounded"
                            />
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleImageUpload(key as keyof typeof theme.branding)}
                                disabled={uploadingImage === key}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                {uploadingImage === key ? 'Uploading...' : 'Replace'}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setTheme({
                                  ...theme,
                                  branding: { ...theme.branding, [key]: undefined }
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
                              onClick={() => handleImageUpload(key as keyof typeof theme.branding)}
                              disabled={uploadingImage === key}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {uploadingImage === key ? 'Uploading...' : `Upload ${label}`}
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

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                User Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Dark Mode Support</Label>
                    <p className="text-sm text-gray-600">Enable dark mode theme switching</p>
                  </div>
                  <Switch
                    checked={theme.preferences.darkModeEnabled}
                    onCheckedChange={(checked) => setTheme({
                      ...theme,
                      preferences: { ...theme.preferences, darkModeEnabled: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Animations</Label>
                    <p className="text-sm text-gray-600">Enable smooth transitions and animations</p>
                  </div>
                  <Switch
                    checked={theme.preferences.animationsEnabled}
                    onCheckedChange={(checked) => setTheme({
                      ...theme,
                      preferences: { ...theme.preferences, animationsEnabled: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Compact Mode</Label>
                    <p className="text-sm text-gray-600">Reduce spacing for more content density</p>
                  </div>
                  <Switch
                    checked={theme.preferences.compactMode}
                    onCheckedChange={(checked) => setTheme({
                      ...theme,
                      preferences: { ...theme.preferences, compactMode: checked }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
