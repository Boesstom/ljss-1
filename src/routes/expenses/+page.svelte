<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { supabase } from '$lib/supabase';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';

  let expenses = [];
  let showModal = false;
  let modalTitle = '';
  let currentExpense = {
    id_expense: null,
    nama_expense: '',
    deskripsi_expense: '',
    nominal_expense: '',
    tanggal_expense: ''
  };

  // Variables for pagination and search
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';
  let itemsPerPageOptions = [5, 10, 25, 50, 100, 500, 1000];

  // Date period filter
  let startDate = '';
  let endDate = '';

  // Pagination handlers
  $: totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  $: paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter expenses based on search and date range
  $: filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.nama_expense.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.deskripsi_expense.toLowerCase().includes(searchQuery.toLowerCase());
    
    const expenseDate = new Date(expense.tanggal_expense);
    const isInDateRange = (!startDate || expenseDate >= new Date(startDate)) &&
      (!endDate || expenseDate <= new Date(endDate));

    return matchesSearch && isInDateRange;
  });

  // Calculate total expenses
  $: totalExpenses = filteredExpenses.reduce((sum, expense) => sum + Number(expense.nominal_expense), 0);

  // Format number with thousand separator
  function formatNumber(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function parseFormattedNumber(value) {
    return value.replace(/,/g, '');
  }

  async function fetchExpenses() {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('tanggal_expense', { ascending: false });

      if (error) throw error;
      expenses = data;
    } catch (error) {
      console.error('Error fetching expenses:', error.message);
      alert('Error fetching expenses');
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
      modalTitle = 'Tambah Data Pengeluaran';
      currentExpense = {
        id_expense: null,
        nama_expense: '',
        deskripsi_expense: '',
        nominal_expense: '',
        tanggal_expense: new Date().toISOString().split('T')[0]
      };
      showModal = true;
    }, 100);
  }

  function openEditModal(expense) {
    showModal = false;
    setTimeout(() => {
      modalTitle = 'Edit Data Pengeluaran';
      currentExpense = {
        ...expense,
        tanggal_expense: new Date(expense.tanggal_expense).toISOString().split('T')[0]
      };
      showModal = true;
    }, 100);
  }

  async function handleSubmit() {
    if (!currentExpense.nama_expense || !currentExpense.nominal_expense || !currentExpense.tanggal_expense) {
      alert('Nama, nominal, dan tanggal harus diisi');
      return;
    }

    try {
      if (currentExpense.id_expense === null) {
        // Add new expense
        const { data, error } = await supabase
          .from('expenses')
          .insert([{
            nama_expense: currentExpense.nama_expense,
            deskripsi_expense: currentExpense.deskripsi_expense,
            nominal_expense: currentExpense.nominal_expense,
            tanggal_expense: currentExpense.tanggal_expense
          }])
          .select();

        if (error) throw error;
        expenses = [...expenses, data[0]];
      } else {
        // Update existing expense
        const { error } = await supabase
          .from('expenses')
          .update({
            nama_expense: currentExpense.nama_expense,
            deskripsi_expense: currentExpense.deskripsi_expense,
            nominal_expense: currentExpense.nominal_expense,
            tanggal_expense: currentExpense.tanggal_expense
          })
          .eq('id_expense', currentExpense.id_expense);

        if (error) throw error;
        expenses = expenses.map(e =>
          e.id_expense === currentExpense.id_expense ? currentExpense : e
        );
      }
      showModal = false;
    } catch (error) {
      console.error('Error saving expense:', error.message);
      alert('Error saving expense');
    }
  }

  async function handleDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const { error } = await supabase
          .from('expenses')
          .delete()
          .eq('id_expense', id);

        if (error) throw error;
        expenses = expenses.filter(e => e.id_expense !== id);
        currentPage = Math.min(currentPage, Math.ceil(expenses.length / itemsPerPage));
      } catch (error) {
        console.error('Error deleting expense:', error.message);
        alert('Error deleting expense');
      }
    }
  }

  onMount(() => {
    fetchExpenses();
  });
