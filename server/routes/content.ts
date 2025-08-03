import { RequestHandler } from "express";
import { 
  AboutContent, 
  ContactContent, 
  CategoriesContent, 
  FooterContent, 
  HeaderContent, 
  SiteSettings,
  UpdateAboutContentRequest,
  UpdateContactContentRequest,
  UpdateCategoriesContentRequest,
  UpdateFooterContentRequest,
  UpdateHeaderContentRequest,
  UpdateSiteSettingsRequest
} from "@shared/content";
import fs from "fs/promises";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "data", "content");

// Ensure content directory exists
async function ensureContentDir() {
  try {
    await fs.access(CONTENT_DIR);
  } catch {
    await fs.mkdir(CONTENT_DIR, { recursive: true });
  }
}

// Generic content loader
async function loadContent<T>(filename: string, defaultContent: T): Promise<T> {
  try {
    await ensureContentDir();
    const filePath = path.join(CONTENT_DIR, filename);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    await saveContent(filename, defaultContent);
    return defaultContent;
  }
}

// Generic content saver
async function saveContent<T>(filename: string, content: T): Promise<void> {
  await ensureContentDir();
  const filePath = path.join(CONTENT_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(content, null, 2));
}

// Default content
const getDefaultAboutContent = (): AboutContent => ({
  id: "about",
  hero: {
    title: "Built on Trust, Powered by Innovation",
    subtitle: "About IndustrialCo",
    description: "For over 25 years, IndustrialCo has been the trusted partner for manufacturing, construction, and industrial operations worldwide.",
    primaryButtonText: "Get in Touch",
    primaryButtonLink: "/contact",
    secondaryButtonText: "View Our Products",
    secondaryButtonLink: "/products"
  },
  stats: {
    clients: "2,500+",
    countries: "45+",
    products: "10,000+",
    experience: "25+"
  },
  values: [
    { icon: "Shield", title: "Safety First", description: "We prioritize safety in every product and service we provide." },
    { icon: "Award", title: "Quality Excellence", description: "Our commitment to quality drives continuous improvement." },
    { icon: "Users", title: "Customer Focus", description: "We build lasting partnerships by exceeding expectations." },
    { icon: "Globe", title: "Global Reach", description: "Consistent service and support across all markets." }
  ],
  milestones: [
    { year: "1999", title: "Company Founded", description: "Started as a small industrial equipment supplier" },
    { year: "2005", title: "International Expansion", description: "Opened first overseas office in Europe" },
    { year: "2012", title: "ISO Certification", description: "Achieved ISO 9001 and safety certifications" },
    { year: "2018", title: "Digital Transformation", description: "Launched e-commerce platform and digital services" },
    { year: "2024", title: "Sustainability Focus", description: "Leading green industrial solutions initiative" }
  ],
  team: [
    { name: "John Smith", role: "CEO", description: "25+ years in industrial manufacturing", image: "/api/placeholder/300/300" },
    { name: "Sarah Johnson", role: "CTO", description: "Expert in industrial automation", image: "/api/placeholder/300/300" },
    { name: "Mike Chen", role: "VP Operations", description: "Global supply chain specialist", image: "/api/placeholder/300/300" },
    { name: "Lisa Rodriguez", role: "VP Safety", description: "Industry leader in safety protocols", image: "/api/placeholder/300/300" }
  ],
  certifications: [
    { title: "ISO 9001:2015", description: "Quality Management" },
    { title: "ISO 14001:2015", description: "Environmental Management" },
    { title: "OHSAS 18001", description: "Occupational Health & Safety" },
    { title: "CE Marking", description: "European Compliance" },
    { title: "UL Listed", description: "North American Markets" }
  ],
  updatedAt: new Date().toISOString()
});

