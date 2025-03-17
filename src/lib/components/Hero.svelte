<script lang="ts">
	// Props
	export let skills: string[] = [];
	export let heroSection: HTMLElement | null = null;
	export let fireworksCanvas: HTMLCanvasElement | null = null;
	export let gradientCanvas: HTMLCanvasElement | null = null;
	
	// Event handlers
	export let handleNameClick: (name: string) => void;
	
	// Expose element binding to parent
	export function getHeroElementRef(el: HTMLElement) {
		heroSection = el;
		return heroSection;
	}
	
	export function getFireworksCanvasRef(el: HTMLCanvasElement) {
		fireworksCanvas = el;
		return fireworksCanvas;
	}
	
	export function getGradientCanvasRef(el: HTMLCanvasElement) {
		gradientCanvas = el;
		return gradientCanvas;
	}
</script>

<!-- Hero section -->
<section id="hero" class="hero perspective relative bg-[#1A202C] py-12 text-gray-100" bind:this={heroSection}>
	<!-- Canvas for fireworks -->
	<canvas class="fireworks-canvas" bind:this={fireworksCanvas}></canvas>

	<!-- Canvas for simple gradient animation -->
	<canvas class="gradient-canvas" bind:this={gradientCanvas}></canvas>

	<div class="container mx-auto px-4">
		<div class="flex flex-col items-center">
			<!-- Profile image wrapper with solid background -->
			<div class="relative z-20">
				<!-- Solid circle behind image -->
				<div class="absolute inset-0 rounded-full bg-[#1A202C] shadow-xl"></div>
				
				<div
					class="hero-element animate-ready mb-6 overflow-hidden rounded-full border-4 border-blue-400 bg-gray-900 shadow-lg shadow-blue-500/50 transition-transform duration-300 hover:scale-105 relative z-10"
				>
					<div class="absolute inset-0 bg-gray-900 opacity-90"></div>
					<img
						src="/images/me.jpg"
						alt="Hank Chou"
						class="object-position-y-top h-40 w-40 object-cover relative z-20"
						style="object-position: 10% 7%; mix-blend-mode: normal;"
						loading="eager"
					/>
				</div>
			</div>

			<div class="w-full max-w-3xl text-center">
				<h1 class="hero-element animate-ready mb-4 text-4xl font-bold md:text-5xl">
					Hi, I'm <button class="hank-highlight" on:click={() => handleNameClick('hank')}
						>Hank</button
					>
					aka
					<button class="szuhan-highlight" on:click={() => handleNameClick('szuhan')}
						>Szu-Han</button
					>
				</h1>

				<h2
					class="hero-element animate-ready mb-6 text-2xl font-semibold text-blue-300 md:text-3xl"
				>
					AI-Powered Software Engineering
				</h2>

				<p
					class="hero-element animate-ready m-4 mt-2 rounded-lg bg-[#2D3748]/60 p-3 text-lg text-gray-100 shadow-inner"
				>
					I help businesses turn complex ideas into high-performing, user-friendly digital
					solutions—so you can focus on growth instead of tech headaches.
				</p>

				<!-- Contact buttons -->
				<div class="hero-element animate-ready flex justify-center gap-3">
					<a
						href="https://www.linkedin.com/in/szuhan-eng"
						target="_blank"
						rel="noopener noreferrer"
						class="group flex items-center justify-center rounded-lg bg-[#0077b5] p-3 text-white shadow-lg transition-all hover:bg-[#006699]"
						aria-label="LinkedIn Profile"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-7 w-7 transform transition-transform group-hover:scale-110"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
							/>
						</svg>
					</a>
					<button
						class="copy-email-btn group relative flex items-center justify-center rounded-lg bg-pink-400 p-3 text-white shadow-lg transition-all hover:bg-pink-400"
						aria-label="Copy Email Address"
					>
						<span
							class="copy-tooltip absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity"
							>Copy email address</span
						>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-7 w-7 transform transition-transform group-hover:-translate-y-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</button>
				</div>
			</div>

			<!-- Skills section -->
			<div class="my-8 mb-12 overflow-hidden">
				<div class="flex flex-wrap justify-center gap-3">
					{#each skills as skill}
						<span
							class="skill-tag animate-ready rounded-full border border-gray-700 bg-[#2D3748] px-3 py-1 text-sm text-blue-300 transition-colors hover:border-blue-500"
							>{skill}</span
						>
					{/each}
				</div>
			</div>

			<!-- Navigation buttons -->
			<div class="mt-8 flex justify-center gap-4">
				<a
					href="/portfolio"
					class="hero-button animate-ready rounded-lg bg-blue-700 px-6 py-3 text-white shadow-lg transition-colors hover:bg-blue-600"
				>
					Projects
				</a>
				<a
					href="/services"
					class="hero-button animate-ready rounded-lg border border-blue-500 px-6 py-3 text-blue-400 shadow-lg transition-colors hover:bg-[#2D3748]"
				>
					Services
				</a>
			</div>
		</div>
	</div>
</section> 