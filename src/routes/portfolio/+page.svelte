<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, stagger, spring } from 'motion';
	
	// Project data based on user's actual projects
	const projects = [
		{
			id: 'running4life',
			title: 'Running4Life - Fitness Platform',
			description: 'A fitness-focused web platform designed to help users track and improve their running performance. This project demonstrates my ability to create clean, user-friendly interfaces for health and wellness applications.',
			technologies: ['Next.js', 'MongoDB', 'Responsive Design'],
			githubUrl: 'https://github.com/hanklikesmatcha/running4life',
			liveUrl: 'https://running4.life',
			image: '/images/running4life.jpg',
			featured: true
		},
		{
			id: 'cnc-cost-analysis',
			title: 'CNC Cost Analysis Tool',
			description: 'A specialized web application for analyzing costs associated with CNC machining operations. This tool helps manufacturers calculate and optimize production costs, demonstrating my ability to develop industry-specific technical solutions.',
			technologies: ['Python/FastAPI', 'TypeScript/React', 'Data Analysis', 'Docker'],
			githubUrl: 'https://github.com/hanklikesmatcha/cnc-cost-analysis',
			liveUrl: 'https://cnc-cost-analysis-production.up.railway.app/',
			image: '/images/cnc-cost-analysis.jpg',
		},
		{
			id: 'personal-website',
			title: 'Portfolio Website',
			description: 'This is my portfolio website, where I showcase my projects and work.',
			technologies: ['TypeScript/SvelteKit', 'Tailwind CSS', 'Vite', "Motion"],
			githubUrl: 'https://github.com/hanklikesmatcha/szu-han-portfolio',
			liveUrl: 'https://hankchou.me',
			image: '/images/portfolio-website.jpg',
		}
	];

	let filter = 'all';
	let projectsGrid: HTMLElement;
	let filtersContainer: HTMLElement;
	let headingElement: HTMLElement;
	let animationsApplied = false;
	
	$: filteredProjects = filter === 'all' 
			? projects
			: projects.filter(p => p.technologies.includes(filter));
			
	const filters = ['all', ...new Set(projects.flatMap(p => p.technologies))];
	
	// Function to handle filter changes with animation
	function changeFilter(newFilter: string) {
		if (filter === newFilter) return;
		
		// Animate cards out with dramatic 3D effect but maintain better visibility
		animate('.project-card', 
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
				animate('.project-card', 
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
				animate('.project-card h3, .project-card p, .project-card span, .project-card a', 
					{ opacity: 1 },
					{ duration: 0.1 }
				);
			}, 50);
		});
	}
	
	onMount(() => {
		// Dramatic header entrance - slide in from top with shadow
		try {
			animate(headingElement, 
				{ 
					opacity: [0, 1],
					y: [-50, 0],
					filter: ['blur(8px)', 'blur(0px)']
				}, 
				{ 
					duration: 1.2,
					easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
				}
			);
			
			// Add subtle continuous animation after appearing
			setTimeout(() => {
				animate(headingElement, 
					{ 
						y: [0, -5, 0],
						textShadow: [
							'0 0px 0px rgba(59, 130, 246, 0)', 
							'0 5px 15px rgba(59, 130, 246, 0.3)',
							'0 0px 0px rgba(59, 130, 246, 0)'
						]
					},
					{
						duration: 6,
						repeat: Infinity,
						easing: 'ease-in-out'
					}
				);
			}, 1500);
		} catch (error) {
			console.error("Header animation error:", error);
		}
		
		// Animate the filters - revealing in sequence with bounce
		try {
			animate('.filter-btn', 
				{ 
					opacity: [0, 1],
					x: [-20, 0],
					scale: [0.8, 1.05, 1] // Slight overshoot for bounce
				}, 
				{ 
					delay: stagger(0.1),
					duration: 0.7,
					easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Custom bounce
				}
			);
		} catch (error) {
			console.error("Filter animation error:", error);
		}
		
		// Dramatic project cards animation - reveal with 3D effect
		try {
			animate('.project-card', 
				{ 
					opacity: [0, 1],
					y: [100, 0],
					scale: [0.8, 1]
				}, 
				{ 
					delay: stagger(0.2, { from: "center" }), // Fan out from center
					duration: 1.0,
					easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
				}
			);
		} catch (error) {
			console.error("Project card animation error:", error);
		}
		
		// Enhanced hover effects for project cards with 3D transformations
		document.querySelectorAll('.project-card').forEach(card => {
			card.addEventListener('mouseenter', () => {
				try {
					animate(card, 
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
						animate(img, 
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
						animate(techTags, 
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
					console.error("Hover animation error:", error);
				}
			});
			
			card.addEventListener('mouseleave', () => {
				try {
					animate(card, 
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
						animate(img, 
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
						animate(techTags, 
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
				} catch (error) {
					console.error("Hover animation reset error:", error);
				}
			});
		});
	});
</script>

<svelte:head>
	<title>Portfolio | Szu-Han Chou aka Hank</title>
	<meta name="description" content="Showcase of my development projects and work">
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12 bg-[#1A202C] perspective">
	<div bind:this={headingElement} class="header-container">
		<h1 class="text-4xl md:text-5xl font-bold mb-2 text-blue-400">Work</h1>
		<p class="text-xl text-gray-300 mb-8">Recent projects I've built</p>
	</div>
	
	<div bind:this={filtersContainer} class="mb-8">
		<h2 class="text-xl font-semibold mb-4 text-blue-300">Filter:</h2>
		<div class="flex flex-wrap gap-2">
			{#each filters as filterOption}
				<button 
					class="filter-btn px-4 py-2 rounded-full text-sm {filter === filterOption ? 'bg-blue-800 text-white' : 'bg-[#2D3748] text-gray-300 hover:bg-gray-700 border border-gray-700'}"
					on:click={() => changeFilter(filterOption)}
				>
					{filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
				</button>
			{/each}
		</div>
	</div>
	
	<div bind:this={projectsGrid} class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each filteredProjects as project}
			<div class="project-card rounded-xl overflow-hidden border border-gray-600">
				<div class="project-image h-48 relative overflow-hidden">
					{#if project.image}
						<img src={project.image} alt={project.title} class="w-full h-full object-cover"/>
					{:else}
						<div class="w-full h-full flex items-center justify-center">
							<span class="text-gray-400">No image</span>
						</div>
					{/if}
				</div>
				
				<div class="p-6">
					<h3 class="text-xl font-bold mb-2 text-blue-300">{project.title}</h3>
					<p class="text-gray-300 mb-4">{project.description.substring(0, 120)}...</p>
					
					<div class="flex flex-wrap gap-2 mb-4">
						{#each project.technologies.slice(0, 3) as tech}
							<span class="bg-[#2D3748] text-blue-300 px-2 py-1 rounded-md text-xs">{tech}</span>
						{/each}
					</div>
					
					<div class="flex gap-3">
						{#if project.githubUrl}
							<a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
								class="project-link bg-[#2D3748] hover:bg-gray-600 text-white px-4 py-2 rounded text-sm flex-1 text-center">
								GitHub
							</a>
						{/if}
						{#if project.liveUrl}
							<a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
								class="project-link bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm flex-1 text-center">
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
	
	.project-card {
		background-color: #1E2433;
		border-color: #4A5568;
		opacity: 1; /* Start visible by default */
		transform-style: preserve-3d; /* Enable 3D transformations */
		backface-visibility: hidden; /* Prevent flickering */
		will-change: transform, opacity; /* Removed filter from will-change */
		transition: transform 0.5s ease, box-shadow 0.5s ease;
	}
	
	/* Ensure inner content maintains visibility during transitions */
	.project-card h3,
	.project-card p,
	.project-card span,
	.project-card a {
		opacity: 1 !important; /* Force full opacity for text content */
	}
	
	.project-image {
		background-color: #2D3748;
		overflow: hidden;
	}
	
	.header-container,
	.filter-btn {
		opacity: 1; /* Start visible by default */
		transform-style: preserve-3d; /* Enable 3D transformations */
		backface-visibility: hidden; /* Prevent flickering */
		will-change: transform, opacity, filter;
	}
	
	/* Hover effects with enhanced 3D */
	.filter-btn {
		transition: background-color 0.3s ease, transform 0.3s ease;
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
		.header-container,
		.filter-btn {
			opacity: 1 !important;
			transform: none !important;
			filter: none !important;
		}
	}
</style> 