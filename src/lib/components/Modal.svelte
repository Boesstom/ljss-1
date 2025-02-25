<script>
  import { X } from 'lucide-svelte';
  
  export let show = false;
  export let title = '';
  
  
  function closeModal() {
    show = false;
  }
</script>

{#if show}
  <div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg w-full max-w-md mx-4">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">{title}</h2>
        <button
          on:click={closeModal}
          class="text-gray-400 hover:text-gray-500 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
{/if}