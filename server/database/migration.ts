import fs from 'fs/promises';
import path from 'path';
import {
  Product,
  User,
  Session,
  Category,
  EmailTemplate,
  EmailLog,
  Content,
  MediaFile,
  SiteSettings
} from '../models/index.js';

const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Check if a JSON file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load JSON data from file
 */
async function loadJsonFile(filename: string): Promise<any> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (await fileExists(filePath)) {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
}

/**
 * Migrate products from JSON to MongoDB
 */
async function migrateProducts(): Promise<void> {
  try {
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`✅ Products already migrated (${existingCount} documents)`);
      return;
    }

    const productsData = await loadJsonFile('products.json');
    if (productsData && Array.isArray(productsData)) {
      // Convert string IDs to proper format and ensure proper structure
      const products = productsData.map((product: any) => ({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price || '',
        images: product.images || [],
        specifications: product.specifications || [],
        tags: product.tags || [],
        featured: Boolean(product.featured),
        visible: Boolean(product.visible !== false),
        rating: Number(product.rating) || 0,
        createdAt: product.createdAt ? new Date(product.createdAt) : new Date(),
        updatedAt: product.updatedAt ? new Date(product.updatedAt) : new Date()
      }));

      await Product.insertMany(products);
      console.log(`✅ Migrated ${products.length} products`);
    } else {
      // Create default products if no data exists
      await createDefaultProducts();
    }
  } catch (error) {
    console.error('❌ Error migrating products:', error);
  }
}

/**
 * Migrate users from JSON to MongoDB
 */
async function migrateUsers(): Promise<void> {
  try {
    const existingCount = await User.countDocuments();
    if (existingCount > 0) {
      console.log(`✅ Users already migrated (${existingCount} documents)`);
      return;
    }

    const usersData = await loadJsonFile('users.json');
    if (usersData && Array.isArray(usersData)) {
      const users = usersData.map((user: any) => ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || 'user',
        company: user.company,
        phone: user.phone,
        isActive: Boolean(user.isActive !== false),
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
        lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined
      }));

      await User.insertMany(users);
      console.log(`✅ Migrated ${users.length} users`);
    } else {
      // Create default admin user if no data exists
      await createDefaultUser();
    }
  } catch (error) {
    console.error('❌ Error migrating users:', error);
  }
}

/**
 * Migrate categories from JSON to MongoDB
 */
async function migrateCategories(): Promise<void> {
  try {
    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      console.log(`✅ Categories already migrated (${existingCount} documents)`);
      return;
    }

    const categoriesData = await loadJsonFile('categories.json');
    if (categoriesData && Array.isArray(categoriesData)) {
      const categories = categoriesData.map((category: any) => ({
        name: category.name,
        description: category.description,
        image: category.image,
        isActive: Boolean(category.isActive !== false),
        createdAt: category.createdAt ? new Date(category.createdAt) : new Date(),
        updatedAt: category.updatedAt ? new Date(category.updatedAt) : new Date()
      }));

      await Category.insertMany(categories);
      console.log(`✅ Migrated ${categories.length} categories`);
    } else {
      // Create default categories if no data exists
      await createDefaultCategories();
    }
  } catch (error) {
    console.error('❌ Error migrating categories:', error);
  }
}

/**
 * Migrate email templates from JSON to MongoDB
 */
async function migrateEmailTemplates(): Promise<void> {
  try {
    const existingCount = await EmailTemplate.countDocuments();
    if (existingCount > 0) {
      console.log(`✅ Email templates already migrated (${existingCount} documents)`);
      return;
    }

    const templatesData = await loadJsonFile('email-templates.json');
    if (templatesData && Array.isArray(templatesData)) {
      const templates = templatesData.map((template: any) => ({
        name: template.name,
        subject: template.subject,
        body: template.body,
        isActive: Boolean(template.isActive !== false),
        createdAt: template.createdAt ? new Date(template.createdAt) : new Date(),
        updatedAt: template.updatedAt ? new Date(template.updatedAt) : new Date()
      }));

      await EmailTemplate.insertMany(templates);
      console.log(`✅ Migrated ${templates.length} email templates`);
    } else {
      // Create default email templates
      await createDefaultEmailTemplates();
    }
  } catch (error) {
    console.error('❌ Error migrating email templates:', error);
  }
}

/**
 * Clean up expired sessions
 */
async function cleanupSessions(): Promise<void> {
  try {
    // Remove expired sessions
    const result = await Session.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    if (result.deletedCount > 0) {
      console.log(`🧹 Cleaned up ${result.deletedCount} expired sessions`);
    }
  } catch (error) {
    console.error('❌ Error cleaning up sessions:', error);
  }
}

/**
 * Create default products
 */
