<script lang="ts">
	// Navigation component for the header
	import { onMount } from 'svelte';
	import { animate, stagger, spring } from 'motion';
	import { page } from '$app/stores'; // Import the page store to track route changes
	import { onNavigate } from '$app/navigation';
	import { browser } from '$app/environment'; // Import browser check for SSR safety
	import { tick } from 'svelte'; // Import tick to ensure DOM is ready
	import { slide, fade } from 'svelte/transition'; // Import Svelte transitions for dropdown animation

	// State for mobile menu
	let isMobileMenuOpen = false;
	
	// Performance optimization - reduce animation complexity
	const PERFORMANCE_MODE = true; // Set to true to use simplified animations
	
	// Color palette for more vibrant animations
	const vibrantColors = {
		primary: '#60a5fa',    // blue
		secondary: '#f472b6',  // pink
		accent1: '#8b5cf6',    // purple
		accent2: '#10b981',    // emerald
		accent3: '#f59e0b',    // amber
		accent4: '#ef4444',    // red
	};
	
	// Function to toggle mobile menu
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
		
		// Create an entirely new menu system directly in the body
		if (isMobileMenuOpen && browser) {
			setTimeout(() => {
				try {
					// First, remove any existing menu overlay elements
					const existingOverlay = document.getElementById('full-page-menu-overlay');
					if (existingOverlay) {
						document.body.removeChild(existingOverlay);
					}
					
					// Create new menu container that completely covers everything
					const menuOverlay = document.createElement('div');
					menuOverlay.id = 'full-page-menu-overlay';
					menuOverlay.style.position = 'fixed';
					menuOverlay.style.top = '0';
					menuOverlay.style.left = '0';
					menuOverlay.style.width = '100vw';
					menuOverlay.style.height = '100vh';
					menuOverlay.style.backgroundColor = 'rgba(17, 24, 39, 0.9)'; // More opaque for better performance
					// Use backdrop blur only in high performance mode
					if (!PERFORMANCE_MODE) {
						menuOverlay.style.backdropFilter = 'blur(8px)';
						menuOverlay.style.setProperty('-webkit-backdrop-filter', 'blur(8px)');
					}
					menuOverlay.style.zIndex = '2147483647';
					menuOverlay.style.overflow = 'auto';
					menuOverlay.style.display = 'flex';
					menuOverlay.style.flexDirection = 'column';
					menuOverlay.style.alignItems = 'center';
					menuOverlay.style.justifyContent = 'center';
					menuOverlay.style.padding = '2rem 1rem';
					
					// Add close button that matches the hamburger menu style
					const closeButton = document.createElement('button');
					closeButton.style.position = 'fixed';
					closeButton.style.top = '1rem';
					closeButton.style.right = '1rem';
					closeButton.style.color = 'white';
					closeButton.style.width = '48px';
					closeButton.style.height = '48px';
					closeButton.style.borderRadius = '0.5rem';
					closeButton.style.display = 'flex';
					closeButton.style.flexDirection = 'column';
					closeButton.style.alignItems = 'center';
					closeButton.style.justifyContent = 'center';
					closeButton.style.zIndex = '2147483647';
					closeButton.style.border = 'none';
					closeButton.style.cursor = 'pointer';
					closeButton.style.backgroundColor = 'rgba(30, 41, 59, 0.8)'; // Add background color
					closeButton.setAttribute('aria-label', 'Close menu');
					
					// Create X icon using spans similar to hamburger menu
					for (let i = 0; i < 2; i++) {
						const line = document.createElement('span');
						line.style.display = 'block';
						line.style.width = '24px';
						line.style.height = '1.5px';
						line.style.backgroundColor = '#3b82f6';
						line.style.borderRadius = '9999px';
						line.style.position = 'absolute';
						line.style.transition = 'transform 0.3s ease';
						
						if (i === 0) {
							line.style.transform = 'rotate(45deg)';
						} else {
							line.style.transform = 'rotate(-45deg)';
						}
						
						closeButton.appendChild(line);
					}
					
					closeButton.addEventListener('click', closeMobileMenu);
					menuOverlay.appendChild(closeButton);
					
					// Create menu items container with improved styling
					const menuItemsContainer = document.createElement('div');
					menuItemsContainer.style.display = 'flex';
					menuItemsContainer.style.flexDirection = 'column';
					menuItemsContainer.style.alignItems = 'center';
					menuItemsContainer.style.width = '100%';
					menuItemsContainer.style.maxWidth = '350px';
					menuItemsContainer.style.gap = '16px';
					menuOverlay.appendChild(menuItemsContainer);
					
					// Prepare batch DOM operations using DocumentFragment
					const fragment = document.createDocumentFragment();
					
					// Add menu items with improved styling
					navItems.forEach(item => {
						const isActive = isNavItemActive(item.path, activePath);
						
						// Create menu item
						const menuItem = document.createElement('a');
						menuItem.href = item.path;
						menuItem.style.display = 'flex';
						menuItem.style.alignItems = 'center';
						menuItem.style.width = '100%';
						menuItem.style.padding = '1rem 1.5rem';
						menuItem.style.backgroundColor = isActive ? 'rgba(59, 130, 246, 0.9)' : 'rgba(30, 41, 59, 0.8)';
						menuItem.style.borderRadius = '12px';
						menuItem.style.border = isActive ? '2px solid #60a5fa' : '1px solid rgba(96, 165, 250, 0.3)';
						menuItem.style.textDecoration = 'none';
						menuItem.style.color = 'white';
						menuItem.style.fontSize = '18px';
						menuItem.style.fontWeight = 'bold';
						menuItem.style.gap = '12px';
						menuItem.style.transition = 'all 0.3s ease';
						menuItem.style.position = 'relative';
						menuItem.setAttribute('aria-label', item.label);
						menuItem.setAttribute('data-path', item.path);
						
						if (isActive) {
							menuItem.setAttribute('aria-current', 'page');
						}
						
						// Create icon
						const svgNS = "http://www.w3.org/2000/svg";
						const icon = document.createElementNS(svgNS, "svg");
						icon.setAttribute("width", "28");
						icon.setAttribute("height", "28");
						icon.setAttribute("viewBox", "0 0 24 24");
						icon.setAttribute("fill", isActive ? '#ffffff' : '#60a5fa');
						icon.classList.add('mobile-nav-icon');
						
						const iconPath = document.createElementNS(svgNS, "path");
						iconPath.setAttribute("d", item.icon);
						icon.appendChild(iconPath);
						
						// Create label
						const label = document.createElement('span');
						label.textContent = item.label;
						label.classList.add('mobile-nav-text');
						
						// Add icon and label to menuItem
						menuItem.appendChild(icon);
						menuItem.appendChild(label);
						
						// Add click event with simplified animations
						menuItem.addEventListener('click', (e) => {
							// Create simple animation before closing menu
							if (!isActive) {
								if (PERFORMANCE_MODE) {
									// Simple highlight animation
									animate(
										menuItem,
										{ backgroundColor: ['rgba(30, 41, 59, 0.8)', 'rgba(59, 130, 246, 0.9)', 'rgba(30, 41, 59, 0.8)'] },
										{ duration: 0.3, easing: 'ease-out' }
									);
								} else {
									// Create a flash effect
									const flash = document.createElement('div');
									flash.style.position = 'absolute';
									flash.style.top = '0';
									flash.style.left = '0';
									flash.style.width = '100%';
									flash.style.height = '100%';
									flash.style.borderRadius = '12px';
									flash.style.background = 'linear-gradient(45deg, rgba(96, 165, 250, 0.7), rgba(244, 114, 182, 0.7))';
									flash.style.opacity = '0';
									flash.style.pointerEvents = 'none';
									flash.style.zIndex = '5';
									menuItem.appendChild(flash);
									
									// Animate the flash
									animate(
										flash,
										{ opacity: [0, 0.8, 0] },
										{ duration: 0.5, easing: 'ease-out' }
									);
									
									// Create a single ripple effect
									const ripple = document.createElement('div');
									ripple.style.position = 'absolute';
									ripple.style.width = '20px';
									ripple.style.height = '20px';
									ripple.style.borderRadius = '50%';
									ripple.style.background = 'radial-gradient(circle, rgba(96, 165, 250, 0.9) 0%, rgba(96, 165, 250, 0) 70%)';
									ripple.style.left = '50%';
									ripple.style.top = '50%';
									ripple.style.transform = 'translate(-50%, -50%)';
									ripple.style.pointerEvents = 'none';
									ripple.style.zIndex = '1';
									ripple.style.opacity = '0.8';
									menuItem.appendChild(ripple);
									
									// Single simpler ripple animation
									animate(
										ripple,
										{
											opacity: [0.9, 0],
											scale: [0, 3]
										},
										{
											duration: 0.5,
											easing: 'ease-out'
										}
									);
									
									// Simple icon animation
									animate(
										icon,
										{
											scale: [1, 1.5, 1],
											y: [0, -5, 0]
										},
										{
											duration: 0.4,
											easing: 'ease-out'
										}
									);
								}
								
								// Delay navigation slightly to show the animation
								e.preventDefault();
								setTimeout(() => {
									window.location.href = item.path;
									closeMobileMenu();
								}, 300); // Shorter delay
								
								return;
							}
							
							closeMobileMenu();
						});
						
						fragment.appendChild(menuItem);
					});
					
					// Add all items at once for better performance
					menuItemsContainer.appendChild(fragment);
					
					// Add to body
					document.body.appendChild(menuOverlay);
					
					// Lock body scroll
					document.body.style.overflow = 'hidden';
					
				} catch (e) {
					console.error("Error creating menu overlay", e);
				}
			}, 50);
		} else if (browser) {
			// Remove menu overlay if it exists
			const menuOverlay = document.getElementById('full-page-menu-overlay');
			if (menuOverlay && menuOverlay.parentNode) {
				menuOverlay.parentNode.removeChild(menuOverlay);
			}
			
			// Restore body scroll
			document.body.style.overflow = '';
		}
	}
	
	// Close mobile menu when navigating or resizing to desktop
	function closeMobileMenu() {
		isMobileMenuOpen = false;
		
		if (browser) {
			// Remove menu overlay if it exists
			const menuOverlay = document.getElementById('full-page-menu-overlay');
			if (menuOverlay && menuOverlay.parentNode) {
				menuOverlay.parentNode.removeChild(menuOverlay);
			}
			
			// Restore body scroll
			document.body.style.overflow = '';
		}
	}
	
	// Check if we're on mobile
	let isMobile = false;
	
	// Function to handle key presses for accessibility
	function handleKeydown(event: KeyboardEvent) {
		// Close mobile menu on Escape key
		if (event.key === 'Escape' && isMobileMenuOpen) {
			closeMobileMenu();
		}
	}
	
	// Update isMobile state on window resize
	function handleResize() {
		if (browser) {
			isMobile = window.innerWidth < 768; // 768px is standard md breakpoint
			if (!isMobile) {
				closeMobileMenu(); // Close menu when switching to desktop
			}
		}
	}

	// Define navigation items
	const navItems = [
		{ path: '/', label: 'Home', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z' },
		{
			path: '/services',
			label: 'Services',
			icon: 'M21.67 18.17l-5.3-5.3h-.99l-2.54 2.54v.99l5.3 5.3c.39.39 1.02.39 1.41 0l2.12-2.12c.39-.38.39-1.02 0-1.41zm-2.83 1.42l-4.24-4.24.71-.71 4.24 4.24-.71.71z M17.34 10.19l1.41-1.41 2.12 2.12c1.17-1.17 1.17-3.07 0-4.24l-3.54-3.54-1.41 1.41V1.71l-.7-.71-3.54 3.54.71.71h2.83l-1.41 1.41 1.06 1.06-2.89 2.89-4.13-4.13V5.06L4.83 2.04 2 4.87 5.03 7.9h1.41l4.13 4.13-.85.85H7.6l-5.3 5.3c-.39.39-.39 1.02 0 1.41l2.12 2.12c.39.39 1.02.39 1.41 0l5.3-5.3v-2.12l5.15-5.15 1.06 1.05zm-7.98 5.15l-4.24 4.24-.71-.71 4.24-4.24.71.71z'
		},
    {
			path: '/portfolio',
			label: 'Projects',
			icon: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z'
		},
	];

	// Track previous active path for transitions
	let previousActivePath = '/';

	// Fireworks parameters - reduced counts for performance
	let fireworksContainer: HTMLDivElement;
	let isAnimatingFireworks = false;
	let lastFireworkTime = 0; // Throttle fireworks
	const particleColors = [
		vibrantColors.primary, '#3b82f6', // Blues
		vibrantColors.accent1, '#a78bfa', // Purples
		vibrantColors.secondary, '#ec4899', // Pinks
		vibrantColors.accent3, '#fcd34d', // Ambers/Yellows
		vibrantColors.accent2, '#6ee7b7', // Emeralds
		vibrantColors.accent4, '#fca5a5' // Reds
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

	// Create page transition effect with optimized animations
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

				if (PERFORMANCE_MODE) {
					// Use simpler animations in performance mode but make them more vibrant
					
					// Create a nav-only flash that fades slowly, instead of full-screen
					const navContainer = document.querySelector('nav');
					if (navContainer) {
						const flashOverlay = document.createElement('div');
						flashOverlay.className = 'nav-contained-flash';
						navContainer.appendChild(flashOverlay);
						
						// Animate the nav-contained flash with longer duration and staged opacity
						animate(
							flashOverlay,
							{ 
								opacity: [0, 0.8, 0.6, 0.4, 0.2, 0] 
							},
							{ 
								duration: 1.8,  // Longer duration
								easing: 'ease-out' 
							}
						).finished?.then(() => {
							if (flashOverlay.parentNode) {
								flashOverlay.parentNode.removeChild(flashOverlay);
							}
						}).catch(error => {
							console.error('Flash animation error:', error);
							if (flashOverlay.parentNode) {
								flashOverlay.parentNode.removeChild(flashOverlay);
							}
						});
					}
					
					// Simple highlight animation for the to item with more vibrant colors
					animate(
						toItem,
						{ 
							opacity: [0.7, 1],
							scale: [0.95, 1.05, 1]
						},
						{ duration: 0.5, easing: 'ease-out' }
					);
					
					// More vibrant animation for the to icon
					animate(
						toIcon,
						{
							scale: [1, 1.5, 1],
							y: [0, -8, 0],
							fill: ['#d1d5db', vibrantColors.primary, vibrantColors.primary]
						},
						{ duration: 0.6, easing: 'ease-out' }
					);
					
					// Simple animation for the from icon
					animate(
						fromIcon,
						{
							scale: [1, 0.8, 1],
							opacity: [1, 0.5, 1]
						},
						{ duration: 0.4, easing: 'ease-out' }
					);
					
					// More colorful animation for the to text
					const toText = toItem.querySelector('.nav-text');
					if (toText) {
						animate(
							toText,
							{ 
								scale: [1, 1.2, 1],
								y: [0, -5, 0],
								color: ['#e5e7eb', vibrantColors.primary, vibrantColors.primary]
							},
							{ duration: 0.6, easing: 'ease-out' }
						);
					}
					
					return;
				}

				// Create a flash effect (simplified)
				const navFlash = document.createElement('div');
				navFlash.className = 'nav-flash';
				const navElement = document.querySelector('nav');
				if (!navElement) return;
				navElement.appendChild(navFlash);

				// Animate the flash
				animate(
					navFlash,
					{ opacity: [0.5, 0] },
					{ duration: 0.5, easing: 'ease-out' }
				).finished?.then(() => {
					if (navFlash.parentNode) {
						navFlash.parentNode.removeChild(navFlash);
					}
				}).catch(() => {
					// Clean up on error
					if (navFlash.parentNode) {
						navFlash.parentNode.removeChild(navFlash);
					}
				});

				// Create a single ripple effect instead of multiple
				const ripple = document.createElement('div');
				ripple.className = 'nav-ripple';
				toItem.appendChild(ripple);

				// Position ripple in center of icon
				const toIconRect = (toIcon as HTMLElement).getBoundingClientRect();
				const toItemRect = (toItem as HTMLElement).getBoundingClientRect();

				ripple.style.left = `${toIconRect.left - toItemRect.left + toIconRect.width / 2}px`;
				ripple.style.top = `${toIconRect.top - toItemRect.top + toIconRect.height / 2}px`;

				// Simplified ripple animation
				animate(
					ripple,
					{
						opacity: [0.7, 0],
						scale: [0, 3]
					},
					{
						duration: 0.6,
						easing: 'ease-out'
					}
				).finished?.then(() => {
					if (ripple.parentNode) {
						ripple.parentNode.removeChild(ripple);
					}
				}).catch(() => {
					// Clean up on error
					if (ripple.parentNode) {
						ripple.parentNode.removeChild(ripple);
					}
				});

				// Simplified animation for the FROM icon
				animate(
					fromIcon,
					{
						scale: [1, 0.8, 1],
						opacity: [1, 0.7, 1]
					},
					{
						duration: 0.5,
						easing: 'ease-out'
					}
				);

				// Simplified animation for the TO icon
				animate(
					toIcon,
					{
						scale: [1, 1.5, 1],
						y: [0, -10, 0]
					},
					{
						duration: 0.6,
						easing: 'ease-out'
					}
				);

				// Create a few particles for effect - reduced count
				if (toItem && toIcon && !PERFORMANCE_MODE) {
					// Only create particles in non-performance mode and limit to 5
					createTransitionParticles(toItem as HTMLElement, toIcon as HTMLElement, 5);
				}

				// Simple animation for the label text
				const toText = toItem.querySelector('.nav-text');
				if (toText) {
					animate(
						toText,
						{
							scale: [1, 1.2, 1],
							y: [0, -5, 0]
						},
						{
							duration: 0.5,
							easing: 'ease-out'
						}
					);
				}
			} catch (error) {
				console.error('Page transition animation error:', error);
			}
		});
	}

	// Function to create particles during page transitions - with reduced particle count
	function createTransitionParticles(container: HTMLElement, sourceElement: HTMLElement, count: number = 5) {
		if (!browser || !container || !sourceElement) return;

		const rect = sourceElement.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		// Create particles in a single batch using DocumentFragment for better performance
		const fragment = document.createDocumentFragment();
		const particles: HTMLDivElement[] = [];

		for (let i = 0; i < count; i++) {
			const particle = document.createElement('div');
			particle.className = 'nav-transition-particle';

			// Random size
			const size = 4 + Math.random() * 4; // Smaller particles
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;

			// Set color
			const colorIndex = Math.floor(Math.random() * (particleColors?.length || 1));
			const color = particleColors && particleColors.length > 0 ? particleColors[colorIndex] : '#60a5fa';
			
			// Remove box-shadow for better performance
			
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
			// Calculate random end position with shorter distance
			const angle = Math.random() * Math.PI * 2;
			const distance = 50 + Math.random() * 50; // Shorter distances
			const endX = centerX + Math.cos(angle) * distance;
			const endY = centerY + Math.sin(angle) * distance;

			// Simplified animation
			animate(
				particle,
				{
					opacity: [1, 0],
					x: [0, `${endX - centerX}px`],
					y: [0, `${endY - centerY}px`]
				},
				{
					duration: 0.5 + Math.random() * 0.3, // Shorter duration
					easing: 'ease-out'
				}
			).finished?.then(() => {
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

	// Handle icon hover animation - enhanced but still optimized
	function handleIconEnter(event: MouseEvent, path: string) {
		if (!browser || isNavItemActive(path, activePath)) return;

		const target = event.currentTarget as HTMLElement;
		const icon = target.querySelector('.nav-icon');
		const text = target.querySelector('.nav-text');

		if (!icon || !text) return;

		if (PERFORMANCE_MODE) {
			// More colorful hover animation in performance mode
			// Create a single colorful flash
			const colorFlash = document.createElement('div');
			colorFlash.className = 'nav-color-pulse';
			target.appendChild(colorFlash);
			
			// Simple scaling for the flash
			animate(
				colorFlash,
				{
					opacity: [0, 0.7, 0],
					scale: [0.5, 1.5, 0]
				},
				{
					duration: 0.6,
					easing: 'ease-out'
				}
			).finished?.then(() => {
				if (colorFlash.parentNode) {
					colorFlash.parentNode.removeChild(colorFlash);
				}
			});
			
			// More vibrant icon animation
			animate(
				icon,
				{
					scale: 1.5,
					y: -7,
					fill: vibrantColors.primary,
				},
				{
					duration: 0.4,
					easing: 'ease-out'
				}
			);

			// More colorful text animation
			animate(
				text,
				{
					y: 4,
					scale: 1.1,
					color: vibrantColors.primary,
				},
				{
					duration: 0.4,
					easing: 'ease-out'
				}
			);
			
			return;
		}

		// Create a simplified glow effect on hover
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
				opacity: [0, 0.7, 0],
				scale: [0.5, 2, 0]
			},
			{
				duration: 0.8,
				easing: 'ease-out'
			}
		).finished?.then(() => {
			if (glow.parentNode) {
				glow.parentNode.removeChild(glow);
			}
		});

		animate(
			icon,
			{
				scale: 1.5,
				y: -10,
				fill: '#60a5fa'
			},
			{
				duration: 0.3,
				easing: 'ease-out'
			}
		);

		animate(
			text,
			{
				y: 5,
				scale: 1.1,
				color: '#60a5fa',
			},
			{
				duration: 0.3,
				easing: 'ease-out'
			}
		);

		// Only create particles in non-performance mode and with reduced count
		if (!PERFORMANCE_MODE) {
			createHoverParticles(target, icon as HTMLElement, 3);
		}
	}

	// Create subtle particle effect on hover - with reduced particle count
	function createHoverParticles(
		container: HTMLElement,
		sourceElement: HTMLElement,
		count: number = 3
	) {
		if (!browser || !container || !sourceElement || PERFORMANCE_MODE) return;

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

			// Simple particle size
			const size = 3 + Math.random() * 3;
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;

			// Simple color
			const colorIndex = Math.floor(Math.random() * (particleColors?.length || 1));
			const color = particleColors && particleColors.length > 0 ? particleColors[colorIndex] : '#60a5fa';
			particle.style.backgroundColor = color;
			
			// No box-shadow for better performance

			// Start position
			const startX = centerX;
			const startY = bottomY - 5;

			particle.style.left = `${startX}px`;
			particle.style.top = `${startY}px`;

			fragment.appendChild(particle);
			particles.push(particle);
		}

		// Add all particles at once
		container.appendChild(fragment);

		// Animate particles
		particles.forEach(particle => {
			// Simpler animation paths
			const angle = Math.random() * Math.PI; // Semi-circle above
			const distance = 20 + Math.random() * 30; // Shorter distance
			const startX = parseFloat(particle.style.left) || centerX;
			const startY = parseFloat(particle.style.top) || bottomY;
			const endX = startX + Math.cos(angle) * distance - 10;
			const endY = startY - Math.sin(angle) * distance - 20;

			animate(
				particle,
				{
					opacity: [0.8, 0],
					x: [0, `${endX - startX}px`],
					y: [0, `${endY - startY}px`]
				},
				{
					duration: 0.4 + Math.random() * 0.3, // Shorter duration
					easing: 'ease-out'
				}
			).finished?.then(() => {
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

		// Simple animation
		animate(
			icon,
			{
				scale: 1,
				y: 0,
				fill: '#d1d5db'
			},
			{
				duration: 0.3,
				easing: 'ease-out'
			}
		);

		animate(
			text,
			{
				y: 0,
				scale: 1,
				color: '#e5e7eb'
			},
			{
				duration: 0.3,
				easing: 'ease-out'
			}
		);
	}

	// Create a single firework explosion (enhanced but optimized)
	function createFireworkExplosion(x: number, y: number) {
		// Skip if not in browser environment or throttled
		if (!browser || isAnimatingFireworks || !fireworksContainer) return;
		
		// Throttle fireworks for performance (max one every 800ms)
		const now = Date.now();
		if (now - lastFireworkTime < 800) return;
		lastFireworkTime = now;

		isAnimatingFireworks = true;

		// Clear previous particles
		fireworksContainer.innerHTML = '';
		
		if (PERFORMANCE_MODE) {
			// Create a more colorful flash for performance mode
			// We'll use a sequence of two flashes with different colors
			const flash1 = document.createElement('div');
			flash1.className = 'firework-flash flash-primary';
			fireworksContainer.appendChild(flash1);
			flash1.style.left = `${x}px`;
			flash1.style.top = `${y}px`;

			const flash2 = document.createElement('div');
			flash2.className = 'firework-flash flash-secondary';
			fireworksContainer.appendChild(flash2);
			flash2.style.left = `${x}px`;
			flash2.style.top = `${y}px`;
			
			// Add a flash confined to the nav element instead of full page
			const navFlashContainer = document.querySelector('nav');
			if (navFlashContainer) {
				const flashOverlay = document.createElement('div');
				flashOverlay.className = 'firework-contained-flash';
				navFlashContainer.appendChild(flashOverlay);
				
				// Animate the flash overlay with longer duration
				animate(
					flashOverlay,
					{
						opacity: [0, 0.4, 0.3, 0.1, 0]
					},
					{
						duration: 1.6,
						easing: 'ease-out'
					}
				).finished?.then(() => {
					if (flashOverlay.parentNode) {
						flashOverlay.parentNode.removeChild(flashOverlay);
					}
				}).catch(error => {
					console.error('Firework overlay animation error:', error);
					if (flashOverlay.parentNode) {
						flashOverlay.parentNode.removeChild(flashOverlay);
					}
				});
			}
			
			// Animate the first flash
			animate(
				flash1,
				{
					opacity: [1, 0.7, 0.3, 0],
					scale: [0, 3.5, 4]
				},
				{
					duration: 1.2, // Longer duration
					easing: 'ease-out'
				}
			).finished?.then(() => {
				if (flash1.parentNode) {
					flash1.parentNode.removeChild(flash1);
				}
			});
			
			// Animate the second flash with slight delay
			animate(
				flash2,
				{
					opacity: [0.9, 0.6, 0.3, 0],
					scale: [0.5, 3, 5]
				},
				{
					duration: 1.5, // Even longer duration
					delay: 0.15,
					easing: 'ease-out'
				}
			).finished?.then(() => {
				if (flash2.parentNode) {
					flash2.parentNode.removeChild(flash2);
				}
				isAnimatingFireworks = false;
			});
			
			// Create a simple ring effect - very cheap animation
			const ring = document.createElement('div');
			ring.className = 'firework-ring';
			fireworksContainer.appendChild(ring);
			ring.style.left = `${x}px`;
			ring.style.top = `${y}px`;
			
			animate(
				ring,
				{
					opacity: [0.9, 0.6, 0.3, 0],
					scale: [0, 2, 3.5]
				},
				{
					duration: 1.2, // Longer duration
					easing: 'ease-out'
				}
			).finished?.then(() => {
				if (ring.parentNode) {
					ring.parentNode.removeChild(ring);
				}
			});
			
			return;
		}

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
				scale: [0, 3]
			},
			{
				duration: 0.5,
				easing: 'ease-out'
			}
		).finished?.then(() => {
			if (flash.parentNode) {
				flash.parentNode.removeChild(flash);
			}
		});

		// Create particles for the explosion - reduced for better performance
		const particleCount = 15; // Reduced from 50
		
		// Batch DOM operations with DocumentFragment
		const fragment = document.createDocumentFragment();
		const particles: HTMLDivElement[] = [];

		// Create all particles first
		for (let i = 0; i < particleCount; i++) {
			const particle = document.createElement('div');
			particle.className = 'firework-particle';

			// Simple particle
			const particleSize = Math.random() * 4 + 3; // 3-7px (smaller)
			particle.style.width = `${particleSize}px`;
			particle.style.height = `${particleSize}px`;

			// Set color without any fallback complexity
			const colorIndex = Math.floor(Math.random() * particleColors.length);
			particle.style.backgroundColor = particleColors[colorIndex];

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
			// Use polar coordinates for spread - shorter distance
			const distance = 50 + Math.random() * 50;
			const angle = Math.random() * Math.PI * 2; // Random angle in radians

			// Calculate endpoint
			const randomX = `${Math.cos(angle) * distance}px`;
			const randomY = `${Math.sin(angle) * distance}px`;

			// Simplified animation
			animate(
				particle,
				{
					opacity: [1, 0],
					scale: [1, 0],
					x: randomX,
					y: randomY
				},
				{
					duration: 0.8 + Math.random() * 0.4, // Shorter duration
					easing: 'ease-out'
				}
			).finished?.then(() => {
				// Remove each particle immediately when its animation completes
				if (particle.parentNode) {
					particle.parentNode.removeChild(particle);
				}
			}).catch(() => {
				// Clean up even if there's an error
				if (particle.parentNode) {
					particle.parentNode.removeChild(particle);
				}
			});
		});

		// Reset animation flag after reasonable time
		setTimeout(() => {
			isAnimatingFireworks = false;
			// Clear any remaining particles
			if (fireworksContainer) {
				fireworksContainer.innerHTML = '';
			}
		}, 1500); // Shorter duration for better performance
	}

	onMount(() => {
		// Only run DOM operations in the browser
		if (!browser) return;

		// Initialize mobile state
		handleResize();

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

				// Create a single firework burst for better performance
				createFireworkExplosion(x, y);
				
				// Add a colorful highlight to the brand logo without expensive effects
				const hankHighlight = document.querySelector('.hank-highlight');
				if (hankHighlight) {
					animate(
						hankHighlight,
						{
							scale: [1, 1.3, 1.2, 1],
							y: [0, -5, -3, 0],
							color: [vibrantColors.secondary, '#ec4899', '#f472b6', vibrantColors.secondary]
						},
						{
							duration: 1.0, // Longer duration
							easing: 'ease-out'
						}
					);
				}
			});
		}

		// Enhanced entry animation with longer flash
		setTimeout(() => {
			try {
				// First, remove any existing animations
				const existingFlash = document.querySelector('.page-entrance-flash');
				if (existingFlash && existingFlash.parentNode) {
					existingFlash.parentNode.removeChild(existingFlash);
				}
				
				if (PERFORMANCE_MODE) {
					// More colorful fade-in for the navigation in performance mode
					const navContainer = document.querySelector('nav');
					if (navContainer) {
						// Create a colorful gradient flash that lasts longer, but constrained to nav
						const flash = document.createElement('div');
						flash.className = 'nav-entrance-flash';
						navContainer.appendChild(flash);
						
						// Animate the flash with stepped opacity for smoother fading
						animate(
							flash,
							{
								opacity: [0, 0.8, 0.7, 0.5, 0.3, 0.1, 0]
							},
							{
								duration: 2.5, // Much longer duration
								easing: 'ease-out'
							}
						).finished?.then(() => {
							if (flash.parentNode) {
								flash.parentNode.removeChild(flash);
							}
						}).catch(error => {
							console.error('Flash animation error:', error);
							if (flash.parentNode) {
								flash.parentNode.removeChild(flash);
							}
						});
						
						// Fade in the nav
						animate(
							navContainer,
							{
								opacity: [0, 1],
								y: [5, 0]
							},
							{
								duration: 0.7,
								easing: 'ease-out'
							}
						);
						
						// Add a subtle but colorful animation to the logo
						const logoElements = document.querySelectorAll('.brand-logo span');
						if (logoElements.length > 0) {
							animate(
								logoElements,
								{
									opacity: [0, 1],
									x: ['-8px', '0px'],
									scale: [0.9, 1]
								},
								{
									delay: stagger(0.12),
									duration: 0.6,
									easing: 'ease-out'
								}
							);
						}
						
						// More colorful entrance for nav icons
						const navIconElements = document.querySelectorAll('.nav-icon');
						if (navIconElements && navIconElements.length > 0) {
							// Convert NodeList to Array
							const navIcons = Array.from(navIconElements);

							// Animate icons with stagger and scale
							animate(
								navIcons,
								{
									opacity: [0, 1],
									y: [8, -5, 0],
									scale: [0.8, 1.2, 1]
								},
								{
									delay: stagger(0.15),
									duration: 0.7,
									easing: 'ease-out'
								}
							);
						}
						
						return;
					}
					
					// ... existing code ...
				}
			} catch (error) {
				console.error('Nav animation error:', error);
			}
		}, 100);
	});
