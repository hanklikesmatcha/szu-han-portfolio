<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, stagger, spring } from 'motion';

	// Project data based on user's actual projects
	const projects = [
		{
			id: 'running4life',
			title: 'Running4Life - Fitness Platform',
			description:
				'A fitness-focused web platform designed to help users track and improve their running performance. This project demonstrates my ability to create clean, user-friendly interfaces for health and wellness applications.',
			technologies: ['Next.js', 'Database', 'Tailwind CSS', 'Animation'],
			githubUrl: 'https://github.com/hanklikesmatcha/running4life',
			liveUrl: 'https://running4.life',
			image: '/images/running4life.jpg',
			featured: true
		},
		{
			id: 'cnc-cost-analysis',
			title: 'CNC Cost Analysis Tool',
			description:
				'A specialized web application for analyzing costs associated with CNC machining operations. This tool helps manufacturers calculate and optimize production costs, demonstrating my ability to develop industry-specific technical solutions.',
			technologies: ['Python/FastAPI', 'TypeScript/React', 'Data Analysis', 'Docker', 'ML'],
			githubUrl: 'https://github.com/hanklikesmatcha/cnc-cost-analysis',
			liveUrl: 'https://cnc-cost-analysis-production.up.railway.app/',
			image: '/images/cnc-cost-analysis.jpg'
		},
		{
			id: 'personal-website',
			title: 'Portfolio Website',
			description: 'This is my portfolio website, where I showcase my projects and work.',
			technologies: ['TypeScript/SvelteKit', 'Tailwind CSS', 'Animation'],
			githubUrl: 'https://github.com/hanklikesmatcha/szu-han-portfolio',
			liveUrl: 'https://hankchou.me',
			image: '/images/portfolio-website.jpg'
		}
	];

	let filter = 'all';
	let projectsGrid: HTMLElement;
	let filtersContainer: HTMLElement;
	let heroSection: HTMLElement;
	let animationsApplied = false;

	$: filteredProjects =
		filter === 'all' ? projects : projects.filter((p) => p.technologies.includes(filter));

	const filters = ['all', ...new Set(projects.flatMap((p) => p.technologies))];

	// Function to handle filter changes with animation
	function changeFilter(newFilter: string) {
		if (filter === newFilter) return;

		// Animate cards out with dramatic 3D effect but maintain better visibility
		animate(
			'.project-card',
			{
				opacity: [1, 0.85], // Higher minimum opacity to prevent darkening
				scale: [1, 0.9],
				y: [0, 20],
				rotateY: [0, -10] // Less extreme rotation to reduce distortion
			},
			{
				duration: 0.3,
				easing: 'ease-in'
			}
		).finished.then(() => {
			// Update filter
			filter = newFilter;

			// After DOM updates, animate cards back in with dramatic 3D effect
			setTimeout(() => {
				animate(
					'.project-card',
					{
						opacity: [0.85, 1], // Ensure we return to full opacity
						scale: [0.9, 1],
						y: [20, 0],
						rotateY: [10, 0] // Less extreme rotation from the other direction
					},
					{
						delay: stagger(0.1),
						duration: 0.4,
						easing: spring({ stiffness: 100, damping: 12 })
					}
				);

				// Ensure text content is fully visible
				animate(
					'.project-card h3, .project-card p, .project-card span, .project-card a',
					{ opacity: 1 },
					{ duration: 0.1 }
				);
			}, 50);
		});
	}

	// Function to ensure hero elements are visible
	function ensureHeroElementsVisible() {
		// Force hero elements to be visible as a fallback
		document.querySelectorAll('.hero-element').forEach((el) => {
			(el as HTMLElement).style.opacity = '1';
			(el as HTMLElement).style.transform = 'translateY(0) scale(1)';
		});
	}

	onMount(() => {
		// Ensure hero elements are visible immediately to prevent flashing
		ensureHeroElementsVisible();

		// Hero section animation - more dramatic entrance with staggered reveal
		try {
			animate(
				'.hero-element',
				{
					opacity: [0, 1],
					y: [50, 0],
					scale: [0.9, 1]
				},
				{
					delay: stagger(0.2),
					duration: 1.0,
					easing: 'cubic-bezier(0.16, 1, 0.3, 1)' // Different easing than landing page
				}
			).finished.catch(() => {
				// Ensure visibility if animation fails
				ensureHeroElementsVisible();
			});
		} catch (error) {
			console.error('Hero animation error:', error);
			// Ensure visibility if animation fails to start
			ensureHeroElementsVisible();
		}

		// About section entrance animation when scrolled to
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !animationsApplied) {
						animationsApplied = true;

						try {
							// Diagonal reveal animation for filter buttons
							animate(
								'.filter-btn',
								{
									opacity: [0, 1],
									y: [20, 0],
									x: ['-20px', '0px']
								},
								{
									delay: stagger(0.1),
									duration: 0.7,
									easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
								}
							);

							// Project cards animation
							animate(
								'.project-card',
								{
									opacity: [0, 1],
									y: [60, 0],
									scale: [0.95, 1]
								},
								{
									delay: stagger(0.15, { from: 'center' }),
									duration: 0.9,
									easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
								}
							);
						} catch (error) {
							console.error('Projects section animation error:', error);
						}
					}
				});
			},
			{ threshold: 0.15, rootMargin: '-50px 0px -100px 0px' }
		);

		if (filtersContainer) {
			observer.observe(filtersContainer);
		}

		// Add hover effect to project cards
		document.querySelectorAll('.project-card').forEach((card) => {
			card.addEventListener('mouseenter', () => {
				try {
					animate(
						card,
						{
							y: -20,
							scale: 1.05,
							boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
						},
						{
							duration: 0.4,
							easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Custom bounce
						}
					);

					// Enhance image zoom effect
					const img = card.querySelector('.project-image img');
					if (img) {
						animate(
							img,
							{
								scale: 1.15
								// No filter effects to avoid blurriness
							},
							{
								duration: 0.8,
								easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
							}
						);
					}

					// Animate tech tags
					const techTags = card.querySelectorAll('.bg-\\[\\#2D3748\\]');
					if (techTags.length) {
						animate(
							techTags,
							{
								y: -5,
								scale: 1.1,
								backgroundColor: '#2a4365' // Deeper blue
							},
							{
								delay: stagger(0.1),
								duration: 0.3
							}
						);
					}
				} catch (error) {
					console.error('Hover animation error:', error);
				}
			});

			card.addEventListener('mouseleave', () => {
				try {
					animate(
						card,
						{
							y: 0,
							scale: 1,
							boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
						},
						{
							duration: 0.5,
							easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
						}
					);

					// Reset image animation
					const img = card.querySelector('.project-image img');
					if (img) {
						animate(
							img,
							{
								scale: 1
								// No filter effects to avoid blurriness
							},
							{
								duration: 0.5,
								easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
							}
						);
					}

					// Reset tech tags
					const techTags = card.querySelectorAll('.bg-\\[\\#2D3748\\]');
					if (techTags.length) {
						animate(
							techTags,
							{
								y: 0,
								scale: 1,
								backgroundColor: '#2D3748' // Original color
							},
							{
								delay: stagger(0.05),
								duration: 0.3
							}
						);
					}

					// Stop colorful border animation
					card.classList.remove('border-animate');
				} catch (error) {
					console.error('Hover animation reset error:', error);
				}
			});

			// Add animated border effect
			card.addEventListener('mouseenter', (e) => {
				card.classList.add('border-animate');
			});
		});

		// Set up idle animation for card borders to subtly pulse
		document.querySelectorAll('.project-card').forEach((card, index) => {
			// Stagger the animations to create a wave effect
			setTimeout(() => {
				animate(
					card,
					{
						borderColor: [
							'rgba(74, 85, 104, 0.8)', // Start with current border
							'rgba(66, 153, 225, 0.6)', // Blue
							'rgba(236, 72, 153, 0.6)', // Pink
							'rgba(74, 85, 104, 0.8)' // Back to original
						]
					},
					{
						duration: 8,
						repeat: Infinity,
						delay: index * 0.8, // Stagger the animations
						easing: 'ease-in-out'
					}
				);
			}, 1500); // Start after initial animations
		});

		// Clean up by making sure elements remain visible when component is destroyed
		return () => {
			ensureHeroElementsVisible();
		};
	});
