<script>
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';
  
  // Data dummy untuk contoh
  let parties = [
    { id: 1, jumlah: 100, ukuran: '20ft' },
    { id: 2, jumlah: 150, ukuran: '40ft' },
    { id: 3, jumlah: 75, ukuran: '20ft' },
    { id: 4, jumlah: 200, ukuran: '40ft' },
    { id: 5, jumlah: 125, ukuran: '20ft' },
  ];

  // Modal state
  let showModal = false;
  let modalTitle = '';
  let currentParty = {
    id: null,
    jumlah: '',
    ukuran: ''
  };
  let isEditing = false;
  let editingParty = { id: null, jumlah: '', ukuran: '' };

  // Variabel untuk paginasi
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';

  // Handler untuk paginasi
  $: totalPages = Math.ceil(parties.length / itemsPerPage);
  $: paginatedParties = parties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
      modalTitle = 'Tambah Data Party';
      currentParty = {
        id: null,
        jumlah: '',
        ukuran: ''
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

  function handleSubmit() {
    if (!currentParty.jumlah || !currentParty.ukuran) {
      alert('Semua field harus diisi');
      return;
    }

    if (currentParty.id === null) {
      // Add new party
      const newParty = {
        ...currentParty,
        id: parties.length + 1
      };
      parties = [...parties, newParty];
    } else {
      // Update existing party
      parties = parties.map(p =>
        p.id === currentParty.id ? currentParty : p
      );
    }
    showModal = false;
  }

  function closeModal() {
    showModal = false;
    editingParty = { id: null, jumlah: '', ukuran: '' };
  }

  function handleDelete(id) {
    console.log('Delete party:', id);
  }

  // Definisi warna utama
  const primaryColor = '#289CD7';
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
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr style="background-color: {primaryColor}">
            <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
              No.
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
              Jumlah
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
              Ukuran
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          {#each paginatedParties as party, index}
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {party.jumlah}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {party.ukuran}
              </td>
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
                    on:click={() => handleDelete(party.id)}
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
    <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <div class="flex items-center text-sm text-gray-700">
        <p>
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(
            currentPage * itemsPerPage,
            parties.length
          )} of {parties.length} entries
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
  </div>
</div>
</div>

<!-- Modal -->
<Modal show={showModal} title={isEditing ? 'Edit Data Party' : 'Tambah Data Party'}>
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
            <div>
              <label for="jumlah" class="block text-sm font-medium text-gray-700 mb-1">
                Jumlah
              </label>
              <input
                type="number"
                id="jumlah"
                bind:value={editingParty.jumlah}
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label for="ukuran" class="block text-sm font-medium text-gray-700 mb-1">
                Ukuran
              </label>
              <select
                id="ukuran"
                bind:value={editingParty.ukuran}
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
                on:click={closeModal}
                class="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                style="background-color: {primaryColor}"
                class="px-4 py-2.5 text-white rounded-lg hover:opacity-90 transition-colors"
              >
                {isEditing ? 'Simpan Perubahan' : 'Tambah Data'}
              </button>
            </div>
  </form>
</Modal>