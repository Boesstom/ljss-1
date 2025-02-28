<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2, Info } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { supabase } from '$lib/supabase';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';
  let items = [];
  let showModal = false;
  let showDetailModal = false;
  let modalTitle = '';
  let currentItem = {
    id_barang: null,
    nama_barang: '',
    spesifikasi: '',
    jumlah: 0,
    satuan: '',
    kondisi: 'Baik',
    lokasi: '',
    tanggal_masuk: new Date().toISOString().split('T')[0],
    status: 'Tersedia'
  };

  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';
  let itemsPerPageOptions = [5, 10, 25, 50, 100, 500, 1000];

  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  $: paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter items berdasarkan pencarian
  $: filteredItems = items.filter(item =>
    item.nama_barang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function fetchItems() {
    try {
      const { data, error } = await supabase
        .from('barang')
        .select('*');

      if (error) throw error;
      items = data;
    } catch (error) {
      console.error('Error fetching items:', error.message);
      alert('Error fetching items');
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
      modalTitle = 'Tambah Data Inventaris';
      currentItem = {
        id_barang: null,
        nama_barang: '',
        spesifikasi: '',
        jumlah: 0,
        satuan: '',
        kondisi: 'Baik',
        lokasi: '',
        tanggal_masuk: new Date().toISOString().split('T')[0],
        status: 'Tersedia'
      };
      showModal = true;
    }, 100);
  }

  function openEditModal(item) {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Edit Data Inventaris';
      currentItem = { ...item };
      showModal = true;
    }, 100);
  }

  function openDetailModal(item) {
    showDetailModal = false;
    setTimeout(() => {
      currentItem = { ...item };
      showDetailModal = true;
    }, 100);
  }

  async function handleSubmit() {
    if (!currentItem.nama_barang || currentItem.jumlah < 0) {
      alert('Semua field harus diisi dengan benar');
      return;
    }

    try {
      if (currentItem.id_barang === null) {
        // Add new item
        const { data, error } = await supabase
          .from('barang')
          .insert([{
            nama_barang: currentItem.nama_barang,
            spesifikasi: currentItem.spesifikasi,
            jumlah: currentItem.jumlah,
            satuan: currentItem.satuan,
            kondisi: currentItem.kondisi,
            lokasi: currentItem.lokasi,
            tanggal_masuk: currentItem.tanggal_masuk,
            status: currentItem.status
          }])
          .select();

        if (error) throw error;
        items = [...items, data[0]];
      } else {
        // Update existing item
        const { error } = await supabase
          .from('barang')
          .update({
            nama_barang: currentItem.nama_barang,
            spesifikasi: currentItem.spesifikasi,
            jumlah: currentItem.jumlah,
            satuan: currentItem.satuan,
            kondisi: currentItem.kondisi,
            lokasi: currentItem.lokasi,
            tanggal_masuk: currentItem.tanggal_masuk,
            status: currentItem.status
          })
          .eq('id_barang', currentItem.id_barang);

        if (error) throw error;
        items = items.map(t =>
          t.id_barang === currentItem.id_barang ? currentItem : t
        );
      }
      showModal = false;
    } catch (error) {
      console.error('Error saving item:', error.message);
      alert('Error saving item');
    }
  }

  async function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const { error } = await supabase
          .from('barang')
          .delete()
          .eq('id_barang', id);

        if (error) throw error;
        items = items.filter(t => t.id_barang !== id);
        currentPage = Math.min(currentPage, Math.ceil(items.length / itemsPerPage));
      } catch (error) {
        console.error('Error deleting item:', error.message);
        alert('Error deleting item');
      }
    }
  }

  onMount(() => {
    fetchItems();
  });
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Data Inventaris</h1>
      <p class="text-gray-600 mt-1">Kelola data inventaris anda</p>
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
          <span>Tambah Data Inventaris</span>
        </button>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari data inventaris..."
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
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Nama Barang</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Jumlah</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Satuan</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Kondisi</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each paginatedItems as item, index}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.nama_barang}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.jumlah}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.satuan)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${item.kondisi === 'Baik' ? 'bg-green-100 text-green-800' : ''}
                    ${item.kondisi === 'Rusak' ? 'bg-red-100 text-red-800' : ''}
                    ${item.kondisi === 'Hilang' ? 'bg-gray-100 text-gray-800' : ''}`}
                  >
                    {item.kondisi}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${item.status === 'Tersedia' ? 'bg-green-100 text-green-800' : ''}
                    ${item.status === 'Digunakan' ? 'bg-blue-100 text-blue-800' : ''}
                    ${item.status === 'Rusak' ? 'bg-red-100 text-red-800' : ''}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <div class="flex gap-3">
                    <button
                      on:click={() => openDetailModal(item)}
                      style="background-color: {primaryColor}"
                      class="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                    >
                      <Info size={18} />
                    </button>
                    <button
                      on:click={() => openEditModal(item)}
                      style="background-color: {primaryColor}"
                      class="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      on:click={() => handleDelete(item.id_barang)}
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

<!-- Add/Edit Modal -->
<Modal show={showModal} title={modalTitle}>
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="nama_barang" class="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
      <input
        type="text"
        id="nama_barang"
        bind:value={currentItem.nama_barang}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="spesifikasi" class="block text-sm font-medium text-gray-700 mb-1">Spesifikasi</label>
      <textarea
        id="spesifikasi"
        bind:value={currentItem.spesifikasi}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        rows="3"
      ></textarea>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label for="jumlah" class="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
        <input
          type="number"
          id="jumlah"
          bind:value={currentItem.jumlah}
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
          min="0"
          required
        />
      </div>
      <div>
        <label for="satuan" class="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
        <input
          type="text"
          id="satuan"
          bind:value={currentItem.satuan}
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
          required
        />
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label for="kondisi" class="block text-sm font-medium text-gray-700 mb-1">Kondisi</label>
        <select
          id="kondisi"
          bind:value={currentItem.kondisi}
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        >
          <option value="Baik">Baik</option>
          <option value="Rusak">Rusak</option>
          <option value="Hilang">Hilang</option>
        </select>
      </div>
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          id="status"
          bind:value={currentItem.status}
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        >
          <option value="Tersedia">Tersedia</option>
          <option value="Digunakan">Digunakan</option>
          <option value="Rusak">Rusak</option>
        </select>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label for="lokasi" class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
        <input
          type="text"
          id="lokasi"
          bind:value={currentItem.lokasi}
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
          required
        />
      </div>
      <div>
        <label for="tanggal_masuk" class="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk</label>
        <input
          type="date"
          id="tanggal_masuk"
          bind:value={currentItem.tanggal_masuk}
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
          required
        />
      </div>
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
        {modalTitle === 'Edit Data Inventaris' ? 'Simpan Perubahan' : 'Tambah Data'}
      </button>
    </div>
  </form>
</Modal>

<!-- Detail Modal -->
<Modal show={showDetailModal} title="Detail Inventaris">
  <div class="space-y-4">
    <div>
      <h3 class="text-sm font-medium text-gray-500">Nama Barang</h3>
      <p class="mt-1 text-sm text-gray-900">{currentItem.nama_barang}</p>
    </div>
    <div>
      <h3 class="text-sm font-medium text-gray-500">Spesifikasi</h3>
      <p class="mt-1 text-sm text-gray-900 whitespace-pre-line">{currentItem.spesifikasi || '-'}</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <h3 class="text-sm font-medium text-gray-500">Jumlah</h3>
        <p class="mt-1 text-sm text-gray-900">{currentItem.jumlah}</p>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500">Satuan</h3>
        <p class="mt-1 text-sm text-gray-900">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(currentItem.satuan)}</p>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <h3 class="text-sm font-medium text-gray-500">Status</h3>
        <p class="mt-1">
          <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
            ${currentItem.kondisi === 'Baik' ? 'bg-green-100 text-green-800' : ''}
            ${currentItem.kondisi === 'Rusak' ? 'bg-red-100 text-red-800' : ''}
            ${currentItem.kondisi === 'Hilang' ? 'bg-gray-100 text-gray-800' : ''}`}
          >
            {currentItem.kondisi}
          </span>
        </p>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <h3 class="text-sm font-medium text-gray-500">Status</h3>
        <p class="mt-1">
          <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
            ${currentItem.status === 'Tersedia' ? 'bg-green-100 text-green-800' : ''}
            ${currentItem.status === 'Digunakan' ? 'bg-blue-100 text-blue-800' : ''}
            ${currentItem.status === 'Rusak' ? 'bg-red-100 text-red-800' : ''}`}
          >
            {currentItem.status}
          </span>
        </p>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-500">Lokasi</h3>
        <p class="mt-1 text-sm text-gray-900">{currentItem.lokasi}</p>
      </div>
    </div>
    <div>
      <h3 class="text-sm font-medium text-gray-500">Tanggal Masuk</h3>
      <p class="mt-1 text-sm text-gray-900">{new Date(currentItem.tanggal_masuk).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    <div class="flex justify-end mt-6">
      <button
        type="button"
        on:click={() => (showDetailModal = false)}
        class="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Tutup
      </button>
    </div>
  </div>
</Modal>