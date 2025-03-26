import type { HandleClientError } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';

export const reroute = i18n.reroute();

// Error handling
export const handleError: HandleClientError = ({ error }) => {
	const errorObj = error instanceof Error ? error : new Error(String(error));

	// Log errors in dev mode
	if (import.meta.env.DEV) {
		console.error('Error in client-side navigation:', errorObj);
	}

	// Vercel Analytics automatically tracks errors in production
	// No manual tracking needed as it's handled by the @vercel/analytics package

	return {
		message: errorObj.message
	};
};
