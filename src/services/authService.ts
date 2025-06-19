import { supabase } from '../lib/supabase';
import { User, UserType } from '../types';

// Helper function to convert database user to frontend user type
const mapUserToUserType = (dbUser: User): UserType => ({
  id: dbUser.id,
  email: dbUser.email,
  name: dbUser.name,
  usageCount: dbUser.usage_count,
  usageLimit: dbUser.usage_limit,
  isPremium: dbUser.is_premium,
  createdAt: dbUser.created_at,
  authId: dbUser.auth_id,
  subscriptionId: dbUser.subscription_id
});

export const loginUser = async (email: string, password: string): Promise<UserType> => {
  // For demo purposes, create a mock user
  const mockUser: UserType = {
    id: 'demo-user-id',
    email: email,
    name: email.split('@')[0],
    usageCount: Math.floor(Math.random() * 3),
    usageLimit: 5,
    isPremium: false,
    createdAt: new Date().toISOString(),
    authId: 'demo-auth-id'
  };

  return mockUser;
};

export const registerUser = async (name: string, email: string, password: string): Promise<void> => {
  // For demo purposes, just simulate registration
  return Promise.resolve();
};

export const logoutUser = async () => {
  return true;
};

export const updateUserUsage = async (userId: string): Promise<UserType> => {
  // For demo purposes, return a mock updated user
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    user.usageCount += 1;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  throw new Error('User not found');
};