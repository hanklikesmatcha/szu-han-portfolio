<script lang="ts">
	import { CONTACT_EMAIL } from '$lib/config';
	import { onMount } from 'svelte';

	let videoElement: HTMLVideoElement;

	// onMount(() => {
	// 	// Load HLS.js from CDN
	// 	const script = document.createElement('script');
	// 	script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
	// 	script.onload = () => {
	// 		if (videoElement && (window as any).Hls) {
	// 			const Hls = (window as any).Hls;
	// 			if (Hls.isSupported()) {
	// 				const hls = new Hls();
	// 				hls.loadSource('https://customer-f2625ido0mjr8wfm.cloudflarestream.com/d4e8683afd2500c5bf0eb43e469b9f15/manifest/video.m3u8');
	// 				hls.attachMedia(videoElement);
	// 				const ensureCaptions = () => {
	// 					try {
	// 						// Force any text tracks to show
	// 						for (let i = 0; i < videoElement.textTracks.length; i++) {
	// 							const track = videoElement.textTracks[i];
	// 							if (track.kind === 'subtitles' || track.kind === 'captions') {
	// 								track.mode = 'showing';
	// 							}
	// 						}
	// 						const trackEl = videoElement.querySelector('track') as HTMLTrackElement | null;
	// 						if (trackEl && trackEl.track) {
	// 							trackEl.addEventListener('load', () => {
	// 								trackEl.track.mode = 'showing';
	// 							});
	// 						}
	// 					} catch {}
	// 				};
	// 				videoElement.addEventListener('loadedmetadata', ensureCaptions);
	// 				videoElement.addEventListener('loadeddata', ensureCaptions);
	// 				videoElement.addEventListener('canplay', ensureCaptions);
	// 			} else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
	// 				// Safari native HLS support
	// 				videoElement.src = 'https://customer-f2625ido0mjr8wfm.cloudflarestream.com/d4e8683afd2500c5bf0eb43e469b9f15/manifest/video.m3u8';
	// 				const ensureCaptions = () => {
	// 					try {
	// 						for (let i = 0; i < videoElement.textTracks.length; i++) {
	// 							const track = videoElement.textTracks[i];
	// 							if (track.kind === 'subtitles' || track.kind === 'captions') {
	// 								track.mode = 'showing';
	// 							}
	// 						}
	// 						const trackEl = videoElement.querySelector('track') as HTMLTrackElement | null;
	// 						if (trackEl && trackEl.track) {
	// 							trackEl.addEventListener('load', () => {
	// 								trackEl.track.mode = 'showing';
	// 							});
	// 						}
	// 					} catch {}
	// 				};
	// 				videoElement.addEventListener('loadedmetadata', ensureCaptions);
	// 				videoElement.addEventListener('loadeddata', ensureCaptions);
	// 				videoElement.addEventListener('canplay', ensureCaptions);
	// 			}
	// 		}
	// 	};
	// 	document.head.appendChild(script);
	// });
</script>

