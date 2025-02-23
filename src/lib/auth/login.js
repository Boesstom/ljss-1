import { supabase } from '../supabase';

export const getUser = async () => {
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
  return { data, error };
};