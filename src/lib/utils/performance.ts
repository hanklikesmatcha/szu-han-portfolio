/**
 * Performance utilities for optimizing SvelteKit routes
 */

// Define LayoutShift interface
interface LayoutShift extends PerformanceEntry {
	value: number;
	hadRecentInput: boolean;
}

// Define NetworkInformation interface
interface NetworkInformation {
	saveData: boolean;
	effectiveType: string;
}

// Specialized preload functions for different content types
export const preloadStrategies = {
	// Preload critical images on homepage
	criticalImages: () => {
		if (typeof window === 'undefined') return; // Server-side guard

		// Using actual images from your static directory
		const imagesToPreload = [
			'/favicon.png',
			'/images/me.jpg',
			'/images/hank-social.png',
			'/images/hank-logo.svg'
		];

		imagesToPreload.forEach((image) => {
			const link = document.createElement('link');
			link.rel = 'preload';
			link.as = 'image';
			link.href = image;
			document.head.appendChild(link);
		});
	},

	// Preconnect to third-party domains
	preconnect: (domains: string[]) => {
		if (typeof window === 'undefined') return; // Server-side guard

		domains.forEach((domain) => {
			const link = document.createElement('link');
			link.rel = 'preconnect';
			link.href = domain;
			document.head.appendChild(link);
		});
	},

	// Dynamically load non-critical JavaScript
	deferScript: (src: string) => {
		if (typeof window === 'undefined') return; // Server-side guard

		const script = document.createElement('script');
		script.src = src;
		script.defer = true;
		document.head.appendChild(script);
	},

	// Prefetch links that are likely to be navigated to
	prefetchLinks: (paths: string[]) => {
		if (typeof window === 'undefined') return; // Server-side guard

		paths.forEach((path) => {
			const link = document.createElement('link');
			link.rel = 'prefetch';
			link.href = path;
			document.head.appendChild(link);
		});
	}
};

// Track performance metrics and report to PostHog
export const trackPerformance = () => {
	if (typeof window === 'undefined') return; // Server-side guard

	// Use Performance Observer to monitor layout shifts
	if ('PerformanceObserver' in window) {
		try {
			const layoutShiftObserver = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					// Cast entry to LayoutShift type
					const layoutShift = entry as LayoutShift;

					// Only send significant layout shifts to reduce noise
					if (layoutShift.value > 0.05 && window.posthog) {
						window.posthog.capture('layout_shift', {
							value: layoutShift.value,
							path: window.location.pathname
						});
					}
				}
			});

			layoutShiftObserver.observe({ type: 'layout-shift', buffered: true });

			// Track largest contentful paint
			const lcpObserver = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				const lastEntry = entries[entries.length - 1];

				if (window.posthog && lastEntry) {
					window.posthog.capture('largest_contentful_paint', {
						value: lastEntry.startTime,
						path: window.location.pathname
					});
				}
			});

			lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
		} catch (e) {
			console.error('Performance Observer error:', e);
		}
	}
};

// Cache resources that rarely change
export const setupResourceCache = () => {
	if (typeof window === 'undefined' || !('caches' in window)) return;

	try {
		// Create a cache for static assets that rarely change
		caches.open('static-assets-v1').then((cache) => {
			// Using actual assets from your static directory
			const urlsToCache = ['/favicon.png', '/images/hank-logo.svg', '/images/hank-social.png'];

			cache.addAll(urlsToCache).catch((e) => {
				console.error('Failed to cache resources:', e);
			});
		});
	} catch (e) {
		console.error('Cache API error:', e);
	}
};

// Initialize all performance optimizations
export const initializePerformanceOptimizations = () => {
	if (typeof window === 'undefined') return;

	// Setup tracking and caching
	trackPerformance();

	// Handle network condition changes
	if ('connection' in navigator) {
		// Use the NetworkInformation interface
		const conn = navigator.connection as NetworkInformation;
		if (conn) {
			// Adapt to network conditions
			if (conn.saveData) {
				// Save data mode is active
				document.body.classList.add('save-data');
			}

			if (conn.effectiveType === '4g') {
				// Fast connection - preload more assets
				preloadStrategies.criticalImages();
				setupResourceCache();
			}
		}
	} else {
		// Default behavior for browsers that don't support Network Information API
		preloadStrategies.criticalImages();
		setupResourceCache();
	}

	// Preconnect to essential domains
	preloadStrategies.preconnect(['https://app.posthog.com']);
};
