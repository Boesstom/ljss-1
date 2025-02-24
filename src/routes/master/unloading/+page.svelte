<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';

  // Data dummy untuk contoh
  let unloadings = [
    { id: 1, name: 'Tempat Bongkar A', address: 'Jl. Bongkar A No. 123' },
    { id: 2, name: 'Tempat Bongkar B', address: 'Jl. Bongkar B No. 456' },
    { id: 3, name: 'Tempat Bongkar C', address: 'Jl. Bongkar C No. 789' },
    { id: 4, name: 'Tempat Bongkar D', address: 'Jl. Bongkar D No. 321' },
    { id: 5, name: 'Tempat Bongkar E', address: 'Jl. Bongkar E No. 654' },
  ];

  let showModal = false;
  let modalTitle = '';
  let currentUnloading = {
    id: null,
    name: '',
    address: ''
  };

  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';

  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredUnloadings.length / itemsPerPage);
  $: paginatedUnloadings = filteredUnloadings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter unloadings berdasarkan pencarian
  $: filteredUnloadings = unloadings.filter(unloading =>
    unloading.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unloading.address.toLowerCase().includes(searchQuery.toLowerCase())
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
      modalTitle = 'Tambah Data Bongkar';
      currentUnloading = {
        id: null,
        name: '',
        address: ''
      };
      showModal = true;
    }, 100);
  }

  function openEditModal(unloading) {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Edit Data Bongkar';
      currentUnloading = { ...unloading };
      showModal = true;
    }, 100);
  }

  function handleSubmit() {
    if (!currentUnloading.name || !currentUnloading.address) {
      alert('Semua field harus diisi');
      return;
    }

    if (currentUnloading.id === null) {
      // Add new unloading
      const newUnloading = {
        ...currentUnloading,
        id: unloadings.length + 1
      };
      unloadings = [...unloadings, newUnloading];
    } else {
      // Update existing unloading
      unloadings = unloadings.map(u =>
        u.id === currentUnloading.id ? currentUnloading : u
      );
    }
    showModal = false;
  }

  function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      unloadings = unloadings.filter(u => u.id !== id);
      currentPage = Math.min(currentPage, Math.ceil(unloadings.length / itemsPerPage));
    }
  }
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Data Bongkar</h1>
      <p class="text-gray-600 mt-1">Kelola data bongkar anda</p>
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
          <span>Tambah Data Bongkar</span>
        </button>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari data bongkar..."
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
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Nama</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Alamat</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#if filteredUnloadings.length === 0}
              <tr>
                <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-900">No unloadings found</td>
              </tr>
            {:else}
              {#each paginatedUnloadings as unloading, i}
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{unloading.name}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{unloading.address}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex gap-3">
                      <button
                        on:click={() => openEditModal(unloading)}
                        style="background-color: {primaryColor}"
                        class="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        on:click={() => handleDelete(unloading.id)}
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
      {#if filteredUnloadings.length > 0}
        <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div class="flex items-center text-sm text-gray-700">
            <p>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUnloadings.length)} of {filteredUnloadings.length} entries
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
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
      <input
        type="text"
        id="name"
        bind:value={currentUnloading.name}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
      <textarea
        id="address"
        bind:value={currentUnloading.address}
        rows="3"
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      ></textarea>
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
        {modalTitle === 'Edit Data Bongkar' ? 'Simpan Perubahan' : 'Tambah Data'}
      </button>
    </div>
  </form>
</Modal>