<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { supabase } from '$lib/supabase';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';
  let shippers = [];
  let showModal = false;
  let modalTitle = '';
  let currentShipper = {
    id_md_data_shipper: null,
    nama_data_shipper: '',
    alamat_data_shipper: '',
    stuffing_place_data_shipper: ['']
  };
  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';
  let itemsPerPageOptions = [5, 10, 25, 50, 100, 500, 1000];
  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredShippers.length / itemsPerPage);
  $: paginatedShippers = filteredShippers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Filter shippers berdasarkan pencarian
  $: filteredShippers = shippers.filter(shipper =>
    shipper.nama_data_shipper.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipper.alamat_data_shipper.toLowerCase().includes(searchQuery.toLowerCase())
  );
  async function fetchShippers() {
    try {
      const { data, error } = await supabase
        .from('md_data_shipper')
        .select('*');
      if (error) throw error;
      shippers = data;
    } catch (error) {
      console.error('Error fetching shippers:', error.message);
      alert('Error fetching shippers');
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
      modalTitle = 'Tambah Data Shipper';
      currentShipper = {
        id_md_data_shipper: null,
        nama_data_shipper: '',
        alamat_data_shipper: '',
        stuffing_place_data_shipper: ['']
      };
      showModal = true;
    }, 100);
  }
  function openEditModal(shipper) {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Edit Data Shipper';
      currentShipper = { ...shipper };
      showModal = true;
    }, 100);
  }
  function addStuffingPlace() {
    currentShipper.stuffing_place_data_shipper = [...currentShipper.stuffing_place_data_shipper, ''];
  }
  function removeStuffingPlace(index) {
    currentShipper.stuffing_place_data_shipper = currentShipper.stuffing_place_data_shipper.filter((_, i) => i !== index);
  }
  async function handleSubmit() {
    try {
      // Validate required fields
      if (!currentShipper.nama_data_shipper?.trim() || !currentShipper.alamat_data_shipper?.trim() || 
          !currentShipper.stuffing_place_data_shipper?.every(place => place.trim())) {
        alert('Semua field harus diisi dengan benar');
        return;
      }

      const shipperData = {
        nama_data_shipper: currentShipper.nama_data_shipper.trim(),
        alamat_data_shipper: currentShipper.alamat_data_shipper.trim(),
        stuffing_place_data_shipper: currentShipper.stuffing_place_data_shipper.filter(place => place.trim())
      };

      if (currentShipper.id_md_data_shipper === null) {
        // Add new shipper
        const { data, error } = await supabase
          .from('md_data_shipper')
          .insert([shipperData])
          .select();

        if (error) throw error;
        if (data && data[0]) {
          shippers = [...shippers, data[0]];
          alert('Data shipper berhasil ditambahkan');
        }
      } else {
        // Update existing shipper
        const { data, error } = await supabase
          .from('md_data_shipper')
          .update(shipperData)
          .eq('id_md_data_shipper', currentShipper.id_md_data_shipper)
          .select();

        if (error) throw error;
        if (data && data[0]) {
          shippers = shippers.map(s =>
            s.id_md_data_shipper === currentShipper.id_md_data_shipper ? data[0] : s
          );
          alert('Data shipper berhasil diperbarui');
        }
      }
      showModal = false;
      await fetchShippers(); // Refresh data after successful operation
    } catch (error) {
      console.error('Error saving shipper:', error.message);
      alert(`Error: ${error.message}`);
    }
  }
  async function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const { error } = await supabase
          .from('md_data_shipper')
          .delete()
          .eq('id_md_data_shipper', id);

        if (error) throw error;
        shippers = shippers.filter(s => s.id_md_data_shipper !== id);
        currentPage = Math.min(currentPage, Math.ceil(shippers.length / itemsPerPage));
      } catch (error) {
        console.error('Error deleting shipper:', error.message);
        alert('Error deleting shipper');
      }
    }
  }
  onMount(() => {
    fetchShippers();
  });
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Data Shipper</h1>
      <p class="text-gray-600 mt-1">Kelola data shipper anda</p>
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
          <span>Tambah Data Shipper</span>
        </button>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari data shipper..."
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
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Tempat Stuffing</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#if filteredShippers.length === 0}
              <tr>
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-900">No shippers found</td>
              </tr>
            {:else}
              {#each paginatedShippers as shipper, i}
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{shipper.nama_data_shipper}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{shipper.alamat_data_shipper}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{shipper.stuffing_place_data_shipper.join(', ')}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex gap-3">
                      <button
                        on:click={() => openEditModal(shipper)}
                        style="background-color: {primaryColor}"
                        class="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        on:click={() => handleDelete(shipper.id_md_data_shipper)}
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
      {#if filteredShippers.length > 0}
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredShippers.length)} of {filteredShippers.length} entries
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
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nama Shipper</label>
      <input
        type="text"
        id="name"
        bind:value={currentShipper.nama_data_shipper}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
      <textarea
        id="address"
        bind:value={currentShipper.alamat_data_shipper}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
        rows="3"
      ></textarea>
    </div>
    <div>
      <div class="flex justify-between items-center mb-1">
        <label class="block text-sm font-medium text-gray-700">Tempat Stuffing</label>
        <button
          type="button"
          on:click={addStuffingPlace}
          class="text-sm text-blue-600 hover:text-blue-700"
        >
          + Tambah Tempat
        </button>
      </div>
      {#each currentShipper.stuffing_place_data_shipper as place, i}
        <div class="flex gap-2 mb-2">
          <input
            type="text"
            bind:value={currentShipper.stuffing_place_data_shipper[i]}
            placeholder="Masukkan tempat stuffing"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
            required
          />
          {#if currentShipper.stuffing_place_data_shipper.length > 1}
            <button
              type="button"
              on:click={() => removeStuffingPlace(i)}
              class="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          {/if}
        </div>
      {/each}
      <div class="flex justify-end mt-4">
        <button
          type="submit"
          style="background-color: {primaryColor}"
          class="px-4 py-2.5 rounded-lg text-white hover:opacity-90 transition-colors font-medium"
        >
          {currentShipper.id_md_data_shipper === null ? 'Tambah' : 'Simpan'}
        </button>
      </div>
    </div>
  </form>
</Modal>
