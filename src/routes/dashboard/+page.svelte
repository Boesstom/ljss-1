<script>
  import { onMount } from 'svelte';
  import { initDashboard } from './dashboard.js';
  import Sidebar from '$lib/components/Sidebar.svelte';

  const dashboard = initDashboard();
  let userEmail = '';
  let userRole = '';
  let loading = true;
  let selectedMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  // Financial data (to be integrated with actual data)
  let financialData = {
    accountsReceivable: 0,
    accountsPayable: 0,
    profitLoss: 0
  };

  // Order statistics (to be integrated with actual data)
  let orderStats = {
    processingOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    paidInvoices: 0,
    unpaidInvoices: 0
  };

  onMount(async () => {
    const userData = await dashboard.loadUserData();
    if (userData) {
      userEmail = userData.userEmail;
      userRole = userData.userRole;
      loading = userData.loading;
    }
  });

  const handleLogout = dashboard.handleLogout;

  // Get available months (last 12 months)
  const getAvailableMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(date.toLocaleString('default', { month: 'long', year: 'numeric' }));
    }
    return months;
  };

  const months = getAvailableMonths();
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <div class="max-w-full mx-auto">
      <!-- Header with Month Selector -->
      <div class="flex justify-between items-center mb-8">
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <p class="text-gray-500">{userEmail}</p>
        </div>
        <div class="flex items-center gap-4">
          <select
            bind:value={selectedMonth}
            class="block w-48 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#289CD7] focus:border-[#289CD7]"
          >
            {#each months as month}
              <option value={month}>{month}</option>
            {/each}
          </select>
          <button
            on:click={handleLogout}
            class="px-4 py-2 text-sm font-medium text-white bg-[#289CD7] rounded-md hover:bg-[#1e7ba8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#289CD7]"
          >
            Logout
          </button>
        </div>
      </div>

      {#if loading}
        <div class="text-center py-12">
          <p class="text-lg text-gray-600">Loading dashboard data...</p>
        </div>
      {:else}
        <!-- Financial Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Total Piutang</h3>
            <p class="text-3xl font-bold text-[#289CD7]">
              Rp {financialData.accountsReceivable.toLocaleString('id-ID')}
            </p>
          </div>
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Total Hutang</h3>
            <p class="text-3xl font-bold text-[#289CD7]">
              Rp {financialData.accountsPayable.toLocaleString('id-ID')}
            </p>
          </div>
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Total Laba/Rugi</h3>
            <p class="text-3xl font-bold text-[#289CD7]">
              Rp {financialData.profitLoss.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <!-- Order & Invoice Statistics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Order Statistics -->
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Statistik Pesanan</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                <span class="text-gray-600">Pesanan Diproses</span>
                <span class="font-semibold">{orderStats.processingOrders}</span>
              </div>
              <div class="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                <span class="text-gray-600">Pesanan Tertunda</span>
                <span class="font-semibold">{orderStats.pendingOrders}</span>
              </div>
              <div class="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                <span class="text-gray-600">Pesanan Selesai</span>
                <span class="font-semibold">{orderStats.completedOrders}</span>
              </div>
            </div>
          </div>

          <!-- Invoice Statistics -->
          <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Statistik Faktur</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                <span class="text-gray-600">Faktur Terbayar</span>
                <span class="font-semibold">{orderStats.paidInvoices}</span>
              </div>
              <div class="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                <span class="text-gray-600">Faktur Belum Dibayar</span>
                <span class="font-semibold">{orderStats.unpaidInvoices}</span>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>