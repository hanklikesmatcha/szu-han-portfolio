export interface SubstackArticle {
	id: string;
	title: string;
	slug: string;
	summary: string;
	url: string;
	publishedAt: string;
	coverImage?: string | null;
	tags: string[];
	readingTimeMinutes?: number | null;
}

export interface SubstackDatasetMeta {
	lastUpdated: string;
	source: string;
}
