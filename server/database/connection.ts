import mongoose from 'mongoose';

// MongoDB connection state
let isConnected = false;

/**
 * Connect to MongoDB database
 */
export async function connectToDatabase(): Promise<void> {
  if (isConnected) {
    console.log('📦 Using existing MongoDB connection');
    return;
  }

  try {
    // Get MongoDB connection string from environment
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/industrialco';

    console.log('🔌 Connecting to MongoDB...');
    console.log('📍 MongoDB URI:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs
    
    // Connect with optimized settings
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,         // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 3000, // Keep trying for 3 seconds
      socketTimeoutMS: 45000,  // Close sockets after 45 seconds of inactivity
      family: 4,               // Use IPv4, skip trying IPv6
      connectTimeoutMS: 3000   // How long to wait for initial connection
    });

    isConnected = true;
    console.log('✅ MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📦 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    isConnected = false;
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.connection.close();
    isConnected = false;
    console.log('📦 MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
    throw error;
  }
}

/**
 * Get connection status
 */
export function getDatabaseStatus(): {
  isConnected: boolean;
  readyState: number;
  name?: string;
  host?: string;
} {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    name: mongoose.connection.name,
    host: mongoose.connection.host
  };
}

/**
 * Health check for database
 */
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  details?: any;
}> {
  try {
    if (!isConnected) {
      return {
        status: 'unhealthy',
        message: 'Database not connected'
      };
    }

    // Test the connection with a simple ping
    await mongoose.connection.db.admin().ping();
    
    return {
      status: 'healthy',
      message: 'Database connection is healthy',
      details: {
        readyState: mongoose.connection.readyState,
        name: mongoose.connection.name,
        host: mongoose.connection.host
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: 'Database health check failed',
      details: error
    };
  }
}

/**
 * Initialize database with default data
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🚀 Initializing database with default data...');
    
    // This will be called after models are imported
    const { initializeDefaultData } = await import('./migration');
    await initializeDefaultData();
    
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

// Connection readyState values:
// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting
export const ConnectionStates = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  CONNECTING: 2,
  DISCONNECTING: 3
} as const;
