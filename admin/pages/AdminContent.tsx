import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  FileText, 
  Home,
  Phone,
  Mail,
  Users,
  Tag,
  Settings,
  Eye,
  Plus,
  Trash2
} from "lucide-react";
import { AboutContent, ContactContent, CategoriesContent, FooterContent, HeaderContent, SiteSettings } from "@shared/content";

export default function AdminContent() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [categoriesContent, setCategoriesContent] = useState<CategoriesContent | null>(null);
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null);
  const [headerContent, setHeaderContent] = useState<HeaderContent | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      const [aboutRes, contactRes, categoriesRes, footerRes, headerRes, settingsRes] = await Promise.all([
        fetch("/api/content/about"),
        fetch("/api/content/contact"),
        fetch("/api/content/categories"),
        fetch("/api/content/footer"),
        fetch("/api/content/header"),
        fetch("/api/content/settings")
      ]);

      if (aboutRes.ok) setAboutContent(await aboutRes.json());
      if (contactRes.ok) setContactContent(await contactRes.json());
      if (categoriesRes.ok) setCategoriesContent(await categoriesRes.json());
      if (footerRes.ok) setFooterContent(await footerRes.json());
      if (headerRes.ok) setHeaderContent(await headerRes.json());
      if (settingsRes.ok) setSiteSettings(await settingsRes.json());
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (type: string, content: any) => {
    setSaving(type);
    try {
      const response = await fetch(`/api/content/${type}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });

      if (response.ok) {
        const updated = await response.json();
        switch (type) {
          case "about":
            setAboutContent(updated);
            break;
          case "contact":
            setContactContent(updated);
            break;
          case "categories":
            setCategoriesContent(updated);
            break;
          case "footer":
            setFooterContent(updated);
            break;
          case "header":
            setHeaderContent(updated);
            break;
          case "settings":
            setSiteSettings(updated);
            break;
        }
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} content saved successfully!`);
      }
    } catch (error) {
      console.error(`Error saving ${type} content:`, error);
      alert(`Error saving ${type} content`);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <Button variant="outline" onClick={() => window.open("/", "_blank")}>
          <Eye className="h-4 w-4 mr-2" />
          Preview Site
        </Button>
      </div>

      <Tabs defaultValue="about" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="contact">Contact Page</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>

        {/* About Page Content */}
        <TabsContent value="about">
          {aboutContent && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    About Page Hero Section
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={aboutContent.hero.title}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          hero: { ...aboutContent.hero, title: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input
                        value={aboutContent.hero.subtitle}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          hero: { ...aboutContent.hero, subtitle: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={aboutContent.hero.description}
                      onChange={(e) => setAboutContent({
                        ...aboutContent,
                        hero: { ...aboutContent.hero, description: e.target.value }
                      })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Button Text</Label>
                      <Input
                        value={aboutContent.hero.primaryButtonText}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          hero: { ...aboutContent.hero, primaryButtonText: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Primary Button Link</Label>
                      <Input
                        value={aboutContent.hero.primaryButtonLink}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          hero: { ...aboutContent.hero, primaryButtonLink: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => saveContent("about", aboutContent)}
                    disabled={saving === "about"}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving === "about" ? "Saving..." : "Save About Content"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Company Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Clients</Label>
                      <Input
                        value={aboutContent.stats.clients}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          stats: { ...aboutContent.stats, clients: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Countries</Label>
                      <Input
                        value={aboutContent.stats.countries}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          stats: { ...aboutContent.stats, countries: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Products</Label>
                      <Input
                        value={aboutContent.stats.products}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          stats: { ...aboutContent.stats, products: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Experience</Label>
                      <Input
                        value={aboutContent.stats.experience}
                        onChange={(e) => setAboutContent({
                          ...aboutContent,
                          stats: { ...aboutContent.stats, experience: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Contact Page Content */}
        <TabsContent value="contact">
          {contactContent && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Contact Page Hero
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={contactContent.hero.title}
                        onChange={(e) => setContactContent({
                          ...contactContent,
                          hero: { ...contactContent.hero, title: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input
                        value={contactContent.hero.subtitle}
                        onChange={(e) => setContactContent({
                          ...contactContent,
                          hero: { ...contactContent.hero, subtitle: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={contactContent.hero.description}
                      onChange={(e) => setContactContent({
                        ...contactContent,
                        hero: { ...contactContent.hero, description: e.target.value }
                      })}
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={() => saveContent("contact", contactContent)}
                    disabled={saving === "contact"}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving === "contact" ? "Saving..." : "Save Contact Content"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Categories Content */}
        <TabsContent value="categories">
          {categoriesContent && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Categories Page Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Page Title</Label>
                      <Input
                        value={categoriesContent.hero.title}
                        onChange={(e) => setCategoriesContent({
                          ...categoriesContent,
                          hero: { ...categoriesContent.hero, title: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input
                        value={categoriesContent.hero.subtitle}
                        onChange={(e) => setCategoriesContent({
                          ...categoriesContent,
                          hero: { ...categoriesContent.hero, subtitle: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={categoriesContent.hero.description}
                      onChange={(e) => setCategoriesContent({
                        ...categoriesContent,
                        hero: { ...categoriesContent.hero, description: e.target.value }
                      })}
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={() => saveContent("categories", categoriesContent)}
                    disabled={saving === "categories"}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving === "categories" ? "Saving..." : "Save Categories Content"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Header Content */}
        <TabsContent value="header">
          {headerContent && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Header Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        value={headerContent.company.name}
                        onChange={(e) => setHeaderContent({
                          ...headerContent,
                          company: { ...headerContent.company, name: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tagline</Label>
                      <Input
                        value={headerContent.company.tagline}
                        onChange={(e) => setHeaderContent({
                          ...headerContent,
                          company: { ...headerContent.company, tagline: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={headerContent.topBar.phone}
                        onChange={(e) => setHeaderContent({
                          ...headerContent,
                          topBar: { ...headerContent.topBar, phone: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        value={headerContent.topBar.email}
                        onChange={(e) => setHeaderContent({
                          ...headerContent,
                          topBar: { ...headerContent.topBar, email: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => saveContent("header", headerContent)}
                    disabled={saving === "header"}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving === "header" ? "Saving..." : "Save Header Content"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Footer Content */}
        <TabsContent value="footer">
          {footerContent && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Footer Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        value={footerContent.company.name}
                        onChange={(e) => setFooterContent({
                          ...footerContent,
                          company: { ...footerContent.company, name: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tagline</Label>
                      <Input
                        value={footerContent.company.tagline}
                        onChange={(e) => setFooterContent({
                          ...footerContent,
                          company: { ...footerContent.company, tagline: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Company Description</Label>
                    <Textarea
                      value={footerContent.company.description}
                      onChange={(e) => setFooterContent({
                        ...footerContent,
                        company: { ...footerContent.company, description: e.target.value }
                      })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Copyright Text</Label>
                    <Input
                      value={footerContent.legal.copyright}
                      onChange={(e) => setFooterContent({
                        ...footerContent,
                        legal: { ...footerContent.legal, copyright: e.target.value }
                      })}
                    />
                  </div>
                  <Button 
                    onClick={() => saveContent("footer", footerContent)}
                    disabled={saving === "footer"}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving === "footer" ? "Saving..." : "Save Footer Content"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Site Settings */}
        <TabsContent value="settings">
          {siteSettings && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    General Site Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Site Name</Label>
                      <Input
                        value={siteSettings.general.siteName}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          general: { ...siteSettings.general, siteName: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <Input
                        type="color"
                        value={siteSettings.general.primaryColor}
                        onChange={(e) => setSiteSettings({
                          ...siteSettings,
                          general: { ...siteSettings.general, primaryColor: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Site Description</Label>
                    <Textarea
                      value={siteSettings.general.siteDescription}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        general: { ...siteSettings.general, siteDescription: e.target.value }
                      })}
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={() => saveContent("settings", siteSettings)}
                    disabled={saving === "settings"}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving === "settings" ? "Saving..." : "Save Site Settings"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
