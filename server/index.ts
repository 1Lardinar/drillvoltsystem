import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToDatabase, initializeDatabase } from "./database/connection.js";
import { handleDemo } from "./routes/demo";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "./routes/products";
import { getHomepageContent, updateHomepageContent } from "./routes/homepage";
import { uploadSingle, uploadMultiple, uploadSingleImage, uploadMultipleImages, listUploadedFiles, deleteUploadedFile } from "./routes/upload";
import { register, login, logout, getCurrentUser, getUsers, updateUser, deleteUser, createUser } from "./routes/auth";
import { getCategories, createCategory, updateCategory, deleteCategory } from "./routes/categories";
import {
  getEmailTemplates, createEmailTemplate, updateEmailTemplate, deleteEmailTemplate,
  sendEmail, getEmailLogs, getEmailSettings, updateEmailSettings
} from "./routes/email";
import {
  getAboutContent, updateAboutContent,
  getContactContent, updateContactContent,
  getCategoriesContent, updateCategoriesContent,
  getFooterContent, updateFooterContent,
  getHeaderContent, updateHeaderContent,
  getSiteSettings, updateSiteSettings,
  getThemeSettings, updateThemeSettings
} from "./routes/content";
import path from "path";

export function createServer() {
  const app = express();

  // Initialize database connection (optional - app can run without MongoDB)
  connectToDatabase()
    .then(() => {
      console.log('🎉 Database connected - full functionality available');
      return initializeDatabase();
    })
    .catch(error => {
      console.warn('⚠️ Database connection failed - running in limited mode:', error.message);
      console.log('💡 Install and start MongoDB locally, or set DATABASE_URL for full functionality');
    });

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Serve admin interface
  app.get('/admin*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'admin.html'));
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Database health check
  app.get("/api/health", async (_req, res) => {
    try {
      const { checkDatabaseHealth, getDatabaseStatus } = await import("./database/connection.js");
      const health = await checkDatabaseHealth();
      const status = getDatabaseStatus();

      res.json({
        status: health.status,
        message: health.message,
        database: {
          connected: status.isConnected,
          readyState: status.readyState,
          name: status.name,
          host: status.host
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/demo", handleDemo);

  // Product routes
  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProduct);
  app.post("/api/products", createProduct);
  app.put("/api/products/:id", updateProduct);
  app.delete("/api/products/:id", deleteProduct);

  // Homepage content routes
  app.get("/api/homepage", getHomepageContent);
  app.put("/api/homepage", updateHomepageContent);

  // File upload routes
  app.post("/api/upload/single", uploadSingle, uploadSingleImage);
  app.post("/api/upload/multiple", uploadMultiple, uploadMultipleImages);
  app.get("/api/upload/list", listUploadedFiles);
  app.delete("/api/upload/:filename", deleteUploadedFile);

  // Authentication routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", getCurrentUser);
  app.get("/api/auth/users", getUsers);
  app.post("/api/auth/users", createUser);
  app.put("/api/auth/users/:id", updateUser);
  app.delete("/api/auth/users/:id", deleteUser);

  // Category management routes
  app.get("/api/categories", getCategories);
  app.post("/api/categories", createCategory);
  app.put("/api/categories/:id", updateCategory);
  app.delete("/api/categories/:id", deleteCategory);

  // Email management routes
  app.get("/api/email/templates", getEmailTemplates);
  app.post("/api/email/templates", createEmailTemplate);
  app.put("/api/email/templates/:id", updateEmailTemplate);
  app.delete("/api/email/templates/:id", deleteEmailTemplate);
  app.post("/api/email/send", sendEmail);
  app.get("/api/email/logs", getEmailLogs);
  app.get("/api/email/settings", getEmailSettings);
  app.put("/api/email/settings", updateEmailSettings);

  // Content management routes
  app.get("/api/content/about", getAboutContent);
  app.put("/api/content/about", updateAboutContent);
  app.get("/api/content/contact", getContactContent);
  app.put("/api/content/contact", updateContactContent);
  app.get("/api/content/categories", getCategoriesContent);
  app.put("/api/content/categories", updateCategoriesContent);
  app.get("/api/content/footer", getFooterContent);
  app.put("/api/content/footer", updateFooterContent);
  app.get("/api/content/header", getHeaderContent);
  app.put("/api/content/header", updateHeaderContent);
  app.get("/api/content/settings", getSiteSettings);
  app.put("/api/content/settings", updateSiteSettings);
  app.get("/api/content/theme", getThemeSettings);
  app.put("/api/content/theme", updateThemeSettings);

  return app;
}
