import mongoose from 'mongoose';

// Product Schema
const productSpecificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, default: '' },
  images: [{ type: String }],
  specifications: [productSpecificationSchema],
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  company: { type: String },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date }
});

// Session Schema
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Email Template Schema
const emailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Email Log Schema
const emailLogSchema = new mongoose.Schema({
  to: [{ type: String, required: true }],
  subject: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, enum: ['sent', 'failed', 'pending'], default: 'pending' },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate' },
  error: { type: String },
  sentAt: { type: Date, default: Date.now }
});

// Content Schema (for homepage, about, contact, etc.)
const contentSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true }, // 'homepage', 'about', 'contact', etc.
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

// Media File Schema
const mediaFileSchema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  url: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Site Settings Schema
const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

// Create indexes for better performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ visible: 1 });

// Note: email, token, name, type, filename indexes are created automatically due to 'unique: true'
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

sessionSchema.index({ expiresAt: 1 });

categorySchema.index({ isActive: 1 });

emailLogSchema.index({ sentAt: -1 });
emailLogSchema.index({ status: 1 });

mediaFileSchema.index({ uploadedBy: 1 });

// Create and export models
export const Product = mongoose.model('Product', productSchema);
export const User = mongoose.model('User', userSchema);
export const Session = mongoose.model('Session', sessionSchema);
export const Category = mongoose.model('Category', categorySchema);
export const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);
export const EmailLog = mongoose.model('EmailLog', emailLogSchema);
export const Content = mongoose.model('Content', contentSchema);
export const MediaFile = mongoose.model('MediaFile', mediaFileSchema);
export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

// Export schemas for type checking
export {
  productSchema,
  userSchema,
  sessionSchema,
  categorySchema,
  emailTemplateSchema,
  emailLogSchema,
  contentSchema,
  mediaFileSchema,
  siteSettingsSchema
};
