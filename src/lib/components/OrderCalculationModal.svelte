<script>
  import { X, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';

  export let showModal = false;
  export let order;
  export let onClose;

  let shippers = [];
  let unloadingLocations = [];
  let vendors = [];
  let documents = [];
  let parties = [];
  let trucks = [];

  onMount(async () => {
    // Fetch shippers
    const { data: shipperData, error: shipperError } = await supabase
      .from('md_data_shipper')
      .select('*');
    if (!shipperError) shippers = shipperData;

    // Fetch unloading locations
    const { data: unloadingData, error: unloadingError } = await supabase
      .from('md_data_bongkar')
      .select('*');
    if (!unloadingError) unloadingLocations = unloadingData;

    // Fetch vendors
    const { data: vendorData, error: vendorError } = await supabase
      .from('md_data_vendor')
      .select('*');
    if (!vendorError) vendors = vendorData;

    // Fetch documents
    const { data: documentData, error: documentError } = await supabase
      .from('md_data_dokumen')
      .select('*');
    if (!documentError) documents = documentData;

    // Fetch parties
    const { data: partyData, error: partyError } = await supabase
      .from('md_data_party')
      .select('*');
    if (!partyError) parties = partyData;

    // Fetch trucks
    const { data: truckData, error: truckError } = await supabase
      .from('md_data_truck')
      .select('*');
    if (!truckError) trucks = truckData;
  });

  function handleNominalInput(index) {
    // TODO: Implement nominal input functionality
    console.log('Input nominal for document at index:', index);
  }

  function handleDirectCostNominal(index) {
    // TODO: Implement direct cost nominal input functionality
    console.log('Input nominal for direct cost at index:', index);
  }

  function handleTaxChange(type, value) {
    if (!order.taxDetails) order.taxDetails = {};
    order.taxDetails[type] = value;
  }

  const taxOptions = [0, 1, 1.1, 2, 2.5, 3, 5, 10, 11, 15, 20];

  onMount(async () => {
    // Fetch shippers
    const { data: shipperData, error: shipperError } = await supabase
      .from('md_data_shipper')
      .select('*');
    if (!shipperError) shippers = shipperData;

    // Fetch unloading locations
    const { data: unloadingData, error: unloadingError } = await supabase
      .from('md_data_bongkar')
      .select('*');
    if (!unloadingError) unloadingLocations = unloadingData;

    // Fetch vendors
    const { data: vendorData, error: vendorError } = await supabase
      .from('md_data_vendor')
      .select('*');
    if (!vendorError) vendors = vendorData;

    // Fetch documents
    const { data: documentData, error: documentError } = await supabase
      .from('md_data_dokumen')
      .select('*');
    if (!documentError) documents = documentData;

    // Fetch parties
    const { data: partyData, error: partyError } = await supabase
      .from('md_data_party')
      .select('*');
    if (!partyError) parties = partyData;

    // Fetch trucks
    const { data: truckData, error: truckError } = await supabase
      .from('md_data_truck')
      .select('*');
    if (!truckError) trucks = truckData;
  });

</script>

{#if showModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[75vh] overflow-hidden flex flex-col">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-xl font-semibold text-gray-900">Detail Order</h2>
        <button
          on:click={onClose}
          class="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} class="text-gray-500" />
        </button>
      </div>

      <div class="overflow-y-auto flex-1 p-4">
        <div class="space-y-4">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data Shipper</label>
              <input
                type="text"
                value={shippers.find(s => s.id_md_data_shipper === order.shipper)?.nama_data_shipper || ''}
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">No Job</label>
              <input
                type="text"
                value={order.jobNumber}
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Stuffing</label>
              <input
                type="text"
                value={order.stuffingDate}
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">No. Booking</label>
              <input
                type="text"
                value={order.bookingNumber}
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Shipper</label>
              <input
                type="text"
                value={order.invoiceShipper}
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Vessel</label>
              <input
                type="text"
                value={order.vessel}
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                value={order.destination}
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tempat Bongkar</label>
              <input
                type="text"
                value={unloadingLocations.find(u => u.id_data_bongkar === order.unloadingLocation)?.nama_data_bongkar || ''}
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tempat Stuffing</label>
              <input
                type="text"
                value={order.stuffingPlace}
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <!-- Notes List -->
          <div class="space-y-3">
            <h3 class="text-base font-medium text-gray-900">Keterangan</h3>
            <div class="space-y-2">
              {#if order.notes && order.notes.length > 0}
                {#each order.notes as note}
                  <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                    {note}
                  </div>
                {/each}
              {:else}
                <div class="px-3 py-16 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 text-center">
                  Tidak ada keterangan
                </div>
              {/if}
            </div>
          </div>

          <!-- Taxation Section -->
          <div class="space-y-3">
            <h3 class="text-base font-medium text-gray-900">Perpajakan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">PPN (%)</label>
                <select
                  value={order.taxDetails?.ppn ?? 0}
                  on:change={(e) => handleTaxChange('ppn', parseFloat(e.target.value))}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  {#each taxOptions as option}
                    <option value={option}>{option}%</option>
                  {/each}
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">PPH (%)</label>
                <select
                  value={order.taxDetails?.pph ?? 0}
                  on:change={(e) => handleTaxChange('pph', parseFloat(e.target.value))}
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  {#each taxOptions as option}
                    <option value={option}>{option}%</option>
                  {/each}
                </select>
              </div>
            </div>
          </div>

          <!-- Document Details -->
          <div class="space-y-3">
            <h3 class="text-base font-medium text-gray-900">Detail Dokumen</h3>
            <div class="flex gap-3 overflow-x-auto pb-2">
              {#if order.documentDetails && order.documentDetails.length > 0}
                {#each order.documentDetails as detail, i}
                  <div class="flex-shrink-0 w-64 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div class="space-y-2">
                      <div>
                        <p class="font-medium text-gray-900">
                          {documents.find(d => d.id === detail.document)?.nama_data_dokumen || 'Dokumen tidak ditemukan'}
                        </p>
                        <p class="text-sm text-gray-600">
                          {vendors.find(v => v.id_data_vendor === detail.vendor)?.nama_data_vendor || 'Vendor tidak ditemukan'}
                        </p>
                      </div>
                      <button
                        on:click={() => handleNominalInput(i)}
                        style="background-color: {primaryColor}"
                        class="w-full px-3 py-1.5 text-white rounded-lg hover:opacity-90 transition-colors"
                      >
                        Input Nominal
                      </button>
                    </div>
                  </div>
                {/each}
              {:else}
                <div class="w-full px-3 py-12 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 text-center flex items-center justify-center min-h-[120px]">
                  Tidak ada detail dokumen
                </div>
              {/if}
            </div>
          </div>

          <!-- Direct Cost Orders -->
          <div class="space-y-3">
            <h3 class="text-base font-medium text-gray-900">Biaya Langsung</h3>
            <div class="flex gap-3 overflow-x-auto pb-2">
              {#if order.directCostOrders && order.directCostOrders.length > 0}
                {#each order.directCostOrders as costOrder, i}
                  <div class="flex-shrink-0 w-64 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div class="space-y-2">
                      <div>
                        <p class="font-medium text-gray-900">
                          {parties.find(p => p.id_md_data_party === costOrder.party)?.jumlah_data_party || ''} x
                          {parties.find(p => p.id_md_data_party === costOrder.party)?.ukuran_data_party || ''}
                        </p>
                        <p class="text-sm text-gray-600">
                          {trucks.find(t => t.id_md_data_truck === costOrder.truck)?.nopol_data_truck || ''} -
                          {trucks.find(t => t.id_md_data_truck === costOrder.truck)?.driver_data_truck || ''}
                        </p>
                        {#if costOrder.containerSeals}
                          <div class="mt-1">
                            {#each costOrder.containerSeals as seal}
                              <p class="text-sm text-gray-600">{seal}</p>
                            {/each}
                          </div>
                        {/if}
                      </div>
                      <button
                        on:click={() => handleDirectCostNominal(i)}
                        style="background-color: {primaryColor}"
                        class="w-full px-3 py-1.5 text-white rounded-lg hover:opacity-90 transition-colors"
                      >
                        Input Nominal
                      </button>
                    </div>
                  </div>
                {/each}
              {:else}
                <div class="w-full px-3 py-12 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 text-center flex items-center justify-center min-h-[120px]">
                  Tidak ada biaya langsung
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 border-t bg-white flex justify-end gap-3">
        <button
          on:click={onClose}
          class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Batal
        </button>
        <button
          on:click={() => {
            // TODO: Implement save functionality
            console.log('Saving order...');
          }}
          style="background-color: {primaryColor}"
          class="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
        >
          Simpan
        </button>
        <button
          on:click={() => {
            // TODO: Implement invoice creation
            console.log('Creating invoice...');
          }}
          style="background-color: {primaryColor}"
          class="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
        >
          Buat Invoice
        </button>
      </div>
    </div>
  </div>
{/if}