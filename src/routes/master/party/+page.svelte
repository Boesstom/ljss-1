<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { supabase } from '$lib/supabase';
  
  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';
  
  let parties = [];
  let showModal = false;
  let modalTitle = '';
  let currentParty = {
    id_md_data_party: null,
    jumlah_data_party: '',
    ukuran_data_party: ''
  };
  
  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';
  let itemsPerPageOptions = [5, 10, 25, 50, 100, 500, 1000];
  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredParties.length / itemsPerPage);
  $: paginatedParties = filteredParties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Filter parties berdasarkan pencarian
  $: filteredParties = parties.filter(party =>
    party.jumlah_data_party.toString().includes(searchQuery.toLowerCase()) ||
    party.ukuran_data_party.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  async function fetchParties() {
    try {
      const { data, error } = await supabase
        .from('md_data_party')
        .select('*');
  
      if (error) throw error;
      parties = data;
    } catch (error) {
      console.error('Error fetching parties:', error.message);
      alert('Error fetching parties');
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
      modalTitle = 'Tambah Data Party';
      currentParty = {
        id_md_data_party: null,
        jumlah_data_party: '',
        ukuran_data_party: ''
      };
      showModal = true;
    }, 100);
  }
  
  function openEditModal(party) {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Edit Data Party';
      currentParty = { ...party };
      showModal = true;
    }, 100);
  }
  
  async function handleSubmit() {
    if (!currentParty.jumlah_data_party || !currentParty.ukuran_data_party) {
      alert('Semua field harus diisi');
      return;
    }
  
    try {
      if (currentParty.id_md_data_party === null) {
        // Add new party
        const { data, error } = await supabase
          .from('md_data_party')
          .insert([{
            jumlah_data_party: currentParty.jumlah_data_party,
            ukuran_data_party: currentParty.ukuran_data_party
          }])
          .select();
  
        if (error) throw error;
        parties = [...parties, data[0]];
      } else {
        // Update existing party
        const { error } = await supabase
          .from('md_data_party')
          .update({
            jumlah_data_party: currentParty.jumlah_data_party,
            ukuran_data_party: currentParty.ukuran_data_party
          })
          .eq('id_md_data_party', currentParty.id_md_data_party);
  
        if (error) throw error;
        parties = parties.map(p =>
          p.id_md_data_party === currentParty.id_md_data_party ? currentParty : p
        );
      }
      showModal = false;
    } catch (error) {
      console.error('Error saving party:', error.message);
      alert('Error saving party');
    }
  }
  
  async function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const { error } = await supabase
          .from('md_data_party')
          .delete()
          .eq('id_md_data_party', id);
  
        if (error) throw error;
        parties = parties.filter(p => p.id_md_data_party !== id);
        currentPage = Math.min(currentPage, Math.ceil(parties.length / itemsPerPage));
      } catch (error) {
        console.error('Error deleting party:', error.message);
        alert('Error deleting party');
      }
    }
  }
  
  onMount(() => {
    fetchParties();
  });
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Data Party</h1>
      <p class="text-gray-600 mt-1">Kelola data party anda</p>
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
          <span>Tambah Data Party</span>
        </button>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari data party..."
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
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Jumlah</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Ukuran</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#if filteredParties.length === 0}
              <tr>
                <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-900">No parties found</td>
              </tr>
            {:else}
              {#each paginatedParties as party, i}
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{party.jumlah_data_party}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{party.ukuran_data_party}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex gap-3">
                      <button
                        on:click={() => openEditModal(party)}
                        style="background-color: {primaryColor}"
                        class="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        on:click={() => handleDelete(party.id_md_data_party)}
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
      {#if filteredParties.length > 0}
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredParties.length)} of {filteredParties.length} entries
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
      <label for="jumlah" class="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
      <input
        type="number"
        id="jumlah"
        bind:value={currentParty.jumlah_data_party}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="ukuran" class="block text-sm font-medium text-gray-700 mb-1">Ukuran</label>
      <select
        id="ukuran"
        bind:value={currentParty.ukuran_data_party}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      >
        <option value="">Pilih Ukuran</option>
        <option value="20ft">20ft</option>
        <option value="40ft">40ft</option>
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
        {modalTitle === 'Edit Data Party' ? 'Simpan Perubahan' : 'Tambah Data'}
      </button>
    </div>
  </form>
</Modal>