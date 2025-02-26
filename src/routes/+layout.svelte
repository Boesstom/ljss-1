<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
	import '../app.css';
	import { page } from '$app/stores';
	import { getUser } from '$lib/auth/login';
	import { onMount } from 'svelte';

	let userEmail = '';
	let userRole = '';

	// Check if current page is login
	$: isLoginPage = $page.url.pathname === '/login';

	onMount(async () => {
		const user = await getUser();
		if (user) {
			userEmail = user.email;
			userRole = user.user_metadata?.role || '';
		}
	});
</script>

{#if !isLoginPage}
	<div class="flex">
		<Sidebar {userEmail} {userRole} />
		<main class="flex-1 bg-gray-100 min-h-screen">
			<slot />
		</main>
	</div>
{:else}
	<main class="bg-gray-100 min-h-screen">
		<slot />
	</main>
{/if}
