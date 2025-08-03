import { RequestHandler } from "express";
import { Product } from "../models/index.js";
import { connectToDatabase } from "../database/connection.js";

// Ensure database connection
async function ensureDbConnection() {
  try {
    await connectToDatabase();
    return true;
  } catch (error) {
    console.warn("Database connection not available, using fallback mode");
    return false;
  }
}

// GET /api/products - Get all products
export const getProducts: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();

    const products = await Product.find({ visible: true })
      .sort({ createdAt: -1 });

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
      products: productsResponse,
      total: productsResponse.length
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    // Fallback to sample data when database is unavailable
    const fallbackProducts = [
      {
        id: "1",
        name: "Industrial Excavator X2000",
        description: "Heavy-duty excavator for large construction projects",
        category: "Heavy Machinery",
        price: "Contact for Quote",
        images: [],
        specifications: [
          { key: "Weight", value: "25 tons" },
          { key: "Engine Power", value: "300 HP" }
        ],
        tags: ["Excavator", "Construction", "Heavy Duty"],
        featured: true,
        visible: true,
        rating: 4.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Professional Welding Kit Pro",
        description: "Complete welding solution for industrial applications",
        category: "Industrial Tools",
        price: "$2,499",
        images: [],
        specifications: [
          { key: "Power", value: "240V" },
          { key: "Welding Range", value: "1-12mm" }
        ],
        tags: ["Welding", "Tools", "Professional"],
        featured: true,
        visible: true,
        rating: 4.6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "3",
        name: "Safety Helmet Premium",
        description: "Advanced safety helmet with integrated communication",
        category: "Safety Equipment",
        price: "$189",
        images: [],
        specifications: [
          { key: "Material", value: "Carbon Fiber" },
          { key: "Weight", value: "380g" }
        ],
        tags: ["Safety", "Helmet", "Communication"],
        featured: true,
        visible: true,
        rating: 4.9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    res.json({
      products: fallbackProducts,
      total: fallbackProducts.length
    });
  }
};

// GET /api/products/:id - Get single product
export const getProduct: RequestHandler = async (req, res) => {
  try {
    const dbConnected = await ensureDbConnection();

    if (dbConnected) {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const productResponse = {
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
      };

      res.json(productResponse);
    } else {
      // Fallback data when database is unavailable
      const fallbackProducts: any = {
        "1": {
          id: "1",
          name: "Industrial Excavator X2000",
          description: "Heavy-duty excavator for large construction projects",
          category: "Heavy Machinery",
          price: "Contact for Quote",
          images: [],
          specifications: [
            { key: "Weight", value: "25 tons" },
            { key: "Engine Power", value: "300 HP" }
          ],
          tags: ["Excavator", "Construction", "Heavy Duty"],
          featured: true,
          visible: true,
          rating: 4.8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      const product = fallbackProducts[req.params.id];
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// POST /api/products - Create new product
export const createProduct: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const productData = req.body;
    
    // Validate required fields
    if (!productData.name || !productData.description || !productData.category) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const newProduct = new Product({
      name: productData.name,
      description: productData.description,
      category: productData.category,
      price: productData.price || '',
      images: productData.images || [],
      specifications: productData.specifications || [],
      tags: productData.tags || [],
      featured: Boolean(productData.featured),
      visible: Boolean(productData.visible !== false),
      rating: 0
    });
    
    await newProduct.save();
    
    const productResponse = {
      id: newProduct._id.toString(),
      name: newProduct.name,
      description: newProduct.description,
      category: newProduct.category,
      price: newProduct.price,
      images: newProduct.images,
      specifications: newProduct.specifications,
      tags: newProduct.tags,
      featured: newProduct.featured,
      visible: newProduct.visible,
      rating: newProduct.rating,
      createdAt: newProduct.createdAt,
      updatedAt: newProduct.updatedAt
    };
    
    res.status(201).json(productResponse);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// PUT /api/products/:id - Update product
export const updateProduct: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const productId = req.params.id;
    const productData = req.body;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        ...productData,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    const productResponse = {
      id: updatedProduct._id.toString(),
      name: updatedProduct.name,
      description: updatedProduct.description,
      category: updatedProduct.category,
      price: updatedProduct.price,
      images: updatedProduct.images,
      specifications: updatedProduct.specifications,
      tags: updatedProduct.tags,
      featured: updatedProduct.featured,
      visible: updatedProduct.visible,
      rating: updatedProduct.rating,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt
    };
    
    res.json(productResponse);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// DELETE /api/products/:id - Delete product
export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const productId = req.params.id;
    
    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// GET /api/products/search - Search products
export const searchProducts: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const { q, category, featured, limit = 50 } = req.query;
    
    let query: any = { visible: true };
    
    // Text search
    if (q) {
      query.$text = { $search: q as string };
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }
    
    const products = await Product.find(query)
      .limit(Number(limit))
      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 });
    
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
      products: productsResponse,
      total: productsResponse.length,
      query: { q, category, featured, limit }
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Failed to search products" });
  }
};

// GET /api/products/categories - Get product categories
export const getProductCategories: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const categories = await Product.distinct('category', { visible: true });
    
    res.json({
      categories: categories.filter(Boolean).sort()
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