</script>

<svelte:head>
	<title>Portfolio | Hank aka Szu-Han Chou </title>
	<meta name="description" content="Showcase of my development projects and work" />
</svelte:head>

<!-- Hero Section (Banner) -->
<section class="bg-gradient-to-br from-gray-900 to-blue-900 py-16" bind:this={heroSection}>
	<div class="container mx-auto px-4 text-center">
		<h1 class="hero-element mb-6 text-4xl font-bold text-blue-400 md:text-5xl">Projects</h1>
		<p class="hero-element mx-auto mb-6 max-w-3xl text-xl text-gray-300">
			Crafting digital experiences with passion and precision. Each project represents my commitment
			to building elegant, functional solutions that deliver real value.
		</p>
		<div class="hero-element flex justify-center gap-3">
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
			<a
				href="mailto:szuhan.eng@gmail.com"
				class="group flex items-center justify-center rounded-lg bg-purple-700 p-3 text-white shadow-lg transition-all hover:bg-purple-600"
				aria-label="Email Me"
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
			</a>
		</div>
	</div>
</section>

<div class="perspective mx-auto max-w-6xl bg-[#1A202C] px-4 py-12">
	<div bind:this={filtersContainer} class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-blue-300">Filter:</h2>
		<div class="flex flex-wrap gap-2">
			{#each filters as filterOption}
				<button
					class="filter-btn rounded-full px-4 py-2 text-sm {filter === filterOption
						? 'bg-blue-800 text-white'
						: 'border border-gray-700 bg-[#2D3748] text-gray-300 hover:bg-gray-700'}"
					on:click={() => changeFilter(filterOption)}
				>
					{filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
				</button>
			{/each}
		</div>
	</div>

	<div bind:this={projectsGrid} class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each filteredProjects as project}
			<div
				class="project-card relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-600"
			>
				<div class="project-image relative h-48 overflow-hidden">
					{#if project.image}
						<img src={project.image} alt={project.title} class="h-full w-full object-cover object-top" />
					{:else}
						<div class="flex h-full w-full items-center justify-center">
							<span class="text-gray-400">No image</span>
						</div>
					{/if}
				</div>

				<div class="flex flex-grow flex-col p-6">
					<div class="flex-grow">
						<h3 class="mb-2 text-xl font-bold text-blue-300">{project.title}</h3>
						<p class="mb-4 text-gray-300">{project.description.substring(0, 120)}...</p>

						<div class="mb-4 flex flex-wrap gap-2">
							{#each project.technologies.slice(0, 3) as tech}
								<span class="rounded-md bg-[#2D3748] px-2 py-1 text-xs text-blue-300">{tech}</span>
							{/each}
						</div>
					</div>

					<div class="mt-auto flex gap-3">
						{#if project.githubUrl}
							<a
								href={project.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="project-link flex-1 rounded bg-[#2D3748] px-4 py-2 text-center text-sm text-white hover:bg-gray-600"
							>
								GitHub
							</a>
						{/if}
						{#if project.liveUrl}
							<a
								href={project.liveUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="project-link flex-1 rounded bg-blue-700 px-4 py-2 text-center text-sm text-white hover:bg-blue-600"
							>
								Live Demo
							</a>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	/* 3D Animation styles */
	.perspective {
		perspective: 1200px; /* More pronounced perspective */
	}

	/* Hero elements styling */
	.hero-element {
		opacity: 0; /* Start invisible for animation */
		transform-style: preserve-3d; /* Enable 3D transformations */
		backface-visibility: hidden; /* Prevent flickering during 3D animations */
		will-change: transform, opacity;
		animation: ensure-visible 0.1s forwards 1s; /* Fallback animation to ensure visibility */
	}

	/* Fallback animation to ensure hero elements are always visible */
	@keyframes ensure-visible {
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	/* Ensure hero elements are visible if JS fails */
	@media (prefers-reduced-motion: reduce) {
		.hero-element {
			opacity: 1 !important;
			transform: none !important;
		}
	}

	.project-card {
		background-color: #1e2433;
		border-color: #4a5568;
		border-width: 4px; /* Increased from 2px to 4px for thicker borders */
		opacity: 1; /* Start visible by default */
		transform-style: preserve-3d; /* Enable 3D transformations */
		backface-visibility: hidden; /* Prevent flickering */
		will-change: transform, opacity, borderColor; /* Added borderColor */
		transition:
			transform 0.5s ease,
			box-shadow 0.5s ease;
		position: relative;
		overflow: hidden; /* Ensure the animated elements stay within bounds */
	}

	/* Animated border effect */
	.project-card::before {
		content: '';
		position: absolute;
		top: -4px;
		left: -4px;
		right: -4px;
		bottom: -4px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			#ff5f6d 10%,
			#ffc371 20%,
			#3a7bd5 30%,
			#00d2ff 40%,
			#6a82fb 50%,
			#fc5c7d 60%,
			transparent 70%
		);
		background-size: 300% 300%;
		border-radius: 12px; /* Slightly larger than the card */
		z-index: -1;
		opacity: 0;
		transition: opacity 0.3s ease;
		box-shadow: 0 0 15px rgba(66, 153, 225, 0.5); /* Add glow effect */
	}

	/* LED running lights effect */
	.project-card::after {
		content: '';
		position: absolute;
		inset: -4px; /* Use inset as shorthand for all sides */
		background: transparent;
		border-radius: 12px;
		z-index: -1;
		opacity: 0;
		transition: opacity 0.3s ease;
		background: conic-gradient(
			from 0deg at 50% 50%,
			#ff5f6d,
			#ffc371,
			#3a7bd5,
			#00d2ff,
			#6a82fb,
			#fc5c7d,
			#ff5f6d
		);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask-composite: exclude;
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: source-out;
		padding: 4px;
		border: 0 solid transparent;
	}

	@keyframes led-flow {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 300% 50%;
		}
	}

	@keyframes rotate-led {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	/* Ensure inner content maintains visibility during transitions */
	.project-card h3,
	.project-card p,
	.project-card span,
	.project-card a {
		opacity: 1 !important; /* Force full opacity for text content */
	}

	.project-image {
		background-color: #2d3748;
		overflow: hidden;
	}

	.filter-btn {
		opacity: 1; /* Start visible by default */
		transform-style: preserve-3d; /* Enable 3D transformations */
		backface-visibility: hidden; /* Prevent flickering */
		will-change: transform, opacity, filter;
	}

	/* Hover effects with enhanced 3D */
	.filter-btn {
		transition:
			background-color 0.3s ease,
			transform 0.3s ease;
	}

	.filter-btn:hover {
		transform: translateY(-3px) scale(1.05);
	}

	.project-image img {
		transition: transform 0.8s ease;
	}

	.project-link {
		transition: all 0.3s ease;
		transform-style: preserve-3d;
	}

	.project-link:hover {
		transform: translateY(-3px) scale(1.05);
	}

	/* Ensure content is visible if JS fails */
	@media (prefers-reduced-motion: reduce) {
		.project-card,
		.filter-btn {
			opacity: 1 !important;
			transform: none !important;
			filter: none !important;
		}
	}
</style>
