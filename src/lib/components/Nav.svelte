<script lang="ts">
	// Navigation component for the header
	import { onMount } from 'svelte';
	import { animate, stagger, spring } from 'motion';
	import { page } from '$app/stores'; // Import the page store to track route changes
	import { onNavigate } from '$app/navigation';
	import { browser } from '$app/environment'; // Import browser check for SSR safety
	import { tick } from 'svelte'; // Import tick to ensure DOM is ready

	// Define navigation items
	const navItems = [
		{ path: '/', label: 'Home', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z' },
		{
			path: '/portfolio',
			label: 'Projects',
			icon: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z'
		},
		{
			path: '/services',
			label: 'Skills',
			icon: 'M21.67 18.17l-5.3-5.3h-.99l-2.54 2.54v.99l5.3 5.3c.39.39 1.02.39 1.41 0l2.12-2.12c.39-.38.39-1.02 0-1.41zm-2.83 1.42l-4.24-4.24.71-.71 4.24 4.24-.71.71z M17.34 10.19l1.41-1.41 2.12 2.12c1.17-1.17 1.17-3.07 0-4.24l-3.54-3.54-1.41 1.41V1.71l-.7-.71-3.54 3.54.71.71h2.83l-1.41 1.41 1.06 1.06-2.89 2.89-4.13-4.13V5.06L4.83 2.04 2 4.87 5.03 7.9h1.41l4.13 4.13-.85.85H7.6l-5.3 5.3c-.39.39-.39 1.02 0 1.41l2.12 2.12c.39.39 1.02.39 1.41 0l5.3-5.3v-2.12l5.15-5.15 1.06 1.05zm-7.98 5.15l-4.24 4.24-.71-.71 4.24-4.24.71.71z'
		}
	];

	// Track previous active path for transitions
	let previousActivePath = '/';

	// Fireworks parameters
	let fireworksContainer: HTMLDivElement;
	let isAnimatingFireworks = false;
	const particleColors = [
		'#60a5fa',
		'#93c5fd',
		'#3b82f6', // Blues
		'#8b5cf6',
		'#a78bfa',
		'#c4b5fd', // Purples
		'#ec4899',
		'#f472b6',
		'#f9a8d4', // Pinks
		'#f59e0b',
		'#fbbf24',
		'#fcd34d', // Ambers/Yellows
		'#10b981',
		'#34d399',
		'#6ee7b7', // Emeralds
		'#ef4444',
		'#f87171',
		'#fca5a5' // Reds
	];

	// Helper function to determine if a nav item is active
	$: activePath = $page.url.pathname;

	// Function to check if a nav item is active (with exact matching for root path)
	function isNavItemActive(itemPath: string, currentPath: string): boolean {
		if (itemPath === '/') {
			return currentPath === '/';
		}
		return currentPath === itemPath;
	}

	// Create page transition effect
	function animatePageTransition(from: string, to: string) {
		if (!browser) return;

		tick().then(() => {
			try {
				// Find the from and to nav items
				const fromItem = document.querySelector(`.nav-item[data-path="${from}"]`);
				const toItem = document.querySelector(`.nav-item[data-path="${to}"]`);

				if (!fromItem || !toItem) return;

				// Get the icons for animation
				const fromIcon = fromItem.querySelector('.nav-icon');
				const toIcon = toItem.querySelector('.nav-icon');

				if (!fromIcon || !toIcon) return;

				// Create a dramatic flash of light over the entire navigation
				const navFlash = document.createElement('div');
				navFlash.className = 'nav-flash';
				const navElement = document.querySelector('nav');
				if (!navElement) return;
				navElement.appendChild(navFlash);

				// Animate the flash
				animate(
					navFlash,
					{
						opacity: [0.7, 0]
					},
					{
						duration: 0.8,
						easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
					}
				).finished.then(() => {
					if (navFlash.parentNode) {
						navFlash.parentNode.removeChild(navFlash);
					}
				});

				// Create multiple ripple effects on the new active item
				for (let i = 0; i < 3; i++) {
					const ripple = document.createElement('div');
					ripple.className = 'nav-ripple';
					toItem.appendChild(ripple);

					// Position ripple in center of icon
					const toIconRect = (toIcon as HTMLElement).getBoundingClientRect();
					const toItemRect = (toItem as HTMLElement).getBoundingClientRect();

					ripple.style.left = `${toIconRect.left - toItemRect.left + toIconRect.width / 2}px`;
					ripple.style.top = `${toIconRect.top - toItemRect.top + toIconRect.height / 2}px`;

					// Animate ripple with staggered timing
					animate(
						ripple,
						{
							opacity: [0.9, 0],
							scale: [0, 4 + i * 1.5] // Each ripple gets bigger
						},
						{
							duration: 1.0 + i * 0.2,
							delay: i * 0.15,
							easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
						}
					).finished.then(() => {
						if (ripple.parentNode) {
							ripple.parentNode.removeChild(ripple);
						}
					});
				}

				// Super dramatic rotation effect for the FROM icon (being navigated away from)
				animate(
					fromIcon,
					{
						scale: [1, 0.5],
						opacity: [1, 0.5, 1],
						rotate: ['0deg', '360deg'],
						y: [0, -20, 0]
					},
					{
						duration: 0.8,
						easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
					}
				);

				// Extreme bounce effect for the TO icon
				animate(
					toIcon,
					{
						scale: [1, 2.5, 1.2, 1],
						rotate: ['0deg', '-15deg', '15deg', '-5deg', '5deg', '0deg'],
						y: [0, -30, 5, 0],
						filter: [
							'drop-shadow(0 0 0px rgba(59, 130, 246, 0))',
							'drop-shadow(0 0 30px rgba(59, 130, 246, 0.9))',
							'drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))'
						]
					},
					{
						duration: 1.2,
						easing: spring({ stiffness: 300, damping: 10 }) // More bouncy spring
					}
				);

				// Create particles explosion for the navigation - only if toItem is available
				if (toItem && toIcon) {
					createTransitionParticles(toItem as HTMLElement, toIcon as HTMLElement);
				}

				// Dramatic effect for the label text
				const toText = toItem.querySelector('.nav-text');
				if (toText) {
					animate(
						toText,
						{
							scale: [1, 1.8, 1],
							y: [0, -15, 0],
							filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
							color: ['#e5e7eb', '#60a5fa', '#93c5fd']
						},
						{
							duration: 1.0,
							easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
						}
					);
				}
			} catch (error) {
				console.error('Page transition animation error:', error);
			}
		});
	}

	// Function to create particles during page transitions
	function createTransitionParticles(container: HTMLElement, sourceElement: HTMLElement) {
		if (!browser || !container || !sourceElement) return;

		const rect = sourceElement.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		// Create a burst of particles
		const particleCount = 30; // More particles for more drama
		const particles: HTMLDivElement[] = [];

		// Create particles in a single batch using DocumentFragment for better performance
		const fragment = document.createDocumentFragment();

		for (let i = 0; i < particleCount; i++) {
			const particle = document.createElement('div');
			particle.className = 'nav-transition-particle';

			// Random size, larger overall
			const size = 5 + Math.random() * 8;
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;

			// More vibrant colors
			const colorIndex = Math.floor(Math.random() * particleColors.length);
			// Add safety check for the particle colors array
			const color = particleColors[colorIndex] || '#60a5fa';
			particle.style.backgroundColor = color;
			particle.style.boxShadow = `0 0 ${8 + Math.random() * 10}px ${color}`;

			// Random shape for some particles
			if (Math.random() > 0.7) {
				particle.style.borderRadius = '2px';
				particle.style.transform = `rotate(${Math.random() * 90}deg)`;
			}

			// Start position at center of icon
			particle.style.left = `${centerX}px`;
			particle.style.top = `${centerY}px`;

			fragment.appendChild(particle);
			particles.push(particle);
		}

		// Add all particles to the DOM at once
		container.appendChild(fragment);

		// Animate each particle
		particles.forEach(particle => {
			// Calculate random end position with farther distance
			const angle = Math.random() * Math.PI * 2;
			const distance = 100 + Math.random() * 150;
			const endX = centerX + Math.cos(angle) * distance;
			const endY = centerY + Math.sin(angle) * distance;

			// Animate with more dramatic paths
			animate(
				particle,
				{
					opacity: [1, 0],
					scale: [Math.random() < 0.5 ? 0.5 : 1.5, 0],
					x: [0, `${endX - centerX}px`],
					y: [0, `${endY - centerY}px`],
					rotate: [`${Math.random() * 90}deg`, `${Math.random() * 360}deg`]
				},
				{
					duration: 0.8 + Math.random() * 0.9,
					easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
				}
			).finished.then(() => {
				if (particle.parentNode) {
					particle.parentNode.removeChild(particle);
				}
			});
		});
	}

	// Reset animation states when active path changes - only in browser environment
	$: if (browser && activePath) {
		// Track path change for transition animation
		if (activePath !== previousActivePath) {
			animatePageTransition(previousActivePath, activePath);
			previousActivePath = activePath;
		}

		// Using tick to ensure DOM operations happen after render
		tick().then(() => {
			// Reset all navigation items to default state
			const navIcons = document.querySelectorAll('.nav-icon');
			const navTexts = document.querySelectorAll('.nav-text');

			navIcons.forEach((icon, index) => {
				const itemPath = navItems[index]?.path;
				if (itemPath && !isNavItemActive(itemPath, activePath)) {
					// Use native styling to reset any persistent animations
					(icon as HTMLElement).style.fill = '#d1d5db';
					(icon as HTMLElement).style.transform = 'none';
					(icon as HTMLElement).style.filter = 'none';
				}
			});

			navTexts.forEach((text, index) => {
				const itemPath = navItems[index]?.path;
				if (itemPath && !isNavItemActive(itemPath, activePath)) {
					(text as HTMLElement).style.transform = 'none';
					(text as HTMLElement).style.color = '#e5e7eb';
				}
			});
		});
	}

	// Register a navigation handler - fixed implementation
	onNavigate(({ from, to, type }) => {
		if (from && to && browser) {
			// Only run in browser environment
			// Save the from path for animations
			previousActivePath = from.url.pathname;

			// Update the active path when navigation completes
			return () => {
				// Use the store-based approach which is more reliable than window.location
				activePath = $page.url.pathname;

				// Force reset all navigation item styles
				tick().then(() => {
					const allNavItems = document.querySelectorAll('.nav-item');

					allNavItems.forEach((item) => {
						const path = item.getAttribute('data-path');

						// Only reset non-active items
						if (path && path !== activePath) {
							// Remove any persistent animation
							item.classList.remove('nav-active');

							// Reset icon
							const icon = item.querySelector('.nav-icon');
							if (icon) {
								(icon as HTMLElement).style.fill = '#d1d5db';
								(icon as HTMLElement).style.animation = 'none';
								(icon as HTMLElement).style.transform = 'none';
							}

							// Reset text
							const text = item.querySelector('.nav-text');
							if (text) {
								(text as HTMLElement).classList.remove('text-blue-400');
								(text as HTMLElement).classList.add('text-gray-200');
							}
						}
					});
				});
			};
		}
	});

	// Handle icon hover animation
	function handleIconEnter(event: MouseEvent, path: string) {
		if (!browser || isNavItemActive(path, activePath)) return;

		const target = event.currentTarget as HTMLElement;
		const icon = target.querySelector('.nav-icon');
		const text = target.querySelector('.nav-text');

		if (!icon || !text) return;

		// Create a dramatic glow effect on hover
		const glow = document.createElement('div');
		glow.className = 'nav-hover-glow';
		target.appendChild(glow);

		// Position the glow
		const iconRect = (icon as HTMLElement).getBoundingClientRect();
		const targetRect = target.getBoundingClientRect();
		glow.style.left = `${iconRect.left - targetRect.left + iconRect.width / 2}px`;
		glow.style.top = `${iconRect.top - targetRect.top + iconRect.height / 2}px`;

		// Animate the glow
		animate(
			glow,
			{
				opacity: [0, 0.9, 0],
				scale: [0.5, 2.5, 3]
			},
			{
				duration: 1.5,
				easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
			}
		).finished.then(() => {
			if (glow.parentNode) {
				glow.parentNode.removeChild(glow);
			}
		});

		animate(
			icon,
			{
				scale: 1.8,
				y: -20,
				rotate: Math.random() > 0.5 ? '15deg' : '-15deg',
				fill: '#60a5fa',
				filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.9))'
			},
			{
				duration: 0.4,
				easing: 'cubic-bezier(0.34, 2.56, 0.64, 1)'
			}
		);

		animate(
			text,
			{
				y: 10,
				scale: 1.3,
				color: '#60a5fa',
				filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))'
			},
			{
				duration: 0.4,
				easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
			}
		);

		// Always create particles for more drama
		createHoverParticles(target, icon as HTMLElement, 15); // Increased particle count
	}

	// Create subtle particle effect on hover
	function createHoverParticles(
		container: HTMLElement,
		sourceElement: HTMLElement,
		count: number = 5
	) {
		if (!browser || !container || !sourceElement) return;

		const rect = container.getBoundingClientRect();
		const iconRect = sourceElement.getBoundingClientRect();
		const centerX = iconRect.width / 2;
		const bottomY = iconRect.height;

		// Create fragment for batch DOM operations
		const fragment = document.createDocumentFragment();
		const particles: HTMLDivElement[] = [];

		// Create particles
		for (let i = 0; i < count; i++) {
			const particle = document.createElement('div');
			particle.className = 'nav-hover-particle';

			// Random size and color
			const size = 4 + Math.random() * 6; // Bigger particles
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;

			// Random shapes for variety
			if (Math.random() > 0.7) {
				particle.style.borderRadius = `${Math.random() * 5}px`;
			}

			// Random color from our particle colors
			const colorIndex = Math.floor(Math.random() * particleColors.length);
			const color = particleColors[colorIndex] || '#60a5fa'; // Fallback color if array access fails
			particle.style.backgroundColor = color;
			particle.style.boxShadow = `0 0 ${5 + Math.random() * 8}px ${color}`; // Add glow to particles

			// Randomize start position slightly
			const startX = centerX + (Math.random() * 10 - 5);
			const startY =
				Math.random() > 0.7
					? Math.random() * iconRect.height // Sometimes start from random height
					: bottomY - 5; // Usually start from bottom

			particle.style.left = `${startX}px`;
			particle.style.top = `${startY}px`;

			fragment.appendChild(particle);
			particles.push(particle);
		}

		// Add all particles at once
		container.appendChild(fragment);

		// Animate particles
		particles.forEach(particle => {
			// More dramatic animation paths
			const angle = Math.random() * Math.PI; // Semi-circle above
			const distance = 40 + Math.random() * 80; // Further distance
			const startX = parseFloat(particle.style.left) || centerX;
			const startY = parseFloat(particle.style.top) || bottomY;
			const endX = startX + Math.cos(angle) * distance - 20;
			const endY = startY - Math.sin(angle) * distance - 40;

			animate(
				particle,
				{
					opacity: [1, 0],
					scale: [Math.random() > 0.5 ? 0.8 : 1.2, 0],
					x: [0, `${endX - startX}px`],
					y: [0, `${endY - startY}px`],
					rotate: ['0deg', `${Math.random() * 360}deg`]
				},
				{
					duration: 0.6 + Math.random() * 1,
					easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
				}
			).finished.then(() => {
				if (particle.parentNode) {
					particle.parentNode.removeChild(particle);
				}
			});
		});
	}

	// Handle icon leave animation
	function handleIconLeave(event: MouseEvent, path: string) {
		if (!browser || isNavItemActive(path, activePath)) return;

		const target = event.currentTarget as HTMLElement;
		const icon = target.querySelector('.nav-icon');
		const text = target.querySelector('.nav-text');

		if (!icon || !text) return;

		// More dramatic leave animation
		animate(
			icon,
			{
				scale: 1,
				y: 0,
				rotate: '0deg',
				fill: '#d1d5db',
				filter: 'drop-shadow(0 0 0 rgba(59, 130, 246, 0))'
			},
			{
				duration: 0.6,
				easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
			}
		);

		animate(
			text,
			{
				y: 0,
				scale: 1,
				color: '#e5e7eb',
				filter: 'drop-shadow(0 0 0 rgba(59, 130, 246, 0))'
			},
			{
				duration: 0.6,
				easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
			}
		);
	}

	// Create a single firework explosion
	function createFireworkExplosion(x: number, y: number) {
		// Skip if not in browser environment
		if (!browser || isAnimatingFireworks || !fireworksContainer) return;

		isAnimatingFireworks = true;

		// Clear previous particles
		fireworksContainer.innerHTML = '';

		// Add launch trails for consistency with main page
		const startY = fireworksContainer.clientHeight;
		const launchTrail = document.createElement('div');
		launchTrail.className = 'firework-launch-trail';
		fireworksContainer.appendChild(launchTrail);
		launchTrail.style.left = `${x}px`;
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
				duration: 0.5,
				easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
			}
		).finished.then(() => {
			if (launchTrail.parentNode) {
				launchTrail.parentNode.removeChild(launchTrail);
			}
		});

		// Create a flash at the explosion center
		const flash = document.createElement('div');
		flash.className = 'firework-flash';
		fireworksContainer.appendChild(flash);
		flash.style.left = `${x}px`;
		flash.style.top = `${y}px`;

		// Animate the flash
		animate(
			flash,
			{
				opacity: [1, 0],
				scale: [0, 4]
			},
			{
				duration: 0.7,
				easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
			}
		).finished.then(() => {
			if (flash.parentNode) {
				flash.parentNode.removeChild(flash);
			}
		});

		// Create particles for the explosion - further reduced for better performance
		const particleCount = 50; // Reduced from 70 for even better performance
		
		// Batch DOM operations with DocumentFragment
		const fragment = document.createDocumentFragment();
		const particles: HTMLDivElement[] = [];

		// Create all particles first
		for (let i = 0; i < particleCount; i++) {
			const particle = document.createElement('div');
			particle.className = 'firework-particle';

			// Determine if this is a normal particle or a "streamer" (long trail)
			const isStreamer = Math.random() < 0.25; // Increased chance of streamers
			if (isStreamer) {
				particle.classList.add('firework-streamer');
			}

			// Random size for more varied effect - increased sizes
			const particleSize = isStreamer ? 4 : Math.random() * 6 + 4; // 4-10px
			particle.style.width = `${particleSize}px`;
			particle.style.height = `${particleSize}px`;

			// Random color
			const colorIndex = Math.floor(Math.random() * particleColors.length);
			const color = particleColors[colorIndex] || '#60a5fa'; // Fallback if array access fails
			particle.style.backgroundColor = color;

			// Set initial position
			particle.style.left = `${x}px`;
			particle.style.top = `${y}px`;

			fragment.appendChild(particle);
			particles.push(particle);
		}

		// Add all particles to DOM at once (more efficient)
		fireworksContainer.appendChild(fragment);

		// Animate all particles
		particles.forEach((particle) => {
			// Detect streamers
			const isStreamer = particle.classList.contains('firework-streamer');

			// Use polar coordinates for more realistic spread - increased distance
			const distance = isStreamer ? 200 + Math.random() * 150 : 100 + Math.random() * 200;

			const angle = Math.random() * Math.PI * 2; // Random angle in radians

			// Calculate endpoint using polar coordinates for more natural arc
			const randomX = `${Math.cos(angle) * distance}px`;
			const randomY = `${Math.sin(angle) * distance + (isStreamer ? 50 : 0)}px`; // Streamers fall more

			// Simplified animations - removed z-axis for better performance
			const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)] || particle.style.backgroundColor;

			// Reduced duration for better performance
			const duration = isStreamer ? 3.0 : 2.5;

			// Animate with fewer properties for better performance
			const animationPromise = animate(
				particle,
				{
					opacity: isStreamer ? [1, 1, 0.8, 0] : [1, 0.9, 0],
					scale: isStreamer ? [1, 1.2, 0.7] : [0, 1.2, 0.8],
					x: randomX,
					y: randomY,
					backgroundColor: randomColor,
					boxShadow: [
						`0 0 ${isStreamer ? 20 : 10}px ${particle.style.backgroundColor}`,
						`0 0 ${isStreamer ? 5 : 0}px rgba(255, 255, 255, 0)`
					]
				},
				{
					duration: duration,
					easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
				}
			);

			if (animationPromise && animationPromise.finished) {
				animationPromise.finished.then(() => {
					// Remove each particle immediately when its animation completes
					if (particle.parentNode) {
						particle.parentNode.removeChild(particle);
					}
				}).catch(error => {
					console.error('Particle animation error:', error);
					// Clean up even if there's an error
					if (particle.parentNode) {
						particle.parentNode.removeChild(particle);
					}
				});
			}
		});

		// Reset animation flag after reasonable time (safety cleanup)
		setTimeout(() => {
			isAnimatingFireworks = false;
			// Clear any remaining particles for safety
			if (fireworksContainer) {
				fireworksContainer.innerHTML = '';
			}
		}, 3500); // Shorter duration than before for better performance
	}

	onMount(() => {
		// Only run DOM operations in the browser
		if (!browser) return;

		// Add hover event for fireworks on the brand logo
		const brandLogo = document.querySelector('.brand-logo');
		if (brandLogo && fireworksContainer) {
			brandLogo.addEventListener('mouseenter', (e) => {
				// Need to type cast the event to MouseEvent
				const mouseEvent = e as MouseEvent;

				// Get position relative to the fireworks container
				const rect = fireworksContainer.getBoundingClientRect();
				const x = mouseEvent.clientX - rect.left;
				const y = mouseEvent.clientY - rect.top;

				// Create multiple firework bursts but more spaced out for better performance
				createFireworkExplosion(x, y);
				setTimeout(() => createFireworkExplosion(x - 50, y - 20), 800); // Increased from 600ms
				setTimeout(() => createFireworkExplosion(x + 50, y - 20), 1600); // Increased from 1200ms
			});
		}

		// Super dramatic entry animation
		setTimeout(() => {
			try {
				// First, create a flash that covers the entire page
				const pageFlash = document.createElement('div');
				pageFlash.className = 'page-entrance-flash';
				document.body.appendChild(pageFlash);

				// Animate the flash
				animate(
					pageFlash,
					{
						opacity: [0, 0.8, 0]
					},
					{
						duration: 1.5,
						easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
					}
				).finished.then(() => {
					if (pageFlash.parentNode) {
						pageFlash.parentNode.removeChild(pageFlash);
					}
				});

				// Create a dramatic zoom-in animation for the navigation
				const navContainer = document.querySelector('nav');
				if (navContainer) {
					// Add a dramatic animation for the entire nav
					animate(
						navContainer,
						{
							opacity: [0, 1],
							scale: [0.9, 1],
							filter: ['blur(10px)', 'blur(0px)']
						},
						{
							duration: 1.2,
							easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
						}
					);
				}

				// Dramatic animation for logo parts with 3D rotation
				const logoElements = document.querySelectorAll('.brand-logo span');
				if (logoElements.length > 0) {
					animate(
						logoElements,
						{
							opacity: [0, 1],
							x: ['-50px', '0px'],
							y: ['-20px', '0px'],
							rotateX: ['45deg', '0deg'],
							rotateY: ['25deg', '0deg'],
							scale: [0.7, 1],
							filter: ['blur(12px)', 'blur(0px)']
						},
						{
							delay: stagger(0.15, { from: 'first' }),
							duration: 1.2,
							easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
						}
					);

					// Additional glow animation for the highlight element
					const hankHighlight = document.querySelector('.hank-highlight');
					if (hankHighlight) {
						setTimeout(() => {
							animate(
								hankHighlight,
								{
									textShadow: [
										'0 0 8px rgba(244, 114, 182, 0.5)',
										'0 0 30px rgba(244, 114, 182, 0.9)',
										'0 0 8px rgba(244, 114, 182, 0.5)'
									]
								},
								{
									duration: 1.5,
									easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
								}
							);
						}, 1000);
					}
				}

				// Super dramatic entrance for nav icons with 3D transform and particles
				const navIconElements = document.querySelectorAll('.nav-icon');
				if (navIconElements && navIconElements.length > 0) {
					// Convert NodeList to Array for better compatibility with the animate function
					const navIcons = Array.from(navIconElements);

					// Hide nav icons first
					navIcons.forEach((icon) => {
						(icon as HTMLElement).style.opacity = '0';
					});

					// For each icon, create entrance particles before showing the icon
					navIcons.forEach((icon, index) => {
						const iconElement = icon as HTMLElement;
						const navItem = iconElement.closest('.nav-item') as HTMLElement;

						if (!navItem) return;

						// Delay based on index
						setTimeout(() => {
							// Create particles first
							for (let i = 0; i < 20; i++) {
								const particle = document.createElement('div');
								particle.className = 'nav-entrance-particle';

								// Random properties
								const size = 3 + Math.random() * 7;
								particle.style.width = `${size}px`;
								particle.style.height = `${size}px`;

								// Vibrant color
								const color = particleColors[Math.floor(Math.random() * particleColors.length)];
								particle.style.backgroundColor = color;
								particle.style.boxShadow = `0 0 ${5 + Math.random() * 8}px ${color}`;

								// Position at center of where icon will appear
								const rect = navItem.getBoundingClientRect();
								particle.style.position = 'absolute';
								particle.style.left = `${rect.width / 2}px`;
								particle.style.top = `${rect.height / 2}px`;

								navItem.appendChild(particle);

								// Animate particles from center outward
								const angle = Math.random() * Math.PI * 2;
								const distance = 30 + Math.random() * 100;

								animate(
									particle,
									{
										opacity: [1, 0],
										scale: [Math.random() < 0.5 ? 0.5 : 1.5, 0],
										x: [0, `${Math.cos(angle) * distance}px`],
										y: [0, `${Math.sin(angle) * distance}px`]
									},
									{
										duration: 0.8 + Math.random() * 0.6,
										easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
									}
								).finished.then(() => {
									if (particle.parentNode) {
										particle.parentNode.removeChild(particle);
									}
								});
							}

							// Now show the icon with an epic animation
							iconElement.style.opacity = '1';

							animate(
								iconElement,
								{
									scale: [0.2, 1.7, 1],
									y: ['-150px', '20px', '0px'],
									rotate: ['-180deg', '20deg', '0deg'],
									filter: [
										'drop-shadow(0 0 0px rgba(59, 130, 246, 0))',
										'drop-shadow(0 0 40px rgba(59, 130, 246, 1))',
										'drop-shadow(0 0 0px rgba(59, 130, 246, 0))'
									]
								},
								{
									duration: 1.5,
									easing: spring({ stiffness: 150, damping: 12 })
								}
							);
						}, index * 300); // Stagger the icons by 300ms each
					});

					// Dramatic entrance for nav texts with delay
					const navTextElements = document.querySelectorAll('.nav-text');
					if (navTextElements && navTextElements.length > 0) {
						const navTexts = Array.from(navTextElements);

						// Hide first
						navTexts.forEach((text) => {
							(text as HTMLElement).style.opacity = '0';
						});

						// Animate each with delay
						navTexts.forEach((text, index) => {
							setTimeout(
								() => {
									(text as HTMLElement).style.opacity = '1';
									animate(
										text,
										{
											opacity: [0, 1],
											y: ['40px', '-10px', '0px'],
											scale: [0.5, 1.2, 1],
											filter: ['blur(8px)', 'blur(1px)', 'blur(0px)']
										},
										{
											duration: 1.0,
											easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
										}
									);
								},
								index * 300 + 150
							); // Slightly offset from icons
						});
					}
				}

				// Reset any pre-existing active states
				const allNavItems = document.querySelectorAll('.nav-item');
				const currentPath = window.location.pathname;

				allNavItems.forEach((item) => {
					const path = item.getAttribute('data-path');

					if (path && path !== currentPath) {
						item.classList.remove('nav-active');

						const icon = item.querySelector('.nav-icon');
						if (icon) {
							(icon as HTMLElement).style.animation = 'none';
							(icon as HTMLElement).style.fill = '#d1d5db';
						}

						const text = item.querySelector('.nav-text');
						if (text) {
							(text as HTMLElement).classList.remove('text-blue-400');
							(text as HTMLElement).classList.add('text-gray-200');
						}
					}
				});
			} catch (error) {
				console.error('Nav icon animation error:', error);
			}
		}, 100); // Short delay to ensure DOM is ready
	});
