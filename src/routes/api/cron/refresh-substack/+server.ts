import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import type { RequestHandler } from './$types';

const unauthorized = new Response('Unauthorized', { status: 401 });

export const GET: RequestHandler = async ({ request, fetch }) => {
	const secret = env.CRON_SECRET?.trim();
	if (!secret) {
		return new Response('CRON_SECRET is not configured', { status: 500 });
	}

	const authHeader = request.headers.get('authorization');
	if (authHeader !== `Bearer ${secret}`) {
		return unauthorized;
	}

	const deployHook = env.VERCEL_DEPLOY_HOOK_URL;
	if (!deployHook) {
		return new Response('VERCEL_DEPLOY_HOOK_URL is not configured', { status: 500 });
	}

	const response = await fetch(deployHook, {
		method: 'POST'
	});

	if (!response.ok) {
		return new Response(`Deploy hook failed: ${response.status}`, { status: 502 });
	}

	return json({ triggered: true, status: response.status, time: new Date().toISOString() });
};
