import { RequestHandler } from "express";
import { User, Session } from "../models/index.js";
import { connectToDatabase } from "../database/connection.js";
import crypto from "crypto";

// Ensure database connection
async function ensureDbConnection() {
  await connectToDatabase();
}

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Hash password (simple implementation - in production use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'salt').digest('hex');
}

// Generate session token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// POST /api/auth/register - Register new user
export const register: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const { email, password, firstName, lastName, company, phone } = req.body;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    
    const newUser = new User({
      email,
      firstName,
      lastName,
      role: 'user', // Default role
      company,
      phone,
      isActive: true
    });
    
    await newUser.save();
    
    // Return user without sensitive data
    const userResponse = {
      id: newUser._id.toString(),
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      company: newUser.company,
      phone: newUser.phone,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt
    };
    
    res.status(201).json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

// POST /api/auth/login - User login
export const login: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    
    const user = await User.findOne({ email, isActive: true });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Simple password check (in production, use bcrypt)
    // For demo purposes, accept "password" for all users
    if (password !== "password") {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Update last login
    user.lastLoginAt = new Date();
    await user.save();
    
    // Create session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const session = new Session({
      userId: user._id,
      token,
      expiresAt
    });
    
    await session.save();
    
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      company: user.company,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    };
    
    res.json({
      success: true,
      user: userResponse,
      token
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

// POST /api/auth/logout - User logout
export const logout: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await Session.deleteOne({ token });
    }
    
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Failed to logout" });
  }
};

// GET /api/auth/me - Get current user
export const getCurrentUser: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const session = await Session.findOne({ 
      token,
      expiresAt: { $gt: new Date() }
    }).populate('userId');
    
    if (!session || !session.userId) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    const user = session.userId as any;
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      company: user.company,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    };
    
    res.json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
};

// GET /api/auth/users - Get all users (admin only)
export const getUsers: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const session = await Session.findOne({ 
      token,
      expiresAt: { $gt: new Date() }
    }).populate('userId');
    
    if (!session || !session.userId) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    const currentUser = session.userId as any;
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    const users = await User.find({}).sort({ createdAt: -1 });
    
    const usersResponse = users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      company: user.company,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    }));
    
    res.json({ success: true, users: usersResponse });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to get users" });
  }
};

// PUT /api/auth/users/:id - Update user (admin only)
export const updateUser: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = req.params.id;
    const updateData = req.body;
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const session = await Session.findOne({ 
      token,
      expiresAt: { $gt: new Date() }
    }).populate('userId');
    
    if (!session || !session.userId) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    const currentUser = session.userId as any;
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    // Prevent admin from removing their own admin role
    if (userId === currentUser._id.toString() && updateData.role !== 'admin') {
      return res.status(400).json({ error: "Cannot remove your own admin role" });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const userResponse = {
      id: updatedUser._id.toString(),
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      company: updatedUser.company,
      phone: updatedUser.phone,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      lastLoginAt: updatedUser.lastLoginAt
    };
    
    res.json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// DELETE /api/auth/users/:id - Delete user (admin only)
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = req.params.id;
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const session = await Session.findOne({ 
      token,
      expiresAt: { $gt: new Date() }
    }).populate('userId');
    
    if (!session || !session.userId) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    const currentUser = session.userId as any;
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    // Prevent admin from deleting themselves
    if (userId === currentUser._id.toString()) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Remove user sessions
    await Session.deleteMany({ userId });
    
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// POST /api/auth/users - Create user (admin only)
export const createUser: RequestHandler = async (req, res) => {
  try {
    await ensureDbConnection();
    
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userData = req.body;
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const session = await Session.findOne({ 
      token,
      expiresAt: { $gt: new Date() }
    }).populate('userId');
    
    if (!session || !session.userId) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    const currentUser = session.userId as any;
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    // Validate required fields
    if (!userData.email || !userData.firstName || !userData.lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    
    const newUser = new User({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'user',
      company: userData.company,
      phone: userData.phone,
      isActive: userData.isActive !== undefined ? userData.isActive : true
    });
    
    await newUser.save();
    
    const userResponse = {
      id: newUser._id.toString(),
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      company: newUser.company,
      phone: newUser.phone,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt
    };
    
    res.status(201).json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};
