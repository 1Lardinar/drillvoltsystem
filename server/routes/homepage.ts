import { RequestHandler } from "express";
import { HomepageContent, UpdateHomepageRequest } from "@shared/homepage";
import fs from "fs/promises";
import path from "path";

const HOMEPAGE_FILE = path.join(process.cwd(), "data", "homepage.json");
const DATA_DIR = path.join(process.cwd(), "data");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Load homepage content from file
async function loadHomepageContent(): Promise<HomepageContent> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(HOMEPAGE_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    // Return default content if file doesn't exist
    const defaultContent: HomepageContent = {
      id: "homepage",
      heroBanner: {
        title: "Industrial Solutions for Modern Manufacturing",
        subtitle: "Trusted by Industry Leaders",
        description: "Discover our comprehensive range of heavy machinery, industrial tools, and safety equipment. Built for performance, engineered for reliability.",
        primaryButtonText: "Explore Products",
        primaryButtonLink: "/products",
        secondaryButtonText: "Download Catalog",
        secondaryButtonLink: "/catalog.pdf"
      },
      stats: {
        clients: "2,500+",
        countries: "45+", 
        products: "10,000+",
        experience: "25+"
      },
      featuredProductIds: ["1", "2", "3"],
      companyInfo: {
        title: "Built on Trust, Powered by Innovation",
        subtitle: "Industry Leader Since 1999",
        description: "For over 25 years, IndustrialCo has been the trusted partner for manufacturing, construction, and industrial operations worldwide. Our commitment to quality, safety, and innovation drives everything we do.",
        features: [
          {
            icon: "Shield",
            title: "Safety First",
            description: "ISO certified safety standards"
          },
          {
            icon: "Truck", 
            title: "Global Delivery",
            description: "Worldwide shipping network"
          },
          {
            icon: "Award",
            title: "Quality Assured", 
            description: "Premium grade materials"
          }
        ],
        primaryButtonText: "Learn More About Us",
        primaryButtonLink: "/about",
        secondaryButtonText: "Contact Our Team",
        secondaryButtonLink: "/contact"
      },
      ctaSection: {
        title: "Ready to Transform Your Operations?",
        description: "Get in touch with our experts today for personalized industrial solutions",
        primaryButtonText: "Download Catalog",
        primaryButtonLink: "/catalog.pdf",
        secondaryButtonText: "Request Quote",
        secondaryButtonLink: "/contact",
        backgroundGradient: "from-industrial-blue to-industrial-dark"
      },
      updatedAt: new Date().toISOString()
    };
    await saveHomepageContent(defaultContent);
    return defaultContent;
  }
}

// Save homepage content to file
async function saveHomepageContent(content: HomepageContent): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(HOMEPAGE_FILE, JSON.stringify(content, null, 2));
}

// GET /api/homepage - Get homepage content
export const getHomepageContent: RequestHandler = async (req, res) => {
  try {
    const content = await loadHomepageContent();
    res.json(content);
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    res.status(500).json({ error: "Failed to fetch homepage content" });
  }
};

// PUT /api/homepage - Update homepage content
export const updateHomepageContent: RequestHandler = async (req, res) => {
  try {
    const updateData: UpdateHomepageRequest = req.body;
    
    const updatedContent: HomepageContent = {
      id: "homepage",
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await saveHomepageContent(updatedContent);
    res.json(updatedContent);
  } catch (error) {
    console.error("Error updating homepage content:", error);
    res.status(500).json({ error: "Failed to update homepage content" });
  }
};
