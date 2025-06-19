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
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) throw new Error(authError.message);

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authData.user.id)
    .single();

  if (userError) throw new Error(userError.message);

  return mapUserToUserType(userData);
};

export const registerUser = async (name: string, email: string, password: string): Promise<void> => {
  // Sign up the user with Supabase Auth
  // The database trigger will automatically create the user profile
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });

  if (authError) throw new Error(authError.message);
  if (!authData.user) throw new Error('Registration failed: No user data returned');

  // User profile creation is handled by database triggers
  // No need to manually insert into users table
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  return true;
};

export const updateUserUsage = async (userId: string): Promise<UserType> => {
  // First, get the current usage count
  const { data: currentUser, error: fetchError } = await supabase
    .from('users')
    .select('usage_count')
    .eq('id', userId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  // Then update with the incremented value
  const { data, error } = await supabase
    .from('users')
    .update({ usage_count: (currentUser.usage_count || 0) + 1 })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapUserToUserType(data);
};

export const togglePremiumMode = async (userId: string): Promise<UserType> => {
  const { data: currentUser, error: fetchError } = await supabase
    .from('users')
    .select('is_premium, usage_limit')
    .eq('id', userId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  let newIsPremium = false;
  let newLimit = 5; // Default free tier

  // Cycle through plans: Free (5) → Starter (50) → Pro (200) → Free
  if (!currentUser.is_premium && currentUser.usage_limit === 5) {
    // Currently Free → Switch to Starter
    newIsPremium = true;
    newLimit = 50;
  } else if (currentUser.is_premium && currentUser.usage_limit === 50) {
    // Currently Starter → Switch to Pro
    newIsPremium = true;
    newLimit = 200;
  } else {
    // Currently Pro or any other state → Switch to Free
    newIsPremium = false;
    newLimit = 5;
  }

  const { data, error } = await supabase
    .from('users')
    .update({ 
      is_premium: newIsPremium,
      usage_limit: newLimit
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapUserToUserType(data);
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw new Error(error.message);
};

export const resendConfirmationEmail = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email
  });
  if (error) throw new Error(error.message);
};