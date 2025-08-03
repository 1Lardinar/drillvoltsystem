import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Shield, Globe, Mail, Database } from "lucide-react";

interface SiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    logo: string;
    favicon: string;
    primaryColor: string;
    secondaryColor: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
    ogImage: string;
  };
  maintenance: {
    enabled: boolean;
    message: string;
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/content/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch("/api/content/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings saved successfully"
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
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
          <Settings className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
          <div className="text-xl text-gray-700">Loading settings...</div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <div className="text-xl text-gray-700">Failed to load settings</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteName: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={settings.general.logo}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, logo: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteDescription: e.target.value }
                  })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      value={settings.general.primaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, primaryColor: e.target.value }
                      })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.general.primaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, primaryColor: e.target.value }
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      value={settings.general.secondaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, secondaryColor: e.target.value }
                      })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.general.secondaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, secondaryColor: e.target.value }
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="defaultTitle">Default Page Title</Label>
                <Input
                  id="defaultTitle"
                  value={settings.seo.defaultTitle}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: { ...settings.seo, defaultTitle: e.target.value }
                  })}
                />
              </div>

              <div>
                <Label htmlFor="defaultDescription">Default Meta Description</Label>
                <Textarea
                  id="defaultDescription"
                  value={settings.seo.defaultDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: { ...settings.seo, defaultDescription: e.target.value }
                  })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                <Input
                  id="keywords"
                  value={settings.seo.keywords.join(', ')}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: { 
                      ...settings.seo, 
                      keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                    }
                  })}
                />
              </div>

              <div>
                <Label htmlFor="ogImage">Open Graph Image URL</Label>
                <Input
                  id="ogImage"
                  value={settings.seo.ogImage}
                  onChange={(e) => setSettings({
                    ...settings,
                    seo: { ...settings.seo, ogImage: e.target.value }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Maintenance Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenance"
                  checked={settings.maintenance.enabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    maintenance: { ...settings.maintenance, enabled: checked }
                  })}
                />
                <Label htmlFor="maintenance">Enable Maintenance Mode</Label>
              </div>

              <div>
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={settings.maintenance.message}
                  onChange={(e) => setSettings({
                    ...settings,
                    maintenance: { ...settings.maintenance, message: e.target.value }
                  })}
                  rows={3}
                  placeholder="We're currently performing maintenance. Please check back soon."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 text-blue-800 rounded">
                <h4 className="font-semibold mb-2">Security Status</h4>
                <p className="text-sm">
                  Your platform is secured with authentication and admin role-based access control.
                  All sensitive operations require authentication.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Session Timeout</span>
                  <span className="text-sm font-medium">24 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Password Requirements</span>
                  <span className="text-sm font-medium">Basic</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">API Authentication</span>
                  <span className="text-sm font-medium text-green-600">Enabled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Admin Role Required</span>
                  <span className="text-sm font-medium text-green-600">Yes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