const getDefaultContactContent = (): ContactContent => ({
  id: "contact",
  hero: {
    title: "Contact Our Team",
    subtitle: "Get in Touch",
    description: "Ready to discuss your industrial needs? Our experts are here to help you find the perfect solutions."
  },
  contactMethods: [
    { icon: "Phone", title: "Phone Support", description: "Speak with our technical experts", details: "+1 (555) 123-4567", hours: "Mon-Fri: 8:00 AM - 6:00 PM EST" },
    { icon: "Mail", title: "Email Support", description: "Get detailed assistance via email", details: "support@industrialco.com", hours: "Response within 24 hours" },
    { icon: "MessageSquare", title: "Live Chat", description: "Instant help from our team", details: "Available on website", hours: "Mon-Fri: 9:00 AM - 5:00 PM EST" },
    { icon: "Headphones", title: "Technical Support", description: "Expert technical assistance", details: "tech@industrialco.com", hours: "24/7 Emergency Support" }
  ],
  offices: [
    { name: "North America HQ", address: "1234 Industrial Blvd\nManufacturing District\nCity, State 12345", phone: "+1 (555) 123-4567", email: "na.sales@industrialco.com" },
    { name: "European Office", address: "456 Europa Street\nIndustrial Park\nLondon, UK EC1A 1BB", phone: "+44 20 1234 5678", email: "eu.sales@industrialco.com" },
    { name: "Asia Pacific Office", address: "789 Asia Road\nBusiness District\nSingapore 123456", phone: "+65 6234 5678", email: "ap.sales@industrialco.com" }
  ],
  emergencySupport: {
    title: "Emergency Support",
    description: "For urgent technical issues or equipment failures, call our 24/7 emergency line:",
    phone: "+1 (555) 911-HELP"
  },
  updatedAt: new Date().toISOString()
});

const getDefaultCategoriesContent = (): CategoriesContent => ({
  id: "categories",
  hero: {
    title: "Browse Our Product Categories",
    subtitle: "Product Categories",
    description: "Explore our comprehensive range of industrial equipment and solutions, organized by category for easy navigation."
  },
  categories: [
    { name: "Heavy Machinery", icon: "Factory", productCount: 156, description: "Excavators, cranes, bulldozers and more", subcategories: ["Excavators", "Cranes", "Bulldozers"], featured: true },
    { name: "Industrial Tools", icon: "Wrench", productCount: 423, description: "Professional grade tools for any job", subcategories: ["Hand Tools", "Power Tools"], featured: true },
    { name: "Safety Equipment", icon: "HardHat", productCount: 287, description: "Keep your workforce protected", subcategories: ["PPE", "Fall Protection"], featured: true },
    { name: "Spare Parts", icon: "Zap", productCount: 1024, description: "OEM and compatible replacement parts", subcategories: ["Engine Parts", "Hydraulics"], featured: false }
  ],
  cta: {
    title: "Can't Find What You're Looking For?",
    description: "Our experts can help you find the right products for your specific needs",
    primaryButtonText: "Contact Our Experts",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Browse All Products",
    secondaryButtonLink: "/products"
  },
  updatedAt: new Date().toISOString()
});

const getDefaultFooterContent = (): FooterContent => ({
  id: "footer",
  company: {
    name: "IndustrialCo",
    tagline: "Industrial Solutions",
    description: "Leading provider of industrial equipment and solutions for manufacturing, construction, and heavy industry applications worldwide."
  },
  contact: {
    address: "1234 Industrial Blvd\nManufacturing District\nCity, State 12345",
    phone: "+1 (555) 123-4567",
    email: "info@industrialco.com",
    emergencyPhone: "+1 (555) 911-HELP",
    hours: [
      { days: "Mon-Fri", time: "8:00 AM - 6:00 PM" },
      { days: "Sat", time: "9:00 AM - 4:00 PM" },
      { days: "Sun", time: "Closed" }
    ]
  },
  links: {
    quickLinks: [
      { title: "All Products", url: "/products" },
      { title: "Categories", url: "/categories" },
      { title: "About Us", url: "/about" },
      { title: "Contact", url: "/contact" },
      { title: "Support", url: "/support" }
    ],
    categories: [
      { title: "Heavy Machinery", url: "/products/category/machinery" },
      { title: "Industrial Tools", url: "/products/category/tools" },
      { title: "Safety Equipment", url: "/products/category/safety" },
      { title: "Spare Parts", url: "/products/category/parts" }
    ]
  },
  legal: {
    copyright: "© 2024 IndustrialCo. All rights reserved.",
    links: [
      { title: "Privacy Policy", url: "/privacy" },
      { title: "Terms of Service", url: "/terms" },
      { title: "Sitemap", url: "/sitemap" }
    ]
  },
  updatedAt: new Date().toISOString()
});

