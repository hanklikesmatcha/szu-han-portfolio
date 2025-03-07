<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-gray-900 text-gray-100">
	<header class="border-b border-gray-800">
		<Nav />
	</header>

	<main class="flex-grow">
		<ParaglideJS {i18n}>
			{@render children()}
		</ParaglideJS>
	</main>

	<footer class="bg-gray-800 py-6 border-t border-gray-800">
		<Footer />
	</footer>
</div>
