<script lang="ts">
	import CTA from '$lib/components/CTA.svelte';
	import { CONTACT_EMAIL } from '$lib/config';
</script>

<svelte:head>
	<title>Fanlytics | Community App for Sports Fans</title>
	<meta
		name="description"
		content="Fanlytics is a Flutter, Cloudflare and Supabase powered community app for sports clubs and brands. Own your fan community, deliver content, and get first‑party insights."
	/>
</svelte:head>

<section class="bg-gradient-to-br from-gray-900 to-blue-900 py-16">
	<div class="container mx-auto max-w-5xl px-4">
		<a href="/portfolio" class="mb-6 inline-flex items-center text-sm text-blue-300 hover:text-blue-200">
			<svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Portfolio
		</a>

		<h1 class="mb-3 text-3xl font-bold text-blue-300 md:text-5xl">Turn fans into a community you own</h1>
		<p class="mb-8 max-w-3xl text-lg text-gray-200">
			Bring your supporters into one place that feels made for them. Share short videos, run match chats and supporter groups, and see what’s working—all without fighting social algorithms.
		</p>

		<div class="mb-6 flex flex-wrap gap-2">
			<span class="rounded-md bg-[#2D3748] px-2 py-1 text-xs text-blue-300">Short‑form video feed</span>
			<span class="rounded-md bg-[#2D3748] px-2 py-1 text-xs text-blue-300">Matchday chats</span>
			<span class="rounded-md bg-[#2D3748] px-2 py-1 text-xs text-blue-300">Supporter groups</span>
			<span class="rounded-md bg-[#2D3748] px-2 py-1 text-xs text-blue-300">Live fan map</span>
		</div>

		<!-- Primary CTA -->
		<div class="mb-10 flex flex-wrap gap-3">
			<a
				href={"mailto:" + CONTACT_EMAIL + "?subject=Fanlytics%20Pilot%20Inquiry&body=Hi%20Hank%2C%0A%0AWe'd%20like%20to%20discuss%20a%20Fanlytics%20pilot.%20Our%20club%2Fbrand%3A%20_____.%20Campaign%20goal%3A%20_____.%20Timeline%3A%20_____.%0A%0ABest%2C%20"}
				class="rounded bg-gradient-to-r from-pink-600 to-amber-500 px-5 py-2 text-white hover:from-pink-500 hover:to-amber-400"
			>
				Start a pilot
			</a>
			<a
				href={"mailto:" + CONTACT_EMAIL + "?subject=Contact%20about%20Fanlytics&body=Hi%20Hank%2C%0A%0AI%27d%20like%20to%20get%20in%20touch%20about%20Fanlytics.%0A%0ABest%2C%20"}
				class="rounded border border-gray-600 px-5 py-2 text-gray-200 hover:border-gray-500"
			>
				Contact me
			</a>
		</div>

		<!-- Cloudflare Stream embed -->
		<div class="relative mb-10 w-full overflow-hidden rounded-xl bg-black shadow-xl" style="aspect-ratio:16/9">
			<iframe
				src="https://iframe.videodelivery.net/baf84bada185bd9833093da0f30cef16"
				title="Fanlytics Product Demo"
				loading="lazy"
				class="absolute left-0 top-0 h-full w-full"
				allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
		<p class="mb-12 text-sm text-gray-400">
			If the player doesn’t load, open the demo in a new tab:
			<a
				href="https://customer-f2625ido0mjr8wfm.cloudflarestream.com/baf84bada185bd9833093da0f30cef16/watch"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-300 underline hover:text-blue-200"
			>
				Open video
			</a>
		</p>

		<div class="grid gap-10 md:grid-cols-2">
			<div>
				<h2 class="mb-3 text-2xl font-semibold text-blue-300">Grow, engage and learn from your fans</h2>
				<p class="mb-4 text-gray-200">
					Bring fans in from social and make them feel at home. Give them a simple feed, spaces to talk on match day and groups to belong to. See where they are, what they love and what keeps them coming back.
				</p>
				<ul class="list-disc space-y-2 pl-5 text-gray-200">
					<li>Spot your most passionate fans and reward them</li>
					<li>Run campaigns and see what actually moves fans</li>
					<li>Create groups for regions, clubs and events</li>
					<li>See fan hotspots on a simple map</li>
					<li>Keep control—no outside algorithms</li>
				</ul>
			</div>
			<div>
				<h2 class="mb-3 text-2xl font-semibold text-blue-300">Clear results you can share</h2>
				<p class="mb-4 text-gray-200">
					No dashboards to learn. Ask simple questions and get simple answers you can put in a deck: what content wins, which fans are most active, and how a campaign performed.
				</p>
				<ul class="list-disc space-y-2 pl-5 text-gray-200">
					<li>Top posts and themes your fans love</li>
					<li>What drove views, chats and group joins</li>
					<li>Simple summaries to share with sponsors</li>
					<li>You own the audience and the learnings</li>
				</ul>
			</div>
		</div>

		<div class="mt-12 grid gap-6 md:grid-cols-2">
			<div class="rounded-xl border border-gray-700 bg-[#1E2433] p-6">
				<h3 class="mb-3 text-xl font-semibold text-blue-300">Pilot outcomes (4–6 weeks)</h3>
				<ul class="list-disc space-y-2 pl-5 text-gray-200">
					<li>Launch branded community hub on iOS/Android</li>
					<li>Content plan + super‑fan activation playbook</li>
					<li>LIVE metrics: reach, engagement, retention, conversions</li>
					<li>End‑of‑pilot report with next‑step recommendations</li>
				</ul>
			</div>
			<div class="rounded-xl border border-gray-700 bg-[#1E2433] p-6">
				<h3 class="mb-3 text-xl font-semibold text-blue-300">What we look at</h3>
				<ul class="list-disc space-y-2 pl-5 text-gray-200">
					<li>How many fans you reached and how often they came back</li>
					<li>What content got them watching, talking and joining groups</li>
					<li>Simple before/after for each campaign</li>
					<li>Ticket clicks, shop visits and other clear actions</li>
					<li>Where your community is strongest</li>
				</ul>
			</div>
		</div>

		<div class="mt-12 flex flex-wrap gap-3">
			<a
				href={"mailto:" + CONTACT_EMAIL + "?subject=Fanlytics%20Pilot%20Inquiry"}
				class="rounded bg-blue-700 px-5 py-2 text-white hover:bg-blue-600"
			>
				Discuss a pilot
			</a>
			<a
				href="https://www.linkedin.com/in/szuhan-eng"
				target="_blank"
				rel="noopener noreferrer"
				class="rounded border border-gray-600 px-5 py-2 text-gray-200 hover:border-gray-500"
			>
				Connect on LinkedIn
			</a>
		</div>
	</div>
</section>

<style>
	/* Keep page visuals consistent with portfolio styling */
	.container {
		max-width: 72rem;
	}
</style>


