export interface User {
  id: string;
  email: string;
  name: string;
  usage_count: number;
  usage_limit: number;
  is_premium: boolean;
  created_at: string;
  auth_id?: string;
  subscription_id?: string;
  stripe_customer_id?: string;
}

// Keep the old interface for backward compatibility but map to new one
export interface UserType {
  id: string;
  email: string;
  name: string;
  usageCount: number;
  usageLimit: number;
  isPremium: boolean;
  createdAt: string;
  authId?: string;
  subscriptionId?: string;
  stripeCustomerId?: string;
}

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  status?: 'uploading' | 'complete' | 'error';
  publicUrl?: string;
  error?: string;
}

export interface ProductDescription {
  id: string;
  imageId: string;
  imageSrc: string;
  title: string;
  text: string;
  keywords: string[];
  createdAt: string;
  seoMetadata: {
    title: string;
    description: string;
    tags: string[];
  };
  isDemoContent?: boolean;
}

export interface AuthContextType {
  user: UserType | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}