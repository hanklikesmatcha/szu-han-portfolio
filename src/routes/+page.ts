import { browser } from '$app/environment';
import { initializePerformanceOptimizations, preloadStrategies } from '$lib/utils/performance';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	// Client-side performance optimizations
	if (browser) {
		// Initialize core performance tracking and optimizations
		initializePerformanceOptimizations();

		// Prefetch portfolio and services pages that are likely to be visited next
		preloadStrategies.prefetchLinks(['/portfolio', '/services']);

		// Preload critical images for the home page
		preloadStrategies.criticalImages();
	}

	// Empty return is fine since we're not using server data here
	return {};
};

// Configure SSG (Static Site Generation)
export const prerender = true;
export const csr = true; // Enable client-side rendering for dynamic elements
