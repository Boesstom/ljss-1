<script>
  import { onMount } from 'svelte';
  import { initDashboard } from './dashboard.js';

  const dashboard = initDashboard();
  let userEmail = '';
  let userRole = '';
  let loading = true;

  onMount(async () => {
    const userData = await dashboard.loadUserData();
    if (userData) {
      userEmail = userData.userEmail;
      userRole = userData.userRole;
      loading = userData.loading;
    }
  });

  const handleLogout = dashboard.handleLogout;
</script>

<div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
  <div class="relative py-3 sm:max-w-xl sm:mx-auto">
    <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
    <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
      <div class="max-w-md mx-auto">
        <div class="divide-y divide-gray-200">
          <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
            {#if loading}
              <p>Loading user information...</p>
            {:else}
              <div class="space-y-4">
                <p class="font-semibold">Welcome to Dashboard</p>
                <p><span class="font-medium">Email:</span> {userEmail}</p>
                <p><span class="font-medium">Role:</span> {userRole}</p>
                <button
                  on:click={handleLogout}
                  class="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>