</script>

<svelte:window on:resize={handleResize} on:keydown={handleKeydown} />

<nav class="container mx-auto flex items-center justify-between px-4 py-4 relative" style="z-index: auto; overflow: visible;">
	<div class="relative">
		<a href="/" class="brand-logo text-xl font-bold text-blue-400 whitespace-nowrap">
			<span class="greeting hidden sm:inline-block">Hello, I'm</span>
			<span class="hank-highlight">Hank</span>
			<span class="aka">•</span>
			<span class="name">Szu-Han</span>
		</a>
		<div class="fireworks-container" bind:this={fireworksContainer}></div>
	</div>
	
	<!-- Mobile Hamburger Menu Button -->
	<button
		class="md:hidden z-[100000] relative w-12 h-12 flex flex-col justify-center items-center"
		style="position: relative; border-radius: 0.5rem; transition: all 0.3s ease;"
		on:click={toggleMobileMenu}
		aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
		aria-expanded={isMobileMenuOpen}
		aria-controls="mobile-nav-menu"
	>
		<span 
			class="hamburger-line bg-blue-500 rounded-full transition-all duration-300"
			class:top-active={isMobileMenuOpen}
			style="display: block; width: 26px; height: 1.5px; margin: 5px 0; background-color: #3b82f6; transform-origin: center;"
		></span>
		<span 
			class="hamburger-line bg-blue-500 rounded-full transition-all duration-300"
			class:middle-active={isMobileMenuOpen}
			style="display: block; width: 20px; height: 1.5px; margin: 5px 0; background-color: #3b82f6; transform-origin: center;"
		></span>
		<span 
			class="hamburger-line bg-blue-500 rounded-full transition-all duration-300"
			class:bottom-active={isMobileMenuOpen}
			style="display: block; width: 26px; height: 1.5px; margin: 5px 0; background-color: #3b82f6; transform-origin: center;"
		></span>
	</button>
	
	<!-- Mobile Navigation Dropdown - Now handled programmatically, keeping as fallback -->
	{#if false && isMobileMenuOpen}
	<div 
		id="mobile-nav-menu"
		class="md:hidden fixed inset-0 z-[99999]"
		style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; background-color: rgba(17, 24, 39, 0.98); padding-top: 6rem; padding-bottom: 2rem; padding-left: 1rem; padding-right: 1rem; overflow-y: auto; display: block; visibility: visible; opacity: 1;"
	>
		<!-- Visible indicator that menu is open -->
		<div style="position: fixed; top: 14px; left: 50%; transform: translateX(-50%); background-color: #ef4444; color: white; padding: 5px 10px; border-radius: 4px; font-weight: bold; z-index: 100001; display: block !important; visibility: visible !important; opacity: 1 !important;">
			Menu Is Open - Tap Items Below
		</div>
		
		<!-- Close button inside menu -->
		<button 
			style="position: fixed; top: 70px; right: 20px; background-color: #ef4444; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex !important; align-items: center; justify-content: center; font-weight: bold; font-size: 20px; z-index: 100001; visibility: visible !important; opacity: 1 !important;"
			on:click={closeMobileMenu}
			aria-label="Close menu"
		>
			✕
		</button>
		
		<div 
			class="flex flex-col gap-6 items-center max-w-md mx-auto"
			style="display: flex; visibility: visible; opacity: 1;"
		>
			{#each navItems as item, i}
				<a
					href={item.path}
					class="nav-item group flex items-center gap-4 w-full justify-center py-6 px-4"
					style="background-color: #1e293b; border: 2px solid #3b82f6; border-radius: 0.75rem; margin-bottom: 1rem; display: flex; visibility: visible; opacity: 1;"
					class:nav-active={isNavItemActive(item.path, activePath)}
					aria-label={item.label}
					aria-current={isNavItemActive(item.path, activePath) ? 'page' : undefined}
					on:click={closeMobileMenu}
					data-path={item.path}
				>
					<svg
						class="nav-icon"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill={isNavItemActive(item.path, activePath) ? '#60a5fa' : '#ffffff'}
						xmlns="http://www.w3.org/2000/svg"
						style="display: inline-block; visibility: visible; opacity: 1;"
					>
						<path d={item.icon} />
					</svg>
					<span
						class="nav-text text-xl text-white font-bold"
						style="display: inline-block; visibility: visible; opacity: 1;"
					>
						{item.label}
					</span>
				</a>
			{/each}
		</div>
	</div>
	{/if}
	
	<!-- Desktop Navigation -->
	<div class="hidden md:flex gap-8">
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
	/* Critical overrides for mobile menu visibility */
	:global(body) {
		position: relative;
		overflow-x: hidden;
	}
	
	:global(#mobile-nav-menu),
	:global(#mobile-nav-menu *) {
		visibility: visible !important;
		opacity: 1 !important;
		display: block !important;
	}
	
	:global(#mobile-nav-menu .flex) {
		display: flex !important;
	}
	
	:global(#mobile-nav-menu a) {
		display: flex !important;
	}
	
	/* Special hack for iOS */
	@supports (-webkit-touch-callout: none) {
		:global(#mobile-nav-menu) {
			-webkit-transform: translateZ(0);
			transform: translateZ(0);
		}
	}
	
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
		height: 2px;
		background: linear-gradient(90deg, #60a5fa, #f472b6);
		border-radius: 2px;
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.3s ease;
	}

	.brand-logo:hover .hank-highlight {
		color: #ec4899;
		transform: translateY(-2px);
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

	/* Hamburger menu styles */
	.hamburger-line {
		display: block;
		width: 24px;
		height: 2px;
		margin: 4px 0;
		transition: all 0.3s ease;
		opacity: 1;
	}
	
	.top-active {
		transform: translateY(7px) rotate(45deg);
		width: 24px !important;
	}
	
	.middle-active {
		opacity: 0;
		transform: translateX(-15px);
		width: 5px;
	}
	
	.bottom-active {
		transform: translateY(-7px) rotate(-45deg);
		width: 24px !important;
	}

	/* Mobile menu item styles */
	@media (max-width: 767px) {
		.nav-item {
			padding: 1.25rem 1.5rem;
			transition: all 0.3s ease;
			transform: translateY(0);
			width: 100%;
			max-width: 300px;
			border-radius: 0.75rem;
			opacity: 1 !important; /* Force visibility */
			background-color: rgba(30, 41, 59, 1);  /* Fully opaque background */
			margin-bottom: 0.75rem;
			border: 1px solid rgba(96, 165, 250, 0.3);
			position: relative; /* Ensure proper stacking context */
		}
		
		.nav-item:hover {
			background-color: rgba(96, 165, 250, 0.3);
			transform: translateY(-3px);
			border-color: rgba(96, 165, 250, 0.5);
		}
		
		.nav-active {
			background-color: rgba(96, 165, 250, 0.5);
			border-color: rgba(96, 165, 250, 0.8);
		}
		
		/* Ensure all navigation text is visible */
		.nav-text {
			opacity: 1 !important;
			color: white !important;
			text-shadow: 0 1px 2px rgba(0,0,0,0.5);
		}
		
		/* Ensure icon is visible */
		.nav-icon {
			opacity: 1 !important;
		}
	}

	.nav-item {
		position: relative;
		text-decoration: none;
		overflow: visible;
	}

	.nav-icon {
		transform-origin: center;
		transition: transform 0.3s ease, fill 0.3s ease;
		position: relative;
		z-index: 2;
		will-change: transform, fill;
	}

	.nav-text {
		transform-origin: bottom center;
		transition: color 0.3s ease, transform 0.3s ease;
		position: relative;
		z-index: 2;
	}

	/* Navigation flash effect - enhanced with gradient and expanded size */
	:global(.nav-flash) {
		position: absolute;
		top: -20px;
		left: -20px;
		width: calc(100% + 40px);
		height: calc(100% + 40px);
		background: linear-gradient(45deg, rgba(96, 165, 250, 0.6), rgba(244, 114, 182, 0.6));
		z-index: 50;
		opacity: 0;
		pointer-events: none;
		border-radius: 12px;
	}
	
	/* Nav-contained flash that doesn't cover whole screen - updated to be more vibrant */
	:global(.nav-contained-flash) {
		position: absolute;
		top: -5%;
		left: -5%;
		width: 110%;
		height: 110%;
		background: linear-gradient(135deg, 
			rgba(96, 165, 250, 0.7),
			rgba(139, 92, 246, 0.7),
			rgba(244, 114, 182, 0.7),
			rgba(16, 185, 129, 0.7)
		);
		z-index: 100;
		opacity: 0;
		pointer-events: none;
		border-radius: 16px;
	}
	
	/* New firework flash contained within nav */
	:global(.firework-contained-flash) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(
			circle at 50% 30%,
			rgba(244, 114, 182, 0.4) 0%,
			rgba(139, 92, 246, 0.3) 40%,
			rgba(96, 165, 250, 0.2) 60%,
			transparent 80%
		);
		z-index: 90;
		opacity: 0;
		pointer-events: none;
		border-radius: 16px;
	}

	/* Replace full-screen entrance flash with nav-contained version */
	:global(.nav-entrance-flash) {
		position: absolute;
		top: -10%;
		left: -10%;
		width: 120%;
		height: 120%;
		background: linear-gradient(135deg, 
			rgba(96, 165, 250, 0.7), 
			rgba(139, 92, 246, 0.7),
			rgba(244, 114, 182, 0.7),
			rgba(16, 185, 129, 0.7)
		);
		z-index: 999;
		pointer-events: none;
		opacity: 0;
		border-radius: 16px;
	}

	/* Remove all large flashing elements */
	:global(.nav-full-flash),
	:global(.firework-overlay-flash),
	:global(.page-entrance-flash),
	:global(.nav-color-flash) {
		display: none;
	}

	/* Simplified ripple effect */
	:global(.nav-ripple) {
		position: absolute;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(96, 165, 250, 0.7) 0%, rgba(96, 165, 250, 0) 70%);
		width: 20px;
		height: 20px;
		transform-origin: center;
		pointer-events: none;
		z-index: 1;
		opacity: 0.7;
		will-change: transform, opacity;
	}

	/* Simplified glow effect for hover */
	:global(.nav-hover-glow) {
		position: absolute;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			rgba(96, 165, 250, 0.6) 0%,
			rgba(96, 165, 250, 0) 70%
		);
		transform-origin: center;
		pointer-events: none;
		z-index: 1;
		opacity: 0;
		will-change: transform, opacity;
	}
	
	/* Color pulse effect for hover - new */
	:global(.nav-color-pulse) {
		position: absolute;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			rgba(96, 165, 250, 0.7) 0%,
			rgba(139, 92, 246, 0.4) 40%,
			rgba(96, 165, 250, 0) 80%
		);
		transform-origin: center;
		pointer-events: none;
		z-index: 1;
		opacity: 0;
		will-change: transform, opacity;
	}

	/* Navigation hover particles - simplified */
	:global(.nav-hover-particle) {
		position: absolute;
		width: 3px;
		height: 3px;
		border-radius: 50%;
		pointer-events: none;
		z-index: 1;
		will-change: transform, opacity;
		opacity: 0.7;
	}

	/* Navigation transition particles - simplified */
	:global(.nav-transition-particle) {
		position: absolute;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		pointer-events: none;
		z-index: 1;
		will-change: transform, opacity;
		opacity: 0.7;
	}

	/* Simple floating animation for active nav icon - enhanced with a bit more movement */
	.nav-active .nav-icon {
		animation: simple-float 3s ease-in-out infinite;
		fill: #60a5fa !important;
		will-change: transform;
	}

	.nav-active .nav-text {
		color: #60a5fa !important;
		animation: simple-pulse 4s ease-in-out infinite;
	}

	/* Explicitly remove animation for inactive items */
	.nav-item:not(.nav-active) .nav-icon {
		animation: none;
	}

	@keyframes simple-float {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}
	
	/* New subtle pulse animation for active text */
	@keyframes simple-pulse {
		0%, 100% {
			opacity: 0.9;
		}
		50% {
			opacity: 1;
		}
	}

	/* Fireworks styles - enhanced for more color and size */
	.fireworks-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 5;
		overflow: visible;
	}

	:global(.firework-particle) {
		position: absolute;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		will-change: transform, opacity;
		pointer-events: none;
	}

	:global(.firework-flash) {
		position: absolute;
		width: 60px; /* Larger flash size */
		height: 60px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.9);
		will-change: transform, opacity;
		pointer-events: none;
	}
	
	/* Enhanced color variants for firework flashes */
	:global(.flash-primary) {
		background-color: rgba(96, 165, 250, 0.8);
	}
	
	:global(.flash-secondary) {
		background-color: rgba(244, 114, 182, 0.8);
	}
	
	/* Enhanced ring effect for fireworks */
	:global(.firework-ring) {
		position: absolute;
		width: 20px; /* Larger ring */
		height: 20px;
		border-radius: 50%;
		border: 3px solid rgba(244, 114, 182, 0.9);
		will-change: transform, opacity;
		pointer-events: none;
	}

	/* Ensure navigation text is never blurred */
	.nav-text, :global(.mobile-nav-text), :global(.nav-text) {
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