</script>

<div class="min-h-screen bg-gray-100 ml-64">
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Data Pengeluaran</h1>
      
    </div>

    <!-- Header Actions -->
    <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <button
          on:click={openAddModal}
          style="background-color: {primaryColor}"
          class="text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-colors w-full sm:w-auto font-medium"
        >
          <Plus size={20} />
          <span>Tambah Data Pengeluaran</span>
        </button>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari data expense..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
          />
          <Search
            size={20}
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      <!-- Date Range Filter -->
      <div class="flex flex-col sm:flex-row gap-4 items-end">
        <div class="w-full sm:w-auto">
          <label class="block text-sm font-medium text-gray-700 mb-1">Periode Dari</label>
          <input
            type="date"
            bind:value={startDate}
            max={new Date().toISOString().split('T')[0]}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
          />
        </div>
        <div class="w-full sm:w-auto">
          <label class="block text-sm font-medium text-gray-700 mb-1">Sampai</label>
          <input
            type="date"
            bind:value={endDate}
            max={new Date().toISOString().split('T')[0]}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
          />
        </div>
        <div class="w-full sm:w-auto">
          <button
            on:click={() => { startDate = ''; endDate = ''; }}
            style="color: {primaryColor}; border-color: {primaryColor}"
            class="px-4 py-2 rounded-lg bg-white border text-sm font-medium hover:opacity-80 transition-colors"
          >
            Reset
          </button>
        </div>
        <div class="w-full sm:w-auto ml-auto">
          <div class="bg-gray-100 px-4 py-2 rounded-lg">
            <span class="text-sm font-medium text-gray-700">Total Pengeluaran:</span>
            <span class="text-lg font-semibold text-gray-900 ml-2">Rp {formatNumber(totalExpenses)}</span>
          </div>
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
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Deskripsi</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Nominal</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#if filteredExpenses.length === 0}
              <tr>
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-900">No expenses found</td>
              </tr>
            {:else}
              {#each paginatedExpenses as expense, i}
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{expense.nama_expense}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{expense.deskripsi_expense}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">Rp {expense.nominal_expense.toLocaleString('id-ID')}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{new Date(expense.tanggal_expense).toLocaleDateString('id-ID')}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex gap-3">
                      <button
                        on:click={() => openEditModal(expense)}
                        style="background-color: {primaryColor}"
                        class="p-2 rounded-lg text-white hover:opacity-80 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        on:click={() => handleDelete(expense.id_expense)}
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
      {#if filteredExpenses.length > 0}
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length} entries
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
      <label for="nama" class="block text-sm font-medium text-gray-700 mb-1">Nama Expense</label>
      <input
        type="text"
        id="nama"
        bind:value={currentExpense.nama_expense}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="deskripsi" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
      <textarea
        id="deskripsi"
        bind:value={currentExpense.deskripsi_expense}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        rows="3"
      ></textarea>
    </div>
    <div>
      <label for="nominal" class="block text-sm font-medium text-gray-700 mb-1">Nominal</label>
      <input
        type="text"
        id="nominal"
        value={currentExpense.nominal_expense ? formatNumber(currentExpense.nominal_expense) : ''}
        on:input={(e) => currentExpense.nominal_expense = parseFormattedNumber(e.target.value)}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div>
      <label for="tanggal" class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
      <input
        type="date"
        id="tanggal"
        bind:value={currentExpense.tanggal_expense}
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        required
      />
    </div>
    <div class="flex justify-end gap-4 mt-6">
      <button
        type="button"
        on:click={() => showModal = false}
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#289CD7]"
      >
        Cancel
      </button>
      <button
        type="submit"
        style="background-color: {primaryColor}"
        class="px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#289CD7]"
      >
        Save
      </button>
    </div>
  </form>
</Modal>