const getDefaultHeaderContent = (): HeaderContent => ({
  id: "header",
  company: {
    name: "IndustrialCo",
    tagline: "Industrial Solutions"
  },
  topBar: {
    phone: "+1 (555) 123-4567",
    email: "info@industrialco.com",
    supportText: "Support"
  },
  navigation: [
    { title: "Home", url: "/" },
    { 
      title: "Products", 
      url: "/products",
      dropdown: [
        { title: "All Products", url: "/products" },
        { title: "Heavy Machinery", url: "/products/category/machinery" },
        { title: "Industrial Tools", url: "/products/category/tools" },
        { title: "Safety Equipment", url: "/products/category/safety" }
      ]
    },
    { title: "Categories", url: "/categories" },
    { title: "About", url: "/about" },
    { title: "Contact", url: "/contact" }
  ],
  updatedAt: new Date().toISOString()
});

const getDefaultSiteSettings = (): SiteSettings => ({
  id: "settings",
  general: {
    siteName: "IndustrialCo",
    siteDescription: "Leading provider of industrial equipment and solutions",
    logo: "/logo.png",
    favicon: "/favicon.ico",
    primaryColor: "#2563eb",
    secondaryColor: "#f97316"
  },
  seo: {
    defaultTitle: "IndustrialCo - Industrial Solutions & Equipment",
    defaultDescription: "Leading provider of industrial equipment and solutions for manufacturing, construction, and heavy industry applications worldwide.",
    keywords: ["industrial equipment", "heavy machinery", "safety equipment", "industrial tools"],
    ogImage: "/og-image.jpg"
  },
  social: {},
  analytics: {},
  maintenance: {
    enabled: false,
    message: "We're currently performing maintenance. Please check back soon."
  },
  updatedAt: new Date().toISOString()
});

// API Handlers

// About Content
export const getAboutContent: RequestHandler = async (req, res) => {
  try {
    const content = await loadContent("about.json", getDefaultAboutContent());
    res.json(content);
  } catch (error) {
    console.error("Error fetching about content:", error);
    res.status(500).json({ error: "Failed to fetch about content" });
  }
};

