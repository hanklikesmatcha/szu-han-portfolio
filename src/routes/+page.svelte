<script lang="ts">
	import { onMount } from 'svelte';
	import { animate, stagger, spring } from 'motion';

	// Skills based on LinkedIn profile
	const skills = [
		'Full-Stack Development',
		'Python',
		'TypeScript',
		'Cloud Services & DevOps',
		'AWS',
		'Azure',
		'Hugging Face',
		'PyTorch',
		'LangChain',
		'Supabase',
		'Mobile Development',
		'Database Migration',
		'Data Engineering and Machine Learning with Python',
		'Technical Mentoring'
	];

	let currentSection = 'about';
	let heroSection: HTMLElement;
	let skillsElements: HTMLElement[] = [];
	let aboutSection: HTMLElement;
	let isAnimated = false;
	let animationsReady = false;
	let fireworksCanvas: HTMLCanvasElement;
	let fireworksCtx: CanvasRenderingContext2D | null;
	let fireworksAnimationId: number;
	let contentReady = false; // Flag to control when to show content
	let testimonialSection: HTMLElement; // Added for testimonial section
	let testimonialAnimated = false; // Flag to track if testimonials were animated
	let ctaSection: HTMLElement; // Added for CTA section
	let useSimpleAnimation = false; // Flag to use super-simplified animation
	let animationStarted = false; // Track if animation has started
	let gradientCanvas: HTMLCanvasElement; // For simple gradient effect
	let gradientCtx: CanvasRenderingContext2D | null;
	let preloaded = false; // Flag to track if preloading is complete
	let lowQualityMode = false; // Flag for very low quality mode

	// Add click counters for name animations
	let hankClickCount = 0;
	let szuhanClickCount = 0;

	// Function to handle name click animations
	function handleNameClick(name: 'hank' | 'szuhan') {
		if (name === 'hank') {
			hankClickCount++;
			const animation = hankClickCount % 4;

			const hankElement = document.querySelector('.hank-highlight');
			if (!hankElement) return;

			// Remove any existing animation classes
			hankElement.classList.remove('hank-pulse', 'hank-shake', 'hank-rotate', 'hank-bounce');

			// Force a reflow to restart animation
			void (hankElement as HTMLElement).offsetWidth;

			// Apply a different animation based on click count
			switch (animation) {
				case 0:
					hankElement.classList.add('hank-pulse');
					break;
				case 1:
					hankElement.classList.add('hank-shake');
					break;
				case 2:
					hankElement.classList.add('hank-rotate');
					break;
				case 3:
					hankElement.classList.add('hank-bounce');
					break;
			}
		} else {
			szuhanClickCount++;
			const animation = szuhanClickCount % 4;

			const szuhanElement = document.querySelector('.szuhan-highlight');
			if (!szuhanElement) return;

			// Remove any existing animation classes
			szuhanElement.classList.remove(
				'szuhan-pulse',
				'szuhan-shake',
				'szuhan-rotate',
				'szuhan-bounce'
			);

			// Force a reflow to restart animation
			void (szuhanElement as HTMLElement).offsetWidth;

			// Apply a different animation based on click count
			switch (animation) {
				case 0:
					szuhanElement.classList.add('szuhan-pulse');
					break;
				case 1:
					szuhanElement.classList.add('szuhan-shake');
					break;
				case 2:
					szuhanElement.classList.add('szuhan-rotate');
					break;
				case 3:
					szuhanElement.classList.add('szuhan-bounce');
					break;
			}
		}
	}

	// Performance monitoring variables
	let lastFrameTime = 0;
	let frameCount = 0;
	let fps = 60;
	let fpsThrottleEnabled = true;
	let fpsThreshold = 30; // Target minimum FPS
	let isDesktopView = false; // Flag to detect desktop view for additional optimization
	let fireworksDisabled = false; // Flag to completely disable fireworks on very low-end devices
	let lowPerformanceCounter = 0; // Counter for consecutive low performance frames
	let offscreenCanvas: HTMLCanvasElement | null = null; // For off-screen rendering
	let offscreenCtx: CanvasRenderingContext2D | null = null;
	let renderScale = 1.0; // Scale factor for off-screen rendering

	// Particle pool to reduce object creation/garbage collection
	const particlePool: Particle[] = [];
	const maxPoolSize = 300;

	// Gets a particle from the pool or creates a new one
	function getParticle(
		x: number,
		y: number,
		vx: number,
		vy: number,
		size: number,
		color: string,
		lifespan: number,
		isStreamer: boolean,
		isSecondary: boolean = false,
		canSplit: boolean = false,
		gravity: number = 0.1
	): Particle {
		if (particlePool.length > 0) {
			const particle = particlePool.pop()!;
			particle.reset(
				x,
				y,
				vx,
				vy,
				size,
				color,
				lifespan,
				isStreamer,
				isSecondary,
				canSplit,
				gravity
			);
			return particle;
		}
		return new Particle(
			x,
			y,
			vx,
			vy,
			size,
			color,
			lifespan,
			isStreamer,
			isSecondary,
			canSplit,
			gravity
		);
	}

	// Returns a particle to the pool
	function recycleParticle(particle: Particle) {
		if (particlePool.length < maxPoolSize) {
			particlePool.push(particle);
		}
	}

	// Fireworks class for optimized Canvas-based rendering
	class Firework {
		x: number;
		y: number;
		targetX: number;
		targetY: number;
		color: string;
		particles: Particle[];
		hasExploded: boolean;
		velocity: number;
		trail: { x: number; y: number }[];
		explosionSize: number;
		explosionType: string;
		particleFactor: number; // Add factor to control particle counts

		constructor(startX: number, targetX: number, targetY: number, particleFactor: number = 1.0) {
			// Start position (bottom of screen)
			this.x = startX;
			this.y = fireworksCanvas ? fireworksCanvas.height : 0;
			// Target position (where explosion happens)
			this.targetX = targetX;
			this.targetY = targetY;
			this.color = this.getRandomFireworkColor();
			this.particles = [];
			this.hasExploded = false;
			// Random upward velocity
			this.velocity = Math.random() * 2 + 3;
			// Trail for rocket effect - even shorter trail for better performance
			this.trail = [];
			// Maximum trail length - further reduced for performance
			const maxTrail = 3; // Reduced from 5
			for (let i = 0; i < maxTrail; i++) {
				this.trail.push({ x: this.x, y: this.y });
			}
			// Random explosion size - smaller explosions on desktop
			this.explosionSize = Math.random() * 0.4 + 0.7; // 0.7 to 1.1 scale factor (reduced)
			// Particle control factor
			this.particleFactor = particleFactor;
			// Simplified explosion types for better performance
			const types = ['circular', 'ring', 'starburst'];
			this.explosionType = types[Math.floor(Math.random() * types.length)];
		}

		getRandomFireworkColor() {
			const colors = [
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
			return colors[Math.floor(Math.random() * colors.length)];
		}

		update(particleFactor?: number) {
			// Update particle factor if provided
			if (particleFactor !== undefined) {
				this.particleFactor = particleFactor;
			}

			if (this.hasExploded) {
				// Update all particles
				for (let i = this.particles.length - 1; i >= 0; i--) {
					this.particles[i].update();

					// Remove dead particles
					if (this.particles[i].alpha <= 0) {
						// Recycle the particle
						recycleParticle(this.particles[i]);
						this.particles.splice(i, 1);
					}
				}

				// Return true if all particles are gone
				return this.particles.length === 0;
			} else {
				// Move rocket toward target
				this.y -= this.velocity;

				// Update trail
				this.trail.pop();
				this.trail.unshift({ x: this.x, y: this.y });

				// Check if rocket reached target
				if (this.y <= this.targetY) {
					this.explode();
				}

				return false;
			}
		}

		explode() {
			this.hasExploded = true;

			// Create particles based on explosion type
			switch (this.explosionType) {
				case 'circular':
					this.createCircularExplosion();
					break;
				case 'ring':
					this.createRingExplosion();
					break;
				case 'starburst':
					this.createStarburstExplosion();
					break;
				default:
					this.createCircularExplosion();
			}

			// Reduce chance of secondary explosions even more
			if (Math.random() < 0.1) {
				// Reduced from 0.2
				setTimeout(
					() => {
						this.createSecondaryExplosion();
					},
					Math.random() * 200 + 100 // Faster explosion timing
				);
			}
		}

		createSecondaryExplosion() {
			// Create smaller secondary explosion - further reduced particle count
			const count = Math.floor(Math.random() * 5 + 3); // Reduced from 10+5
			const color = this.getRandomFireworkColor();

			for (let i = 0; i < count; i++) {
				const angle = Math.random() * Math.PI * 2;
				const speed = Math.random() * 2 + 1;
				const vx = Math.cos(angle) * speed;
				const vy = Math.sin(angle) * speed;
				const size = Math.random() * 1.5 + 1;

				const particle = getParticle(
					this.targetX,
					this.targetY,
					vx,
					vy,
					size,
					color,
					Math.random() * 0.3 + 0.3, // Shorter life
					Math.random() < 0.1, // Reduced from 0.2
					true
				);

				this.particles.push(particle);
			}
		}

		createCircularExplosion() {
			// Standard circular explosion - further reduced particle count
			// Apply particleFactor to control particle count
			const baseCount = 15; // Reduced from 20
			const randomCount = 10; // Reduced from 20
			const particleCount = Math.floor(
				(Math.random() * randomCount + baseCount) * this.particleFactor
			);

			for (let i = 0; i < particleCount; i++) {
				// Random velocity in all directions
				const angle = Math.random() * Math.PI * 2;
				const speed = Math.random() * 4 + 1; // Reduced from 5+1
				const vx = Math.cos(angle) * speed * this.explosionSize;
				const vy = Math.sin(angle) * speed * this.explosionSize;

				// Random size for particles - smaller for performance
				const size = Math.random() * 2 + 1; // Reduced from 3+1

				// Create particle with random properties
				const particle = getParticle(
					this.targetX,
					this.targetY,
					vx,
					vy,
					size,
					this.color,
					Math.random() * 0.5 + 0.3, // Shorter lifespan
					Math.random() < 0.05, // Reduced from 0.1
					false
				);

				this.particles.push(particle);
			}
		}

		createRingExplosion() {
			// Creates a ring pattern - further reduced particle count
			// Apply particleFactor to control particle count
			const baseCount = 20; // Reduced from 25
			const randomCount = 10; // Reduced from 15
			const particleCount = Math.floor(
				(Math.random() * randomCount + baseCount) * this.particleFactor
			);
			const ringThickness = Math.random() * 0.3 + 0.3; // Reduced from 0.5+0.5

			for (let i = 0; i < particleCount; i++) {
				const angle = (i / particleCount) * Math.PI * 2;
				// All particles go at similar speeds for ring effect
				const variance = Math.random() * ringThickness;
				const speed = (3 + variance) * this.explosionSize; // Reduced from 4+variance
				const vx = Math.cos(angle) * speed;
				const vy = Math.sin(angle) * speed;

				const size = Math.random() * 2 + 1; // Reduced from 2.5+1.5

				const particle = getParticle(
					this.targetX,
					this.targetY,
					vx,
					vy,
					size,
					this.color,
					Math.random() * 0.4 + 0.4, // Shorter lifespan
					Math.random() < 0.05, // Reduced from 0.1
					false
				);

				this.particles.push(particle);
			}
		}

		createStarburstExplosion() {
			// Creates a star pattern with defined rays - further optimized
			const rayCount = Math.floor(Math.random() * 3) + 4; // Reduced from 4+6
			// Apply particleFactor to control particle count
			const maxParticlesPerRay = Math.floor((Math.random() * 2 + 4) * this.particleFactor); // Reduced from 3+5

			for (let ray = 0; ray < rayCount; ray++) {
				const rayAngle = (ray / rayCount) * Math.PI * 2;

				// Use particleFactor to determine how many particles per ray
				const particlesPerRay = Math.max(2, Math.floor(maxParticlesPerRay));

				for (let i = 0; i < particlesPerRay; i++) {
					// Particles go in similar directions for each ray
					const angleVariance = (Math.random() - 0.5) * 0.2; // Reduced from 0.3
					const angle = rayAngle + angleVariance;

					// Speed increases for particles further from center
					const speed = (1.5 + i * 0.4) * this.explosionSize; // Reduced from 2+i*0.5
					const vx = Math.cos(angle) * speed;
					const vy = Math.sin(angle) * speed;

					// Size decreases for particles further from center
					const size = Math.max(1, 2.5 - i * 0.2); // Reduced from 3-i*0.2

					const particle = getParticle(
						this.targetX,
						this.targetY,
						vx,
						vy,
						size,
						this.color,
						Math.random() * 0.2 + 0.5, // Shorter lifespan
						i === particlesPerRay - 1 && Math.random() < 0.5, // Only 50% chance for last particle to be a streamer
						false
					);

					this.particles.push(particle);
				}
			}
		}

		draw(ctx: CanvasRenderingContext2D, isDesktopView = false) {
			if (this.hasExploded) {
				// For desktop, we can skip drawing some particles for better performance
				const skipFactor = isDesktopView ? 2 : 1; // Draw every 2nd particle on desktop

				// Draw all particles
				for (let i = 0; i < this.particles.length; i += skipFactor) {
					this.particles[i].draw(ctx, isDesktopView);
				}
			} else {
				// Simplified rocket drawing for better performance
				ctx.beginPath();
				ctx.strokeStyle = this.color;
				ctx.lineWidth = 2;
				ctx.moveTo(this.x, this.y);

				// Draw trail with fading effect - even more simplified
				for (let i = 0; i < this.trail.length; i++) {
					// Skip some points on desktop for better performance
					if (isDesktopView && i % 2 === 1 && i > 0) continue;

					ctx.lineTo(this.trail[i].x, this.trail[i].y);
					// Fade out the line as it gets farther from the head
					ctx.globalAlpha = 1 - i / this.trail.length;
				}
				ctx.stroke();
				ctx.globalAlpha = 1;

				// Draw rocket head - simplified
				ctx.beginPath();
				ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); // Smaller radius
				ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
				ctx.fill();

				// Skip glow effect on desktop for better performance
				if (!isDesktopView) {
					ctx.beginPath();
					ctx.arc(this.x, this.y, 4, 0, Math.PI * 2); // Smaller glow radius
					ctx.fillStyle = 'rgba(255, 220, 180, 0.15)'; // More transparent
					ctx.fill();
				}
			}
		}
	}

	class Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		color: string;
		alpha: number;
		decay: number;
		isStreamer: boolean;
		isSecondary: boolean;
		canSplit: boolean;
		hasSplit: boolean;
		splitTime: number;
		gravity: number;
		rotation: number;
		rotationSpeed: number;

		constructor(
			x: number,
			y: number,
			vx: number,
			vy: number,
			size: number,
			color: string,
			lifespan: number,
			isStreamer: boolean,
			isSecondary: boolean = false,
			canSplit: boolean = false,
			gravity: number = 0.1
		) {
			this.x = x;
			this.y = y;
			this.vx = vx;
			this.vy = vy;
			this.size = size;
			this.color = color;
			this.alpha = 1;
			this.decay = 0.015 / lifespan; // Adjusted for longer life
			this.isStreamer = isStreamer;
			this.isSecondary = isSecondary;
			this.canSplit = canSplit;
			this.hasSplit = false;
			this.splitTime = Math.random() * 15 + 10; // Split after 10-25 frames
			this.gravity = gravity;
			this.rotation = Math.random() * Math.PI * 2;
			this.rotationSpeed = (Math.random() - 0.5) * 0.2;

			// Streamers have different properties
			if (this.isStreamer) {
				this.decay = this.decay * 0.4; // Even slower decay
				this.size = this.size * 1.5; // Larger size
			}

			// Secondary particles have different properties
			if (this.isSecondary) {
				this.decay = this.decay * 1.5; // Faster decay
			}
		}

		reset(
			x: number,
			y: number,
			vx: number,
			vy: number,
			size: number,
			color: string,
			lifespan: number,
			isStreamer: boolean,
			isSecondary: boolean = false,
			canSplit: boolean = false,
			gravity: number = 0.1
		) {
			this.x = x;
			this.y = y;
			this.vx = vx;
			this.vy = vy;
			this.size = size;
			this.color = color;
			this.alpha = 1;
			this.decay = 0.015 / lifespan;
			this.isStreamer = isStreamer;
			this.isSecondary = isSecondary;
			this.canSplit = canSplit;
			this.hasSplit = false;
			this.splitTime = Math.random() * 15 + 10;
			this.gravity = gravity;
			this.rotation = Math.random() * Math.PI * 2;
			this.rotationSpeed = (Math.random() - 0.5) * 0.2;

			if (this.isStreamer) {
				this.decay = this.decay * 0.4;
				this.size = this.size * 1.5;
			}

			if (this.isSecondary) {
				this.decay = this.decay * 1.5;
			}
		}

		update() {
			// Update position
			this.x += this.vx;
			this.y += this.vy;

			// Apply gravity to y velocity
			this.vy += this.gravity;

			// Slow down over time (more for streamers)
			this.vx *= this.isStreamer ? 0.98 : 0.99;
			this.vy *= this.isStreamer ? 0.98 : 0.99;

			// Update rotation
			this.rotation += this.rotationSpeed;

			// Check if particle should split
			if (this.canSplit && !this.hasSplit && this.splitTime-- <= 0) {
				this.hasSplit = true;
				this.split();
			}

			// Additional optimization: faster decay on desktop
			if (isDesktopView) {
				this.alpha -= this.decay * 1.25;
			} else {
				this.alpha -= this.decay;
			}

			// Ensure alpha doesn't go below 0
			if (this.alpha < 0) this.alpha = 0;
		}

		// Updated to handle desktop optimization
		draw(ctx: CanvasRenderingContext2D, isDesktopView = false) {
			// Skip drawing if particle is invisible
			if (this.alpha <= 0) return;

			// Set global alpha for transparency
			ctx.globalAlpha = this.alpha;

			// Draw particle
			ctx.beginPath();

			// Streamers get a different shape
			if (this.isStreamer) {
				// Extremely simplified streamer drawing for better performance
				ctx.save();
				ctx.translate(this.x, this.y);

				// Skip rotation calculation for better performance on desktop
				if (!isDesktopView) {
					const angle = Math.atan2(this.vy, this.vx);
					ctx.rotate(angle);
				}

				// Simplified streamer shape
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(-this.size * 3, 0); // Shorter streamer

				// Skip additional shape complexity on desktop
				if (!isDesktopView) {
					ctx.lineTo(-this.size * 3, -this.size * 0.2);
					ctx.lineTo(-this.size * 3, this.size * 0.2);
					ctx.closePath();
				}

				ctx.fillStyle = this.color;
				ctx.fill();

				ctx.restore();
			} else {
				// Regular particles as simple circles
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

				// Skip all glow effects on desktop
				if (!isDesktopView && this.alpha > 0.7 && this.size > 2) {
					ctx.shadowColor = this.color;
					ctx.shadowBlur = 2; // Further reduced from 3
				}

				ctx.fillStyle = this.color;
				ctx.fill();

				// Always reset shadow blur for consistent rendering
				if (ctx.shadowBlur) {
					ctx.shadowBlur = 0;
				}
			}

			// Reset global alpha
			ctx.globalAlpha = 1;
		}

		// Optimize the split method to create fewer particles
		split() {
			// Skip splitting entirely on desktop
			if (isDesktopView) return;

			// Original split implementation with reduced particle count
			if (!fireworksCtx) return;

			const canvas = fireworksCtx.canvas;
			// Only split if we're on screen
			if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) return;

			// Find the parent firework to add child particles to
			const fireworksSequenceFunc = (window as any).latestFireworksSequence;
			if (!fireworksSequenceFunc) return;

			const parentFireworks = fireworksSequenceFunc();
			if (!parentFireworks || !parentFireworks.length) return;

			// Add to the first active firework
			const parentFirework = parentFireworks[0];

			// Additional safety check to ensure parentFirework is defined before using it
			if (!parentFirework) return;

			// Further reduced from 3 to just 2 child particles
			for (let i = 0; i < 2; i++) {
				const angle = (i / 2) * Math.PI * 2 + Math.random() * 0.5;
				const speed = Math.random() * 1.5 + 0.5; // Reduced speed
				const vx = Math.cos(angle) * speed;
				const vy = Math.sin(angle) * speed;

				const childParticle = getParticle(
					this.x,
					this.y,
					vx,
					vy,
					this.size * 0.5, // Smaller child particles
					this.color,
					Math.random() * 0.2 + 0.1, // Even shorter life
					i === 0, // Only first particle is a streamer
					true
				);

				parentFirework.particles.push(childParticle);
			}
		}
	}

	// Preload key assets and initialize
	function preloadAssets() {
		// Skip preloading if already done
		if (preloaded) return;
		preloaded = true;

		// Preload profile image for faster rendering
		const profileImg = new Image();
		profileImg.src = '/images/me.jpg';

		// Preload background image if any
		const bgImg = new Image();
		bgImg.src = '/images/hometown.jpg';

		// Use simpler animation on desktop or if device has low performance
		if (window.innerWidth >= 1024) {
			// Desktop devices often struggle with Canvas animations
			lowQualityMode = true;
		}

		// Check for battery level if possible
		if ('getBattery' in navigator) {
			(navigator as any)
				.getBattery()
				.then((battery: any) => {
					// If battery level is below 20% or not charging, use low quality mode
					if (battery && battery.level < 0.2 && !battery.charging) {
						lowQualityMode = true;
					}
				})
				.catch(() => {
					// If we can't get battery info, default to safer option
					console.log('Could not access battery info');
				});
		}

		// Check if user prefers reduced motion
		if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			lowQualityMode = true;
		}

		// Test for GPU performance
		try {
			// Create a test canvas for performance check
			const canvas = document.createElement('canvas');
			canvas.width = 100;
			canvas.height = 100;
			const ctx = canvas.getContext('2d');

			if (ctx) {
				const startTime = performance.now();
				let totalDraws = 0;

				// Draw multiple shapes to test performance
				for (let i = 0; i < 1000; i++) {
					ctx.beginPath();
					ctx.arc(50, 50, 30, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
					ctx.fill();
					totalDraws++;

					// If drawing is taking too long, exit early and use low quality mode
					if (performance.now() - startTime > 50) {
						lowQualityMode = true;
						console.log('Low GPU performance detected, using low quality mode');
						break;
					}
				}

				// Clean up
				ctx.clearRect(0, 0, 100, 100);
			}
		} catch (error) {
			console.error('Performance test error:', error);
			// Default to low quality on error
			lowQualityMode = true;
		}

		console.log('Using low quality mode:', lowQualityMode);

		// Skip animation and show content directly if using low quality mode
		if (lowQualityMode) {
			useSimpleAnimation = true;
		}

		// After preloading, initialize the animation
		if (animationsReady && !animationStarted) {
			initializeAnimation();
		}
	}

	// Initialize animation based on device capability
	function initializeAnimation() {
		if (animationStarted) return;
		animationStarted = true;

		if (useSimpleAnimation) {
			// Use simple gradient animation instead of fireworks
			initGradientAnimation();
		} else {
			// Use optimized fireworks for capable devices
			startFireworksSequence();
		}
	}

	// Simple gradient animation for low-end devices
	function initGradientAnimation() {
		if (!gradientCanvas || !gradientCtx) return;

		// Set canvas to full size
		gradientCanvas.width = gradientCanvas.offsetWidth;
		gradientCanvas.height = gradientCanvas.offsetHeight;

		// Colors for gradient (simplified palette)
		const colors = [
			'#3b82f6', // Blue
			'#8b5cf6', // Purple
			'#ec4899', // Pink
			'#f59e0b' // Amber
		];

		let startTime = performance.now();
		let animationDuration = 3000; // Animation lasts for 3 seconds

		function drawGradient(timestamp: number) {
			const elapsed = timestamp - startTime;
			const progress = Math.min(elapsed / animationDuration, 1);

			// Clear canvas
			gradientCtx!.clearRect(0, 0, gradientCanvas.width, gradientCanvas.height);

			// Create gradient
			const centerX = gradientCanvas.width / 2;
			const centerY = gradientCanvas.height / 2 - 50; // Offset slightly upward

			// Radius grows with progress
			const radius = (gradientCanvas.width / 2) * progress;

			// Create radial gradient
			const gradient = gradientCtx!.createRadialGradient(
				centerX,
				centerY,
				0,
				centerX,
				centerY,
				radius
			);

			// Add color stops
			gradient.addColorStop(0, colors[0]);
			gradient.addColorStop(0.3, colors[1]);
			gradient.addColorStop(0.6, colors[2]);
			gradient.addColorStop(1, 'rgba(0,0,0,0)'); // Fade to transparent

			// Fill with gradient
			gradientCtx!.fillStyle = gradient;
			gradientCtx!.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);

			// Add some particles for visual interest
			if (progress > 0.2) {
				const particleCount = Math.floor(10 * progress);

				for (let i = 0; i < particleCount; i++) {
					const x = centerX + (Math.random() - 0.5) * radius * 2;
					const y = centerY + (Math.random() - 0.5) * radius * 2;
					const size = Math.random() * 3 + 1;

					gradientCtx!.beginPath();
					gradientCtx!.arc(x, y, size, 0, Math.PI * 2);
					gradientCtx!.fillStyle = colors[Math.floor(Math.random() * colors.length)];
					gradientCtx!.globalAlpha = 0.7 * (1 - progress);
					gradientCtx!.fill();
					gradientCtx!.globalAlpha = 1;
				}
			}

			// Continue animation if not complete
			if (progress < 1) {
				requestAnimationFrame(drawGradient);
			} else {
				// Fade out
				let opacity = 1;
				function fadeOut() {
					opacity -= 0.05;
					gradientCanvas.style.opacity = opacity.toString();

					if (opacity <= 0) {
						gradientCanvas.style.display = 'none';

						// Show content
						contentReady = true;
						revealContent();
					} else {
						requestAnimationFrame(fadeOut);
					}
				}

				// Start fade out after a brief pause
				setTimeout(fadeOut, 500);
			}
		}

		// Start animation
		requestAnimationFrame(drawGradient);
	}

	// Choreographed fireworks sequences (heavily modified for performance)
	function startFireworksSequence() {
		if (!fireworksCtx) return;

		// Skip fireworks on low-quality mode
		if (lowQualityMode) {
			skipFireworksAndShowContent();
			return;
		}

		// Check browser and device capabilities
		// Check if we're on desktop (likely larger screen)
		isDesktopView = window.innerWidth >= 1024;

		// Try to detect performance level more accurately
		const performanceLevel = detectPerformanceLevel();
		const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

		// Set render scale based on performance level (lower = better performance but lower quality)
		renderScale = isDesktopView
			? performanceLevel === 'low'
				? 0.4
				: 0.6 // Even lower for desktop
			: performanceLevel === 'low'
				? 0.5
				: 0.8;

		// Disable fireworks entirely on very low-end devices
		if (
			performanceLevel === 'very-low' ||
			(isSafari && performanceLevel === 'low') ||
			(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
		) {
			skipFireworksAndShowContent();
			return;
		}

		// Setup offscreen canvas for better performance
		setupOffscreenCanvas();

		// Clear any existing animation
		if (fireworksAnimationId) {
			cancelAnimationFrame(fireworksAnimationId);
		}

		// Get canvas dimensions
		const width = fireworksCanvas.width;
		const height = fireworksCanvas.height;

		// Array to store active fireworks
		const fireworks: Firework[] = [];

		// Make fireworks accessible to particle split function
		(window as any).latestFireworksSequence = () => {
			// Return a copy of the array to prevent modification issues
			// and ensure we always return at least an empty array
			return fireworks ? [...fireworks] : [];
		};

		// Track time for fireworks scheduling
		let startTime = performance.now();

		// Even more reduced fireworks sequence
		const fireworksSequence = [
			// Just two bursts for all devices
			{ time: 500, startX: width * 0.5, targetX: width * 0.5, targetY: height * 0.4 },
			{ time: 1800, startX: width * 0.5, targetX: width * 0.5, targetY: height * 0.3 }
		];

		// Add one more burst for high-performance devices
		if (performanceLevel === 'high' && !isDesktopView) {
			fireworksSequence.push({
				time: 3000,
				startX: width * 0.5,
				targetX: width * 0.5,
				targetY: height * 0.25
			});
		}

		let sequenceIndex = 0;
		// Even more aggressive particle reduction
		let adaptiveParticleFactor = isDesktopView ? 0.4 : performanceLevel === 'low' ? 0.6 : 0.8;

		// Batch rendering variables with more aggressive batching
		let lastBatchTime = 0;
		const batchInterval = isDesktopView ? 3 : performanceLevel === 'low' ? 2 : 1; // Render less frequently

		// Use a faster animation overall
		const animationSpeedFactor = isDesktopView ? 1.5 : performanceLevel === 'low' ? 1.3 : 1.0;

		// Animation loop with further optimizations
		function animate(timestamp: number) {
			// Calculate FPS and apply timeScale to speed up animation
			const timeElapsed = timestamp - (lastFrameTime || timestamp);
			const adjustedElapsed = timeElapsed * animationSpeedFactor;

			lastFrameTime = timestamp;

			// Use batch rendering - only render every X frames based on performance
			const shouldRender = timestamp - lastBatchTime >= batchInterval;

			if (shouldRender) {
				lastBatchTime = timestamp;

				// Use offscreen canvas if available
				const ctx = offscreenCtx || fireworksCtx;
				const targetWidth = offscreenCanvas ? offscreenCanvas.width : fireworksCanvas?.width || 0;
				const targetHeight = offscreenCanvas
					? offscreenCanvas.height
					: fireworksCanvas?.height || 0;

				if (ctx) {
					// Clear canvas with faster method
					ctx.clearRect(0, 0, targetWidth, targetHeight);

					// Much lighter background
					ctx.fillStyle = 'rgba(26, 32, 44, 0.03)';
					ctx.fillRect(0, 0, targetWidth, targetHeight);

					// Set composite operation for better performance
					ctx.globalCompositeOperation = 'lighter';
				}
			}

			// Current time since start
			const currentTime = (performance.now() - startTime) * animationSpeedFactor;

			// Add new fireworks based on sequence
			while (
				sequenceIndex < fireworksSequence.length &&
				currentTime >= fireworksSequence[sequenceIndex].time
			) {
				const sequence = fireworksSequence[sequenceIndex];

				// Create firework with adaptiveParticleFactor to control explosion size
				const fw = new Firework(
					sequence.startX,
					sequence.targetX,
					sequence.targetY,
					adaptiveParticleFactor
				);
				fireworks.push(fw);
				sequenceIndex++;
			}

			// Update and draw fireworks - super optimized with minimal draws
			for (let i = fireworks.length - 1; i >= 0; i--) {
				// Skip non-existent fireworks
				if (!fireworks[i]) continue;

				// Only draw if we're rendering this frame
				if (shouldRender) {
					// Draw the firework with optimized drawing
					fireworks[i].draw(offscreenCtx || fireworksCtx!, isDesktopView);
				}

				// Update with adjusted time
				const isDone = fireworks[i].update(adaptiveParticleFactor);

				// Remove finished fireworks
				if (isDone) {
					fireworks.splice(i, 1);
				}
			}

			// Copy from offscreen canvas if used
			if (shouldRender && offscreenCtx && fireworksCtx) {
				fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
				// Fast image drawing with disabled smoothing for better performance
				fireworksCtx.imageSmoothingEnabled = false;
				fireworksCtx.drawImage(
					offscreenCanvas!,
					0,
					0,
					offscreenCanvas!.width,
					offscreenCanvas!.height,
					0,
					0,
					fireworksCanvas.width,
					fireworksCanvas.height
				);

				// Reset composite operation
				if (offscreenCtx) {
					offscreenCtx.globalCompositeOperation = 'source-over';
				}
			}

			// Show content much earlier
			const revealTime = 2000; // Show content after 2 seconds in all cases
			if (
				(sequenceIndex >= fireworksSequence.length && !contentReady) ||
				currentTime > revealTime
			) {
				contentReady = true;
				revealContent();
			}

			// Continue animation if there are active fireworks or sequence isn't complete
			if (fireworks.length > 0 || sequenceIndex < fireworksSequence.length) {
				fireworksAnimationId = requestAnimationFrame(animate);
			} else {
				// Fade out canvas when complete - even faster
				const fadeCanvas = () => {
					let opacity = parseFloat(fireworksCanvas.style.opacity || '1');
					opacity -= 0.1; // Faster fade out

					if (opacity <= 0) {
						fireworksCanvas.style.opacity = '0';
						fireworksCanvas.style.display = 'none';

						// Clean up resources
						if (offscreenCanvas) {
							offscreenCanvas.width = 1;
							offscreenCanvas.height = 1;
							offscreenCanvas = null;
							offscreenCtx = null;
						}
						return;
					}

					fireworksCanvas.style.opacity = opacity.toString();
					requestAnimationFrame(fadeCanvas);
				};

				// Start fade out sooner
				fadeCanvas();
			}
		}

		// Start animation
		fireworksAnimationId = requestAnimationFrame(animate);
	}

	// Setup canvas and start animation when component is mounted
	onMount(() => {
		// Mark animations as ready
		animationsReady = true;
		
		// Setup copy email functionality
		setupCopyEmailFunctionality();

		// Create the observers here (only in browser environment)
		const aboutObserver = createAboutObserver();
		const testimonialObserver = createTestimonialObserver();

		// Setup gradientCanvas for simple animation
		if (gradientCanvas) {
			gradientCtx = gradientCanvas.getContext('2d');
		}

		// Setup canvas and resize function
		let resizeCanvas: () => void;

		if (fireworksCanvas) {
			fireworksCtx = fireworksCanvas.getContext('2d', {
				alpha: true,
				desynchronized: true, // Hint for potential rendering optimization
				willReadFrequently: false // Hint that we won't read back pixel data
			});

			// Set canvas size to match container
			resizeCanvas = () => {
				if (heroSection) {
					fireworksCanvas.width = heroSection.offsetWidth;
					fireworksCanvas.height = heroSection.offsetHeight;
				}
			};

			// Initial resize
			resizeCanvas();

			// Handle window resize
			window.addEventListener('resize', resizeCanvas);
		}

		// Preload assets, then start animation with a slight delay
		preloadAssets();
		
		// Add window resize handler to fix any stuck skill tag animations
		const resetSkillTagsOnResize = () => {
			const skillTags = document.querySelectorAll('.skill-tag');
			skillTags.forEach(tag => {
				const element = tag as HTMLElement;
				// Reset transform but preserve the animation
				element.style.transform = ''; // This allows the CSS animation to take over
				
				// Ensure animations can still run
				element.style.animationPlayState = 'running';
			});
		};
		window.addEventListener('resize', resetSkillTagsOnResize);
		
		// Set up observers for scroll animations after DOM elements are available
		if (aboutSection) {
			aboutObserver.observe(aboutSection);
		}

		if (testimonialSection) {
			testimonialObserver.observe(testimonialSection);
		} else {
			// If for some reason the section isn't available, make testimonials visible
			ensureTestimonialsVisible();
		}

		// CTA section animation when scrolled to
		const ctaObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						try {
							animate(
								'.cta-element',
								{
									opacity: [0, 1],
									y: [20, 0],
									scale: [0.9, 1.05, 1]
								},
								{
									delay: stagger(0.2),
									duration: 0.8,
									easing: 'cubic-bezier(0.22, 1.5, 0.36, 1)'
								}
							);
						} catch (error) {
							console.error('CTA animation error:', error);
							// Ensure CTA elements are visible if animation fails
							document.querySelectorAll('.cta-element').forEach((el) => {
								(el as HTMLElement).style.opacity = '1';
								(el as HTMLElement).style.transform = 'translateY(0) scale(1)';
							});
						}
					}
				});
			},
			{ threshold: 0.2 }
		);

		if (ctaSection) {
			ctaObserver.observe(ctaSection);
		}

		// Ensure testimonials are visible after a delay regardless of scroll position
		// This serves as a fallback for page navigation scenarios
		setTimeout(ensureTestimonialsVisible, 2000);
		
		// Clean up on component unmount
		return () => {
			if (fireworksAnimationId) {
				cancelAnimationFrame(fireworksAnimationId);
			}
			if (resizeCanvas) {
				window.removeEventListener('resize', resizeCanvas);
			}
			
			// Remove skill tags resize listener
			window.removeEventListener('resize', resetSkillTagsOnResize);

			// Disconnect observers
			aboutObserver.disconnect();
			testimonialObserver.disconnect();
		};
	});

	// Helper function to detect performance level
	function detectPerformanceLevel(): 'high' | 'medium' | 'low' | 'very-low' {
		// Check for obvious low-end indicators
		const memory = (navigator as any).deviceMemory;
		const cores = navigator.hardwareConcurrency || 0;
		const isLowPowerMode =
			'getBattery' in navigator &&
			(navigator as any).getBattery &&
			(navigator as any).getBattery().then((b: any) => b.charging);
		const isReducedMotion =
			window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// Basic heuristics for performance level
		if (isReducedMotion) {
			return 'very-low';
		}

		if (memory && memory <= 2) {
			return 'low';
		}

		if (cores <= 2) {
			return 'low';
		}

		if (memory && memory <= 4 && cores <= 4) {
			return 'medium';
		}

		if (isLowPowerMode) {
			return 'low';
		}

		// Mobile detection
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
		if (isMobile) {
			return cores <= 4 ? 'low' : 'medium';
		}

		// Default to high for modern desktops
		return 'high';
	}

	// Setup offscreen canvas for better performance
	function setupOffscreenCanvas() {
		// Skip if already set up or disabled
		if (offscreenCanvas || !fireworksCanvas) return;

		try {
			offscreenCanvas = document.createElement('canvas');

			// Use smaller dimensions for better performance
			offscreenCanvas.width = Math.floor(fireworksCanvas.width * renderScale);
			offscreenCanvas.height = Math.floor(fireworksCanvas.height * renderScale);

			offscreenCtx = offscreenCanvas.getContext('2d', { alpha: true });

			// Optimize the context
			if (offscreenCtx) {
				// Disable image smoothing for better performance
				offscreenCtx.imageSmoothingEnabled = false;
			}
		} catch (e) {
			console.error('Failed to create offscreen canvas:', e);
			offscreenCanvas = null;
			offscreenCtx = null;
		}
	}

	// Skip fireworks and show content directly
	function skipFireworksAndShowContent() {
		if (fireworksCanvas) {
			fireworksCanvas.style.display = 'none';
		}

		if (fireworksAnimationId) {
			cancelAnimationFrame(fireworksAnimationId);
			fireworksAnimationId = 0;
		}

		// Show content immediately
		contentReady = true;
		setTimeout(revealContent, 100);
	}

	// Function to reveal content after fireworks
	function revealContent() {
		console.log('Revealing content');

		// Hero elements animation
		try {
			const heroElements = document.querySelectorAll('.hero-element');
			if (heroElements.length > 0) {
				animate(
					'.hero-element',
					{
						opacity: [0, 1],
						y: [50, 0],
						scale: [0.9, 1]
					},
					{
						delay: stagger(0.2),
						duration: 1.0
					}
				);
			}
		} catch (error) {
			console.error('Hero animation error:', error);
			document.querySelectorAll('.hero-element').forEach((el) => {
				(el as HTMLElement).style.opacity = '1';
			});
		}

		// Skills animation with shorter delay
		setTimeout(() => {
			try {
				const skillTags = document.querySelectorAll('.skill-tag');
				if (skillTags.length > 0) {
					// Set the animation delays for floating effect - should happen regardless of initial animation
					skillTags.forEach((tag, index) => {
						// Circular index for center-out staggering
						const centerIndex = Math.floor(skillTags.length / 2);
						const distanceFromCenter = Math.abs(index - centerIndex);
						const normalizedDelay = distanceFromCenter / skillTags.length;
						(tag as HTMLElement).style.setProperty('--index', normalizedDelay.toString());
					});
				
					// Initial reveal animation
					animate(
						'.skill-tag',
						{
							opacity: [0, 1],
							scale: [0.85, 1],
							y: [15, 0]
						},
						{
							delay: stagger(0.025, { from: 'center' }),
							duration: 0.4,
							easing: 'ease-out'
						}
					);

					// Add a safety cleanup to ensure all skills are properly positioned
					setTimeout(() => {
						document.querySelectorAll('.skill-tag').forEach(el => {
							const element = el as HTMLElement;
							// Reset any stuck animations from the initial reveal
							// But keep the CSS animation running
							element.style.opacity = '1';
							element.style.transform = ''; // This allows the CSS animation to take over
						});
					}, 1500);
				}
			} catch (error) {
				console.error('Skill tag animation error:', error);
				document.querySelectorAll('.skill-tag').forEach((el) => {
					(el as HTMLElement).style.opacity = '1';
					(el as HTMLElement).style.transform = '';
				});
			}
		}, 600);

		// Buttons animation
		setTimeout(() => {
			try {
				const heroButtons = document.querySelectorAll('.hero-button');
				if (heroButtons.length > 0) {
					animate(
						'.hero-button',
						{
							opacity: [0, 1],
							x: ['-50px', '0px'],
							scale: [0.8, 1]
						},
						{
							delay: stagger(0.2),
							duration: 0.8
						}
					);
				}
			} catch (error) {
				console.error('Button animation error:', error);
				document.querySelectorAll('.hero-button').forEach((el) => {
					(el as HTMLElement).style.opacity = '1';
				});
			}
		}, 800);

		// Ensure testimonials are visible even if animation hasn't run yet
		ensureTestimonialsVisible();
	}

	// Function to make sure testimonials are visible
	function ensureTestimonialsVisible() {
		document.querySelectorAll('.testimonial-card').forEach((el) => {
			(el as HTMLElement).style.opacity = '1';
		});
		testimonialAnimated = true;
	}

	// Create observer factories to use in onMount
	function createAboutObserver() {
		return new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isAnimated && aboutSection) {
						isAnimated = true;

						try {
							// More dynamic animation for section elements
							animate(
								'.about-element',
								{
									opacity: [0, 1],
									x: [-40, 0],
									scale: [0.95, 1]
								},
								{
									delay: stagger(0.2, { start: 0.1 }),
									duration: 0.8,
									easing: (x) => {
										try {
											// Safely call spring with fallback
											return spring({ stiffness: 100, damping: 15 })(x) || x;
										} catch (error) {
											console.error('Spring animation error:', error);
											// Fallback to a simple cubic bezier easing
											return 0.34 * (1 - Math.cos(Math.PI * x));
										}
									}
								}
							);

							// Add animation for the card too
							animate(
								'.about-section-card',
								{
									opacity: [0.7, 1],
									scale: [0.98, 1],
									y: [20, 0]
								},
								{
									duration: 0.9,
									easing: (x) => {
										try {
											// Safely call spring with fallback
											return spring({ stiffness: 50, damping: 15 })(x) || x;
										} catch (error) {
											console.error('Spring animation error:', error);
											// Fallback to a simple cubic bezier easing
											return 0.34 * (1 - Math.cos(Math.PI * x));
										}
									}
								}
							);
						} catch (error) {
							console.error('About section animation error:', error);
							document.querySelectorAll('.about-element, .about-section-card').forEach((el) => {
								(el as HTMLElement).style.opacity = '1';
							});
						}
					}
				});
			},
			{ threshold: 0.1, rootMargin: '-50px' }
		);
	}

	function createTestimonialObserver() {
		return new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !testimonialAnimated && testimonialSection) {
						testimonialAnimated = true;
						try {
							animate(
								'.testimonial-card',
								{
									opacity: [0, 1],
									y: [60, 0],
									scale: [0.9, 1]
								},
								{
									delay: stagger(0.25),
									duration: 0.8,
									easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
								}
							);

							// Add gentle pulse after appearing
							setTimeout(() => {
								const cards = document.querySelectorAll('.testimonial-card');
								if (cards && cards.length > 0) {
									cards.forEach((card, i) => {
										animate(
											card,
											{
												scale: [1, 1.02, 1],
												boxShadow: [
													'0 4px 6px -1px rgba(0, 0, 0, 0.1)',
													'0 15px 25px -5px rgba(0, 0, 0, 0.3)',
													'0 4px 6px -1px rgba(0, 0, 0, 0.1)'
												]
											},
											{
												duration: 4 + i,
												delay: i * 1.5,
												repeat: Infinity,
												easing: 'ease-in-out'
											}
										);
									});
								}
							}, 1500);
						} catch (error) {
							console.error('Testimonial animation error:', error);
							ensureTestimonialsVisible();
						}
					} else if (!testimonialAnimated) {
						// If not intersecting but not yet animated, make sure they're visible anyway
						// This helps when navigating back to the page
						ensureTestimonialsVisible();
					}
				});
			},
			{ threshold: 0.1, rootMargin: '-50px' }
		);
	}

	// Function to setup copy email functionality
	function setupCopyEmailFunctionality() {
		document.querySelectorAll('.copy-email-btn').forEach((btn) => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				// Cast btn to HTMLElement at the beginning to fix all TypeScript errors
				const htmlBtn = btn as HTMLElement;
				const emailAddress = 'szuhan.eng@gmail.com';
				navigator.clipboard
					.writeText(emailAddress)
					.then(() => {
						// Show success message in tooltip
						const tooltip = htmlBtn.querySelector('.copy-tooltip') as HTMLElement;
						if (tooltip) {
							tooltip.textContent = 'Email copied!';
							tooltip.classList.add('tooltip-visible');

							// Create and display success animation elements

							// 1. Create ripple effect
							const ripple = document.createElement('span');
							ripple.className = 'copy-ripple';
							htmlBtn.appendChild(ripple);

							// 2. Add animation class to button
							htmlBtn.classList.add('copy-success-pulse');

							// 3. Handle text content change for Contact Me buttons
							const hasButtonText = htmlBtn.childNodes.length > 0 && 
								Array.from(htmlBtn.childNodes).some(node => 
									node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== '');
							
							if (hasButtonText) {
								// Save original text by looking for direct text nodes
								const textNodes = Array.from(htmlBtn.childNodes)
									.filter(node => node.nodeType === Node.TEXT_NODE);
								
								if (textNodes.length > 0) {
									const originalText = textNodes[0].textContent?.trim() || '';
									htmlBtn.dataset.originalText = originalText;
									
									// Create a wrapper with just text that won't change button dimensions
									const successContent = document.createElement('div');
									successContent.className = 'copy-success-content';
									// Simplified to just show text without the checkmark icon
									successContent.innerHTML = `<span class="success-text">Email Copied!</span>`;
									
									// Clear text nodes and add our wrapper
									textNodes.forEach(node => node.textContent = '');
									// Append the success content to the first text node's parent
									if (textNodes[0].parentNode) {
										textNodes[0].parentNode.insertBefore(successContent, textNodes[0]);
									}
								}
							} else {
								// For icon-only buttons, create and add a temporary success label
								const successLabel = document.createElement('span');
								successLabel.className = 'copy-success-label';
								successLabel.textContent = 'Copied!';
								htmlBtn.appendChild(successLabel);

								// Make sure the original SVG icon stays visible
								const svgIcon = htmlBtn.querySelector('svg');
								if (svgIcon) svgIcon.style.opacity = '1';
							}

							// Clean up elements after animations complete
							setTimeout(() => {
								ripple.remove();
								htmlBtn.classList.remove('copy-success-pulse');

								// Remove success content and restore original text
								if (htmlBtn.dataset.originalText) {
									const successContent = htmlBtn.querySelector('.copy-success-content');
									if (successContent) {
										successContent.remove();
									}
								
									// Restore the original text in the first text node
									const textNodes = Array.from(htmlBtn.childNodes)
										.filter(node => node.nodeType === Node.TEXT_NODE);
									
									if (textNodes.length > 0) {
										textNodes[0].textContent = htmlBtn.dataset.originalText || '';
									} else {
										// If there are no text nodes, create one
										htmlBtn.appendChild(document.createTextNode(htmlBtn.dataset.originalText || ''));
									}
									
									delete htmlBtn.dataset.originalText;
								}

								// Remove success label if it was added
								const successLabel = htmlBtn.querySelector('.copy-success-label');
								if (successLabel) successLabel.remove();

								tooltip.textContent = 'Copy email address';
								tooltip.classList.remove('tooltip-visible');
							}, 2000);
						}
					})
					.catch((err) => {
						console.error('Failed to copy email: ', err);
					});
			});

			// Show tooltip on hover
			btn.addEventListener('mouseenter', () => {
				const htmlBtn = btn as HTMLElement;
				const tooltip = htmlBtn.querySelector('.copy-tooltip') as HTMLElement;
				if (tooltip) {
					tooltip.classList.add('tooltip-visible');
				}
			});

			// Hide tooltip on mouse leave
			btn.addEventListener('mouseleave', () => {
				const htmlBtn = btn as HTMLElement;
				const tooltip = htmlBtn.querySelector('.copy-tooltip') as HTMLElement;
				if (tooltip && tooltip.textContent !== 'Email copied!') {
					tooltip.classList.remove('tooltip-visible');
				}
			});
		});
	}
