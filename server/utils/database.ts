import { connectToDatabase, getDatabaseStatus } from '../database/connection.js';

/**
 * Ensure database connection, but don't fail if MongoDB is unavailable
 * Returns true if connected, false if not available
 */
export async function ensureDbConnection(): Promise<boolean> {
  try {
    const status = getDatabaseStatus();
    if (status.isConnected) {
      return true;
    }
    
    await connectToDatabase();
    return true;
  } catch (error) {
    console.warn('📦 Database connection unavailable, using fallback mode');
    return false;
  }
}

/**
 * Check if we should use database or fallback to JSON files
 */
export function shouldUseDatabase(): boolean {
  const status = getDatabaseStatus();
  return status.isConnected;
}
