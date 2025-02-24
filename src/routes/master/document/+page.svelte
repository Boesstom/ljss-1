<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';

  // Data dummy untuk contoh
  let documents = [
    { id: 1, name: 'Surat Jalan' },
    { id: 2, name: 'Invoice' },
    { id: 3, name: 'Bill of Lading' },
    { id: 4, name: 'Packing List' },
    { id: 5, name: 'Certificate of Origin' },
  ];

  let showModal = false;
  let modalTitle = '';
  let currentDocument = {
    id: null,
    name: ''
  };

  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';

  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  $: paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter documents berdasarkan pencarian
  $: filteredDocuments = documents.filter(document =>
    document.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      modalTitle = 'Tambah Data Dokumen';
      currentDocument = {
        id: null,
        name: ''
      };
      showModal = true;
    }, 100);
  }

  function openEditModal(document) {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Edit Data Dokumen';
      currentDocument = { ...document };
      showModal = true;
    }, 100);
  }

  function handleSubmit() {
    if (!currentDocument.name) {
      alert('Nama dokumen harus diisi');
      return;
    }

    if (currentDocument.id === null) {
      // Add new document
      const newDocument = {
        ...currentDocument,
        id: documents.length + 1
      };
      documents = [...documents, newDocument];
    } else {
      // Update existing document
      documents = documents.map(d =>
        d.id === currentDocument.id ? currentDocument : d
      );
    }
    showModal = false;
  }

  function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      documents = documents.filter(d => d.id !== id);
      currentPage = Math.min(currentPage, Math.ceil(documents.length / itemsPerPage));
    }
  }
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Data Dokumen</h1>
      <p class="text-gray-600 mt-1">Kelola data dokumen anda</p>
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
          <span>Tambah Data Dokumen</span>
        </button>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari data dokumen..."
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
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Nama Dokumen</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#if filteredDocuments.length === 0}
              <tr>
                <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-900">No documents found</td>
              </tr>
            {:else}
              {#each paginatedDocuments as document, i}
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{document.name}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex gap-3">
                      <button
                        on:click={() => openEditModal(document)}
                        style="background-color: {primaryColor}"
                        class="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        on:click={() => handleDelete(document.id)}
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
      {#if filteredDocuments.length > 0}
        <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div class="flex items-center text-sm text-gray-700">
            <p>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDocuments.length)} of {filteredDocuments.length} entries
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
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nama Dokumen</label>
      <input
        type="text"
        id="name"
        bind:value={currentDocument.name}
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
        {modalTitle === 'Edit Data Dokumen' ? 'Simpan Perubahan' : 'Tambah Data'}
      </button>
    </div>
  </form>
</Modal>