</script>

<svelte:head>
	<title>Hank - Portfolio</title>
	<meta
		name="description"
		content="I help businesses turn complex ideas into high-performing, user-friendly digital solutions—so you can focus on growth instead of tech headaches."
	/>
	<!-- Open Graph / Social Media Meta Tags -->
	<meta property="og:title" content="Hank aka Szu-Han Chou - Portfolio" />
	<meta
		property="og:description"
		content="I help businesses turn complex ideas into high-performing, user-friendly digital solutions—so you can focus on growth instead of tech headaches."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://hankchou.me" />
	<meta property="og:image" content="https://hankchou.me/images/hank-social.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Hank Chou - AI-Powered Software Engineering" />
	<meta property="og:site_name" content="Hank Chou" />

	<!-- Twitter Card data -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Hank aka Szu-Han Chou - Portfolio" />
	<meta
		name="twitter:description"
		content="I help businesses turn complex ideas into high-performing, user-friendly digital solutions—so you can focus on growth instead of tech headaches."
	/>
	<meta name="twitter:image" content="https://hankchou.me/images/hank-social.png" />
</svelte:head>

<section class="perspective relative bg-[#1A202C] py-12 text-gray-100" bind:this={heroSection}>
	<!-- Canvas for fireworks -->
	<canvas class="fireworks-canvas" bind:this={fireworksCanvas}></canvas>

	<!-- Canvas for simple gradient animation -->
	<canvas class="gradient-canvas" bind:this={gradientCanvas}></canvas>

	<div class="container mx-auto px-4">
		<div class="flex flex-col items-center">
			<!-- Profile image added here -->
			<div
				class="hero-element animate-ready mb-6 overflow-hidden rounded-full border-4 border-blue-400 shadow-lg shadow-blue-500/20 transition-transform duration-300 hover:scale-105"
			>
				<img
					src="/images/me.jpg"
					alt="Hank Chou"
					class="object-position-y-top h-40 w-40 object-cover"
					style="object-position: 20% 10%;"
					loading="eager"
				/>
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

				<!-- Contact buttons under name -->
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
						class="copy-email-btn group relative flex items-center justify-center rounded-lg bg-purple-700 p-3 text-white shadow-lg transition-all hover:bg-purple-600"
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

			<!-- Increased margins for skills section to prevent overlap and added overflow container -->
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

			<!-- Added more top margin to the buttons section -->
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

