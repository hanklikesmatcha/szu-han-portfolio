<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, stagger, spring } from 'motion';
	import CTA from '$lib/components/CTA.svelte';
	import { projects } from '$lib/data/projects';

	// Project data including both personal and professional projects
	// Projects are now imported from $lib/data/projects

	let filter = 'all';
	let categoryFilter = 'all'; // New filter for project type (personal/professional/all)
	let projectsGrid: HTMLElement;
	let filtersContainer: HTMLElement;
	let heroSection: HTMLElement;
	let animationsApplied = false;
	let scrollAnimationsApplied: Record<string, boolean> = {}; // Track which cards have been animated

	// Replace the dynamic filters with a static array of outcome-focused filters
	const filters = [
		'all',
		'Web Development',
		'Mobile Development',
		'Data Analytics',
		'AI & Machine Learning',
		'Cloud Solutions',
		'API Development',
		'Automation',
		'Full-Stack'
	];

	// Updated filtering logic to handle broader categories
	$: filteredProjects = projects
		.filter((p) => categoryFilter === 'all' || p.type === categoryFilter)
		.filter((p) => {
			if (filter === 'all') return true;

			// Map technologies to outcome categories
			const techToOutcome = {
				// Web Development
				'Next.js': 'Web Development',
				React: 'Web Development',
				'Tailwind CSS': 'Web Development',
				TypeScript: 'Web Development',
				'TypeScript/React': 'Web Development',
				Animation: 'Web Development',

				// Data Analytics
				'Data Analytics': 'Data Analytics',
				'Data Analysis': 'Data Analytics',
				'Data Visualization': 'Data Analytics',
				'Data Science': 'Data Analytics',
				Sustainability: 'Data Analytics',

				// AI & Machine Learning
				ML: 'AI & Machine Learning',
				'Machine Learning': 'AI & Machine Learning',
				'Computer Vision': 'AI & Machine Learning',
				OCR: 'AI & Machine Learning',
				OpenAI: 'AI & Machine Learning',
				AI: 'AI & Machine Learning',

				// Cloud Solutions
				AWS: 'Cloud Solutions',
				'Cloud Computing': 'Cloud Solutions',
				Microservices: 'Cloud Solutions',
				Docker: 'Cloud Solutions',
				Supabase: 'Cloud Solutions',
				Firebase: 'Cloud Solutions',

				// API Development
				'API Development': 'API Development',
				'API Design': 'API Development',
				GraphQL: 'API Development',
				'Shopify API': 'API Development',

				// Automation
				Automation: 'Automation',
				'IoT Integration': 'Automation',
				'E-commerce': 'Automation',

				// Full-Stack
				'Full-Stack': 'Full-Stack',
				'Full-Stack Development': 'Full-Stack',
				'Node.js': 'Full-Stack',
				Django: 'Full-Stack',
				'Python/FastAPI': 'Full-Stack',
				Python: 'Full-Stack',
				JavaScript: 'Full-Stack',
				Database: 'Full-Stack',
				Postgres: 'Full-Stack',
				Flutter: 'Mobile Development',
				'Mobile Development': 'Mobile Development'
			};

			// Check if any of the project's technologies map to the selected outcome category
			return p.technologies.some(
				(tech) => techToOutcome[tech as keyof typeof techToOutcome] === filter
			);
		});

	// Array of category options
	const categories = [
		{ id: 'all', label: 'All Projects' },
		{ id: 'personal', label: 'Personal Projects' },
		{ id: 'professional', label: 'Professional Work' }
	];

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

			// Reset scroll animations for the new filtered cards
			resetScrollAnimations();

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
						easing: (x) => {
							try {
								// Safely call spring with fallback
								return spring({ stiffness: 100, damping: 12 })(x) || x;
							} catch (error) {
								console.error('Spring animation error:', error);
								// Fallback to a simple cubic bezier easing
								return 0.34 * (1 - Math.cos(Math.PI * x));
							}
						}
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

	// Function to handle category filter changes
	function changeCategory(newCategory: string) {
		if (categoryFilter === newCategory) return;

		// Similar animation to technology filter changes
		animate(
			'.project-card',
			{
				opacity: [1, 0.85],
				scale: [1, 0.9],
				y: [0, 20],
				rotateY: [0, -10]
			},
			{
				duration: 0.3,
				easing: 'ease-in'
			}
		).finished.then(() => {
			// Update category filter
			categoryFilter = newCategory;

			// Reset scroll animations for the new filtered cards
			resetScrollAnimations();

			// After DOM updates, animate cards back in
			setTimeout(() => {
				animate(
					'.project-card',
					{
						opacity: [0.85, 1],
						scale: [0.9, 1],
						y: [20, 0],
						rotateY: [10, 0]
					},
					{
						delay: stagger(0.1),
						duration: 0.4,
						easing: (x) => {
							try {
								return spring({ stiffness: 100, damping: 12 })(x) || x;
							} catch (error) {
								console.error('Spring animation error:', error);
								return 0.34 * (1 - Math.cos(Math.PI * x));
							}
						}
					}
				);

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

		// Setup animation code but without the CTA section observer
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

							// Project cards animation is now handled by individual card observers
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

		// Set up scroll animations for each project card
		setupScrollAnimations();

		// Add hover effect to project cards
		document.querySelectorAll('.project-card').forEach((card) => {
			// Check if device is mobile before adding hover listeners
			const isMobile = window.innerWidth < 768;
			if (!isMobile) {
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
			}
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

	// Function to set up scroll animations for project cards
	function setupScrollAnimations() {
		// Create a separate observer for each project card
		const cardObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					// Get the card ID to track which cards have been animated
					const card = entry.target as HTMLElement;
					const cardId = card.dataset.projectId;

					// Only animate if the card is coming into view and hasn't been animated yet
					if (entry.isIntersecting && cardId && !scrollAnimationsApplied[cardId]) {
						// Mark this card as animated
						scrollAnimationsApplied[cardId] = true;

						// Get device type for more tailored animations
						const isMobile = window.innerWidth < 768;

						try {
							// Different animation based on device type
							if (isMobile) {
								// Mobile animation - slide and fade in with slight rotation
								animate(
									card,
									{
										opacity: [0, 1],
										y: [100, 0],
										rotateX: [5, 0],
										scale: [0.9, 1]
									},
									{
										duration: 0.7,
										easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
									}
								);

								// Animate project image separately with a slight delay
								const projectImage = card.querySelector('.project-image');
								if (projectImage) {
									animate(
										projectImage,
										{
											opacity: [0.6, 1],
											scale: [0.9, 1]
										},
										{
											delay: 0.2,
											duration: 0.5,
											easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
										}
									);
								}

								// Animate tech tags with staggered delay
								const techTags = card.querySelectorAll('.rounded-md');
								if (techTags.length) {
									animate(
										techTags,
										{
											opacity: [0, 1],
											x: ['-20px', '0px']
										},
										{
											delay: stagger(0.1, { start: 0.3 }),
											duration: 0.4,
											easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
										}
									);
								}
							} else {
								// Desktop animation - more subtle with 3D effects
								animate(
									card,
									{
										opacity: [0, 1],
										y: [60, 0],
										scale: [0.95, 1]
									},
									{
										duration: 0.9,
										easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
									}
								);
							}

							// Add a subtle "bounce" effect after the main animation
							setTimeout(() => {
								animate(
									card,
									{
										y: [0, -10, 0]
									},
									{
										duration: 0.6,
										easing: (x) => {
											try {
												return spring({ stiffness: 100, damping: 15 })(x) || x;
											} catch (error) {
												return x;
											}
										}
									}
								);
							}, 800);
						} catch (error) {
							console.error('Card scroll animation error:', error);
						}
					}
				});
			},
			{
				// Lower threshold and larger rootMargin for mobile to start animations earlier
				threshold: 0.15,
				rootMargin: '0px 0px -100px 0px'
			}
		);

		// Observe all project cards
		document.querySelectorAll('.project-card').forEach((card) => {
			cardObserver.observe(card);
		});

		// Reset animations when filters change
		window.addEventListener('resize', () => {
			// Reset scroll animations on resize for responsive behavior
			scrollAnimationsApplied = {};
			
			// Re-observe all cards after a short delay to allow DOM updates
			setTimeout(() => {
				document.querySelectorAll('.project-card').forEach((card) => {
					cardObserver.observe(card);
				});
			}, 300);
		});
	}

	// Function to reset scroll animations when filters change
	function resetScrollAnimations() {
		scrollAnimationsApplied = {};
		// Allow animations to be re-applied on next scroll
		setTimeout(setupScrollAnimations, 50);
	}
</script>

<svelte:head>
<title>Portfolio | Hank Chou</title>
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
</section>

<div class="perspective mx-auto max-w-6xl bg-[#1A202C] px-4 py-12">
	<div bind:this={filtersContainer} class="mb-8">
		<!-- Category filter buttons -->
		<h2 class="mb-4 text-xl font-semibold text-blue-300">Project Type:</h2>
		<div class="mb-6 flex flex-wrap gap-2">
			{#each categories as category}
				<button
					class="filter-btn relative flex items-center border px-4 py-1.5 text-sm transition-all {categoryFilter ===
					category.id
						? 'border-purple-400 bg-purple-900/40 text-white shadow-inner shadow-purple-500/30'
						: 'border-gray-700 bg-[#2D3748]/70 text-gray-300 hover:border-purple-400/50 hover:bg-[#2D3748]'}"
					on:click={() => changeCategory(category.id)}
				>
					{#if categoryFilter === category.id}
						<span class="mr-2 flex items-center text-purple-300">
							<svg
								class="h-3 w-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
								></path>
							</svg>
						</span>
					{/if}
					{category.label}
					{#if categoryFilter === category.id}
						<span
							class="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-purple-500 to-blue-500"
						></span>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Technologies filter (existing) -->
		<h2 class="mb-4 text-xl font-semibold text-blue-300">Technology:</h2>
		<div class="flex flex-wrap gap-2">
			{#each filters as filterOption}
				<button
					class="filter-btn relative flex items-center border px-4 py-1.5 text-sm transition-all {filter ===
					filterOption
						? 'border-blue-400 bg-blue-900/40 text-white shadow-inner shadow-blue-500/30'
						: 'border-gray-700 bg-[#2D3748]/70 text-gray-300 hover:border-blue-400/50 hover:bg-[#2D3748]'}"
					on:click={() => changeFilter(filterOption)}
				>
					{#if filter === filterOption}
						<span class="mr-2 flex items-center text-blue-300">
							<svg
								class="h-3 w-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
								></path>
							</svg>
						</span>
					{/if}
					{filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
					{#if filter === filterOption}
						<span
							class="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-blue-500 to-purple-500"
						></span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<div bind:this={projectsGrid} class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each filteredProjects as project}
			<div
				class="project-card relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-600 {project.type ===
				'professional'
					? 'border-purple-600/50'
					: ''}"
				data-project-id={project.id}
			>
				<div class="project-image relative h-48 overflow-hidden">
					{#if project.image}
						<img
							src={project.image}
							alt={project.title}
							class="h-full w-full object-cover object-center"
							style="object-position: center;"
						/>
					{:else}
						<div class="flex h-full w-full items-center justify-center">
							<span class="text-gray-400">No image</span>
						</div>
					{/if}

					<!-- Badge for professional projects -->
					{#if project.type === 'professional' && !(project as any).hideProfessionalBadge}
						<div
							class="absolute top-2 right-2 rounded-lg bg-purple-700 px-2 py-1 text-xs font-semibold text-white shadow-lg"
						>
							Professional Work
						</div>
					{/if}
				</div>

				<div class="flex flex-grow flex-col p-6">
					<div class="flex-grow">
						<h3 class="mb-2 text-xl font-bold text-blue-300">{project.title}</h3>

						<!-- Show company name for professional projects without role titles -->
						{#if project.type === 'professional' && project.companyName}
							<div class="mb-2 text-sm text-purple-300">
								<span class="font-semibold">{project.companyName}</span>
							</div>
						{/if}

						<!-- Show complete description instead of truncated version -->
						<p class="mb-4 text-gray-300">{project.description}</p>

						<!-- For professional projects, show accomplishments as bullet points -->
						{#if project.type === 'professional' && project.accomplishments && project.accomplishments.length > 0}
							<div class="mb-4">
								<h4 class="mb-2 text-sm font-semibold text-blue-400">Key Contributions:</h4>
								<ul class="list-disc space-y-1 pl-5 text-sm text-gray-300">
									{#each project.accomplishments as accomplishment}
										<li>{accomplishment}</li>
									{/each}
								</ul>
							</div>
						{/if}

						<div class="mb-4 flex flex-wrap gap-2">
							{#each project.technologies.slice(0, 4) as tech}
								<span class="rounded-md bg-[#2D3748] px-2 py-1 text-xs text-blue-300">{tech}</span>
							{/each}
						</div>
					</div>

					<div class="mt-auto flex gap-3">
					{#if project.id === 'fanlytics' && project.detailsUrl}
						<a
							href={project.detailsUrl}
							class="project-link flex-1 rounded bg-gradient-to-r from-pink-600 to-amber-500 px-4 py-2 text-center text-sm text-white hover:from-pink-500 hover:to-amber-400"
						>
							Learn More
						</a>
					{:else if project.detailsUrl}
						<a
							href={project.detailsUrl}
							class="project-link flex-1 rounded bg-indigo-600 px-4 py-2 text-center text-sm text-white hover:bg-indigo-500"
						>
							Learn More
						</a>
					{/if}
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
						{#if project.purchaseUrl}
							<a
								href={project.purchaseUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="project-link flex-1 rounded bg-green-700 px-4 py-2 text-center text-sm text-white hover:bg-green-600"
							>
								Purchase
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
						{#if project.appStoreUrl}
							<a
								href={project.appStoreUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="project-link flex-1 rounded bg-[#0D96F6] px-4 py-2 text-center text-sm text-white hover:bg-blue-600"
							>
								App Store
							</a>
						{/if}
						{#if project.type === 'professional' && !project.githubUrl && !project.liveUrl && project.companyUrl}
							<a
								href={project.companyUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="project-link flex-1 rounded bg-purple-700 px-4 py-2 text-center text-sm text-white hover:bg-purple-600"
							>
								Visit Company
							</a>
						{/if}
					{#if project.type === 'professional' && !project.githubUrl && !project.liveUrl && !project.companyUrl && !(project as any).hideProfessionalBadge}
							<div class="flex-1 rounded bg-gray-700 px-4 py-2 text-center text-sm text-gray-300">
								Professional Work
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- CTA Section -->
<CTA heading="Interested in working together?" buttonText="View My Services" buttonLink="/services" />

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
		opacity: 0; /* Start invisible for scroll animations */
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

	/* Updated filter button styling */
	.filter-btn {
		opacity: 1; /* Start visible by default */
		transform-style: preserve-3d; /* Enable 3D transformations */
		backface-visibility: hidden; /* Prevent flickering */
		will-change: transform, opacity, filter;
		border-radius: 4px; /* Sharper corners, distinct from rounded-lg navigation buttons */
		position: relative;
		overflow: hidden; /* For the gradient line effect */
	}

	/* Hover effects with enhanced 3D */
	.filter-btn {
		transition:
			background-color 0.3s ease,
			transform 0.3s ease,
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.filter-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 3px 10px -2px rgba(66, 153, 225, 0.25);
	}

	.filter-btn:active {
		transform: translateY(1px);
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

	/* Mobile-specific styles */
	@media (max-width: 767px) {
		.project-card {
			transform-origin: center bottom; /* For better mobile animations */
			will-change: transform, opacity, scale; /* Optimize for mobile animations */
		}
		
		/* Add perspective to mobile cards for more pronounced 3D effect */
		.perspective {
			perspective: 800px; /* Less intense perspective for mobile */
		}

		/* Disable hover animations on mobile */
		.project-card:hover,
		.project-card:active,
		.project-card:focus {
			transform: none !important;
			box-shadow: none !important;
		}

		.project-image img:hover {
			transform: none !important;
		}

		.project-link:hover {
			transform: none !important;
		}

		/* Disable border animations on mobile */
		.project-card::before,
		.project-card::after {
			display: none;
		}

		.filter-btn:hover {
			transform: none !important;
			box-shadow: none !important;
		}
	}
</style>
