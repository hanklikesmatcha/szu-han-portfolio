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
		
		// Animate cards out
		animate('.project-card', 
			{ 
				opacity: [1, 0],
				scale: [1, 0.95],
				y: [0, 15]
			}, 
			{ 
				duration: 0.25,
				easing: 'ease-in'
			}
		).finished.then(() => {
			// Update filter
			filter = newFilter;
			
			// After DOM updates, animate cards back in
			setTimeout(() => {
				animate('.project-card', 
					{ 
						opacity: [0, 1],
						scale: [0.95, 1],
						y: [15, 0]
					}, 
					{ 
						delay: stagger(0.1),
						duration: 0.4,
						easing: spring({ stiffness: 100, damping: 15 })
					}
				);
			}, 50);
		});
	}
	
	onMount(() => {
		// Entrance animation for the page header
		animate(headingElement, 
			{ 
				opacity: [0, 1],
				y: [30, 0]
			}, 
			{ 
				duration: 0.6,
				easing: spring({ stiffness: 60, damping: 15 })
			}
		);
		
		// Animate the filters entrance
		animate('.filter-btn', 
			{ 
				opacity: [0, 1],
				x: [-20, 0]
			}, 
			{ 
				delay: stagger(0.05),
				duration: 0.5,
				easing: spring({ stiffness: 100, damping: 20 })
			}
		);
		
		// Animate project cards with stagger
		animate('.project-card', 
			{ 
				opacity: [0, 1],
				y: [40, 0],
				scale: [0.9, 1]
			}, 
			{ 
				delay: stagger(0.1),
				duration: 0.6,
				easing: spring({ stiffness: 80, damping: 12 })
			}
		);
		
		// Add hover effects to project cards
		document.querySelectorAll('.project-card').forEach(card => {
			card.addEventListener('mouseenter', () => {
				animate(card, 
					{ 
						y: -8, 
						scale: 1.02,
						boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
					}, 
					{ 
						duration: 0.3,
						easing: spring({ stiffness: 300, damping: 15 })
					}
				);
			});
			
			card.addEventListener('mouseleave', () => {
				animate(card, 
					{ 
						y: 0, 
						scale: 1,
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
					}, 
					{ 
						duration: 0.3,
						easing: spring({ stiffness: 300, damping: 15 })
					}
				);
			});
		});
	});
</script>

<svelte:head>
	<title>Portfolio | Szu-Han Chou aka Hank</title>
	<meta name="description" content="Showcase of my development projects and work">
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12 bg-[#1A202C]">
	<div bind:this={headingElement} class="header-container">
		<h1 class="text-4xl font-bold mb-2 text-blue-400">My Work</h1>
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
	/* Improve visibility for all elements */
	.project-card {
		background-color: #1E2433;
		border-color: #4A5568;
		opacity: 1 !important;
	}
	
	.project-image {
		background-color: #2D3748;
	}
	
	.header-container,
	.filter-btn {
		opacity: 1 !important;
	}
	
	/* Hover effects are preserved */
	.filter-btn {
		transition: background-color 0.3s ease, transform 0.2s ease;
	}
	
	.filter-btn:hover {
		transform: translateY(-2px);
	}
	
	.project-card {
		will-change: transform, opacity;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}
	
	.project-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
	}
	
	.project-image img {
		transition: transform 0.5s ease;
	}
	
	.project-card:hover .project-image img {
		transform: scale(1.1);
	}
	
	.project-link {
		transition: all 0.3s ease;
	}
	
	.project-link:hover {
		transform: translateY(-2px);
	}
</style> 