<script>
  import { slide } from 'svelte/transition';
  import { page } from '$app/stores';
  import { ChevronDown } from 'lucide-svelte';

  export let text = '';
  export let icon = undefined;
  export let visible = true;
  export let children = [];

  let isOpen = false;
  $: isActive = children.some(child => $page.url.pathname === child.href);

  function toggleAccordion() {
    isOpen = !isOpen;
  }
</script>

{#if visible}
  <div class="nav-accordion">
    <button
      on:click={toggleAccordion}
      class="w-full flex items-center justify-between px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 {isActive ? 'bg-gray-100 text-[#289CD7]' : ''}">
      <div class="flex items-center">
        <div class="w-5 h-5 mr-3">
          <svelte:component this={icon} class="w-full h-full" />
        </div>
        <span class="text-sm font-medium">{text}</span>
      </div>
      <div class="w-4 h-4 transform transition-transform duration-200 {isOpen ? 'rotate-180' : ''}">
        <ChevronDown />
      </div>
    </button>

    {#if isOpen}
      <div transition:slide class="pl-4 mt-1 space-y-1">
        {#each children as child}
          {#if child.visible}
            <a
              href={child.href}
              class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 {$page.url.pathname === child.href ? 'bg-gray-100 text-[#289CD7]' : ''}">
              <div class="w-5 h-5 mr-3">
                <svelte:component this={child.icon} class="w-full h-full" />
              </div>
              <span class="text-sm font-medium">{child.text}</span>
            </a>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
{/if}