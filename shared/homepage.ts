export interface HeroBanner {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface CompanyStats {
  clients: string;
  countries: string;
  products: string;
  experience: string;
}

export interface CompanyInfo {
  title: string;
  subtitle: string;
  description: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export interface CtaSection {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundGradient: string;
}

export interface HomepageContent {
  id: string;
  heroBanner: HeroBanner;
  stats: CompanyStats;
  featuredProductIds: string[];
  companyInfo: CompanyInfo;
  ctaSection: CtaSection;
  updatedAt: string;
}

export interface UpdateHomepageRequest {
  heroBanner: HeroBanner;
  stats: CompanyStats;
  featuredProductIds: string[];
  companyInfo: CompanyInfo;
  ctaSection: CtaSection;
}