<section class="perspective bg-[#1E2433] py-12 text-gray-100" bind:this={aboutSection}>
	<div class="container mx-auto px-4">
		<h2 class="about-element animate-ready mb-8 text-center text-3xl font-bold text-blue-400">
			About Me
		</h2>

		<div
			class="about-section-card rounded-xl border border-gray-700 bg-[#1A202C] p-8 shadow-lg transition-all duration-300 hover:border-gray-600 hover:shadow-xl hover:shadow-blue-900/20"
		>
			<div class="flex flex-col gap-6">
				<div
					class="about-element animate-ready transition-transform duration-300 hover:translate-y-[-2px]"
				>
					<h3 class="mb-2 text-xl font-semibold text-blue-300">My Background</h3>
					<p class="mb-6 text-gray-200">
						Hey there! I'm a full-stack dev who loves building user-friendly software that actually
						solves problems. I'm originally from Taipei (that's the beautiful city in the photo!),
						but I've been living in New Zealand and working with multi-national startups for over 7
						years now. My journey between these cultures has sparked my love for connecting
						technology with vibrant communities. My technical toolkit includes <span
							class="font-bold transition-colors duration-300 hover:text-blue-300">Python</span
						>
						and
						<span class="font-bold transition-colors duration-300 hover:text-blue-300"
							>TypeScript</span
						>. I enjoy collaboration and believe in making tech accessible to everyone, so don't
						hesitate to reach out if you want to chat about a project or just talk tech!
					</p>

					<div
						class="mx-auto max-w-md overflow-hidden rounded-lg border-2 border-gray-700 shadow-lg transition-transform duration-300 hover:scale-105"
					>
						<img
							src="/images/hometown.jpg"
							alt="Taipei City - My Hometown"
							class="w-full object-cover"
						/>
						<div class="bg-[#1A202C]/80 p-2 text-center text-sm text-blue-300">
							Taipei - Where I'm From
						</div>
					</div>
				</div>

				<div
					class="about-element animate-ready transition-transform duration-300 hover:translate-y-[-2px]"
				>
					<h3 class="mb-2 text-xl font-semibold text-blue-300">Education & Experience</h3>
					<p class="text-gray-200">
						I've been fortunate to study at Auckland University of Technology (Postgraduate
						Certificate in Computer & Information Sciences) and Wellington Technology Institute
						(Graduate Diploma in IT), along with my Bachelor of Engineering background. I've had a
						blast working with amazing teams at <a
							href="https://octopus.energy/"
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-pink-300 transition-colors duration-300 hover:text-pink-200 hover:underline"
							>Octopus Energy</a
						>,
						<a
							href="https://sharesies.com.au/"
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-pink-300 transition-colors duration-300 hover:text-pink-200 hover:underline"
							>Sharesies</a
						>,
						<a
							href="https://www.generatezero.com/"
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-pink-300 transition-colors duration-300 hover:text-pink-200 hover:underline"
							>GenerateZero</a
						>, and
						<a
							href="https://www.taggun.io"
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-pink-300 transition-colors duration-300 hover:text-pink-200 hover:underline"
							>Taggun</a
						>. One of my proudest achievements was helping
						<a
							href="https://thegoodregistry.com/"
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-pink-300 transition-colors duration-300 hover:text-pink-200 hover:underline"
							>The Good Registry</a
						> raise over $500,000 NZD for charities through automated processes I developed.
					</p>
				</div>

				<div
					class="about-element animate-ready transition-transform duration-300 hover:translate-y-[-2px]"
				>
					<h3 class="mb-2 text-xl font-semibold text-blue-300">My Approach</h3>
					<p class="text-gray-200">
						I'm all about creating tech that makes life better and easier for people. I get excited
						about <span class="font-bold transition-colors duration-300 hover:text-blue-300"
							>AI-driven software solutions</span
						>, crafting elegant
						<span class="font-bold transition-colors duration-300 hover:text-blue-300"
							>RESTful & GraphQL APIs</span
						>, and integrating
						<span class="font-bold transition-colors duration-300 hover:text-blue-300"
							>machine learning models</span
						> that actually solve real problems. I'm a firm believer in clean code that other developers
						will thank you for later! I love both teaching others what I know and continuously learning
						new technologies - the tech world never stands still, and neither do I!
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- New Testimonials section added below the About Me section -->
<section class="bg-[#1A202C] py-12 text-gray-100" bind:this={testimonialSection}>
	<div class="container mx-auto px-4">
		<h2 class="mb-8 text-center text-3xl font-bold text-blue-400">What People Say</h2>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div
				class="testimonial-card rounded-xl border border-gray-700 bg-[#1E2433] p-6 shadow-lg transition-all duration-300 hover:border-blue-500 hover:shadow-xl"
			>
				<p class="mb-4 text-gray-300 italic">
					"Hank is hard-working, enthusiastic and has grown into a proficient and dependable member
					of the Sharesies technical team. His determination, communication and drive to learn make
					him a capable developer who can confidently pick up and solve unfamiliar tasks."
				</p>
				<div>
					<h3 class="font-bold text-blue-300">Richard Clark</h3>
					<p class="text-gray-400">Technical Director, Sharesies</p>
				</div>
			</div>

			<div
				class="testimonial-card rounded-xl border border-gray-700 bg-[#1E2433] p-6 shadow-lg transition-all duration-300 hover:border-blue-500 hover:shadow-xl"
			>
				<p class="mb-4 text-gray-300 italic">
					"Hank volunteered to help our social giving platform, The Good Registry, to solve a
					problem we had with issuing gift cards in bulk from our e-commerce platform. He provided a
					perfect solution for us and did it with great professionalism, skill and passion."
				</p>
				<div>
					<h3 class="font-bold text-blue-300">Christine Langdon</h3>
					<p class="text-gray-400">Founder, The Good Registry</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="bg-gray-900 py-12" bind:this={ctaSection}>
	<div class="container mx-auto px-4 text-center">
		<h2 class="cta-element mb-4 text-2xl font-bold text-blue-400">
			Interested in working together?
		</h2>
		<div class="flex justify-center gap-4">
			<a
				href="/services"
				class="cta-element cta-button-fixed rounded-lg border border-blue-500 px-6 py-2 text-blue-400 transition-colors hover:bg-gray-800"
			>
				View My Services
			</a>
			<button
				class="copy-email-btn cta-element cta-button-fixed relative rounded-lg bg-blue-800 px-6 py-2 text-white transition-colors hover:bg-blue-700"
			>
				<span
					class="copy-tooltip absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity"
					>Copy email address</span
				>
				Contact Me
			</button>
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
		will-change: transform, opacity;
	}

	/* Show content if JS is disabled or animations fail */
	:global(.animate-ready:not(:has(+ script))), /* For browsers without JS */
	:global(.no-js .animate-ready) {
		/* Fallback approach for when JS is disabled */
		opacity: 1 !important;
	}

	.skill-tag {
		transition:
			border-color 0.3s ease,
			transform 0.4s ease;
		position: relative; /* Add positioning context */
		z-index: 5; /* Ensure proper stacking */
		text-align: center; /* Center the text within each skill tag */
		margin-bottom: 6px; /* Add vertical spacing for tags */
		transform-origin: center center; /* Ensure scaling from center */
		will-change: transform; /* Optimize for animations */
		backface-visibility: hidden; /* Prevent flickering */
		animation: skill-float 3s ease-in-out infinite;
		animation-delay: calc(var(--index, 0) * 0.1s); /* Staggered animation start */
	}

	.skill-tag:hover {
		border-color: #3b82f6; /* blue-500 */
		transform: translateY(-2px) scale(1.05);
		z-index: 10; /* Raise above other skills when hovered */
		animation-play-state: paused; /* Pause animation on hover */
	}
	
	/* Floating animation for skills */
	@keyframes skill-float {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
	}
	
	/* Skills section container */
	section .container div > .overflow-hidden {
		contain: layout paint; /* Better performance containment */
		position: relative;
		z-index: 5;
		margin-bottom: 3rem !important; /* Force more space below skills */
	}
	
	/* Skills wrapper */
	section .container div > .overflow-hidden > div {
		position: relative;
		z-index: inherit;
		padding-bottom: 6px; /* Extra padding to prevent cut-off */
	}

	.hero-button {
		transition: all 0.3s ease;
	}

	.hero-button:hover {
		transform: translateY(-3px) scale(1.03);
		box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.5);
	}

	/* Testimonial card styling - modified to support back navigation */
	.testimonial-card {
		opacity: 0; /* Start hidden for animation */
		will-change: transform, opacity, box-shadow;
		transition: all 0.3s ease;
		animation: show-testimonials 0s 2s forwards; /* Ensure visible after 2 seconds regardless */
	}

	@keyframes show-testimonials {
		to {
			opacity: 1;
		}
	}

	.testimonial-card:hover {
		transform: translateY(-5px) scale(1.01);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
		border-color: #3b82f6; /* blue-500 */
	}

	/* Ensure content is visible if JS fails */
	@media (prefers-reduced-motion: reduce) {
		.animate-ready {
			opacity: 1 !important;
			transform: none !important;
		}
	}

	/* Make content visible after 800ms regardless of animations */
	@keyframes show-content {
		to {
			opacity: 1;
		}
	}

	.animate-ready {
		animation: show-content 0s 5000ms forwards; /* Longer delay to allow fireworks to display first */
	}

	/* Canvas for fireworks */
	.fireworks-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		pointer-events: none;
	}

	/* Canvas for simple gradient animation */
	.gradient-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		pointer-events: none;
	}

	/* Styling for Hank's name */
	.hank-highlight {
		position: relative;
		display: inline-block;
		color: #f472b6; /* Neon pink base color */
		font-weight: 800;
		text-shadow: 0 0 8px rgba(244, 114, 182, 0.6);
		transition: all 0.3s ease;
		cursor: pointer;
		z-index: 5;
		background: none;
		border: none;
		padding: 0;
		font: inherit;
	}

	.hank-highlight::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 100%;
		height: 3px;
		background: linear-gradient(90deg, #f472b6, #ec4899);
		border-radius: 2px;
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.hank-highlight:hover {
		color: #ec4899; /* Brighter pink on hover */
		transform: translateY(-2px);
		text-shadow: 0 0 12px rgba(236, 72, 153, 0.8);
	}

	.hank-highlight:hover::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	/* Styling for Szu-Han's name */
	.szuhan-highlight {
		position: relative;
		display: inline-block;
		color: #60a5fa; /* Neon blue base color */
		font-weight: 800;
		text-shadow: 0 0 8px rgba(96, 165, 250, 0.6);
		transition: all 0.3s ease;
		cursor: pointer;
		z-index: 5;
		background: none;
		border: none;
		padding: 0;
		font: inherit;
	}

	.szuhan-highlight::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 100%;
		height: 3px;
		background: linear-gradient(90deg, #3b82f6, #60a5fa);
		border-radius: 2px;
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.szuhan-highlight:hover {
		color: #93c5fd; /* Brighter blue on hover */
		transform: translateY(-2px);
		text-shadow: 0 0 12px rgba(96, 165, 250, 0.8);
	}

	.szuhan-highlight:hover::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	/* Click animations for both names */
	/* Pulse animation */
	@keyframes name-pulse {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.2);
			opacity: 0.8;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	/* Shake animation */
	@keyframes name-shake {
		0% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-5px) rotate(-3deg);
		}
		40% {
			transform: translateX(5px) rotate(3deg);
		}
		60% {
			transform: translateX(-5px) rotate(-3deg);
		}
		80% {
			transform: translateX(5px) rotate(3deg);
		}
		100% {
			transform: translateX(0);
		}
	}

	/* 3D Rotate animation */
	@keyframes name-rotate {
		0% {
			transform: rotateY(0);
		}
		50% {
			transform: rotateY(180deg);
		}
		100% {
			transform: rotateY(360deg);
		}
	}

	/* Bounce animation */
	@keyframes name-bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-20px);
		}
		60% {
			transform: translateY(-10px);
		}
	}

	/* Email button tooltip styles */
	.copy-email-btn {
		position: relative;
		cursor: pointer;
		overflow: hidden; /* Ensure ripple doesn't overflow */
	}

	.copy-tooltip {
		z-index: 10;
		pointer-events: none;
		white-space: nowrap;
		/* Add a small triangle/arrow */
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
	}

	.copy-tooltip:after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		margin-left: -6px;
		border-width: 6px;
		border-style: solid;
		border-color: #1a202c transparent transparent transparent;
	}
	
	/* Fixed-size CTA buttons that don't scale */
	.cta-element {
		opacity: 1; /* Start visible by default */
		transform-style: preserve-3d;
		backface-visibility: hidden;
		will-change: transform, opacity;
		transition: all 0.3s ease;
	}
	
	/* Fixed-size CTA buttons that don't scale */
	.cta-button-fixed {
		transform: none !important; /* Prevent any transform */
		transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important; /* Only transition colors */
		will-change: background-color, color, border-color; /* Only watch for color changes */
		min-width: 160px; /* Ensure consistent width */
		height: 40px; /* Fixed height instead of min-height */
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box; /* Include padding in dimensions */
		overflow: hidden; /* Prevent content from affecting dimensions */
		white-space: nowrap; /* Keep text on one line */
		line-height: 1; /* Standardize line height */
		padding: 0 1.5rem; /* Standardize padding */
		font-size: 1rem; /* Standardize font size */
	}

	@keyframes copy-pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7);
		}
		70% {
			box-shadow: 0 0 0 15px rgba(147, 51, 234, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(147, 51, 234, 0);
		}
	}

	@keyframes copy-ripple {
		0% {
			width: 0;
			height: 0;
			opacity: 0.6;
		}
		100% {
			width: 200%;
			height: 200%;
			opacity: 0;
		}
	}

	@keyframes copy-checkmark {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.5);
		}
		60% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1.2);
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(1);
		}
	}
	@keyframes fadeInOut {
		0% {
			opacity: 0;
			transform: scale(0.8) translateY(5px);
		}
		15% {
			opacity: 1;
			transform: scale(1.1) translateY(0);
		}
		25% {
			transform: scale(1) translateY(0);
		}
		85% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
		100% {
			opacity: 0;
			transform: scale(0.8) translateY(-5px);
		}
	}

	/* Skills container styles for better overflow management */
	.my-8.mb-12.overflow-hidden {
		contain: layout paint; /* Better performance containment */
		position: relative;
		z-index: 5;
	}
	
	.my-8.mb-12.overflow-hidden > div {
		position: relative;
		z-index: inherit;
		padding-bottom: 4px; /* Extra padding to prevent cut-off */
	}
</style>
