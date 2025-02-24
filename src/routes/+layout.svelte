<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
	import '../app.css';
	import { userStore } from '$lib/stores/authStore';
	import { page } from '$app/stores';

	export let data;
	
	// Update store ketika data berubah
	$: if (data?.user) {
		userStore.set({
			email: data.user.email || '',
			role: data.user.role || ''
		});
	}

	// Check if current page is login
	$: isLoginPage = $page.url.pathname === '/login';
</script>

{#if !isLoginPage}
	<div class="flex">
		<Sidebar userEmail={$userStore.email} userRole={$userStore.role} />
		<main class="flex-1 bg-gray-100 min-h-screen">
			<slot />
		</main>
	</div>
{:else}
	<main class="bg-gray-100 min-h-screen">
		<slot />
	</main>
{/if}
