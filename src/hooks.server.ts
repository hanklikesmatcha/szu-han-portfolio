import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { SITE_URL } from '$lib/config';
import { sequence } from '@sveltejs/kit/hooks';

// Paraglide i18n handler
const handleParaglide: Handle = i18n.handle();

// Custom SEO and performance handler
const handleSeoAndPerformance: Handle = async ({ event, resolve }) => {
	// Add global response headers for better SEO and performance
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html
	});

	// Add security headers
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('X-XSS-Protection', '1; mode=block');

	// Add HTTP cache control headers
	if (!event.url.pathname.startsWith('/api/')) {
		const cacheControl =
			event.url.pathname === '/'
				? 'public, max-age=600, s-maxage=1200' // 10 mins for homepage, 20 mins on CDN
				: 'public, max-age=3600, s-maxage=7200'; // 1 hour for other pages, 2 hours on CDN

		response.headers.set('Cache-Control', cacheControl);
	}

	// Set Content-Security-Policy
	response.headers.set(
		'Content-Security-Policy',
		"default-src 'self'; " +
			"script-src 'self' 'unsafe-inline' vitals.vercel-insights.com va.vercel-scripts.com; " +
			"style-src 'self' 'unsafe-inline'; " +
			"img-src 'self' data: https:; " +
			"font-src 'self'; " +
			"connect-src 'self' vitals.vercel-insights.com vercel.com va.vercel-scripts.com; " +
			"media-src 'self'; " +
			"object-src 'none'; " +
			"frame-src 'self'; " +
			"base-uri 'self';"
	);

	// Add canonical URL
	if (!event.url.pathname.includes('.') && !event.url.pathname.startsWith('/api/')) {
		const path =
			event.url.pathname.endsWith('/') && event.url.pathname !== '/'
				? event.url.pathname.slice(0, -1)
				: event.url.pathname;

		const canonicalUrl = `${SITE_URL}${path}`;
		response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`);
	}

	return response;
};

// Combine handlers using sequence
export const handle = sequence(handleParaglide, handleSeoAndPerformance);

// Re-export i18n reroute for language handling
export const reroute = i18n.reroute();