<svelte:head>
	<title>Fanlytics | AI CRM for Sports Clubs & Teams</title>
	<meta
		name="description"
		content="Fanlytics is a simple AI CRM for sport that grows engagement, lifts match attendance, and boosts fan‑driven revenue with Gen Z‑ready community features and clear, sponsor‑ready analytics."
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

		<h1 class="mb-3 text-3xl font-bold text-blue-300 md:text-5xl">AI CRM for sport that drives engagement and matchday revenue</h1>
		<p class="mb-2 max-w-3xl text-blue-300">Short videos. Live reactions. Real attendance impact.</p>
		<p class="mb-8 max-w-3xl text-gray-200">Fanlytics turns highlight clips and live streams into measurable fan engagement—so clubs can grow attendance, loyalty, and sponsor ROI.</p>

		<div class="mb-6 flex flex-wrap gap-2">
			<span class="rounded-md bg-[#2D3748] px-2 py-1 text-xs text-blue-300">Match Feed & fan groups</span>
			<span class="rounded-md bg-[#2D3748] px-2 py-1 text-xs text-blue-300">Short video highlights</span>
			<span class="rounded-md bg-[#2D3748] px-2 py-1 text-xs text-blue-300">Live stream reactions</span>
			<span class="rounded-md bg-[#2D3748] px-2 py-1 text-xs text-blue-300">Sponsor activation tracking</span>
		</div>

		<!-- Primary CTA -->
		<div class="mb-10 flex flex-wrap gap-3">
			<a
				href={"mailto:" + CONTACT_EMAIL + "?subject=Fanlytics%20Pilot%20Inquiry&body=Hi%20Hank%2C%0A%0AWe'd%20like%20to%20discuss%20a%20Fanlytics%20pilot.%20Our%20club%2Fbrand%3A%20_____.%20Campaign%20goal%3A%20_____.%20Timeline%3A%20_____.%0A%0ABest%2C%20"}
				class="rounded bg-gradient-to-r from-pink-600 to-amber-500 px-5 py-2 text-white hover:from-pink-500 hover:to-amber-400"
			>
				Start a pilot (4–6 weeks)
			</a>
			<a
				href={"mailto:" + CONTACT_EMAIL + "?subject=Book%20a%20Fanlytics%20demo&body=Hi%20Hank%2C%0A%0AWe'd%20like%20to%20book%20a%20Fanlytics%20demo.%20Our%20club%2Fbrand%3A%20_____.%20Focus%20(KPIs)%3A%20_____.%0A%0ABest%2C%20"}
				class="rounded border border-gray-600 px-5 py-2 text-gray-200 hover:border-gray-500"
			>
				Book a demo
			</a>
			<a href="#examples" class="rounded border border-blue-600 px-5 py-2 text-blue-300 hover:bg-blue-950/40">
				View engagement examples
			</a>
		</div>

		<!-- Cloudflare Stream video with captions -->
		<!-- <div class="relative mb-10 w-full overflow-hidden rounded-xl bg-black shadow-xl" style="aspect-ratio:16/9">
			<video
				bind:this={videoElement}
				class="absolute left-0 top-0 h-full w-full"
				controls
				preload="metadata"
				playsinline
				crossorigin="anonymous"
			>
				<track kind="captions" src="/fanlytics.vtt" srclang="en" label="English" default>
				Your browser does not support the video tag.
			</video>
		</div> -->
		<!-- <p class="mb-4 text-sm text-gray-300">Live stream preview — fans react in real time.</p>
		<p class="mb-12 text-sm text-gray-400">
			If the player doesn't load, open the demo in a new tab:
			<a
				href="https://customer-f2625ido0mjr8wfm.cloudflarestream.com/d4e8683afd2500c5bf0eb43e469b9f15/watch"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-300 underline hover:text-blue-200"
			>
				Open video
			</a>
		</p> -->


		<!-- How it works -->
		<section class="mb-16 rounded-xl border border-gray-700 bg-[#1E2433] p-6">
			<h2 class="mb-3 text-2xl font-semibold text-blue-300">How it works</h2>
			<div class="grid gap-6 md:grid-cols-3">
				<div class="rounded-lg bg-[#151A26] p-5">
					<div class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-300">1. Engage</div>
					<p class="mb-2 text-gray-200">Fans scroll match highlights and live clips; AI prompts reactions and attendance nudges.</p>
					<ul class="list-disc space-y-1 pl-5 text-gray-300">
						<li>Match Feed with AI prompts</li>
						<li>Highlights and live clips</li>
						<li>Attendance nudges built‑in</li>
					</ul>
				</div>
				<div class="rounded-lg bg-[#151A26] p-5">
					<div class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-300">2. Analyse</div>
					<p class="mb-2 text-gray-200">AI turns first‑party signals into clear, actionable KPIs.</p>
					<ul class="list-disc space-y-1 pl-5 text-gray-300">
						<li>See engagement %, retention, growth</li>
						<li>Predict attendance and trigger nudges</li>
						<li>Track sponsor ROI and CTR</li>
					</ul>
				</div>
				<div class="rounded-lg bg-[#151A26] p-5">
					<div class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-300">3. Monetise</div>
					<p class="mb-2 text-gray-200">Boost turn‑up and fan‑driven revenue with targeted offers.</p>
					<ul class="list-disc space-y-1 pl-5 text-gray-300">
						<li>Boost turn‑up with reminders and streaks</li>
						<li>Convert fans to repeat ticket buyers</li>
						<li>Place sponsor offers fans welcome</li>
					</ul>
				</div>
			</div>
		</section>

		<!-- Why Gen Z loves it -->
		<section class="mb-16 grid gap-6 md:grid-cols-2">
			<div class="rounded-xl border border-gray-700 bg-[#1E2433] p-6">
				<h3 class="mb-2 text-xl font-semibold text-blue-300">Why Gen Z loves it</h3>
				<ul class="list-disc space-y-2 pl-5 text-gray-200">
					<li>Feels like TikTok, but built for your club.</li>
					<li>Swipe, comment, earn badges.</li>
					<li>Real‑time reactions that matter.</li>
				</ul>
			</div>
			<div class="rounded-xl border border-gray-700 bg-[#1E2433] p-6">
				<h3 class="mb-2 text-xl font-semibold text-blue-300">Why it matters to revenue</h3>
				<p class="text-gray-200">Attendance is sliding. Social platforms charge you to reach your own fans. Fanlytics rebuilds direct fan relationships so clubs can lift attendance and prove sponsor ROI without renting audiences.</p>
			</div>
		</section>

		<!-- Demo visuals: Fan Map & Match Feed -->
		<section class="mb-16 grid gap-6 md:grid-cols-2">
			<div class="rounded-xl border border-gray-700 bg-[#1E2433] p-6">
				<div class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-300">Fan Map</div>
				<div class="relative h-56 w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 to-slate-800">
					<!-- simple hotspot dots -->
					<div class="absolute left-[15%] top-[30%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/80"></div>
					<div class="absolute left-[40%] top-[55%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/80"></div>
					<div class="absolute left-[65%] top-[35%] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/80"></div>
					<div class="absolute left-[78%] top-[70%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/80"></div>
					<div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_60%)]"></div>
				</div>
				<p class="mt-3 text-sm text-gray-300">See where your community is strongest to plan activations and away‑day offers.</p>
			</div>
			<div class="rounded-xl border border-gray-700 bg-[#1E2433] p-6">
				<div class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-300">Match Feed</div>
				<div class="w-full overflow-hidden rounded-lg bg-[#0f1420] p-3" style="aspect-ratio:9/16">
					<!-- Vertical feed items -->
					<div class="mb-3 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 p-3">
						<div class="mb-2 h-28 w-full rounded-lg bg-slate-600/40"></div>
						<div class="space-y-1 text-xs text-gray-300">
							<p><span class="font-semibold text-white">@mia</span> Unreal volley! 🔥</p>
							<p><span class="font-semibold text-white">@liam</span> This angle is class.</p>
						</div>
					</div>
					<div class="mb-3 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 p-3">
						<div class="mb-2 h-28 w-full rounded-lg bg-slate-600/40"></div>
						<div class="space-y-1 text-xs text-gray-300">
							<p><span class="font-semibold text-white">@sara</span> Ticket link pls 🙏</p>
							<p><span class="font-semibold text-white">@evan</span> Taking my brother to the derby!</p>
						</div>
					</div>
					<div class="rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 p-3">
						<div class="mb-2 h-28 w-full rounded-lg bg-slate-600/40"></div>
						<div class="space-y-1 text-xs text-gray-300">
							<p><span class="font-semibold text-white">@zoe</span> Keeper save of the season!</p>
							<p><span class="font-semibold text-white">@tom</span> MOTM? #8 for me.</p>
						</div>
					</div>
				</div>
				<p class="mt-3 text-sm text-gray-300">Fans comment live during matches and highlights. Clubs see engagement and sentiment in real time.</p>
			</div>
		</section>

		<!-- Proof & Pilot -->
		<div class="mt-16 grid gap-6 md:grid-cols-2">
			<div class="rounded-xl border border-gray-700 bg-[#1E2433] p-6">
				<h3 class="mb-3 text-xl font-semibold text-blue-300">What marketers say</h3>
				<p class="mb-3 text-gray-200">Finally, a way for sport marketers to understand their fans and act on it — not just collect data. Fanlytics brings every engagement, conversation, and purchase into one place, so teams can build loyalty without chasing platforms or paying to reach their own supporters</p>
				<p class="text-sm text-gray-400">— Ad campaign producer for professional teams</p>
			</div>
			<div class="rounded-xl border border-gray-700 bg-[#1E2433] p-6">
				<h3 class="mb-3 text-xl font-semibold text-blue-300">Pilot (4–6 weeks)</h3>
				<ul class="list-disc space-y-2 pl-5 text-gray-200">
					<li>Launch branded community hub (iOS/Android)</li>
					<li>Activation plan focused on turn‑up and engagement</li>
					<li>Live KPIs: engagement %, retention, attendance clicks</li>
					<li>End report: outcomes, learnings, next steps</li>
				</ul>
			</div>
		</div>

		<!-- Example KPIs disclaimer + Engagement dashboard (moved lower) -->
		<section id="examples" class="mt-16 mb-16 rounded-xl border border-gray-600 bg-gray-100/10 p-6">
			<p class="mb-2 text-xs italic text-gray-400">Example KPIs from early simulations. Actual results may vary by club and campaign.</p>
			<h2 class="mb-3 text-2xl font-semibold text-blue-300">Engagement dashboard</h2>
			<p class="mb-6 text-gray-200">Metrics sport marketers care about—at a glance and ready for sponsors.</p>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div class="rounded-lg bg-[#151A26] p-4 shadow">
					<div class="text-3xl font-bold text-white">38%</div>
					<div class="text-sm text-gray-400">Weekly active fans</div>
				</div>
				<div class="rounded-lg bg-[#151A26] p-4 shadow">
					<div class="text-3xl font-bold text-white">+12%</div>
					<div class="text-sm text-gray-400">Attendance uplift</div>
				</div>
				<div class="rounded-lg bg-[#151A26] p-4 shadow">
					<div class="text-3xl font-bold text-white">3.4×</div>
					<div class="text-sm text-gray-400">Sponsor CTR vs social</div>
				</div>
				<div class="rounded-lg bg-[#151A26] p-4 shadow">
					<div class="text-3xl font-bold text-white">$2.80</div>
					<div class="text-sm text-gray-400">Avg. revenue per fan</div>
				</div>
			</div>
		</section>

		<div class="mt-16 flex flex-wrap gap-3">
			<a
				href={"mailto:" + CONTACT_EMAIL + "?subject=Fanlytics%20Pilot%20Inquiry"}
				class="rounded bg-blue-700 px-5 py-2 text-white hover:bg-blue-600"
			>
				Start a pilot (4–6 weeks)
			</a>
			<a
				href={"mailto:" + CONTACT_EMAIL + "?subject=Book%20a%20Fanlytics%20demo"}
				class="rounded border border-gray-600 px-5 py-2 text-gray-200 hover:border-gray-500"
			>
				Book a demo
			</a>
			<a href="#examples" class="rounded border border-blue-600 px-5 py-2 text-blue-300 hover:bg-blue-950/40">
				View engagement examples
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


