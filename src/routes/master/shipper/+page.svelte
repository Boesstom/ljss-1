<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';

  // Data dummy untuk contoh
  let shippers = [
    { id: 1, name: 'PT Shipper A', address: 'Jl. Raya A No. 123', stuffing_places: ['Jakarta', 'Surabaya'] },
    { id: 2, name: 'PT Shipper B', address: 'Jl. Raya B No. 456', stuffing_places: ['Bandung', 'Semarang'] },
    { id: 3, name: 'PT Shipper C', address: 'Jl. Raya C No. 789', stuffing_places: ['Medan', 'Palembang'] },
    { id: 4, name: 'PT Shipper D', address: 'Jl. Raya D No. 321', stuffing_places: ['Makassar', 'Manado'] },
    { id: 5, name: 'PT Shipper E', address: 'Jl. Raya E No. 654', stuffing_places: ['Denpasar', 'Malang'] },
  ];

  let showModal = false;
  let modalTitle = '';
  let currentShipper = {
    id: null,
    name: '',
    address: '',
    stuffing_places: ['']
  };

  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';

  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredShippers.length / itemsPerPage);
  $: paginatedShippers = filteredShippers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter shippers berdasarkan pencarian
  $: filteredShippers = shippers.filter(shipper =>
    shipper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipper.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipper.stuffing_places.some(place => 
      place.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }

  function addStuffingPlace() {
    currentShipper.stuffing_places = [...currentShipper.stuffing_places, ''];
  }

  function removeStuffingPlace(index) {
    currentShipper.stuffing_places = currentShipper.stuffing_places.filter((_, i) => i !== index);
  }

  function openAddModal() {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Tambah Data Shipper';
      currentShipper = {
        id: null,
        name: '',
        address: '',
        stuffing_places: ['']
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

  function handleSubmit() {
    if (!currentShipper.name || !currentShipper.address || currentShipper.stuffing_places.some(place => !place)) {
      alert('Semua field harus diisi');
      return;
    }

    if (currentShipper.id) {
      // Logic untuk edit shipper
      const index = shippers.findIndex(s => s.id === currentShipper.id);
      if (index !== -1) {
        shippers[index] = { ...currentShipper };
        shippers = [...shippers];
      }
    } else {
      // Logic untuk tambah shipper baru
      const newId = Math.max(...shippers.map(s => s.id)) + 1;
      shippers = [...shippers, { ...currentShipper, id: newId }];
    }

    showModal = false;
  }

  function handleDelete(id) {
    if (confirm('Are you sure you want to delete this shipper?')) {
      shippers = shippers.filter(s => s.id !== id);
    }
  }
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
          placeholder="Cari shipper..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        />
        <Search
          size={20}
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr style="background-color: {primaryColor}">
            <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">No.</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Shipper</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Alamat</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Stuffing Place</th>
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
                <td class="px-6 py-4 text-sm text-gray-900">{shipper.name}</td>
                <td class="px-6 py-4 text-sm text-gray-900">{shipper.address}</td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <ul class="list-disc list-inside">
                    {#each shipper.stuffing_places as place}
                      <li>{place}</li>
                    {/each}
                  </ul>
                </td>
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
                      on:click={() => handleDelete(shipper.id)}
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

      <!-- Pagination -->
      {#if filteredShippers.length > 0}
        <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div class="flex items-center text-sm text-gray-700">
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


<Modal show={showModal} title={modalTitle}>
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nama Shipper</label>
            <input
              type="text"
              id="name"
              bind:value={currentShipper.name}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea
              id="address"
              bind:value={currentShipper.address}
              rows="3"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              required
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Stuffing Places</label>
            {#each currentShipper.stuffing_places as place, i}
              <div class="flex gap-2 mb-2">
                <input
                  type="text"
                  bind:value={currentShipper.stuffing_places[i]}
                  class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#289CD7] focus:ring-[#289CD7]"
                />
                {#if i > 0}
                  <button
                    type="button"
                    on:click={() => removeStuffingPlace(i)}
                    class="px-2 py-1 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                {/if}
              </div>
            {/each}
            <button
              type="button"
              on:click={addStuffingPlace}
              class="mt-2 text-sm text-[#289CD7] hover:text-[#1e7ba8]"
            >
              + Add Stuffing Place
            </button>
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
              {modalTitle === 'Edit Shipper' ? 'Simpan Perubahan' : 'Tambah Data'}
            </button>
          </div>
        </form>
</Modal>
