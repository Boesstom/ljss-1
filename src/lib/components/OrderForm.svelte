<script>
  import { X, Plus, Trash2 } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  // Primary color for buttons and highlights
  const primaryColor = '#289CD7';

  export let currentOrder;
  export let onSubmit;
  export let onCancel;

  let shippers = [];
  let unloadingLocations = [];
  let notes = [''];
  let vendors = [];
  let documents = [];
  let documentDetails = [];
  let parties = [];
  let trucks = [];
  let containerSeals = [''];
  let directCostOrders = [];
  
  // Temporary state for new document detail
  let newDocument = '';
  let newVendor = '';
  let selectedParty = '';
  let selectedTruck = '';

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

  function addNote() {
    notes = [...notes, ''];
  }

  function removeNote(index) {
    notes = notes.filter((_, i) => i !== index);
  }

  function addDocumentDetail() {
    if (newDocument && newVendor) {
      const newDetail = {
        document: newDocument,
        vendor: newVendor
      };
      documentDetails = [...documentDetails, newDetail];
      // Reset temporary state
      newDocument = '';
      newVendor = '';
    }
  }

  function removeDocumentDetail(index) {
    documentDetails = documentDetails.filter((_, i) => i !== index);
  }

  function addContainerSeal() {
    containerSeals = [...containerSeals, ''];
  }

  function removeContainerSeal(index) {
    containerSeals = containerSeals.filter((_, i) => i !== index);
  }

  function addDirectCostOrder() {
    if (selectedParty && selectedTruck && containerSeals.some(seal => seal.trim() !== '')) {
      const newOrder = {
        party: selectedParty,
        truck: selectedTruck,
        containerSeals: containerSeals.filter(seal => seal.trim() !== '')
      };
      directCostOrders = [...directCostOrders, newOrder];
      
      // Reset selections
      selectedParty = '';
      selectedTruck = '';
      containerSeals = [''];
    }
  }

  function removeDirectCostOrder(index) {
    directCostOrders = directCostOrders.filter((_, i) => i !== index);
  }

  $: currentOrder.notes = notes;
  $: currentOrder.documentDetails = documentDetails;
  $: currentOrder.directCostOrders = directCostOrders;

  function addEmptyDocumentDetail() {
    const newDetail = {
      document: '',
      vendor: ''
    };
    documentDetails = [...documentDetails, newDetail];
  }

  function handleRemoveDocumentDetail(index) {
    documentDetails = documentDetails.filter((_, i) => i !== index);
  }
</script>

