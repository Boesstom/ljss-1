<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { getUser } from '$lib/auth/login';

  onMount(async () => {
    const user = await getUser();
    if (user) {
      goto('/dashboard');
    } else {
      goto('/login');
    }
  });
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-50">
  <div class="text-center">
    <p class="text-gray-600">Redirecting...</p>
  </div>
</div>
