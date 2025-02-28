<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { supabase } from '$lib/supabase';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';
  let accounts = [];
  let showModal = false;
  let modalTitle = '';
  let currentAccount = {
    id: null,
    nama_bank: '',
    atas_nama: '',
    nomor_rekening: ''
  };

  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';
  let itemsPerPageOptions = [5, 10, 25, 50, 100, 500, 1000];

  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  $: paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter accounts berdasarkan pencarian
  $: filteredAccounts = accounts.filter(account =>
    account.nama_bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.atas_nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.nomor_rekening.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function fetchAccounts() {
    try {
      const { data, error } = await supabase
        .from('data_rekening')
        .select('*');

      if (error) throw error;
      accounts = data;
    } catch (error) {
      console.error('Error fetching accounts:', error.message);
      alert('Error fetching accounts');
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
      modalTitle = 'Tambah Data Rekening';
      currentAccount = {
        id: null,
        nama_bank: '',
        atas_nama: '',
        nomor_rekening: ''
      };
      showModal = true;
    }, 100);
  }

  function openEditModal(account) {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Edit Data Rekening';
      currentAccount = { ...account };
      showModal = true;
    }, 100);
  }

  async function handleSubmit() {
    if (!currentAccount.nama_bank || !currentAccount.atas_nama || !currentAccount.nomor_rekening) {
      alert('Semua field harus diisi');
      return;
    }

    try {
      if (currentAccount.id === null) {
        // Add new account
        const { data, error } = await supabase
          .from('data_rekening')
          .insert([{
            nama_bank: currentAccount.nama_bank,
            atas_nama: currentAccount.atas_nama,
            nomor_rekening: currentAccount.nomor_rekening
          }])
          .select();

        if (error) throw error;
        accounts = [...accounts, data[0]];
      } else {
        // Update existing account
        const { error } = await supabase
          .from('data_rekening')
          .update({
            nama_bank: currentAccount.nama_bank,
            atas_nama: currentAccount.atas_nama,
            nomor_rekening: currentAccount.nomor_rekening
          })
          .eq('id', currentAccount.id);

        if (error) throw error;
        accounts = accounts.map(a =>
          a.id === currentAccount.id ? currentAccount : a
        );
      }
      showModal = false;
    } catch (error) {
      console.error('Error saving account:', error.message);
      alert('Error saving account');
    }
  }

  async function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const { error } = await supabase
          .from('data_rekening')
          .delete()
          .eq('id', id);

        if (error) throw error;
        accounts = accounts.filter(a => a.id !== id);
        currentPage = Math.min(currentPage, Math.ceil(accounts.length / itemsPerPage));
      } catch (error) {
        console.error('Error deleting account:', error.message);
        alert('Error deleting account');
      }
    }
  }

  onMount(() => {
    fetchAccounts();
  });
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Data Rekening</h1>
      <p class="text-gray-600 mt-1">Kelola data rekening bank anda</p>
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
          <span>Tambah Data Rekening</span>
        </button>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari data rekening..."
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
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Nama Bank</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Atas Nama</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Nomor Rekening</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each paginatedAccounts as account, index}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {account.nama_bank}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {account.atas_nama}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {account.nomor_rekening}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <div class="flex gap-3">
                    <button
                      on:click={() => openEditModal(account)}
                      style="background-color: {primaryColor}"
                      class="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      on:click={() => handleDelete(account.id)}
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
      <label for="nama_bank" class="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
      <input
        type="text"
        id="nama_bank"
        bind:value={currentAccount.nama_bank}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="atas_nama" class="block text-sm font-medium text-gray-700 mb-1">Atas Nama</label>
      <input
        type="text"
        id="atas_nama"
        bind:value={currentAccount.atas_nama}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="nomor_rekening" class="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening</label>
      <input
        type="text"
        id="nomor_rekening"
        bind:value={currentAccount.nomor_rekening}
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
        {modalTitle === 'Edit Data Rekening' ? 'Simpan Perubahan' : 'Tambah Data'}
      </button>
    </div>
  </form>
</Modal>