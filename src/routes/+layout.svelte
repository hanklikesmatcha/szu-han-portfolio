<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';
	import '$lib/styles/global.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { animate, spring } from 'motion';
	import { browser } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	// Initialize Vercel analytics
	if (browser) {
		// Initialize Vercel Analytics and Speed Insights
		inject();
		injectSpeedInsights();
	}

	let { children } = $props();
	let currentPath = '';
	let transitionContainer;
	let isFirstLoad = true;
	let animationsLoaded = false;

	// Enhanced animation states for more dramatic effect
	const inAnimation = {
		opacity: [0, 1],
		y: [80, 0],
		scale: [0.9, 1],
		filter: ['blur(15px)', 'blur(0px)'] // Add blur effect for dramatic transitions
	};

	onMount(() => {
		// Mark animations as loaded
		animationsLoaded = true;

		// Capture initial path
		currentPath = $page.url.pathname;
		isFirstLoad = false;

		// More dramatic initial page entrance animation
		try {
			const pageContent = document.querySelector('.page-content');
			if (pageContent) {
				// More dramatic entrance from bottom with scale
				animate(
					'.page-content',
					{
						opacity: [0, 1],
						y: [100, 0],
						scale: [0.9, 1]
					},
					{ duration: 1.4, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
				);
			}
		} catch (error) {
			console.error('Animation error:', error);
		}
	});

	// Handle page transitions using $effect instead of afterUpdate
	$effect(() => {
		if (animationsLoaded && !isFirstLoad && currentPath !== $page.url.pathname) {
			// Page has changed - trigger transition
			const oldPath = currentPath;
			currentPath = $page.url.pathname;

			// Animate page content with enhanced effects
			try {
				const pageContent = document.querySelector('.page-content');
				if (pageContent) {
					// Choose different transition effect based on navigation direction
					if (determineNavigationDirection(oldPath, currentPath) === 'forward') {
						// Forward navigation - slide left and fade
						animate(
							'.page-content',
							{
								opacity: [0, 1],
								x: ['5%', '0%'],
								scale: [0.95, 1]
							},
							{ duration: 1.0, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
						);
					} else {
						// Backward navigation - different animation (slide right)
						animate(
							'.page-content',
							{
								opacity: [0, 1],
								x: ['-5%', '0%'],
								scale: [0.95, 1]
							},
							{ duration: 1.0, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
						);
					}
				}
			} catch (error) {
				console.error('Animation error:', error);
			}
		}
	});

	// Helper function to guess navigation direction
	function determineNavigationDirection(oldPath: string, newPath: string): 'forward' | 'backward' {
		// Simple heuristic - deeper paths are "forward"
		// This is just a guess based on path depth
		const oldDepth = (oldPath.match(/\//g) || []).length;
		const newDepth = (newPath.match(/\//g) || []).length;

		return newDepth >= oldDepth ? 'forward' : 'backward';
	}
</script>

<svelte:head>
	<!-- Common meta tags that apply to all pages -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="og:type" content="website" />
	<link rel="icon" href="/favicon.png" />
</svelte:head>

<div class="perspective-container flex min-h-screen flex-col bg-[#171923] text-gray-100">
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

	<footer class="border-t border-gray-800 bg-[#111827] py-6">
		<Footer />
	</footer>
</div>

<style>
	:global(body) {
		background-color: #171923;
		color: #f3f4f6;
		overflow-x: hidden; /* Prevent horizontal scrollbars during animations */
	}

	/* Enhanced animation handling */
	.perspective-container {
		perspective: 1200px; /* Add perspective to entire container */
	}

	.page-content {
		opacity: 1; /* Start visible by default */
		will-change: transform, opacity, filter;
		transform-style: preserve-3d;
		transition:
			opacity 0.5s ease,
			transform 0.5s ease,
			filter 0.5s ease; /* Fallback for when JS is disabled */
	}

	/* Make content fail safe but don't override opacity for animations */
	:global(.hero-element),
	:global(.service-card),
	:global(.expertise-element),
	:global(.testimonial-card),
	:global(.cta-element),
	:global(.project-card),
	:global(.filter-btn),
	:global(.header-container),
	:global(.about-element),
	:global(.skill-tag) {
		transform-style: preserve-3d;
		backface-visibility: hidden;
	}

	.transition-container {
		position: relative;
		width: 100%;
	}

	/* Ensure content is visible if JS fails or reduced motion is preferred */
	@media (prefers-reduced-motion: reduce) {
		.page-content,
		:global(.animate-ready),
		:global(.hero-element),
		:global(.service-card),
		:global(.expertise-element),
		:global(.testimonial-card),
		:global(.cta-element),
		:global(.project-card),
		:global(.filter-btn),
		:global(.header-container),
		:global(.about-element),
		:global(.skill-tag) {
			opacity: 1 !important;
			transform: none !important;
			filter: none !important;
		}
	}
</style>
