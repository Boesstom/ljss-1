<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { supabase } from '$lib/supabase';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';
  let employees = [];
  let showModal = false;
  let modalTitle = '';
  let currentEmployee = {
    id_data_pegawai: null,
    nama_pegawai: '',
    alamat_pegawai: '',
    nomor_hp_pegawai: '',
    gaji_pegawai: '',
    status_pegawai: '',
    tanggal_masuk: '',
    tanggal_keluar: '',
    tempat_lahir: '',
    tanggal_lahir: ''
  };

  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';
  let itemsPerPageOptions = [5, 10, 25, 50, 100, 500, 1000];
  // Handler untuk paginasi
  $: totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  $: paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter employees berdasarkan pencarian
  $: filteredEmployees = employees.filter(employee =>
    employee.nama_pegawai.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.alamat_pegawai.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.status_pegawai.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function fetchEmployees() {
    try {
      const { data, error } = await supabase
        .from('md_data_pegawai')
        .select('*');

      if (error) throw error;
      employees = data;
    } catch (error) {
      console.error('Error fetching employees:', error.message);
      alert('Error fetching employees');
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
      modalTitle = 'Tambah Data Pegawai';
      currentEmployee = {
        id_data_pegawai: null,
        nama_pegawai: '',
        alamat_pegawai: '',
        nomor_hp_pegawai: '',
        gaji_pegawai: '',
        status_pegawai: '',
        tanggal_masuk: '',
        tanggal_keluar: '',
        tempat_lahir: '',
        tanggal_lahir: ''
      };
      showModal = true;
    }, 100);
  }

  function openEditModal(employee) {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Edit Data Pegawai';
      currentEmployee = { ...employee };
      showModal = true;
    }, 100);
  }

  async function handleSubmit() {
    if (!currentEmployee.nama_pegawai || !currentEmployee.alamat_pegawai || 
        !currentEmployee.nomor_hp_pegawai || !currentEmployee.gaji_pegawai ||
        !currentEmployee.status_pegawai || !currentEmployee.tanggal_masuk ||
        !currentEmployee.tempat_lahir || !currentEmployee.tanggal_lahir) {
      alert('Harap isi semua field yang wajib');
      return;
    }

    try {
      if (currentEmployee.id_data_pegawai === null) {
        // Add new employee
        const { data, error } = await supabase
          .from('md_data_pegawai')
          .insert([{
            nama_pegawai: currentEmployee.nama_pegawai,
            alamat_pegawai: currentEmployee.alamat_pegawai,
            nomor_hp_pegawai: currentEmployee.nomor_hp_pegawai,
            gaji_pegawai: currentEmployee.gaji_pegawai,
            status_pegawai: currentEmployee.status_pegawai,
            tanggal_masuk: currentEmployee.tanggal_masuk,
            tanggal_keluar: currentEmployee.tanggal_keluar,
            tempat_lahir: currentEmployee.tempat_lahir,
            tanggal_lahir: currentEmployee.tanggal_lahir
          }])
          .select();

        if (error) throw error;
        employees = [...employees, data[0]];
      } else {
        // Update existing employee
        const { error } = await supabase
          .from('md_data_pegawai')
          .update({
            nama_pegawai: currentEmployee.nama_pegawai,
            alamat_pegawai: currentEmployee.alamat_pegawai,
            nomor_hp_pegawai: currentEmployee.nomor_hp_pegawai,
            gaji_pegawai: currentEmployee.gaji_pegawai,
            status_pegawai: currentEmployee.status_pegawai,
            tanggal_masuk: currentEmployee.tanggal_masuk,
            tanggal_keluar: currentEmployee.tanggal_keluar,
            tempat_lahir: currentEmployee.tempat_lahir,
            tanggal_lahir: currentEmployee.tanggal_lahir
          })
          .eq('id_data_pegawai', currentEmployee.id_data_pegawai);

        if (error) throw error;
        employees = employees.map(e =>
          e.id_data_pegawai === currentEmployee.id_data_pegawai ? currentEmployee : e
        );
      }
      showModal = false;
    } catch (error) {
      console.error('Error saving employee:', error.message);
      alert('Error saving employee');
    }
  }

  async function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const { error } = await supabase
          .from('md_data_pegawai')
          .delete()
          .eq('id_data_pegawai', id);

        if (error) throw error;
        employees = employees.filter(e => e.id_data_pegawai !== id);
        currentPage = Math.min(currentPage, Math.ceil(employees.length / itemsPerPage));
      } catch (error) {
        console.error('Error deleting employee:', error.message);
        alert('Error deleting employee');
      }
    }
  }

  onMount(() => {
    fetchEmployees();
  });
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Data Pegawai</h1>
      <p class="text-gray-600 mt-1">Kelola data pegawai anda</p>
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
          <span>Tambah Data Pegawai</span>
        </button>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari data pegawai..."
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
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">No. HP</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Gaji</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Tanggal Masuk</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#if filteredEmployees.length === 0}
              <tr>
                <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-900">No employees found</td>
              </tr>
            {:else}
              {#each paginatedEmployees as employee, i}
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{employee.nama_pegawai}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{employee.alamat_pegawai}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{employee.nomor_hp_pegawai}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">Rp {employee.gaji_pegawai.toLocaleString('id-ID')}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{employee.status_pegawai}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{new Date(employee.tanggal_masuk).toLocaleDateString('id-ID')}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex gap-3">
                      <button
                        on:click={() => openEditModal(employee)}
                        style="background-color: {primaryColor}"
                        class="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        on:click={() => handleDelete(employee.id_data_pegawai)}
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
      {#if filteredEmployees.length > 0}
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} entries
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
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai</label>
      <input
        type="text"
        id="name"
        bind:value={currentEmployee.nama_pegawai}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
      <textarea
        id="address"
        bind:value={currentEmployee.alamat_pegawai}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
        rows="3"
      ></textarea>
    </div>
    <div>
      <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
      <input
        type="tel"
        id="phone"
        bind:value={currentEmployee.nomor_hp_pegawai}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="salary" class="block text-sm font-medium text-gray-700 mb-1">Gaji</label>
      <input
        type="text"
        id="salary"
        bind:value={currentEmployee.gaji_pegawai}
        on:input={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          currentEmployee.gaji_pegawai = value;
          e.target.value = value ? `Rp ${parseInt(value).toLocaleString('id-ID')}` : '';
        }}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <select
        id="status"
        bind:value={currentEmployee.status_pegawai}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      >
        <option value="">Pilih Status</option>
        <option value="Aktif">Aktif</option>
        <option value="Tidak Aktif">Tidak Aktif</option>
      </select>
    </div>
    <div>
      <label for="birthPlace" class="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
      <input
        type="text"
        id="birthPlace"
        bind:value={currentEmployee.tempat_lahir}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
      <input
        type="date"
        id="birthDate"
        bind:value={currentEmployee.tanggal_lahir}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="joinDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk</label>
      <input
        type="date"
        id="joinDate"
        bind:value={currentEmployee.tanggal_masuk}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="leaveDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal Keluar</label>
      <input
        type="date"
        id="leaveDate"
        bind:value={currentEmployee.tanggal_keluar}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
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
        {modalTitle === 'Edit Data Pegawai' ? 'Simpan Perubahan' : 'Tambah Data'}
      </button>
    </div>
  </form>
</Modal>