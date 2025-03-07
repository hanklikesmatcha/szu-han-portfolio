<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { animate, spring } from 'motion';

	let { children } = $props();
	let currentPath = '';
	let transitionContainer;
	let isFirstLoad = true;

	// Animation states
	const inAnimation = { 
		opacity: [0, 1], 
		y: [20, 0] 
	};
	
	const outAnimation = { 
		opacity: [1, 0], 
		y: [0, -20] 
	};

	onMount(() => {
		// Capture initial path
		currentPath = $page.url.pathname;
		isFirstLoad = false;
		
		// Initial page entrance animation
		animate(
			'.page-content', 
			{ 
				opacity: [0, 1], 
				y: [50, 0],
				scale: [0.98, 1]
			}, 
			{ 
				duration: 0.8,
				easing: spring({ stiffness: 100, damping: 15 }) 
			}
		);
	});

	// Handle page transitions using $effect instead of afterUpdate
	$effect(() => {
		if (!isFirstLoad && currentPath !== $page.url.pathname) {
			// Page has changed - trigger transition
			currentPath = $page.url.pathname;
			
			// Animate page content
			animate(
				'.page-content', 
				{ 
					opacity: [0, 1], 
					y: [30, 0],
					scale: [0.98, 1]
				}, 
				{ 
					duration: 0.6,
					easing: spring({ stiffness: 100, damping: 15 }) 
				}
			);
		}
	});
</script>

<div class="min-h-screen flex flex-col bg-[#171923] text-gray-100">
	<header class="border-b border-gray-800">
		<Nav />
	</header>

	<main class="flex-grow">
		<ParaglideJS {i18n}>
			<div bind:this={transitionContainer} class="transition-container">
				<div class="page-content">
					{@render children()}
				</div>
			</div>
		</ParaglideJS>
	</main>

	<footer class="bg-[#111827] py-6 border-t border-gray-800">
		<Footer />
	</footer>
</div>

<style>
	:global(body) {
		background-color: #171923;
		color: #f3f4f6;
	}
	
	:global(.page-content) {
		opacity: 1 !important;
	}
	
	:global(.hero-element), 
	:global(.service-card), 
	:global(.expertise-element), 
	:global(.testimonial-card), 
	:global(.cta-element),
	:global(.project-card),
	:global(.filter-btn),
	:global(.header-container) {
		opacity: 1 !important;
	}
	
	.transition-container {
		position: relative;
		width: 100%;
	}
	
	.page-content {
		width: 100%;
		will-change: transform, opacity;
	}
</style>
