import { supabase } from '../supabase';

let cachedUser = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export const getUser = async () => {
  const currentTime = Date.now();
  
  // Return cached user if valid
  if (cachedUser && (currentTime - lastFetchTime) < CACHE_DURATION) {
    return cachedUser;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    // Fetch user role from user_profile table
    const { data: profile, error } = await supabase
      .from('user_profile')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profile) {
      user.user_metadata = user.user_metadata || {};
      user.user_metadata.role = profile.role;
    }

    // Update cache
    cachedUser = user;
    lastFetchTime = currentTime;
  }
  return user;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (data?.user) {
    // Fetch user role from user_profile table
    const { data: profile } = await supabase
      .from('user_profile')
      .select('role')
      .eq('id', data.user.id)
      .single();
    
    if (profile) {
      data.user.user_metadata = data.user.user_metadata || {};
      data.user.user_metadata.role = profile.role;
    }
  }

  return { data, error };
};