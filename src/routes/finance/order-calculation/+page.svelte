<script>
  import { onMount } from 'svelte';
  import { Search, ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2 } from 'lucide-svelte';
  import OrderCalculationModal from '$lib/components/OrderCalculationModal.svelte';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';

  // Data dummy untuk contoh
  let orders = [
    { 
      id: 1, 
      invoiceShipper: 'INV-001', 
      jobNumber: 'JOB-001', 
      shipper: 'PT Shipper A',
      stuffingDate: '2024-01-15'
    },
    { 
      id: 2, 
      invoiceShipper: 'INV-002', 
      jobNumber: 'JOB-002', 
      shipper: 'PT Shipper B',
      stuffingDate: '2024-01-16'
    },
    { 
      id: 3, 
      invoiceShipper: 'INV-003', 
      jobNumber: 'JOB-003', 
      shipper: 'PT Shipper C',
      stuffingDate: '2024-01-17'
    },
    { 
      id: 4, 
      invoiceShipper: 'INV-004', 
      jobNumber: 'JOB-004', 
      shipper: 'PT Shipper D',
      stuffingDate: '2024-01-18'
    },
    { 
      id: 5, 
      invoiceShipper: 'INV-005', 
      jobNumber: 'JOB-005', 
      shipper: 'PT Shipper E',
      stuffingDate: '2024-01-19'
    },
  ];

  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';
  let sortField = null;
  let sortDirection = 'asc';

  function toggleSort(field) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'asc';
    }
  }

  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  $: paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter and sort orders
  $: filteredOrders = orders
    .filter(order =>
      order.invoiceShipper.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipper.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      
      let comparison = 0;
      if (sortField === 'stuffingDate') {
        comparison = new Date(a.stuffingDate) - new Date(b.stuffingDate);
      } else if (sortField === 'invoiceShipper') {
        comparison = a.invoiceShipper.localeCompare(b.invoiceShipper);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }

  let showModal = false;
  let selectedOrder = null;

  function handleEdit(order) {
    selectedOrder = order;
    showModal = true;
  }

  function handleDelete(order) {
    // TODO: Implement delete functionality
    console.log('Delete order:', order);
  }
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Order Calculation</h1>
      <p class="text-gray-600 mt-1">Lihat perhitungan order</p>
    </div>

    <!-- Header Actions -->
    <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
      <div class="flex justify-end">
        <div class="relative w-full sm:w-64">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari order..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
          />
          <Search
            size={20}
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr style="background-color: {primaryColor}">
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">No.</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" on:click={() => toggleSort('invoiceShipper')}>
                <div class="flex items-center gap-2">
                  Invoice Shipper
                  {#if sortField !== 'invoiceShipper'}
                    <ArrowUpDown size={14} />
                  {:else}
                    {#if sortDirection === 'asc'}
                      <ArrowUp size={14} />
                    {:else}
                      <ArrowDown size={14} />
                    {/if}
                  {/if}
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">No Job</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Data Shipper</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer" on:click={() => toggleSort('stuffingDate')}>
                <div class="flex items-center gap-2">
                  Tanggal Stuffing
                  {#if sortField !== 'stuffingDate'}
                    <ArrowUpDown size={14} />
                  {:else}
                    {#if sortDirection === 'asc'}
                      <ArrowUp size={14} />
                    {:else}
                      <ArrowDown size={14} />
                    {/if}
                  {/if}
                </div>
              </th>
              <th class="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#if filteredOrders.length === 0}
              <tr>
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-900">No orders found</td>
              </tr>
            {:else}
              {#each paginatedOrders as order, i}
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{order.invoiceShipper}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{order.jobNumber}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{order.shipper}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{order.stuffingDate}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="flex justify-center space-x-2">
                      <button
                        on:click={() => handleEdit(order)}
                        class="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                        style="color: {primaryColor};"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        on:click={() => handleDelete(order)}
                        class="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      {#if filteredOrders.length > 0}
        <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div class="flex items-center text-sm text-gray-700">
            <p>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
            </p>
          </div>
          <div class="flex gap-2">
            <button
              on:click={prevPage}
              disabled={currentPage === 1}
              style="color: {primaryColor}; border-color: {primaryColor}"
              class="px-4 py-2 rounded-lg bg-white border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-colors"
            >
              Previous
            </button>
            <button
              on:click={nextPage}
              disabled={currentPage === totalPages}
              style="color: {primaryColor}; border-color: {primaryColor}"
              class="px-4 py-2 rounded-lg bg-white border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>

  {#if showModal && selectedOrder}
    <OrderCalculationModal
      {showModal}
      order={selectedOrder}
      onClose={() => showModal = false}
    />
  {/if}
</div>