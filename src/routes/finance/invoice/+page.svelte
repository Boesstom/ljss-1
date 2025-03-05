<script>
  import { onMount } from 'svelte';
  import { Search, Plus, Pencil, Trash2 } from 'lucide-svelte';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';

  // Data dummy untuk contoh
  let invoices = [
    {
      id: 1,
      jobNumber: 'JOB-001',
      documentNumber: 'SI/INV/2024/001',
      shipper: 'PT Shipper A',
      status: 'Paid'
    },
    {
      id: 2,
      jobNumber: 'JOB-002',
      documentNumber: 'SI/INV/2024/002',
      shipper: 'PT Shipper B',
      status: 'Unpaid'
    },
    {
      id: 3,
      jobNumber: 'JOB-003',
      documentNumber: 'SI/INV/2024/003',
      shipper: 'PT Shipper C',
      status: 'Paid'
    },
  ];

  // Variabel untuk paginasi dan pencarian
  let currentPage = 1;
  let itemsPerPage = 5;
  let searchQuery = '';
  let itemsPerPageOptions = [5, 10, 25, 50];

  // Computed values for pagination
  $: totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  $: paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter invoices berdasarkan pencarian
  $: filteredInvoices = invoices.filter(invoice =>
    invoice.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.shipper.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Data Invoice</h1>
  </div>

  <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
    <div class="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <button
        style="background-color: {primaryColor}"
        class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#289CD7]"
      >
        <Plus class="w-5 h-5 mr-2" />
        <span>Tambah Invoice</span>
      </button>

      <div class="relative w-full sm:w-64">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari invoice..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
        />
        <Search
          size={20}
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr style="background-color: {primaryColor}">
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">No.</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">No Job</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">SI/INV/BL/PO</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Shipper</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#if filteredInvoices.length === 0}
              <tr>
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-900">No invoices found</td>
              </tr>
            {:else}
              {#each paginatedInvoices as invoice, index}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.jobNumber}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.documentNumber}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.shipper}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : ''}
                      ${invoice.status === 'Unpaid' ? 'bg-red-100 text-red-800' : ''}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="flex items-center space-x-2">
                      <button
                        class="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        class="text-red-600 hover:text-red-900"
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