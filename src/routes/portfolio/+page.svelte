<script>
	// Project data based on user's actual projects
	const projects = [
		{
			id: 'running4life',
			title: 'Running4Life - Fitness Platform',
			description: 'A fitness-focused web platform designed to help users track and improve their running performance. This project demonstrates my ability to create clean, user-friendly interfaces for health and wellness applications.',
			technologies: ['JavaScript', 'Web Development', 'Responsive Design', 'UX/UI', 'Front-end'],
			githubUrl: 'https://github.com/hanklikesmatcha/running4life',
			liveUrl: 'https://running4.life',
			image: '/images/running4life.jpg',
			featured: true
		},
		{
			id: 'cnc-cost-analysis',
			title: 'CNC Cost Analysis Tool',
			description: 'A specialized web application for analyzing costs associated with CNC machining operations. This tool helps manufacturers calculate and optimize production costs, demonstrating my ability to develop industry-specific technical solutions.',
			technologies: ['Python', 'JavaScript', 'Data Analysis', 'Web App', 'Railway Deployment'],
			githubUrl: 'https://github.com/hanklikesmatcha/cnc-cost-analysis',
			liveUrl: 'https://cnc-cost-analysis-production.up.railway.app/',
			image: '/images/cnc-cost-analysis.jpg',
			featured: true
		}
	];

	let filter = 'all';
	
	$: filteredProjects = filter === 'all' 
		? projects 
		: filter === 'featured' 
			? projects.filter(p => p.featured) 
			: projects.filter(p => p.technologies.includes(filter));
			
	const filters = ['all', 'featured', ...new Set(projects.flatMap(p => p.technologies))];
</script>

<svelte:head>
	<title>Portfolio | Szu-Han Chou aka Hank</title>
	<meta name="description" content="Showcase of my development projects and work">
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12 bg-gray-900 text-gray-100">
	<h1 class="text-4xl font-bold mb-2 text-blue-400">My Portfolio</h1>
	<p class="text-xl text-gray-300 mb-8">Showcasing my recent projects and work</p>
	
	<div class="mb-8">
		<h2 class="text-xl font-semibold mb-4 text-blue-300">Filter Projects:</h2>
		<div class="flex flex-wrap gap-2">
			{#each filters as filterOption}
				<button 
					class="px-4 py-2 rounded-full text-sm {filter === filterOption ? 'bg-blue-800 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'}"
					on:click={() => filter = filterOption}
				>
					{filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
				</button>
			{/each}
		</div>
	</div>
	
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each filteredProjects as project}
			<div class="bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] border border-gray-700">
				<div class="h-48 bg-gray-700 relative">
					{#if project.image}
						<img 
							src={project.image} 
							alt={project.title} 
							class="w-full h-full object-cover"
						/>
					{:else}
						<div class="w-full h-full flex items-center justify-center">
							<span class="text-gray-400">No image available</span>
						</div>
					{/if}
					
					{#if project.featured}
						<span class="absolute top-2 right-2 bg-blue-800 text-white text-xs px-2 py-1 rounded-full">
							Featured
						</span>
					{/if}
				</div>
				
				<div class="p-6">
					<h3 class="text-xl font-bold mb-2 text-blue-300">{project.title}</h3>
					<p class="text-gray-300 mb-4">{project.description.substring(0, 120)}...</p>
					
					<div class="flex flex-wrap gap-2 mb-4">
						{#each project.technologies as tech}
							<span class="bg-gray-700 text-blue-300 px-2 py-1 rounded-md text-xs border border-gray-600">{tech}</span>
						{/each}
					</div>
					
					<div class="flex gap-3">
						{#if project.githubUrl}
							<a 
								href={project.githubUrl} 
								target="_blank" 
								rel="noopener noreferrer"
								class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm flex-1 text-center"
							>
								GitHub
							</a>
						{/if}
						{#if project.liveUrl}
							<a 
								href={project.liveUrl} 
								target="_blank" 
								rel="noopener noreferrer"
								class="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex-1 text-center shadow-md"
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
	/* No additional styles needed as global styles handle the theme */
</style> 