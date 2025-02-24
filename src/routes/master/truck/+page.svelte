<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';

  // Data dummy untuk contoh
  let trucks = [
    { id: 1, nopol: 'B 1234 ABC', driver: 'John Doe', vendor: 'PT Transport A', phone: '081234567890' },
    { id: 2, nopol: 'B 5678 DEF', driver: 'Jane Smith', vendor: 'PT Transport B', phone: '081234567891' },
    { id: 3, nopol: 'B 9012 GHI', driver: 'Mike Johnson', vendor: 'PT Transport C', phone: '081234567892' },
    { id: 4, nopol: 'B 3456 JKL', driver: 'Sarah Wilson', vendor: 'PT Transport D', phone: '081234567893' },
    { id: 5, nopol: 'B 7890 MNO', driver: 'David Brown', vendor: 'PT Transport E', phone: '081234567894' },
  ];

  let showModal = false;
  let modalTitle = '';
  let currentTruck = {
    id: null,
    nopol: '',
    driver: '',
    vendor: '',
    phone: ''
  };

  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';

  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredTrucks.length / itemsPerPage);
  $: paginatedTrucks = filteredTrucks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter trucks berdasarkan pencarian
  $: filteredTrucks = trucks.filter(truck =>
    truck.nopol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    truck.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
    truck.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    truck.phone.toLowerCase().includes(searchQuery.toLowerCase())
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
      modalTitle = 'Tambah Data Truck';
      currentTruck = {
        id: null,
        nopol: '',
        driver: '',
        vendor: '',
        phone: ''
      };
      showModal = true;
    }, 100);
  }

  function openEditModal(truck) {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Edit Data Truck';
      currentTruck = { ...truck };
      showModal = true;
    }, 100);
  }

  function handleSubmit() {
    if (!currentTruck.nopol || !currentTruck.driver || !currentTruck.vendor || !currentTruck.phone) {
      alert('Semua field harus diisi');
      return;
    }

    if (currentTruck.id === null) {
      // Add new truck
      const newTruck = {
        ...currentTruck,
        id: trucks.length + 1
      };
      trucks = [...trucks, newTruck];
    } else {
      // Update existing truck
      trucks = trucks.map(t =>
        t.id === currentTruck.id ? currentTruck : t
      );
    }
    showModal = false;
  }

  function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      trucks = trucks.filter(t => t.id !== id);
      currentPage = Math.min(currentPage, Math.ceil(trucks.length / itemsPerPage));
    }
  }
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Data Truck</h1>
      <p class="text-gray-600 mt-1">Kelola data truck anda</p>
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
          <span>Tambah Data Truck</span>
        </button>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari data truck..."
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
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Nopol</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Driver</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Nama Vendor</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Telfon</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#if filteredTrucks.length === 0}
              <tr>
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-900">No trucks found</td>
              </tr>
            {:else}
              {#each paginatedTrucks as truck, i}
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{truck.nopol}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{truck.driver}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{truck.vendor}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{truck.phone}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex gap-3">
                      <button
                        on:click={() => openEditModal(truck)}
                        style="background-color: {primaryColor}"
                        class="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        on:click={() => handleDelete(truck.id)}
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
      {#if filteredTrucks.length > 0}
        <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div class="flex items-center text-sm text-gray-700">
            <p>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTrucks.length)} of {filteredTrucks.length} entries
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
      <label for="nopol" class="block text-sm font-medium text-gray-700 mb-1">Nopol</label>
      <input
        type="text"
        id="nopol"
        bind:value={currentTruck.nopol}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="driver" class="block text-sm font-medium text-gray-700 mb-1">Driver</label>
      <input
        type="text"
        id="driver"
        bind:value={currentTruck.driver}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="vendor" class="block text-sm font-medium text-gray-700 mb-1">Nama Vendor</label>
      <input
        type="text"
        id="vendor"
        bind:value={currentTruck.vendor}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telfon</label>
      <input
        type="tel"
        id="phone"
        bind:value={currentTruck.phone}
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
        {modalTitle === 'Edit Data Truck' ? 'Simpan Perubahan' : 'Tambah Data'}
      </button>
    </div>
  </form>
</Modal>