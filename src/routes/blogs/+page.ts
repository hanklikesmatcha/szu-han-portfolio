import { substackArticles, substackMeta } from '$lib/data/substack';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		articles: substackArticles,
		meta: substackMeta
	};
};

export const prerender = true;
