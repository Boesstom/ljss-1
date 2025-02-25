<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { supabase } from '$lib/supabase';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';
  let vendors = [];
  let showModal = false;
  let modalTitle = '';
  let currentVendor = {
    id_data_vendor: null,
    nama_data_vendor: '',
    alamat_data_vendor: '',
    telepon_data_vendor: '',
    jenis_dokumen_data_vendor: ''
  };

  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';
  let itemsPerPageOptions = [5, 10, 25, 50, 100, 500, 1000];
  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  $: paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter vendors berdasarkan pencarian
  $: filteredVendors = vendors.filter(vendor =>
    vendor.nama_data_vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.alamat_data_vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.jenis_dokumen_data_vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function fetchVendors() {
    try {
      const { data, error } = await supabase
        .from('md_data_vendor')
        .select('*');

      if (error) throw error;
      vendors = data;
    } catch (error) {
      console.error('Error fetching vendors:', error.message);
      alert('Error fetching vendors');
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
      modalTitle = 'Tambah Data Vendor';
      currentVendor = {
        id_data_vendor: null,
        nama_data_vendor: '',
        alamat_data_vendor: '',
        telepon_data_vendor: '',
        jenis_dokumen_data_vendor: ''
      };
      showModal = true;
    }, 100);
  }

  function openEditModal(vendor) {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Edit Data Vendor';
      currentVendor = { ...vendor };
      showModal = true;
    }, 100);
  }

  async function handleSubmit() {
    if (!currentVendor.nama_data_vendor || !currentVendor.alamat_data_vendor || 
        !currentVendor.telepon_data_vendor || !currentVendor.jenis_dokumen_data_vendor) {
      alert('Semua field harus diisi');
      return;
    }

    try {
      if (currentVendor.id_data_vendor === null) {
        // Add new vendor
        const { data, error } = await supabase
          .from('md_data_vendor')
          .insert([{
            nama_data_vendor: currentVendor.nama_data_vendor,
            alamat_data_vendor: currentVendor.alamat_data_vendor,
            telepon_data_vendor: currentVendor.telepon_data_vendor,
            jenis_dokumen_data_vendor: currentVendor.jenis_dokumen_data_vendor
          }])
          .select();

        if (error) throw error;
        vendors = [...vendors, data[0]];
      } else {
        // Update existing vendor
        const { error } = await supabase
          .from('md_data_vendor')
          .update({
            nama_data_vendor: currentVendor.nama_data_vendor,
            alamat_data_vendor: currentVendor.alamat_data_vendor,
            telepon_data_vendor: currentVendor.telepon_data_vendor,
            jenis_dokumen_data_vendor: currentVendor.jenis_dokumen_data_vendor
          })
          .eq('id_data_vendor', currentVendor.id_data_vendor);

        if (error) throw error;
        vendors = vendors.map(v =>
          v.id_data_vendor === currentVendor.id_data_vendor ? currentVendor : v
        );
      }
      showModal = false;
    } catch (error) {
      console.error('Error saving vendor:', error.message);
      alert('Error saving vendor');
    }
  }

  async function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const { error } = await supabase
          .from('md_data_vendor')
          .delete()
          .eq('id_data_vendor', id);

        if (error) throw error;
        vendors = vendors.filter(v => v.id_data_vendor !== id);
        currentPage = Math.min(currentPage, Math.ceil(vendors.length / itemsPerPage));
      } catch (error) {
        console.error('Error deleting vendor:', error.message);
        alert('Error deleting vendor');
      }
    }
  }

  onMount(() => {
    fetchVendors();
  });
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Data Vendor</h1>
      <p class="text-gray-600 mt-1">Kelola data vendor anda</p>
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
          <span>Tambah Data Vendor</span>
        </button>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari data vendor..."
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
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Telepon</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Jenis Dokumen</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#if filteredVendors.length === 0}
              <tr>
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-900">No vendors found</td>
              </tr>
            {:else}
              {#each paginatedVendors as vendor, i}
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{vendor.nama_data_vendor}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{vendor.alamat_data_vendor}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{vendor.telepon_data_vendor}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{vendor.jenis_dokumen_data_vendor}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex gap-3">
                      <button
                        on:click={() => openEditModal(vendor)}
                        style="background-color: {primaryColor}"
                        class="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        on:click={() => handleDelete(vendor.id_data_vendor)}
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
      {#if filteredVendors.length > 0}
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredVendors.length)} of {filteredVendors.length} entries
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
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nama Vendor</label>
      <input
        type="text"
        id="name"
        bind:value={currentVendor.nama_data_vendor}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
      <textarea
        id="address"
        bind:value={currentVendor.alamat_data_vendor}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
        rows="3"
      ></textarea>
    </div>
    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
      <input
        type="tel"
        id="phone"
        bind:value={currentVendor.telepon_data_vendor}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="documentType" class="block text-sm font-medium text-gray-700 mb-1">Jenis Dokumen</label>
      <select
        id="documentType"
        bind:value={currentVendor.jenis_dokumen_data_vendor}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      >
        <option value="">Pilih Jenis Dokumen</option>
        <option value="SIUP">SIUP</option>
        <option value="TDP">TDP</option>
        <option value="NPWP">NPWP</option>
      </select>
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
        {modalTitle === 'Edit Data Vendor' ? 'Simpan Perubahan' : 'Tambah Data'}
      </button>
    </div>
  </form>
</Modal>