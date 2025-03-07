<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, stagger, spring } from 'motion';
	
	// Skills based on LinkedIn profile
	const skills = [
		'Full-Stack Development',
		'Python',
		'TypeScript',
		'Auth',
		'Hugging Face',
		'LangChain',
		'Supabase',
		'Flutter',
		'Database Migration',
		'Technical Mentoring',
		'Project Management'
	];

	let currentSection = 'about';
	let heroSection: HTMLElement;
	let skillsElements: HTMLElement[] = [];
	let aboutSection: HTMLElement;
	let isAnimated = false;
	let animationsReady = false;
	let fireworksContainer: HTMLDivElement;
	
	// Create fireworks explosion for dramatic effect
	function createLandingFireworks() {
		if (!fireworksContainer) return;
		
		// Get the name element position
		const nameElement = document.querySelector('.name-highlight');
		if (!nameElement) return;
		
		// Get position relative to the fireworks container
		const nameRect = nameElement.getBoundingClientRect();
		const containerRect = fireworksContainer.getBoundingClientRect();
		
		// Center coordinates of the name element relative to fireworks container
		const centerX = (nameRect.left + nameRect.width/2) - containerRect.left;
		const centerY = (nameRect.top + nameRect.height/2) - containerRect.top;
		
		// Create multiple firework explosions with choreographed timing
		// First wave
		setTimeout(() => createFireworkBurst(centerX, centerY), 200);
		setTimeout(() => createFireworkBurst(centerX - 100, centerY - 30), 700);  // Increased from 400ms
		setTimeout(() => createFireworkBurst(centerX + 100, centerY - 20), 1200); // Increased from 600ms
		
		// Second wave (higher and wider)
		setTimeout(() => createFireworkBurst(centerX - 200, centerY - 100), 2000); // Increased from 1200ms
		setTimeout(() => createFireworkBurst(centerX + 180, centerY - 120), 2600); // Increased from 1500ms
		
		// Grand finale
		setTimeout(() => createFireworkBurst(centerX, centerY - 150, true), 3400); // Increased from 2000ms
	}
	
	// Helper function to create a single burst of fireworks
	function createFireworkBurst(x: number, y: number, isSuper = false) {
		// Create particles for the explosion
		const particleCount = isSuper ? 120 : 80; // Reduced from 200/150 for better performance
		const particles: HTMLDivElement[] = [];
		// More vibrant color palette with additional colors
		const colors = [
			'#60a5fa', '#93c5fd', '#3b82f6', // Blues
			'#8b5cf6', '#a78bfa', '#c4b5fd', // Purples
			'#ec4899', '#f472b6', '#f9a8d4', // Pinks
			'#f59e0b', '#fbbf24', '#fcd34d', // Ambers/Yellows
			'#10b981', '#34d399', '#6ee7b7', // Emeralds
			'#ef4444', '#f87171', '#fca5a5'  // Reds
		];
		
		// Create multiple "launch" particles that shoot up before explosion
		const launchCount = isSuper ? 5 : Math.random() > 0.5 ? 2 : 1;
		for (let i = 0; i < launchCount; i++) {
			const launchTrail = document.createElement('div');
			launchTrail.className = 'firework-launch-trail';
			if (fireworksContainer) {
				fireworksContainer.appendChild(launchTrail);
				
				// Random start position at bottom of container
				const startX = x + (Math.random() * 150 - 75);
				const startY = fireworksContainer.clientHeight;
				launchTrail.style.left = `${startX}px`;
				launchTrail.style.top = `${startY}px`;
				
				// Animate the launch
				animate(
					launchTrail,
					{
						opacity: [0.8, 0],
						y: [0, -(startY - y)],
						scale: [0.6, 0.3]
					},
					{
						duration: 0.7,
						easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
					}
				).finished.then(() => {
					if (launchTrail.parentNode) {
						launchTrail.parentNode.removeChild(launchTrail);
					}
				});
			}
		}
		
		// Create core bright flash - larger for super bursts
		const flash = document.createElement('div');
		flash.className = 'firework-flash';
		if (fireworksContainer) {
			fireworksContainer.appendChild(flash);
			flash.style.left = `${x}px`;
			flash.style.top = `${y}px`;
			
			// Animate the flash - more dramatic for super bursts
			animate(
				flash,
				{
					opacity: [1, 0],
					scale: [0, isSuper ? 6 : 4]
				},
				{
					duration: isSuper ? 0.8 : 0.6,
					easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
				}
			).finished.then(() => {
				if (flash.parentNode) {
					flash.parentNode.removeChild(flash);
				}
			});
		}
		
		for (let i = 0; i < particleCount; i++) {
			const particle = document.createElement('div');
			particle.className = 'firework-particle';
			
			// Determine if this is a normal particle or a "streamer" (long trail)
			const isStreamer = Math.random() < 0.25; // Increased chance of streamers
			if (isStreamer) {
				particle.classList.add('firework-streamer');
			}
			
			// Random size for more varied effect - increased sizes
			const particleSize = isStreamer ? 4 : Math.random() * 8 + 5; // 5-13px
			particle.style.width = `${particleSize}px`;
			particle.style.height = `${particleSize}px`;
			
			// Random color - super bursts get special colors
			const color = colors[Math.floor(Math.random() * colors.length)];
			particle.style.backgroundColor = color;
			
			if (fireworksContainer) {
				fireworksContainer.appendChild(particle);
				particles.push(particle);
				
				// Set initial position
				particle.style.left = `${x}px`;
				particle.style.top = `${y}px`;
			}
		}
		
		// Pre-calculate random animations for each particle
		const animations = particles.map((particle) => {
			// Detect streamers
			const isStreamer = particle.classList.contains('firework-streamer');
			
			// Much larger spread for high-altitude effect - even bigger now
			const distance = isStreamer ? 
				400 + Math.random() * 300 : 
				200 + Math.random() * 450;
			
			const angle = Math.random() * Math.PI * 2; // Random angle in radians
			
			// Calculate endpoint using polar coordinates for more realistic arc
			const randomX = `${Math.cos(angle) * distance}px`;
			const randomY = `${Math.sin(angle) * distance + (isStreamer ? 70 : 0)}px`; // Streamers fall more
			
			// 3D effect with z-axis - enhanced depth
			const randomZ = `${(Math.random() * 350) - 175}px`;
			// Removed 3D rotations for better performance
			const randomColor = colors[Math.floor(Math.random() * colors.length)];
			
			// Streamers last longer and have different animation
			// Increased duration by 1.5 seconds
			const duration = isStreamer ? 4.3 : 3.7;
			
			// Fade out timing - streamers last longer
			const keyframes = isStreamer ? 
				{ opacity: [1, 1, 0.8, 0] } : 
				{ opacity: [1, 0.9, 0] };
				
			// Return animation object with pre-calculated values
			return {
				particle,
				isStreamer,
				animProps: {
					...keyframes,
					scale: isStreamer ? [1, 1.2, 0.8] : [0, 1.2, 0.8],
					x: randomX,
					y: randomY,
					z: randomZ,
					// Removed rotateX and rotateY for performance
					backgroundColor: [particle.style.backgroundColor, randomColor],
					boxShadow: [
						`0 0 ${isStreamer ? 30 : 15}px ${particle.style.backgroundColor}`,
						`0 0 ${isStreamer ? 8 : 3}px rgba(255, 255, 255, 0)`
					]
				},
				duration,
				easing: isStreamer ? 
					'cubic-bezier(0.22, 0.44, 0.34, 1)' : 
					'cubic-bezier(0.22, 1, 0.36, 1)'
			};
		});
		
		// Animate particles in 3D - with individual animations
		particles.forEach((particle, index) => {
			const { animProps, duration, easing, isStreamer } = animations[index];
			
			animate(
				particle,
				animProps,
				{
					duration: duration,
					easing: easing,
					delay: index * 0.003, // Even faster stagger for more realistic explosion
				}
			).finished.then(() => {
				// Remove particle after animation completes
				if (particle.parentNode) {
					particle.parentNode.removeChild(particle);
				}
			});
		});
	}
	
	onMount(() => {
		// Mark elements as ready for animation
		animationsReady = true;
		
		// More dramatic hero section animation with 3D effects
		setTimeout(() => {
			console.log("Running hero animations");
			try {
				const heroElements = document.querySelectorAll('.hero-element');
				if (heroElements.length > 0) {
					// Enhanced dramatic animation - slide up from bottom with scaling
					animate('.hero-element', 
						{ 
							opacity: [0, 1], 
							y: [100, 0],
							scale: [0.7, 1]
						},
						{ 
							delay: stagger(0.25), // Longer stagger for more dramatic sequence
							duration: 1.5 // Longer duration for more impact
						}
					);
					
					// Trigger fireworks after the name appears
					setTimeout(() => {
						createLandingFireworks();
					}, 1000);
				}
			} catch (error) {
				console.error("Hero animation error:", error);
				document.querySelectorAll('.hero-element').forEach(el => {
					(el as HTMLElement).style.opacity = '1';
				});
			}
			
			// More dramatic skills animation with staggered delay
			setTimeout(() => {
				try {
					const skillTags = document.querySelectorAll('.skill-tag');
					if (skillTags.length > 0) {
						// Dramatic fan-out effect for skills
						animate('.skill-tag', 
							{ 
								opacity: [0, 1], 
								scale: [0.3, 1],
								y: [80, 0]
							},
							{ 
								delay: stagger(0.08, { from: "center" }), // Fan out from center
								duration: 1.2
							}
						);
					}
				} catch (error) {
					console.error("Skill tag animation error:", error);
					document.querySelectorAll('.skill-tag').forEach(el => {
						(el as HTMLElement).style.opacity = '1';
					});
				}
			}, 600); // Longer delay after hero elements
			
			// Enhanced buttons animation with more delay
			setTimeout(() => {
				try {
					const heroButtons = document.querySelectorAll('.hero-button');
					if (heroButtons.length > 0) {
						// More dramatic slide-in from sides
						animate('.hero-button', 
							{ 
								opacity: [0, 1], 
								x: ['-100px', '0px'],
								scale: [0.5, 1]
							},
							{ 
								delay: stagger(0.3), // More dramatic stagger
								duration: 1.0
							}
						);
					}
				} catch (error) {
					console.error("Button animation error:", error);
					document.querySelectorAll('.hero-button').forEach(el => {
						(el as HTMLElement).style.opacity = '1';
					});
				}
			}, 1200); // Much longer delay for the final button reveal
		}, 100); // Small delay to ensure DOM is ready
		
		// About section entrance animation when scrolled to
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting && !isAnimated) {
					isAnimated = true;
					
					// More dramatic about section animation
					try {
						const aboutElements = document.querySelectorAll('.about-element');
						if (aboutElements.length > 0) {
							// Sequential reveal animation with scale and slide
							animate('.about-element', 
								{ 
									opacity: [0, 1], 
									x: [-80, 0], 
									scale: [0.85, 1] 
								},
								{ 
									delay: stagger(0.25, { start: 0.2 }), // Longer delay between elements
									duration: 1.2 
								}
							);
							
							// Add subtle continuous floating animation after entrance
							setTimeout(() => {
								// Select each element individually for different floating patterns
								document.querySelectorAll('.about-element').forEach((el, i) => {
									// Alternating gentle float direction based on position
									const floatY = i % 2 === 0 ? "5px" : "-5px";
									
									animate(
										el, 
										{ y: [0, floatY, 0] }, 
										{ 
											duration: 3 + i * 0.5, // Different duration for each element
											repeat: Infinity,
											easing: 'ease-in-out'
										}
									);
								});
							}, 1500); // Start floating after entrance animation completes
						}
					} catch (error) {
						console.error("About section animation error:", error);
						document.querySelectorAll('.about-element').forEach(el => {
							(el as HTMLElement).style.opacity = '1';
						});
					}
				}
			});
		}, { threshold: 0.1, rootMargin: '-50px' }); // Trigger slightly before element is fully visible
		
		if (aboutSection) {
			observer.observe(aboutSection);
		}
	});
