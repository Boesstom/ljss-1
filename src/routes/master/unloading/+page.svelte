<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { supabase } from '$lib/supabase';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';
  let unloadings = [];
  let showModal = false;
  let modalTitle = '';
  let currentUnloading = {
    id_data_bongkar: null,
    nama_data_bongkar: '',
    alamat_data_bongkar: ''
  };
  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';
  let itemsPerPageOptions = [5, 10, 25, 50, 100, 500, 1000];
  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredUnloadings.length / itemsPerPage);
  $: paginatedUnloadings = filteredUnloadings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Filter unloadings berdasarkan pencarian
  $: filteredUnloadings = unloadings.filter(unloading =>
    unloading.nama_data_bongkar.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unloading.alamat_data_bongkar.toLowerCase().includes(searchQuery.toLowerCase())
  );
  async function fetchUnloadings() {
    try {
      const { data, error } = await supabase
        .from('md_data_bongkar')
        .select('*');

      if (error) throw error;
      unloadings = data;
    } catch (error) {
      console.error('Error fetching unloadings:', error.message);
      alert('Error fetching unloadings');
    }
  }
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
        id_data_bongkar: null,
        nama_data_bongkar: '',
        alamat_data_bongkar: ''
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
  async function handleSubmit() {
    try {
      if (!currentUnloading.nama_data_bongkar?.trim() || !currentUnloading.alamat_data_bongkar?.trim()) {
        alert('Semua field harus diisi');
        return;
      }
      const unloadingData = {
        nama_data_bongkar: currentUnloading.nama_data_bongkar.trim(),
        alamat_data_bongkar: currentUnloading.alamat_data_bongkar.trim()
      };
      if (currentUnloading.id_data_bongkar === null) {
        // Add new unloading
        const { data, error } = await supabase
          .from('md_data_bongkar')
          .insert([unloadingData])
          .select();

        if (error) throw error;
        if (data && data[0]) {
          unloadings = [...unloadings, data[0]];
          alert('Data bongkar berhasil ditambahkan');
        }
      } else {
        // Update existing unloading
        const { data, error } = await supabase
          .from('md_data_bongkar')
          .update(unloadingData)
          .eq('id_data_bongkar', currentUnloading.id_data_bongkar)
          .select();

        if (error) throw error;
        if (data && data[0]) {
          unloadings = unloadings.map(u =>
            u.id_data_bongkar === currentUnloading.id_data_bongkar ? data[0] : u
          );
          alert('Data bongkar berhasil diperbarui');
        }
      }
      showModal = false;
    } catch (error) {
      console.error('Error saving unloading:', error.message);
      alert(`Error: ${error.message}`);
    }
  }
  async function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const { error } = await supabase
          .from('md_data_bongkar')
          .delete()
          .eq('id_data_bongkar', id);

        if (error) throw error;
        unloadings = unloadings.filter(u => u.id_data_bongkar !== id);
        currentPage = Math.min(currentPage, Math.ceil(unloadings.length / itemsPerPage));
      } catch (error) {
        console.error('Error deleting unloading:', error.message);
        alert('Error deleting unloading');
      }
    }
  }
  onMount(() => {
    fetchUnloadings();
  });
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
                  <td class="px-6 py-4 text-sm text-gray-900">{unloading.nama_data_bongkar}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{unloading.alamat_data_bongkar}</td>
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
                        on:click={() => handleDelete(unloading.id_data_bongkar)}
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
            <p class="mr-4">
              Show
              <select
                bind:value={itemsPerPage}
                class="mx-2 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              >
                {#each itemsPerPageOptions as option}
                  <option value={option}>{option}</option>
                {/each}
              </select>
              entries
            </p>
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
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nama Bongkar</label>
      <input
        type="text"
        id="name"
        bind:value={currentUnloading.nama_data_bongkar}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
      <textarea
        id="address"
        bind:value={currentUnloading.alamat_data_bongkar}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
        rows="3"
      ></textarea>
    </div>
    <div class="flex justify-end mt-4">
      <button
        type="submit"
        style="background-color: {primaryColor}"
        class="px-4 py-2.5 rounded-lg text-white hover:opacity-90 transition-colors font-medium"
      >
        {currentUnloading.id_data_bongkar === null ? 'Tambah' : 'Simpan'}
      </button>
    </div>
  </form>
</Modal>