<style>
	:global(body) {
		background-color: #111827; /* bg-gray-900 */
		color: #f3f4f6; /* text-gray-100 */
	}

	/* Add perspective for 3D effects */
	:global(.perspective) {
		perspective: 1000px;
	}

	/* Animation styles for initial state */
	:global(.animate-ready) {
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

	:global(.skill-tag) {
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

	:global(.skill-tag:hover) {
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
	:global(section .container div > .overflow-hidden) {
		contain: layout paint; /* Better performance containment */
		position: relative;
		z-index: 5;
		margin-bottom: 3rem !important; /* Force more space below skills */
	}
	
	/* Skills wrapper */
	:global(section .container div > .overflow-hidden > div) {
		position: relative;
		z-index: inherit;
		padding-bottom: 6px; /* Extra padding to prevent cut-off */
	}

	:global(.hero-button) {
		transition: all 0.3s ease;
	}

	:global(.hero-button:hover) {
		transform: translateY(-3px) scale(1.03);
		box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.5);
	}

	/* Testimonial card styling - modified to support back navigation */
	:global(.testimonial-card) {
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

	:global(.testimonial-card:hover) {
		transform: translateY(-5px) scale(1.01);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
		border-color: #3b82f6; /* blue-500 */
	}

	/* Ensure content is visible if JS fails */
	@media (prefers-reduced-motion: reduce) {
		:global(.animate-ready) {
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

	:global(.animate-ready) {
		animation: show-content 0s 5000ms forwards; /* Longer delay to allow fireworks to display first */
	}

	/* Canvas for fireworks */
	:global(.fireworks-canvas) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		pointer-events: none;
	}

	/* Canvas for simple gradient animation */
	:global(.gradient-canvas) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
		pointer-events: none;
	}

	/* Styling for Hank's name */
	:global(.hank-highlight) {
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

	:global(.hank-highlight::after) {
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

	:global(.hank-highlight:hover) {
		color: #ec4899; /* Brighter pink on hover */
		transform: translateY(-2px);
		text-shadow: 0 0 12px rgba(236, 72, 153, 0.8);
	}

	:global(.hank-highlight:hover::after) {
		transform: scaleX(1);
		transform-origin: left;
	}

	/* Styling for Szu-Han's name */
	:global(.szuhan-highlight) {
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

	:global(.szuhan-highlight::after) {
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

	:global(.szuhan-highlight:hover) {
		color: #93c5fd; /* Brighter blue on hover */
		transform: translateY(-2px);
		text-shadow: 0 0 12px rgba(96, 165, 250, 0.8);
	}

	:global(.szuhan-highlight:hover::after) {
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
	:global(.copy-email-btn) {
		position: relative;
		cursor: pointer;
		overflow: hidden; /* Ensure ripple doesn't overflow */
	}

	:global(.copy-tooltip) {
		z-index: 10;
		pointer-events: none;
		white-space: nowrap;
		/* Add a small triangle/arrow */
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
	}

	:global(.copy-tooltip:after) {
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
	:global(.cta-element) {
		opacity: 1; /* Start visible by default */
		transform-style: preserve-3d;
		backface-visibility: hidden;
		will-change: transform, opacity;
		transition: all 0.3s ease;
	}
	
	/* Fixed-size CTA buttons that don't scale */
	:global(.cta-button-fixed) {
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
	:global(.my-8.mb-12.overflow-hidden) {
		contain: layout paint; /* Better performance containment */
		position: relative;
		z-index: 5;
	}
	
	:global(.my-8.mb-12.overflow-hidden > div) {
		position: relative;
		z-index: inherit;
		padding-bottom: 4px; /* Extra padding to prevent cut-off */
	}

	/* Canvas positioning */
	:global(.fireworks-canvas, .gradient-canvas) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		display: none; /* Hide by default */
		opacity: 0;
		pointer-events: none;
	}
	
	/* Hide all animations by default */
	@keyframes none {
		from { opacity: 0; }
		to { opacity: 0; }
	}

	/* 3D Animation visibility */
	:global(.background-animation) {
		opacity: 0;
		transition: opacity 1.5s ease-in-out;
	}

	:global(.background-animation.visible) {
		opacity: 1;
	}
</style> 