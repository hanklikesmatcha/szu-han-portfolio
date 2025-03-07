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
		'Technical Mentoring',
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
		trail: {x: number, y: number}[];
		explosionSize: number;
		explosionType: string;
		
		constructor(startX: number, targetX: number, targetY: number) {
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
			// Trail for rocket effect - shorter trail for performance
			this.trail = [];
			// Maximum trail length - reduced for performance
			const maxTrail = 5; // Reduced from 8
			for (let i = 0; i < maxTrail; i++) {
				this.trail.push({x: this.x, y: this.y});
			}
			// Random explosion size
			this.explosionSize = Math.random() * 0.5 + 0.8; // 0.8 to 1.3 scale factor
			// Random explosion type
			const types = ['circular', 'ring', 'starburst', 'crossette', 'willow'];
			this.explosionType = types[Math.floor(Math.random() * types.length)];
		}
		
		getRandomFireworkColor() {
			const colors = [
				'#60a5fa', '#93c5fd', '#3b82f6', // Blues
				'#8b5cf6', '#a78bfa', '#c4b5fd', // Purples
				'#ec4899', '#f472b6', '#f9a8d4', // Pinks
				'#f59e0b', '#fbbf24', '#fcd34d', // Ambers/Yellows
				'#10b981', '#34d399', '#6ee7b7', // Emeralds
				'#ef4444', '#f87171', '#fca5a5'  // Reds
			];
			return colors[Math.floor(Math.random() * colors.length)];
		}

		update() {
			if (this.hasExploded) {
				// Update all particles
				for (let i = this.particles.length - 1; i >= 0; i--) {
					this.particles[i].update();
					
					// Remove dead particles
					if (this.particles[i].alpha <= 0) {
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
				this.trail.unshift({x: this.x, y: this.y});
				
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
			switch(this.explosionType) {
				case 'circular':
					this.createCircularExplosion();
					break;
				case 'ring':
					this.createRingExplosion();
					break;
				case 'starburst':
					this.createStarburstExplosion();
					break;
				case 'crossette':
					this.createCrossetteExplosion();
					break;
				case 'willow':
					this.createWillowExplosion();
					break;
				default:
					this.createCircularExplosion();
			}
			
			// Lower chance for secondary explosion to improve performance
			if (Math.random() < 0.2) { // Reduced from 0.3
				setTimeout(() => {
					this.createSecondaryExplosion();
				}, Math.random() * 300 + 100);
			}
		}
		
		createSecondaryExplosion() {
			// Create smaller secondary explosion - reduced particle count
			const count = Math.floor(Math.random() * 10) + 5; // Reduced from 20+10
			const color = this.getRandomFireworkColor();
			
			for (let i = 0; i < count; i++) {
				const angle = Math.random() * Math.PI * 2;
				const speed = Math.random() * 3 + 1;
				const vx = Math.cos(angle) * speed;
				const vy = Math.sin(angle) * speed;
				const size = Math.random() * 2 + 1;
				
				const particle = new Particle(
					this.targetX,
					this.targetY,
					vx,
					vy,
					size,
					color,
					Math.random() * 0.5 + 0.3,
					Math.random() < 0.1, // Reduced from 0.2
					true
				);
				
				this.particles.push(particle);
			}
		}
		
		createCircularExplosion() {
			// Standard circular explosion - reduced particle count
			const particleCount = Math.floor(Math.random() * 20) + 20; // Reduced from 40+40
			
			for (let i = 0; i < particleCount; i++) {
				// Random velocity in all directions
				const angle = Math.random() * Math.PI * 2;
				const speed = Math.random() * 5 + 1;
				const vx = Math.cos(angle) * speed * this.explosionSize;
				const vy = Math.sin(angle) * speed * this.explosionSize;
				
				// Random size for particles
				const size = Math.random() * 3 + 1;
				
				// Create particle with random properties
				const particle = new Particle(
					this.targetX,
					this.targetY,
					vx,
					vy,
					size,
					this.color,
					Math.random() * 0.7 + 0.3,
					Math.random() < 0.1, // Reduced from 0.15
					false
				);
				
				this.particles.push(particle);
			}
		}
		
		createRingExplosion() {
			// Creates a ring pattern - reduced particle count
			const particleCount = Math.floor(Math.random() * 15) + 25; // Reduced from 30+50
			const ringThickness = Math.random() * 0.5 + 0.5;
			
			for (let i = 0; i < particleCount; i++) {
				const angle = (i / particleCount) * Math.PI * 2;
				// All particles go at similar speeds for ring effect
				const variance = Math.random() * ringThickness;
				const speed = (4 + variance) * this.explosionSize;
				const vx = Math.cos(angle) * speed;
				const vy = Math.sin(angle) * speed;
				
				const size = Math.random() * 2.5 + 1.5;
				
				const particle = new Particle(
					this.targetX,
					this.targetY,
					vx,
					vy,
					size,
					this.color,
					Math.random() * 0.5 + 0.5,
					Math.random() < 0.1, // Reduced from 0.2
					false
				);
				
				this.particles.push(particle);
			}
		}
		
		createStarburstExplosion() {
			// Creates a star pattern with defined rays - optimized
			const rayCount = Math.floor(Math.random() * 4) + 6; // Reduced from 8-12
			const particlesPerRay = Math.floor(Math.random() * 3) + 5; // Reduced from 7-12
			
			for (let ray = 0; ray < rayCount; ray++) {
				const rayAngle = (ray / rayCount) * Math.PI * 2;
				
				for (let i = 0; i < particlesPerRay; i++) {
					// Particles go in similar directions for each ray
					const angleVariance = (Math.random() - 0.5) * 0.3;
					const angle = rayAngle + angleVariance;
					
					// Speed increases for particles further from center
					const speed = (2 + i * 0.5) * this.explosionSize;
					const vx = Math.cos(angle) * speed;
					const vy = Math.sin(angle) * speed;
					
					// Size decreases for particles further from center
					const size = Math.max(1, 3 - i * 0.2);
					
					const particle = new Particle(
						this.targetX,
						this.targetY,
						vx,
						vy,
						size,
						this.color,
						Math.random() * 0.3 + 0.7,
						i === particlesPerRay - 1, // Last particle in ray is a streamer
						false
					);
					
					this.particles.push(particle);
				}
			}
		}
		
		createCrossetteExplosion() {
			// Initial burst - reduced particle count
			const mainCount = Math.floor(Math.random() * 10) + 10; // Reduced from 20+20
			
			for (let i = 0; i < mainCount; i++) {
				const angle = Math.random() * Math.PI * 2;
				const speed = Math.random() * 4 + 3;
				const vx = Math.cos(angle) * speed * this.explosionSize;
				const vy = Math.sin(angle) * speed * this.explosionSize;
				const size = Math.random() * 3 + 1;
				
				// Lower chance to split for better performance
				const particle = new Particle(
					this.targetX,
					this.targetY,
					vx,
					vy,
					size,
					this.color,
					Math.random() * 0.4 + 0.4,
					false,
					false,
					Math.random() < 0.3 // Reduced from 0.5
				);
				
				this.particles.push(particle);
			}
		}
		
		createWillowExplosion() {
			// Creates willow effect - reduced particle count
			const particleCount = Math.floor(Math.random() * 15) + 20; // Reduced from 30+40
			
			for (let i = 0; i < particleCount; i++) {
				const angle = Math.random() * Math.PI * 2;
				// Initial outward velocity
				const speed = Math.random() * 4 + 2;
				const vx = Math.cos(angle) * speed * this.explosionSize;
				// More upward bias for initial burst
				const vy = Math.sin(angle) * speed * this.explosionSize - 1;
				
				const size = Math.random() * 2 + 2;
				
				// Willow streamers last longer and fall more
				const particle = new Particle(
					this.targetX,
					this.targetY,
					vx,
					vy,
					size,
					this.color,
					Math.random() * 0.5 + 0.9, // Longer life
					true, // All are streamers
					false,
					false,
					0.15 // Higher gravity
				);
				
				this.particles.push(particle);
			}
		}
		
		draw(ctx: CanvasRenderingContext2D) {
			if (this.hasExploded) {
				// Draw all particles
				for (let i = 0; i < this.particles.length; i++) {
					this.particles[i].draw(ctx);
				}
			} else {
				// Draw rocket trail - simplified for performance
				ctx.beginPath();
				ctx.strokeStyle = this.color;
				ctx.lineWidth = 2;
				ctx.moveTo(this.x, this.y);
				
				// Draw trail with fading effect - simplified
				for (let i = 0; i < this.trail.length; i++) {
					ctx.lineTo(this.trail[i].x, this.trail[i].y);
					// Fade out the line as it gets farther from the head
					ctx.globalAlpha = 1 - (i / this.trail.length);
				}
				ctx.stroke();
				ctx.globalAlpha = 1;
				
				// Draw rocket head
				ctx.beginPath();
				ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
				ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
				ctx.fill();
				
				// Simple glow effect - more efficient
				ctx.beginPath();
				ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
				ctx.fillStyle = 'rgba(255, 220, 180, 0.2)';
				ctx.fill();
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
			
			// Reduce alpha based on decay rate
			this.alpha -= this.decay;
			
			// Ensure alpha doesn't go below 0
			if (this.alpha < 0) this.alpha = 0;
		}
		
		split() {
			// Split into fewer smaller particles
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
			
			// Reduced from 4 to 3 child particles
			for (let i = 0; i < 3; i++) {
				const angle = (i / 3) * Math.PI * 2 + Math.random() * 0.5;
				const speed = Math.random() * 2 + 1;
				const vx = Math.cos(angle) * speed;
				const vy = Math.sin(angle) * speed;
				
				const childParticle = new Particle(
					this.x,
					this.y,
					vx,
					vy,
					this.size * 0.6,
					this.color,
					Math.random() * 0.3 + 0.2,
					i === 0, // First particle is a streamer
					true
				);
				
				parentFirework.particles.push(childParticle);
			}
		}
		
		draw(ctx: CanvasRenderingContext2D) {
			// Skip drawing if particle is invisible
			if (this.alpha <= 0) return;
			
			// Set global alpha for transparency
			ctx.globalAlpha = this.alpha;
			
			// Draw particle
			ctx.beginPath();
			
			// Streamers get a different shape
			if (this.isStreamer) {
				// Simplified streamer drawing for better performance
				ctx.save();
				ctx.translate(this.x, this.y);
				
				// Use simpler rotation calculation
				const angle = Math.atan2(this.vy, this.vx);
				ctx.rotate(angle);
				
				// Simpler shape
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(-this.size * 4, 0);
				ctx.lineTo(-this.size * 4, -this.size * 0.3);
				ctx.lineTo(-this.size * 4, this.size * 0.3);
				ctx.closePath();
				
				ctx.fillStyle = this.color;
				ctx.fill();
				
				ctx.restore();
			} else {
				// Regular particles
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				
				// Only apply glow to larger particles for better performance
				if (this.alpha > 0.7 && this.size > 2) {
					ctx.shadowColor = this.color;
					ctx.shadowBlur = 3; // Reduced from 5
				}
				
				ctx.fillStyle = this.color;
				ctx.fill();
				ctx.shadowBlur = 0;
			}
			
			// Reset global alpha
			ctx.globalAlpha = 1;
		}
	}
	
	// Performance monitoring variables
	let lastFrameTime = 0;
	let frameCount = 0;
	let fps = 60;
	let fpsThrottleEnabled = true;
	let fpsThreshold = 30; // Target minimum FPS
	
	// Choreographed fireworks sequences
	function startFireworksSequence() {
		if (!fireworksCtx) return;
		
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
		(window as any).latestFireworksSequence = () => fireworks;
		
		// Track time for fireworks scheduling
		let startTime = performance.now();
		
		// More dramatic choreography but with fewer fireworks for performance
		const fireworksSequence = [
			// First wave - single centered burst
			{ time: 500, startX: width * 0.5, targetX: width * 0.5, targetY: height * 0.4 },
			
			// Second wave - pair of bursts (delayed slightly for better spacing)
			{ time: 1600, startX: width * 0.4, targetX: width * 0.35, targetY: height * 0.35 },
			{ time: 2000, startX: width * 0.6, targetX: width * 0.65, targetY: height * 0.35 },
			
			// Third wave - triangular formation with longer delay
			{ time: 3000, startX: width * 0.3, targetX: width * 0.3, targetY: height * 0.3 },
			{ time: 3300, startX: width * 0.7, targetX: width * 0.7, targetY: height * 0.3 },
			{ time: 3800, startX: width * 0.5, targetX: width * 0.5, targetY: height * 0.2 },
			
			// Grand finale - fewer but well-spaced bursts
			{ time: 4800, startX: width * 0.25, targetX: width * 0.25, targetY: height * 0.25 },
			{ time: 5200, startX: width * 0.75, targetX: width * 0.75, targetY: height * 0.25 },
			{ time: 5800, startX: width * 0.5, targetX: width * 0.5, targetY: height * 0.2 },
		];
		
		let sequenceIndex = 0;
		let adaptiveParticleFactor = 1.0; // Will be adjusted based on performance
		
		// Animation loop
		function animate(timestamp: number) {
			// Calculate FPS for performance monitoring
			if (timestamp) {
				if (lastFrameTime) {
					const delta = timestamp - lastFrameTime;
					if (delta > 0) {
						const instantFps = 1000 / delta;
						// Smooth FPS calculation
						fps = fps * 0.9 + instantFps * 0.1;
						
						// Adjust particle count based on performance
						if (fpsThrottleEnabled) {
							if (fps < fpsThreshold && adaptiveParticleFactor > 0.3) {
								adaptiveParticleFactor *= 0.9; // Reduce particles if low FPS
							} else if (fps > fpsThreshold + 10 && adaptiveParticleFactor < 1.0) {
								adaptiveParticleFactor *= 1.05; // Increase particles if high FPS
							}
						}
					}
				}
				lastFrameTime = timestamp;
				
				// Log FPS every 60 frames
				if (++frameCount % 60 === 0) {
					console.log(`Fireworks FPS: ${fps.toFixed(1)}, Particle factor: ${adaptiveParticleFactor.toFixed(2)}`);
				}
			}
			
			// Clear canvas - use full clear for less transparency buildup
			if (fireworksCtx) {
				fireworksCtx.clearRect(0, 0, width, height);
				// Add a subtle background for trail effect
				fireworksCtx.fillStyle = 'rgba(26, 32, 44, 0.15)';
				fireworksCtx.fillRect(0, 0, width, height);
			}
			
			// Current time since start
			const currentTime = performance.now() - startTime;
			
			// Add new fireworks based on sequence
			while (sequenceIndex < fireworksSequence.length && 
				   currentTime >= fireworksSequence[sequenceIndex].time) {
				
				const sequence = fireworksSequence[sequenceIndex];
				const fw = new Firework(
					sequence.startX,
					sequence.targetX, 
					sequence.targetY
				);
				
				fireworks.push(fw);
				sequenceIndex++;
			}
			
			// Update and draw fireworks
			for (let i = fireworks.length - 1; i >= 0; i--) {
				// Draw the firework
				fireworks[i].draw(fireworksCtx!);
				
				// Update and check if firework is done
				const isDone = fireworks[i].update();
				
				// Remove finished fireworks
				if (isDone) {
					fireworks.splice(i, 1);
				}
			}
			
			// Show content after all fireworks have started
			if (sequenceIndex >= fireworksSequence.length && !contentReady && currentTime > 6000) {
				contentReady = true;
				revealContent();
			}
			
			// Continue animation if there are active fireworks or sequence isn't complete
			if (fireworks.length > 0 || sequenceIndex < fireworksSequence.length) {
				fireworksAnimationId = requestAnimationFrame(animate);
			} else {
				// Fade out canvas when complete
				const fadeCanvas = () => {
					let opacity = parseFloat(fireworksCanvas.style.opacity || "1");
					opacity -= 0.02;
					
					if (opacity <= 0) {
						fireworksCanvas.style.opacity = "0";
						setTimeout(() => {
							fireworksCanvas.style.display = "none";
						}, 500);
						return;
					}
					
					fireworksCanvas.style.opacity = opacity.toString();
					requestAnimationFrame(fadeCanvas);
				};
				
				setTimeout(fadeCanvas, 1000);
			}
		}
		
		// Start animation
		fireworksAnimationId = requestAnimationFrame(animate);
	}
	
	// Function to reveal content after fireworks
	function revealContent() {
		console.log("Revealing content");
		
		// Hero elements animation
		try {
			const heroElements = document.querySelectorAll('.hero-element');
			if (heroElements.length > 0) {
				animate('.hero-element', 
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
			console.error("Hero animation error:", error);
			document.querySelectorAll('.hero-element').forEach(el => {
				(el as HTMLElement).style.opacity = '1';
			});
		}
		
		// Skills animation with shorter delay
		setTimeout(() => {
			try {
				const skillTags = document.querySelectorAll('.skill-tag');
				if (skillTags.length > 0) {
					animate('.skill-tag', 
						{ 
							opacity: [0, 1], 
							scale: [0.7, 1],
							y: [30, 0]
						},
						{ 
							delay: stagger(0.03, { from: "center" }),
							duration: 0.8
						}
					);
				}
			} catch (error) {
				console.error("Skill tag animation error:", error);
				document.querySelectorAll('.skill-tag').forEach(el => {
					(el as HTMLElement).style.opacity = '1';
				});
			}
		}, 400);
		
		// Buttons animation
		setTimeout(() => {
			try {
				const heroButtons = document.querySelectorAll('.hero-button');
				if (heroButtons.length > 0) {
					animate('.hero-button', 
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
				console.error("Button animation error:", error);
				document.querySelectorAll('.hero-button').forEach(el => {
					(el as HTMLElement).style.opacity = '1';
				});
			}
		}, 800);
	}
	
	// Setup canvas and start fireworks when component is mounted
	onMount(() => {
		// Mark animations as ready
		animationsReady = true;
		
		// Setup canvas and resize function
		let resizeCanvas: () => void;
		
		if (fireworksCanvas) {
			fireworksCtx = fireworksCanvas.getContext('2d');
			
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
			
			// Start fireworks sequence (content will be shown afterward)
			setTimeout(startFireworksSequence, 300);
		}
		
		// About section entrance animation when scrolled to
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting && !isAnimated) {
					isAnimated = true;
					
					try {
						const aboutElements = document.querySelectorAll('.about-element');
						if (aboutElements.length > 0) {
							// Simpler animation for better performance
							animate('.about-element', 
								{ 
									opacity: [0, 1], 
									x: [-40, 0], 
									scale: [0.95, 1] 
								},
								{ 
									delay: stagger(0.15, { start: 0.2 }),
									duration: 0.8
								}
							);
						}
					} catch (error) {
						console.error("About section animation error:", error);
						document.querySelectorAll('.about-element').forEach(el => {
							(el as HTMLElement).style.opacity = '1';
						});
					}
				}
			});
		}, { threshold: 0.1, rootMargin: '-50px' });
		
		if (aboutSection) {
			observer.observe(aboutSection);
		}
		
		// Clean up on component unmount
		return () => {
			if (fireworksAnimationId) {
				cancelAnimationFrame(fireworksAnimationId);
			}
			if (resizeCanvas) {
				window.removeEventListener('resize', resizeCanvas);
			}
		};
	});
</script>

<svelte:head>
	<title>Szu-Han Chou aka Hank - Portfolio</title>
	<meta name="description" content="Professional portfolio showcasing my projects and expertise in software development">
</svelte:head>

<section class="py-12 bg-[#1A202C] text-gray-100 perspective relative" bind:this={heroSection}>
	<!-- Canvas for fireworks -->
	<canvas class="fireworks-canvas" bind:this={fireworksCanvas}></canvas>
	<div class="container mx-auto px-4">
		<div class="flex flex-col items-center">
			<div class="w-full max-w-3xl mb-8 text-center">
				<h1 class="text-4xl md:text-5xl font-bold mb-4 hero-element animate-ready">Hi, I'm <span class="text-blue-400 name-highlight">Hank</span> aka Szu-Han Chou</h1>
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
						With experience in full-stack development, I specialize in building secure and maintainable software solutions.
						My technical expertise spans Python and TypeScript development, web applications, and implementing robust database systems.
						I currently work with Eighty20.AI, which is an enterprise AI company where I apply my skills to develop innovative technology solutions for a range of clients.
					</p>
				</div>
				
				<div class="about-element animate-ready">
					<h3 class="text-xl font-semibold mb-2 text-blue-300">Education & Experience</h3>
					<p class="text-gray-200">
						I hold a Postgraduate Certificate in Computer & Information Sciences from Auckland University of Technology 
						and a Graduate Diploma in IT from Wellington Technology Institute, along with a Bachelor of Engineering. My professional 
						journey includes roles at GenerateZero, Taggun, Octopus Energy, and Sharesies, where I've worked on diverse projects 
						from carbon accounting to AI integration. I've also contributed as a Python Bootcamp Speaker for Summer of Tech 
						and as a Developer for The Good Registry, automating processes that helped raise over $500,000 NZD for charities.
					</p>
				</div>
				
				<div class="about-element animate-ready">
					<h3 class="text-xl font-semibold mb-2 text-blue-300">My Approach</h3>
					<p class="text-gray-200">
						I believe in writing clean, maintainable code with a focus on performance and user experience. I specialize in 
						building AI-driven software solutions, designing RESTful & GraphQL APIs, and utilizing machine learning models.
						My development philosophy centers around creating user-focused applications that solve real problems while 
						balancing technical excellence with business needs. I'm highly collaborative and committed to continuous 
						improvement, enjoying both mentoring others and learning new technologies.
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
		will-change: transform, opacity;
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
		transform: translateY(-2px) scale(1.05);
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
		}
	}
	
	/* Make content visible after 800ms regardless of animations */
	@keyframes show-content {
		to { opacity: 1; }
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
	
	.name-highlight {
		position: relative;
		z-index: 5;
	}
</style>