async function createDefaultProducts(): Promise<void> {
  const defaultProducts = [
    {
      name: "Heavy Duty Excavator X2000",
      description: "Professional grade excavator designed for heavy construction work. Features advanced hydraulic systems and GPS tracking for optimal performance.",
      category: "Heavy Machinery",
      price: "Starting at $450,000",
      images: ["/api/placeholder/400/300"],
      specifications: [
        { key: "Weight", value: "20 tons" },
        { key: "Engine Power", value: "300 HP" },
        { key: "Bucket Capacity", value: "2.5 m³" },
        { key: "Max Digging Depth", value: "7.2 m" }
      ],
      tags: ["excavator", "heavy-duty", "construction"],
      featured: true,
      visible: true,
      rating: 4.8
    },
    {
      name: "Industrial Welding Station Pro",
      description: "State-of-the-art welding station with automated controls and safety features. Perfect for industrial manufacturing environments.",
      category: "Welding Equipment",
      price: "Starting at $15,000",
      images: ["/api/placeholder/400/300"],
      specifications: [
        { key: "Welding Current", value: "400A" },
        { key: "Power Supply", value: "380V" },
        { key: "Duty Cycle", value: "100%" },
        { key: "Wire Feed Speed", value: "0.5-25 m/min" }
      ],
      tags: ["welding", "automated", "safety"],
      featured: true,
      visible: true,
      rating: 4.9
    },
    {
      name: "Safety Helmet with HUD",
      description: "Advanced safety helmet featuring augmented reality display, impact resistance, and integrated communication systems.",
      category: "Safety Equipment",
      price: "Starting at $299",
      images: ["/api/placeholder/400/300"],
      specifications: [
        { key: "Impact Rating", value: "ANSI Z89.1" },
        { key: "Battery Life", value: "8 hours" },
        { key: "Display Type", value: "AR HUD" },
        { key: "Communication Range", value: "500m" }
      ],
      tags: ["safety", "helmet", "ar", "communication"],
      featured: true,
      visible: true,
      rating: 4.7
    }
  ];

  await Product.insertMany(defaultProducts);
  console.log(`✅ Created ${defaultProducts.length} default products`);
}

/**
 * Create default admin user
 */
async function createDefaultUser(): Promise<void> {
  const defaultUser = {
    email: "admin@industrialco.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    company: "IndustrialCo",
    phone: "+1 (555) 123-4567",
    isActive: true
  };

  await User.create(defaultUser);
  console.log('✅ Created default admin user');
}

/**
 * Create default categories
 */
async function createDefaultCategories(): Promise<void> {
  const defaultCategories = [
    {
      name: "Heavy Machinery",
      description: "Construction and industrial heavy machinery equipment",
      isActive: true
    },
    {
      name: "Welding Equipment",
      description: "Professional welding tools and equipment",
      isActive: true
    },
    {
      name: "Safety Equipment",
      description: "Industrial safety gear and protective equipment",
      isActive: true
    },
    {
      name: "Industrial Tools",
      description: "Professional tools for industrial applications",
      isActive: true
    }
  ];

  await Category.insertMany(defaultCategories);
  console.log(`✅ Created ${defaultCategories.length} default categories`);
}

/**
 * Create default email templates
 */
async function createDefaultEmailTemplates(): Promise<void> {
  const defaultTemplates = [
    {
      name: "Welcome Email",
      subject: "Welcome to IndustrialCo!",
      body: "Dear {firstName},\n\nWelcome to IndustrialCo! We're excited to have you on board.\n\nIf you have any questions, please don't hesitate to contact us.\n\nBest regards,\nThe IndustrialCo Team",
      isActive: true
    },
    {
      name: "Newsletter Template",
      subject: "IndustrialCo Monthly Newsletter",
      body: "Hello {firstName},\n\nHere are the latest updates from IndustrialCo:\n\n- New product launches\n- Industry insights\n- Company news\n\nStay tuned for more!\n\nBest regards,\nIndustrialCo Team",
      isActive: true
    }
  ];

  await EmailTemplate.insertMany(defaultTemplates);
  console.log(`✅ Created ${defaultTemplates.length} default email templates`);
}

/**
 * Initialize database with default data
 */
export async function initializeDefaultData(): Promise<void> {
  console.log('🔄 Starting database migration...');

  await migrateUsers();
  await migrateProducts();
  await migrateCategories();
  await migrateEmailTemplates();
  await cleanupSessions();

  console.log('✅ Database migration completed');
}

/**
 * Force reset database (use with caution)
 */
export async function resetDatabase(): Promise<void> {
  console.log('⚠️ Resetting database...');

  await Product.deleteMany({});
  await User.deleteMany({});
  await Session.deleteMany({});
  await Category.deleteMany({});
  await EmailTemplate.deleteMany({});
  await EmailLog.deleteMany({});
  await Content.deleteMany({});
  await MediaFile.deleteMany({});
  await SiteSettings.deleteMany({});

  await initializeDefaultData();

  console.log('✅ Database reset completed');
}