<div class="min-h-screen bg-gray-100">
  <div class="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">{currentOrder.id ? 'Edit Order' : 'Tambah Order Baru'}</h1>
      <button
        on:click={onCancel}
        class="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X size={24} class="text-gray-500" />
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <form on:submit|preventDefault={onSubmit} class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Shipper Dropdown -->
          <div>
            <label for="shipper" class="block text-sm font-medium text-gray-700 mb-1">Data Shipper</label>
            <select
              id="shipper"
              bind:value={currentOrder.shipper}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              required
            >
              <option value="">Pilih Shipper</option>
              {#each shippers as shipper}
                <option value={shipper.id_md_data_shipper}>{shipper.nama_data_shipper}</option>
              {/each}
            </select>
          </div>

          <!-- Job Number -->
          <div>
            <label for="jobNumber" class="block text-sm font-medium text-gray-700 mb-1">No Job</label>
            <input
              type="text"
              id="jobNumber"
              bind:value={currentOrder.jobNumber}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              required
            />
          </div>

          <!-- Stuffing Date -->
          <div>
            <label for="stuffingDate" class="block text-sm font-medium text-gray-700 mb-1">Tanggal Stuffing</label>
            <input
              type="date"
              id="stuffingDate"
              bind:value={currentOrder.stuffingDate}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              required
            />
          </div>

          <!-- Booking Number -->
          <div>
            <label for="bookingNumber" class="block text-sm font-medium text-gray-700 mb-1">No. Booking</label>
            <input
              type="text"
              id="bookingNumber"
              bind:value={currentOrder.bookingNumber}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              required
            />
          </div>

          <!-- Invoice Shipper -->
          <div>
            <label for="invoiceShipper" class="block text-sm font-medium text-gray-700 mb-1">Invoice Shipper</label>
            <input
              type="text"
              id="invoiceShipper"
              bind:value={currentOrder.invoiceShipper}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              required
            />
          </div>

          <!-- Vessel -->
          <div>
            <label for="vessel" class="block text-sm font-medium text-gray-700 mb-1">Vessel</label>
            <input
              type="text"
              id="vessel"
              bind:value={currentOrder.vessel}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              required
            />
          </div>

          <!-- Destination -->
          <div>
            <label for="destination" class="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input
              type="text"
              id="destination"
              bind:value={currentOrder.destination}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              required
            />
          </div>

          <!-- Unloading Location -->
          <div>
            <label for="unloadingLocation" class="block text-sm font-medium text-gray-700 mb-1">Data Bongkar</label>
            <select
              id="unloadingLocation"
              bind:value={currentOrder.unloadingLocation}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              required
            >
              <option value="">Pilih Data Bongkar</option>
              {#each unloadingLocations as location}
                <option value={location.id_data_bongkar}>{location.nama_data_bongkar}</option>
              {/each}
            </select>
          </div>

          <!-- Stuffing Location -->
          <div>
            <label for="stuffingLocation" class="block text-sm font-medium text-gray-700 mb-1">Tempat Stuffing</label>
            <select
              id="stuffingLocation"
              bind:value={currentOrder.stuffingLocation}
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              required
            >
              <option value="">Pilih Tempat Stuffing</option>
              {#if currentOrder.shipper}
                {#each shippers.find(s => s.id_md_data_shipper === currentOrder.shipper)?.stuffing_place_data_shipper || [] as place}
                  <option value={place}>{place}</option>
                {/each}
              {/if}
            </select>
          </div>
        </div>

        <!-- Notes List -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <label class="block text-sm font-medium text-gray-700">Keterangan</label>
            <button
              type="button"
              on:click={addNote}
              class="flex items-center gap-2 text-sm text-[#289CD7] hover:opacity-80"
            >
              <Plus size={16} />
              Tambah Keterangan
            </button>
          </div>
          {#each notes as note, i}
            <div class="flex gap-2">
              <input
                type="text"
                bind:value={notes[i]}
                placeholder="Masukkan keterangan"
                class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              />
              {#if notes.length > 1}
                <button
                  type="button"
                  on:click={() => removeNote(i)}
                  class="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Taxation Section -->
        <div class="space-y-4">
          <h2 class="text-lg font-medium text-gray-900">Perpajakan</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- PPH23 Dropdown -->
            <div>
              <label for="pph23" class="block text-sm font-medium text-gray-700 mb-1">PPH23</label>
              <select
                id="pph23"
                bind:value={currentOrder.pph23}
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              >
                <option value="">Pilih PPH23</option>
                <option value="yes">Ya</option>
                <option value="no">Tidak</option>
              </select>
            </div>

            <!-- PPN Dropdown -->
            <div>
              <label for="ppn" class="block text-sm font-medium text-gray-700 mb-1">PPN</label>
              <select
                id="ppn"
                bind:value={currentOrder.ppn}
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              >
                <option value="">Pilih PPN</option>
                <option value="yes">Ya</option>
                <option value="no">Tidak</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Document Details Section -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Detail Dokumen</h2>
            <button
              type="button"
              on:click={addDocumentDetail}
              class="flex items-center gap-2 text-sm text-[#289CD7] hover:opacity-80"
            >
              <Plus size={16} />
              Tambah Detail
            </button>
          </div>

          <!-- Document Detail Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label for="document" class="block text-sm font-medium text-gray-700 mb-1">Dokumen</label>
              <select
                id="document"
                bind:value={newDocument}
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              >
                <option value="">Pilih Dokumen</option>
                {#each documents as doc}
                  <option value={doc.id}>{doc.nama_data_dokumen}</option>
                {/each}
              </select>
            </div>

            <div>
              <label for="vendor" class="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <select
                id="vendor"
                bind:value={newVendor}
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              >
                <option value="">Pilih Vendor</option>
                {#each vendors as vendor}
                  <option value={vendor.id_data_vendor}>{vendor.nama_data_vendor}</option>
                {/each}
              </select>
            </div>
          </div>

          <!-- Document Details List -->
          {#if documentDetails.length > 0}
            <div class="overflow-x-auto pb-4">
              <div class="flex gap-4">
                {#each documentDetails as detail, i}
                  <div class="flex-shrink-0 w-72 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div class="flex justify-between items-start mb-3">
                      <div>
                        <p class="font-medium text-gray-900">
                          {documents.find(d => d.id === detail.document)?.nama_data_dokumen || 'Dokumen tidak ditemukan'}
                        </p>
                        <p class="text-sm text-gray-600">
                          {vendors.find(v => v.id_data_vendor === detail.vendor)?.nama_data_vendor || 'Vendor tidak ditemukan'}
                        </p>
                      </div>
                      <button
                        type="button"
                        on:click={() => removeDocumentDetail(i)}
                        class="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <!-- Direct Cost Section -->
        <div class="space-y-4">
          <h2 class="text-lg font-medium text-gray-900">Tambahkan Biaya Langsung</h2>
          
          <!-- Direct Cost Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label for="party" class="block text-sm font-medium text-gray-700 mb-1">Data Party</label>
              <select
                id="party"
                bind:value={selectedParty}
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              >
                <option value="">Pilih Party</option>
                {#each parties as party}
                  <option value={party.id_md_data_party}>{party.jumlah_data_party} x {party.ukuran_data_party}</option>
                {/each}
              </select>
            </div>

            <div>
              <label for="truck" class="block text-sm font-medium text-gray-700 mb-1">Data Truck</label>
              <select
                id="truck"
                bind:value={selectedTruck}
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
              >
                <option value="">Pilih Truck</option>
                {#each trucks as truck}
                  <option value={truck.id_md_data_truck}>{truck.nopol_data_truck} - {truck.driver_data_truck}</option>
                {/each}
              </select>
            </div>
          </div>

          <!-- Container Seals -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <label class="block text-sm font-medium text-gray-700">No Container/Seal</label>
              <button
                type="button"
                on:click={addContainerSeal}
                class="flex items-center gap-2 text-sm text-[#289CD7] hover:opacity-80"
              >
                <Plus size={16} />
                Tambah No Container/Seal
              </button>
            </div>
            {#each containerSeals as seal, i}
              <div class="flex gap-2">
                <input
                  type="text"
                  bind:value={containerSeals[i]}
                  placeholder="Masukkan nomor container/seal"
                  class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#289CD7] focus:border-transparent"
                />
                {#if containerSeals.length > 1}
                  <button
                    type="button"
                    on:click={() => removeContainerSeal(i)}
                    class="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                {/if}
              </div>
            {/each}
          </div>

          <!-- Add Direct Cost Order Button -->
          <div class="flex justify-end">
            <button
              type="button"
              on:click={addDirectCostOrder}
              style="background-color: {primaryColor}"
              class="px-4 py-2.5 text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Tambah Data Order
            </button>
          </div>

          <!-- Direct Cost Orders List -->
          {#if directCostOrders.length > 0}
            <div class="overflow-x-auto pb-4">
              <div class="flex gap-4">
                {#each directCostOrders as order, i}
                  <div class="flex-shrink-0 w-80 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div class="flex justify-between items-start mb-3">
                      <div class="space-y-2">
                        <div>
                          <p class="font-medium text-gray-900">
                            {parties.find(p => p.id_md_data_party === order.party)?.jumlah_data_party} x
                            {parties.find(p => p.id_md_data_party === order.party)?.ukuran_data_party}
                          </p>
                          <p class="text-sm text-gray-600">
                            {trucks.find(t => t.id_md_data_truck === order.truck)?.nopol_data_truck} -
                            {trucks.find(t => t.id_md_data_truck === order.truck)?.driver_data_truck}
                          </p>
                        </div>
                        <div class="space-y-1">
                          <p class="text-xs font-medium text-gray-500">Container/Seal Numbers:</p>
                          {#each order.containerSeals as seal}
                            <p class="text-sm text-gray-600">{seal}</p>
                          {/each}
                        </div>
                      </div>
                      <button
                        type="button"
                        on:click={() => removeDirectCostOrder(i)}
                        class="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <div class="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            on:click={onCancel}
            class="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            style="background-color: {primaryColor}"
            class="px-4 py-2.5 text-white rounded-lg hover:opacity-90 transition-colors"
          >
            {currentOrder.id ? 'Simpan Perubahan' : 'Tambah Data'}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>