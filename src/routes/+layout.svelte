<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-gray-900 text-gray-100">
	<header class="bg-gray-900 text-white shadow-md border-b border-gray-800">
		<nav class="container mx-auto px-4 py-4 flex justify-between items-center">
			<a href="/" class="text-xl font-bold text-blue-400">Szu-Han Chou aka Hank</a>
			<div class="space-x-6">
				<a href="/" class="hover:text-blue-400 transition-colors">Home</a>
				<a href="/portfolio" class="hover:text-blue-400 transition-colors">Portfolio</a>
				<a href="/services" class="hover:text-blue-400 transition-colors">Expertise</a>
			</div>
		</nav>
	</header>

	<main class="flex-grow">
		<ParaglideJS {i18n}>
			{@render children()}
		</ParaglideJS>
	</main>

	<footer class="bg-gray-800 text-white py-6 border-t border-gray-800">
		<div class="container mx-auto px-4">
			<div class="flex flex-col md:flex-row justify-between items-center">
				<div class="mb-4 md:mb-0">
					<p>© {new Date().getFullYear()} Szu-Han Chou aka Hank All rights reserved.</p>
				</div>
				<div class="flex space-x-4">
					<a href="https://github.com/hanklikesmatcha" target="_blank" rel="noopener noreferrer" class="hover:text-blue-400 transition-colors">
						GitHub
					</a>
					<a href="https://linkedin.com/in/szuhan-eng" target="_blank" rel="noopener noreferrer" class="hover:text-blue-400 transition-colors">
						LinkedIn
					</a>
					<a href="mailto:szuhan.eng@gmail.com" class="hover:text-blue-400 transition-colors">
						Email
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>
