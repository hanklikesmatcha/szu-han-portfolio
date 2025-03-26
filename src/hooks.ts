import type { HandleClientError } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';

export const reroute = i18n.reroute();

// Performance budget violation tracking
export const handleError: HandleClientError = ({ error, event }) => {
	const errorObj = error instanceof Error ? error : new Error(String(error));

	// Log performance issues in dev mode
	if (import.meta.env.DEV) {
		console.error('Error in client-side navigation:', errorObj);
	}

	// Report to PostHog in production
	if (typeof window !== 'undefined' && window.posthog) {
		window.posthog.capture('error', {
			message: errorObj.message,
			url: event.url.href,
			stack: errorObj.stack
		});
	}

	return {
		message: errorObj.message
	};
};

// Declare PostHog type for TypeScript
declare global {
	interface Window {
		posthog?: {
			capture: (
				event: string,
				properties?: Record<string, string | number | boolean | undefined>
			) => void;
		};
	}
}
