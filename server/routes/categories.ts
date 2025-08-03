import { RequestHandler } from "express";
import { Category, Product, Session } from "../models/index.js";
import { connectToDatabase } from "../database/connection.js";

// Ensure database connection
async function ensureDbConnection() {
  await connectToDatabase();
}

// Check admin authorization
async function checkAdminAuth(req: any): Promise<boolean> {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) return false;
  
  try {
    const session = await Session.findOne({ 
      token,
      expiresAt: { $gt: new Date() }
    }).populate('userId');
    
    return session && (session.userId as any)?.role === 'admin';
  } catch {
    return false;
  }
}

// Get product counts for categories
async function getProductCounts(): Promise<Record<string, number>> {
  try {
    const pipeline = [
      { $match: { visible: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ];
    
    const results = await Product.aggregate(pipeline);
    
    const counts: Record<string, number> = {};
    results.forEach(result => {
      if (result._id) {
        counts[result._id] = result.count;
      }
    });
    
    return counts;
  } catch {
    return {};
  }
}

// GET /api/categories - Get all categories
export const getCategories: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const categories = await Category.find({}).sort({ name: 1 });
    const productCounts = await getProductCounts();
    
    // Update product counts
    const categoriesWithCounts = categories.map(category => ({
      id: category._id.toString(),
      name: category.name,
      description: category.description,
      image: category.image,
      isActive: category.isActive,
      productCount: productCounts[category.name] || 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));
    
    res.json({ success: true, categories: categoriesWithCounts });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// POST /api/categories - Create new category (admin only)
export const createCategory: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const { name, description, image, isActive = true } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" });
    }
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }
    
    const newCategory = new Category({
      name,
      description,
      image,
      isActive
    });
    
    await newCategory.save();
    
    const categoryResponse = {
      id: newCategory._id.toString(),
      name: newCategory.name,
      description: newCategory.description,
      image: newCategory.image,
      isActive: newCategory.isActive,
      productCount: 0,
      createdAt: newCategory.createdAt,
      updatedAt: newCategory.updatedAt
    };
    
    res.status(201).json({ success: true, category: categoryResponse });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

// PUT /api/categories/:id - Update category (admin only)
export const updateCategory: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const categoryId = req.params.id;
    const updateData = req.body;
    
    // If name is being changed, check for duplicates
    if (updateData.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
        _id: { $ne: categoryId }
      });
      
      if (existingCategory) {
        return res.status(400).json({ error: "Category name already exists" });
      }
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    const productCounts = await getProductCounts();
    
    const categoryResponse = {
      id: updatedCategory._id.toString(),
      name: updatedCategory.name,
      description: updatedCategory.description,
      image: updatedCategory.image,
      isActive: updatedCategory.isActive,
      productCount: productCounts[updatedCategory.name] || 0,
      createdAt: updatedCategory.createdAt,
      updatedAt: updatedCategory.updatedAt
    };
    
    res.json({ success: true, category: categoryResponse });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

// DELETE /api/categories/:id - Delete category (admin only)
export const deleteCategory: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const isAdmin = await checkAdminAuth(req);
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const categoryId = req.params.id;
    
    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    // Check if category has products
    const productCount = await Product.countDocuments({ 
      category: category.name,
      visible: true 
    });
    
    if (productCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category with ${productCount} products. Please move products to another category first.` 
      });
    }
    
    await Category.findByIdAndDelete(categoryId);
    
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// GET /api/categories/:id/products - Get products in a category
export const getCategoryProducts: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const categoryId = req.params.id;
    const { limit = 20, skip = 0 } = req.query;
    
    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    const products = await Product.find({ 
      category: category.name,
      visible: true 
    })
    .limit(Number(limit))
    .skip(Number(skip))
    .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments({ 
      category: category.name,
      visible: true 
    });
    
    const productsResponse = products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      images: product.images,
      specifications: product.specifications,
      tags: product.tags,
      featured: product.featured,
      visible: product.visible,
      rating: product.rating,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));
    
    res.json({
      success: true,
      category: {
        id: category._id.toString(),
        name: category.name,
        description: category.description
      },
      products: productsResponse,
      total,
      limit: Number(limit),
      skip: Number(skip)
    });
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).json({ error: "Failed to fetch category products" });
  }
};