</script>

<nav class="container mx-auto flex items-center justify-between px-4 py-4">
	<div class="relative">
		<a href="/" class="brand-logo text-xl font-bold text-blue-400">
			<span class="greeting">Hello, I'm</span>
			<span class="hank-highlight">Hank</span>
			<span class="aka">•</span>
			<span class="name">Szu-Han</span>
		</a>
		<div class="fireworks-container" bind:this={fireworksContainer}></div>
	</div>
	<div class="flex gap-8">
		{#each navItems as item}
			<a
				href={item.path}
				class="nav-item group flex flex-col items-center"
				class:nav-active={isNavItemActive(item.path, activePath)}
				aria-label={item.label}
				aria-current={isNavItemActive(item.path, activePath) ? 'page' : undefined}
				on:mouseenter={(e) => handleIconEnter(e, item.path)}
				on:mouseleave={(e) => handleIconLeave(e, item.path)}
				data-path={item.path}
			>
				<svg
					class="nav-icon mb-1"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill={isNavItemActive(item.path, activePath) ? '#60a5fa' : '#d1d5db'}
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d={item.icon} />
				</svg>
				<span
					class="nav-text transition-colors"
					class:text-blue-400={isNavItemActive(item.path, activePath)}
					class:text-gray-200={!isNavItemActive(item.path, activePath)}
				>
					{item.label}
				</span>
			</a>
		{/each}
	</div>
</nav>

<style>
	.brand-logo {
		position: relative;
		overflow: visible;
		z-index: 10;
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
	}

	.greeting {
		font-weight: 500;
		color: #94a3b8;
		font-size: 0.9em;
		opacity: 0.85;
		letter-spacing: 0.02em;
	}

	.name {
		color: #93c5fd;
	}

	.aka {
		color: #f9a8d4;
		font-size: 0.8em;
		margin-top: 0.1em;
	}

	.hank-highlight {
		position: relative;
		display: inline-block;
		color: #f472b6;
		font-weight: 800;
		text-shadow: 0 0 8px rgba(244, 114, 182, 0.5);
		transition: all 0.3s ease;
	}

	.hank-highlight::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 100%;
		height: 3px;
		background: linear-gradient(90deg, #60a5fa, #f472b6);
		border-radius: 2px;
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.brand-logo:hover .hank-highlight {
		color: #ec4899;
		transform: translateY(-2px);
		text-shadow: 0 0 12px rgba(236, 72, 153, 0.7);
	}

	.brand-logo:hover .hank-highlight::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.brand-logo:hover .greeting {
		color: #cbd5e1;
	}

	.brand-logo:hover .name {
		color: #60a5fa;
	}

	.nav-item {
		position: relative;
		text-decoration: none;
		overflow: visible;
		isolation: isolate; /* Create stacking context for z-index */
	}

	.nav-icon {
		transform-origin: center;
		will-change: transform, fill, filter;
		filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0));
		transition:
			transform 0.3s ease,
			filter 0.3s ease,
			fill 0.3s ease;
		animation: none; /* Default to no animation */
		position: relative;
		z-index: 2;
	}

	.nav-text {
		will-change: transform;
		transform-origin: bottom center;
		transition: color 0.3s ease;
		position: relative;
		z-index: 2;
	}

	/* Navigation flash effect */
	:global(.nav-flash) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(45deg, rgba(96, 165, 250, 0.6), rgba(244, 114, 182, 0.6));
		z-index: 5;
		opacity: 0;
		pointer-events: none;
		filter: blur(15px);
		mix-blend-mode: overlay;
	}

	/* Create ripple effect for navigation */
	:global(.nav-ripple) {
		position: absolute;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(96, 165, 250, 0.9) 0%, rgba(96, 165, 250, 0) 70%);
		width: 20px;
		height: 20px;
		transform-origin: center;
		pointer-events: none;
		z-index: 1;
		opacity: 0.8;
		will-change: transform, opacity;
		filter: blur(1px); /* Slight blur for smoother appearance */
	}

	/* Dramatic glow effect for hover */
	:global(.nav-hover-glow) {
		position: absolute;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			rgba(96, 165, 250, 0.9) 0%,
			rgba(139, 92, 246, 0.4) 40%,
			rgba(96, 165, 250, 0) 70%
		);
		transform-origin: center;
		pointer-events: none;
		z-index: 1;
		opacity: 0;
		will-change: transform, opacity;
		filter: blur(5px);
		mix-blend-mode: screen;
	}

	/* Navigation hover particles */
	:global(.nav-hover-particle) {
		position: absolute;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		pointer-events: none;
		z-index: 1;
		will-change: transform, opacity;
		transform-style: preserve-3d;
		filter: blur(1px);
		opacity: 0.8;
	}

	/* Navigation transition particles */
	:global(.nav-transition-particle) {
		position: absolute;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		pointer-events: none;
		z-index: 1;
		will-change: transform, opacity;
		transform-style: preserve-3d;
		filter: blur(0.5px);
		opacity: 0.8;
	}

	/* Enhanced floating animation for active nav icon */
	.nav-active .nav-icon {
		animation: floating 3s ease-in-out infinite;
		fill: #60a5fa !important;
		filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.6)) !important;
		transform-style: preserve-3d;
		perspective: 800px;
	}

	.nav-active .nav-text {
		color: #60a5fa !important;
		animation: textPulse 3s ease-in-out infinite;
		text-shadow: 0 0 15px rgba(96, 165, 250, 0.5);
	}

	/* Explicitly remove animation for inactive items */
	.nav-item:not(.nav-active) .nav-icon {
		animation: none;
	}

	@keyframes floating {
		0% {
			transform: translateY(0px) rotateY(0deg);
		}
		25% {
			transform: translateY(-3px) rotateY(5deg);
		}
		50% {
			transform: translateY(-5px) rotateY(0deg);
		}
		75% {
			transform: translateY(-3px) rotateY(-5deg);
		}
		100% {
			transform: translateY(0px) rotateY(0deg);
		}
	}

	@keyframes textPulse {
		0% {
			opacity: 0.9;
			text-shadow: 0 0 5px rgba(96, 165, 250, 0.3);
		}
		50% {
			opacity: 1;
			text-shadow: 0 0 15px rgba(96, 165, 250, 0.7);
		}
		100% {
			opacity: 0.9;
			text-shadow: 0 0 5px rgba(96, 165, 250, 0.3);
		}
	}

	/* Fireworks styles */
	.fireworks-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 5;
		overflow: visible;
		perspective: 2000px;
		transform-style: preserve-3d;
	}

	:global(.firework-particle) {
		position: absolute;
		width: 10px; /* Increased base size */
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
		box-shadow:
			0 0 30px #fff,
			0 0 60px rgba(255, 220, 180, 0.8); /* Double glow */
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
		box-shadow: 0 0 10px rgba(255, 200, 100, 0.5); /* Glow for the trail */
	}

	/* Dramatic entrance effects */
	:global(.page-entrance-flash) {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: linear-gradient(135deg, rgba(96, 165, 250, 0.8), rgba(244, 114, 182, 0.8));
		z-index: 9999;
		pointer-events: none;
		opacity: 0;
		filter: blur(20px);
		mix-blend-mode: overlay;
	}

	:global(.nav-entrance-particle) {
		position: absolute;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		pointer-events: none;
		z-index: 3;
		will-change: transform, opacity;
		transform-style: preserve-3d;
		filter: blur(1px);
		opacity: 0.9;
	}

	/* Navigation animation effects */
	.nav-item {
		position: relative;
		text-decoration: none;
		overflow: visible;
		isolation: isolate; /* Create stacking context for z-index */
		transform-style: preserve-3d;
		perspective: 1000px;
	}
</style>