export const updateAboutContent: RequestHandler = async (req, res) => {
  try {
    const updateData: UpdateAboutContentRequest = req.body;
    const updatedContent: AboutContent = {
      id: "about",
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    await saveContent("about.json", updatedContent);
    res.json(updatedContent);
  } catch (error) {
    console.error("Error updating about content:", error);
    res.status(500).json({ error: "Failed to update about content" });
  }
};

// Contact Content
export const getContactContent: RequestHandler = async (req, res) => {
  try {
    const content = await loadContent("contact.json", getDefaultContactContent());
    res.json(content);
  } catch (error) {
    console.error("Error fetching contact content:", error);
    res.status(500).json({ error: "Failed to fetch contact content" });
  }
};

export const updateContactContent: RequestHandler = async (req, res) => {
  try {
    const updateData: UpdateContactContentRequest = req.body;
    const updatedContent: ContactContent = {
      id: "contact",
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    await saveContent("contact.json", updatedContent);
    res.json(updatedContent);
  } catch (error) {
    console.error("Error updating contact content:", error);
    res.status(500).json({ error: "Failed to update contact content" });
  }
};

// Categories Content
export const getCategoriesContent: RequestHandler = async (req, res) => {
  try {
    const content = await loadContent("categories.json", getDefaultCategoriesContent());
    res.json(content);
  } catch (error) {
    console.error("Error fetching categories content:", error);
    res.status(500).json({ error: "Failed to fetch categories content" });
  }
};

export const updateCategoriesContent: RequestHandler = async (req, res) => {
  try {
    const updateData: UpdateCategoriesContentRequest = req.body;
    const updatedContent: CategoriesContent = {
      id: "categories",
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    await saveContent("categories.json", updatedContent);
    res.json(updatedContent);
  } catch (error) {
    console.error("Error updating categories content:", error);
    res.status(500).json({ error: "Failed to update categories content" });
  }
};

// Footer Content
export const getFooterContent: RequestHandler = async (req, res) => {
  try {
    const content = await loadContent("footer.json", getDefaultFooterContent());
    res.json(content);
  } catch (error) {
    console.error("Error fetching footer content:", error);
    res.status(500).json({ error: "Failed to fetch footer content" });
  }
};

export const updateFooterContent: RequestHandler = async (req, res) => {
  try {
    const updateData: UpdateFooterContentRequest = req.body;
    const updatedContent: FooterContent = {
      id: "footer",
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    await saveContent("footer.json", updatedContent);
    res.json(updatedContent);
  } catch (error) {
    console.error("Error updating footer content:", error);
    res.status(500).json({ error: "Failed to update footer content" });
  }
};

// Header Content
export const getHeaderContent: RequestHandler = async (req, res) => {
  try {
    const content = await loadContent("header.json", getDefaultHeaderContent());
    res.json(content);
  } catch (error) {
    console.error("Error fetching header content:", error);
    res.status(500).json({ error: "Failed to fetch header content" });
  }
};

export const updateHeaderContent: RequestHandler = async (req, res) => {
  try {
    const updateData: UpdateHeaderContentRequest = req.body;
    const updatedContent: HeaderContent = {
      id: "header",
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    await saveContent("header.json", updatedContent);
    res.json(updatedContent);
  } catch (error) {
    console.error("Error updating header content:", error);
    res.status(500).json({ error: "Failed to update header content" });
  }
};

// Site Settings
export const getSiteSettings: RequestHandler = async (req, res) => {
  try {
    const settings = await loadContent("settings.json", getDefaultSiteSettings());
    res.json(settings);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    res.status(500).json({ error: "Failed to fetch site settings" });
  }
};

export const updateSiteSettings: RequestHandler = async (req, res) => {
  try {
    const updateData: UpdateSiteSettingsRequest = req.body;
    const updatedSettings: SiteSettings = {
      id: "settings",
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    await saveContent("settings.json", updatedSettings);
    res.json(updatedSettings);
  } catch (error) {
    console.error("Error updating site settings:", error);
    res.status(500).json({ error: "Failed to update site settings" });
  }
};

// GET /api/content/theme - Get theme settings
export const getThemeSettings: RequestHandler = async (req, res) => {
  try {
    const theme = await loadContent("theme.json", getDefaultThemeSettings());
    res.json(theme);
  } catch (error) {
    console.error("Error fetching theme settings:", error);
    res.status(500).json({ error: "Failed to fetch theme settings" });
  }
};

// PUT /api/content/theme - Update theme settings
export const updateThemeSettings: RequestHandler = async (req, res) => {
  try {
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const theme = req.body;
    await saveContent("theme.json", theme);
    res.json(theme);
  } catch (error) {
    console.error("Error updating theme settings:", error);
    res.status(500).json({ error: "Failed to update theme settings" });
  }
};

function getDefaultThemeSettings() {
  return {
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#f97316",
      background: "#ffffff",
      text: "#1f2937",
      muted: "#6b7280"
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      fontSize: {
        base: "16px",
        heading: "32px"
      }
    },
    layout: {
      maxWidth: "1200px",
      borderRadius: "8px",
      spacing: "1rem"
    },
    branding: {
      companyName: "IndustrialCo"
    }
  };
}
