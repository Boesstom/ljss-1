<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { supabase } from '$lib/supabase';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';
  let taxes = [];
  let showModal = false;
  let modalTitle = '';
  let currentTax = {
    id: null,
    nama_pajak: '',
    nominal_pajak: 0
  };

  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';
  let itemsPerPageOptions = [5, 10, 25, 50, 100, 500, 1000];

  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredTaxes.length / itemsPerPage);
  $: paginatedTaxes = filteredTaxes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter taxes berdasarkan pencarian
  $: filteredTaxes = taxes.filter(tax =>
    tax.nama_pajak.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function fetchTaxes() {
    try {
      const { data, error } = await supabase
        .from('data_pajak')
        .select('*');

      if (error) throw error;
      taxes = data;
    } catch (error) {
      console.error('Error fetching taxes:', error.message);
      alert('Error fetching taxes');
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
      modalTitle = 'Tambah Data Pajak';
      currentTax = {
        id: null,
        nama_pajak: '',
        nominal_pajak: 0
      };
      showModal = true;
    }, 100);
  }

  function openEditModal(tax) {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Edit Data Pajak';
      currentTax = { ...tax };
      showModal = true;
    }, 100);
  }

  async function handleSubmit() {
    if (!currentTax.nama_pajak || currentTax.nominal_pajak <= 0) {
      alert('Semua field harus diisi dengan benar');
      return;
    }

    try {
      if (currentTax.id === null) {
        // Add new tax
        const { data, error } = await supabase
          .from('data_pajak')
          .insert([{
            nama_pajak: currentTax.nama_pajak,
            nominal_pajak: currentTax.nominal_pajak
          }])
          .select();

        if (error) throw error;
        taxes = [...taxes, data[0]];
      } else {
        // Update existing tax
        const { error } = await supabase
          .from('data_pajak')
          .update({
            nama_pajak: currentTax.nama_pajak,
            nominal_pajak: currentTax.nominal_pajak
          })
          .eq('id', currentTax.id);

        if (error) throw error;
        taxes = taxes.map(t =>
          t.id === currentTax.id ? currentTax : t
        );
      }
      showModal = false;
    } catch (error) {
      console.error('Error saving tax:', error.message);
      alert('Error saving tax');
    }
  }

  async function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const { error } = await supabase
          .from('data_pajak')
          .delete()
          .eq('id', id);

        if (error) throw error;
        taxes = taxes.filter(t => t.id !== id);
        currentPage = Math.min(currentPage, Math.ceil(taxes.length / itemsPerPage));
      } catch (error) {
        console.error('Error deleting tax:', error.message);
        alert('Error deleting tax');
      }
    }
  }

  onMount(() => {
    fetchTaxes();
  });
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Data Pajak</h1>
      <p class="text-gray-600 mt-1">Kelola data pajak anda</p>
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
          <span>Tambah Data Pajak</span>
        </button>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari data pajak..."
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
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Nama Pajak</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Nominal Pajak</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each paginatedTaxes as tax, index}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tax.nama_pajak}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Rp {tax.nominal_pajak.toLocaleString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <div class="flex gap-3">
                    <button
                      on:click={() => openEditModal(tax)}
                      style="background-color: {primaryColor}"
                      class="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      on:click={() => handleDelete(tax.id)}
                      class="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Rows per page:</span>
            <select
              bind:value={itemsPerPage}
              class="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {#each itemsPerPageOptions as option}
                <option value={option}>{option}</option>
              {/each}
            </select>
          </div>
          <div class="flex items-center gap-2">
            <button
              on:click={prevPage}
              disabled={currentPage === 1}
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              on:click={nextPage}
              disabled={currentPage === totalPages}
              class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Modal -->
<Modal show={showModal} title={modalTitle}>
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="nama_pajak" class="block text-sm font-medium text-gray-700 mb-1">Nama Pajak</label>
      <input
        type="text"
        id="nama_pajak"
        bind:value={currentTax.nama_pajak}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="nominal_pajak" class="block text-sm font-medium text-gray-700 mb-1">Nominal Pajak</label>
      <input
        type="number"
        id="nominal_pajak"
        bind:value={currentTax.nominal_pajak}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        min="0"
        step="0.01"
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
        {modalTitle === 'Edit Data Pajak' ? 'Simpan Perubahan' : 'Tambah Data'}
      </button>
    </div>
  </form>
</Modal>