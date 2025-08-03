// About Page Content
export interface AboutContent {
  id: string;
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
  stats: {
    clients: string;
    countries: string;
    products: string;
    experience: string;
  };
  values: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  milestones: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  team: Array<{
    name: string;
    role: string;
    description: string;
    image: string;
  }>;
  certifications: Array<{
    title: string;
    description: string;
  }>;
  updatedAt: string;
}

// Contact Page Content
export interface ContactContent {
  id: string;
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  contactMethods: Array<{
    icon: string;
    title: string;
    description: string;
    details: string;
    hours: string;
  }>;
  offices: Array<{
    name: string;
    address: string;
    phone: string;
    email: string;
  }>;
  emergencySupport: {
    title: string;
    description: string;
    phone: string;
  };
  updatedAt: string;
}

// Categories Page Content
export interface CategoriesContent {
  id: string;
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  categories: Array<{
    name: string;
    icon: string;
    productCount: number;
    description: string;
    subcategories: string[];
    featured: boolean;
  }>;
  cta: {
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
  updatedAt: string;
}

// Footer Content
export interface FooterContent {
  id: string;
  company: {
    name: string;
    tagline: string;
    description: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    emergencyPhone: string;
    hours: Array<{
      days: string;
      time: string;
    }>;
  };
  links: {
    quickLinks: Array<{
      title: string;
      url: string;
    }>;
    categories: Array<{
      title: string;
      url: string;
    }>;
  };
  legal: {
    copyright: string;
    links: Array<{
      title: string;
      url: string;
    }>;
  };
  updatedAt: string;
}

// Header Content
export interface HeaderContent {
  id: string;
  company: {
    name: string;
    tagline: string;
  };
  topBar: {
    phone: string;
    email: string;
    supportText: string;
  };
  navigation: Array<{
    title: string;
    url: string;
    dropdown?: Array<{
      title: string;
      url: string;
    }>;
  }>;
  updatedAt: string;
}

// Global Site Settings
export interface SiteSettings {
  id: string;
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
  social: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  maintenance: {
    enabled: boolean;
    message: string;
  };
  updatedAt: string;
}

// Content Management Requests
export interface UpdateAboutContentRequest {
  hero: AboutContent['hero'];
  stats: AboutContent['stats'];
  values: AboutContent['values'];
  milestones: AboutContent['milestones'];
  team: AboutContent['team'];
  certifications: AboutContent['certifications'];
}

export interface UpdateContactContentRequest {
  hero: ContactContent['hero'];
  contactMethods: ContactContent['contactMethods'];
  offices: ContactContent['offices'];
  emergencySupport: ContactContent['emergencySupport'];
}

export interface UpdateCategoriesContentRequest {
  hero: CategoriesContent['hero'];
  categories: CategoriesContent['categories'];
  cta: CategoriesContent['cta'];
}

export interface UpdateFooterContentRequest {
  company: FooterContent['company'];
  contact: FooterContent['contact'];
  links: FooterContent['links'];
  legal: FooterContent['legal'];
}

export interface UpdateHeaderContentRequest {
  company: HeaderContent['company'];
  topBar: HeaderContent['topBar'];
  navigation: HeaderContent['navigation'];
}

export interface UpdateSiteSettingsRequest {
  general: SiteSettings['general'];
  seo: SiteSettings['seo'];
  social: SiteSettings['social'];
  analytics: SiteSettings['analytics'];
  maintenance: SiteSettings['maintenance'];
}
