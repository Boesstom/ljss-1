<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';

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

  let showModal = false;
  let modalTitle = '';
  let currentOrder = {
    id: null,
    invoiceShipper: '',
    jobNumber: '',
    shipper: '',
    stuffingDate: ''
  };

  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';

  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  $: paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter orders berdasarkan pencarian
  $: filteredOrders = orders.filter(order =>
    order.invoiceShipper.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.shipper.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }

  function openAddModal() {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Tambah Order';
      currentOrder = {
        id: null,
        invoiceShipper: '',
        jobNumber: '',
        shipper: '',
        stuffingDate: ''
      };
      showModal = true;
    }, 100);
  }

  function openEditModal(order) {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Edit Order';
      currentOrder = { ...order };
      showModal = true;
    }, 100);
  }

  function handleSubmit() {
    if (!currentOrder.invoiceShipper || !currentOrder.jobNumber || !currentOrder.shipper || !currentOrder.stuffingDate) {
      alert('Semua field harus diisi');
      return;
    }

    if (currentOrder.id === null) {
      // Add new order
      const newOrder = {
        ...currentOrder,
        id: orders.length + 1
      };
      orders = [...orders, newOrder];
    } else {
      // Update existing order
      orders = orders.map(o =>
        o.id === currentOrder.id ? currentOrder : o
      );
    }
    showModal = false;
  }

  function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      orders = orders.filter(o => o.id !== id);
      currentPage = Math.min(currentPage, Math.ceil(orders.length / itemsPerPage));
    }
  }
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Data Order</h1>
      <p class="text-gray-600 mt-1">Kelola data order anda</p>
    </div>

    <!-- Header Actions -->
    <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          on:click={openAddModal}
          style="background-color: {primaryColor}"
          class="text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-colors w-full sm:w-auto font-medium"
        >
          <Plus size={20} />
          <span>Tambah Order</span>
        </button>

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
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Invoice Shipper</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">No Job</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Data Shipper</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Tanggal Stuffing</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
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
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex gap-3">
                      <button
                        on:click={() => openEditModal(order)}
                        style="background-color: {primaryColor}"
                        class="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        on:click={() => handleDelete(order.id)}
                        class="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
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
</div>

<!-- Modal -->
<Modal show={showModal} title={modalTitle}>
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="invoiceShipper" class="block text-sm font-medium text-gray-700 mb-1">Invoice Shipper</label>
      <input
        type="text"
        id="invoiceShipper"
        bind:value={currentOrder.invoiceShipper}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="jobNumber" class="block text-sm font-medium text-gray-700 mb-1">No Job</label>
      <input
        type="text"
        id="jobNumber"
        bind:value={currentOrder.jobNumber}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="shipper" class="block text-sm font-medium text-gray-700 mb-1">Data Shipper</label>
      <input
        type="text"
        id="shipper"
        bind:value={currentOrder.shipper}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="stuffingDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal Stuffing</label>
      <input
        type="date"
        id="stuffingDate"
        bind:value={currentOrder.stuffingDate}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div class="flex justify-end gap-4 mt-6">
      <button
        type="button"
        on:click={() => (showModal = false)}
        class="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Batal
      </button>
      <button
        type="submit"
        style="background-color: {primaryColor}"
        class="px-4 py-2.5 text-white rounded-lg hover:opacity-90 transition-colors"
      >
        {modalTitle === 'Edit Order' ? 'Simpan Perubahan' : 'Tambah Data'}
      </button>
    </div>
  </form>
</Modal>