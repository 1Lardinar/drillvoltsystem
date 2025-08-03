export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  company?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface UserQuote {
  id: string;
  userId: string;
  productIds: string[];
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: string;
  updatedAt: string;
  responseMessage?: string;
  respondedAt?: string;
}

export interface UserInquiry {
  id: string;
  userId: string;
  subject: string;
  message: string;
  category: 'general' | 'product' | 'technical' | 'billing';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  responseMessage?: string;
  respondedAt?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}
