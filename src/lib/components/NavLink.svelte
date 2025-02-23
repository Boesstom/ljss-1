<script>
  import { page } from '$app/stores';

  export let href = '';
  export let icon = undefined;
  export let text = '';
  export let visible = true;

  $: isActive = $page.url.pathname === href;
</script>

{#if visible}
  <a
    {href}
    class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 {isActive ? 'bg-gray-100 text-[#289CD7]' : ''}">
    <div class="w-5 h-5 mr-3">
      <svelte:component this={icon} class="w-full h-full" />
    </div>
    <span class="text-sm font-medium">{text}</span>
  </a>
{/if}