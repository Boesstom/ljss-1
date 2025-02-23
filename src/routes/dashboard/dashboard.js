import { supabase } from '$lib/supabase';
import { goto } from '$app/navigation';

export function initDashboard() {
  const loadUserData = async () => {
    try {
      const { data: { user }, error: sessionError } = await supabase.auth.getUser();

      if (sessionError) {
        console.error('Error loading user session:', sessionError.message);
        goto('/login');
        return null;
      }

      if (!user) {
        goto('/login');
        return null;
      }

      return {
        userEmail: user.email,
        userRole: user.user_metadata.role || 'user',
        loading: false
      };
    } catch (error) {
      console.error('Error loading user data:', error.message);
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      goto('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return {
    loadUserData,
    handleLogout
  };
}