</script>

<svelte:head>
	<title>Szu-Han Chou aka Hank - Portfolio</title>
	<meta name="description" content="Professional portfolio showcasing my projects and expertise in software development">
</svelte:head>

<section class="py-12 bg-[#1A202C] text-gray-100 perspective relative" bind:this={heroSection}>
	<!-- Fireworks container positioned absolutely -->
	<div class="fireworks-container" bind:this={fireworksContainer}></div>
	<div class="container mx-auto px-4">
		<div class="flex flex-col items-center">
			<div class="w-full max-w-3xl mb-8 text-center">
				<h1 class="text-4xl md:text-5xl font-bold mb-4 hero-element animate-ready">Hi, I'm <span class="text-blue-400 name-highlight">Szu-Han Chou</span> aka Hank</h1>
				<h2 class="text-2xl md:text-3xl text-gray-300 mb-6 hero-element animate-ready">Software Developer</h2>
				<p class="text-lg text-gray-200 mb-8 hero-element animate-ready">
					I'm a passionate developer specialized in creating modern software solutions.
					With a strong focus on clean code, security, and user experience, I build applications 
					that help businesses succeed.
				</p>
				<div class="flex flex-wrap gap-3 mb-8 justify-center">
					{#each skills as skill}
						<span class="bg-[#2D3748] text-blue-300 px-3 py-1 rounded-full text-sm border border-gray-700 hover:border-blue-500 transition-colors skill-tag animate-ready">{skill}</span>
					{/each}
				</div>
				<div class="flex gap-4 justify-center">
					<a href="/portfolio" class="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors shadow-lg hero-button animate-ready">
						View My Work
					</a>
					<a href="/services" class="border border-blue-500 text-blue-400 hover:bg-[#2D3748] px-6 py-3 rounded-lg transition-colors shadow-lg hero-button animate-ready">
						My Expertise
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="py-12 bg-[#1E2433] text-gray-100 perspective" bind:this={aboutSection}>
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold mb-8 text-center text-blue-400 about-element animate-ready">About Me</h2>
		
		<div class="bg-[#1A202C] rounded-xl shadow-lg p-8 border border-gray-700">
			<div class="flex flex-col gap-6">
				<div class="about-element animate-ready">
					<h3 class="text-xl font-semibold mb-2 text-blue-300">My Background</h3>
					<p class="text-gray-200">
						With extensive experience in full-stack development, I specialize in building secure and maintainable software solutions.
						My technical expertise spans Python development, web applications, and implementing robust security practices.
						I currently work with Eighty20.AI, where I apply my skills to develop innovative technology solutions for a range of clients.
					</p>
				</div>
				
				<div class="about-element animate-ready">
					<h3 class="text-xl font-semibold mb-2 text-blue-300">Education & Experience</h3>
					<p class="text-gray-200">
						I hold a degree from Auckland University of Technology and have built my career working across various technology stacks.
						My professional journey includes roles at Eighty20.AI and volunteer positions including Python Bootcamp Instructor for 
						Summer of Tech (2020-2022) and Software Developer for The Good Registry (2019-2022), where I developed an application
						to generate gift cards for bulk orders. I'm passionate about mentoring and have served as a mentor for Young Enterprise.
					</p>
				</div>
				
				<div class="about-element animate-ready">
					<h3 class="text-xl font-semibold mb-2 text-blue-300">My Approach</h3>
					<p class="text-gray-200">
						I believe in writing clean, maintainable, and secure code. I hold several security certifications from SafeStack, including
						Secure Developer (Levels 1-2), Security Architect (Levels 1-2), Security Fundamentals (Levels 1-2), and Security Tester.
						My development philosophy centers around creating user-focused solutions that solve real problems while maintaining high 
						standards for security and code quality.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	:global(body) {
		background-color: #111827; /* bg-gray-900 */
		color: #f3f4f6; /* text-gray-100 */
	}
	
	/* Add perspective for 3D effects */
	.perspective {
		perspective: 1000px;
	}
	
	/* Animation styles for initial state */
	.animate-ready {
		opacity: 0; /* Start invisible for animation */
		transform-style: preserve-3d; /* Enable 3D transformations */
		backface-visibility: hidden; /* Prevent flickering during 3D animations */
		will-change: transform, opacity, filter;
	}
	
	/* Show content if JS is disabled or animations fail */
	:global(.animate-ready:not(:has(+ script))), /* For browsers without JS */
	:global(.no-js .animate-ready) { /* Fallback approach for when JS is disabled */
		opacity: 1 !important;
	}
	
	.skill-tag {
		transition: border-color 0.3s ease, transform 0.4s ease;
	}
	
	.skill-tag:hover {
		border-color: #3b82f6; /* blue-500 */
		transform: translateY(-2px) scale(1.05) rotate(2deg);
		transition: all 0.3s ease;
	}
	
	.hero-button {
		transition: all 0.3s ease;
	}
	
	.hero-button:hover {
		transform: translateY(-3px) scale(1.03);
		box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.5);
	}
	
	/* Ensure content is visible if JS fails */
	@media (prefers-reduced-motion: reduce) {
		.animate-ready {
			opacity: 1 !important;
			transform: none !important;
			filter: none !important;
		}
	}
	
	/* Make content visible after 800ms regardless of animations */
	@keyframes show-content {
		to { opacity: 1; }
	}
	
	.animate-ready {
		animation: show-content 0s 800ms forwards;
	}
	
	/* Fireworks styles */
	.fireworks-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		pointer-events: none;
		overflow: visible;
		perspective: 2000px; /* Even stronger perspective */
		transform-style: preserve-3d;
	}
	
	:global(.firework-particle) {
		position: absolute;
		width: 10px; /* Base size - increased */
		height: 10px;
		border-radius: 50%;
		will-change: transform, opacity, box-shadow;
		transform-style: preserve-3d;
		pointer-events: none;
		filter: blur(0.5px); /* Subtle blur for all particles */
	}
	
	:global(.firework-streamer) {
		width: 4px !important;
		height: 4px !important; 
		border-radius: 4px !important;
		filter: blur(1.5px); /* More blur for streamers */
		transform-origin: center center;
		box-shadow: 0 0 25px currentColor; /* Stronger glow for streamers */
	}
	
	:global(.firework-flash) {
		position: absolute;
		width: 50px; /* Larger flash */
		height: 50px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.95);
		filter: blur(15px); /* More blur for dramatic flash */
		will-change: transform, opacity;
		pointer-events: none;
		box-shadow: 0 0 30px #fff, 0 0 60px rgba(255, 220, 180, 0.8); /* Double glow */
	}
	
	:global(.firework-launch-trail) {
		position: absolute;
		width: 3px; /* Wider trail */
		height: 15px; /* Longer trail */
		background: linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 200, 100, 0.6));
		will-change: transform, opacity;
		pointer-events: none;
		filter: blur(2px); /* More blur for softer trail */
		z-index: 5;
		box-shadow: 0 0 15px rgba(255, 200, 100, 0.5); /* Glow for the trail */
	}
	
	.name-highlight {
		position: relative;
		z-index: 5;
	}
</style>
