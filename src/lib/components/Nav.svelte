<script lang="ts">
  // Navigation component for the header
  import { onMount } from 'svelte';
  import { animate, stagger } from 'motion';
  import { page } from '$app/stores'; // Import the page store to track route changes
  import { onNavigate } from '$app/navigation';

  // Define navigation items
  const navItems = [
    { path: '/', label: 'Home', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z' },
    { path: '/portfolio', label: 'Work', icon: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' },
    { path: '/services', label: 'Skills', icon: 'M21.67 18.17l-5.3-5.3h-.99l-2.54 2.54v.99l5.3 5.3c.39.39 1.02.39 1.41 0l2.12-2.12c.39-.38.39-1.02 0-1.41zm-2.83 1.42l-4.24-4.24.71-.71 4.24 4.24-.71.71z M17.34 10.19l1.41-1.41 2.12 2.12c1.17-1.17 1.17-3.07 0-4.24l-3.54-3.54-1.41 1.41V1.71l-.7-.71-3.54 3.54.71.71h2.83l-1.41 1.41 1.06 1.06-2.89 2.89-4.13-4.13V5.06L4.83 2.04 2 4.87 5.03 7.9h1.41l4.13 4.13-.85.85H7.6l-5.3 5.3c-.39.39-.39 1.02 0 1.41l2.12 2.12c.39.39 1.02.39 1.41 0l5.3-5.3v-2.12l5.15-5.15 1.06 1.05zm-7.98 5.15l-4.24 4.24-.71-.71 4.24-4.24.71.71z' }
  ];
  
  // Fireworks parameters
  let fireworksContainer: HTMLDivElement;
  let isAnimatingFireworks = false;
  const particleColors = [
    '#60a5fa', '#93c5fd', '#3b82f6', // Blues
    '#8b5cf6', '#a78bfa', '#c4b5fd', // Purples
    '#ec4899', '#f472b6', '#f9a8d4', // Pinks
    '#f59e0b', '#fbbf24', '#fcd34d', // Ambers/Yellows
    '#10b981', '#34d399', '#6ee7b7', // Emeralds
    '#ef4444', '#f87171', '#fca5a5'  // Reds
  ];
  
  // Helper function to determine if a nav item is active
  $: activePath = $page.url.pathname;

  // Register a navigation handler
  onNavigate(() => {
    // This will run before navigation completes
    return ({ complete }) => {
      // This will run after navigation completes
      complete().then(() => {
        // Force active path update after navigation is fully complete
        activePath = window.location.pathname;
      });
    };
  });
  
  // Handle icon hover animation
  function handleIconEnter(event: MouseEvent, path: string) {
    if (path === activePath) return;
    
    const target = event.currentTarget as HTMLElement;
    const icon = target.querySelector('.nav-icon');
    const text = target.querySelector('.nav-text');
    
    if (!icon || !text) return;
    
    animate(icon, { 
      scale: 1.4,
      y: -8,
      fill: '#60a5fa',
      filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.7))'
    }, { 
      duration: 0.3, 
      easing: 'cubic-bezier(0.34, 2.56, 0.64, 1)' 
    });
    
    animate(text, {
      y: 5,
      scale: 1.1,
      color: '#60a5fa'
    }, {
      duration: 0.3,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
  }
  
  // Handle icon leave animation
  function handleIconLeave(event: MouseEvent, path: string) {
    if (path === activePath) return;
    
    const target = event.currentTarget as HTMLElement;
    const icon = target.querySelector('.nav-icon');
    const text = target.querySelector('.nav-text');
    
    if (!icon || !text) return;
    
    animate(icon, { 
      scale: 1,
      y: 0,
      fill: '#d1d5db',
      filter: 'drop-shadow(0 0 0 rgba(59, 130, 246, 0))'
    }, { 
      duration: 0.4, 
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' 
    });
    
    animate(text, {
      y: 0,
      scale: 1,
      color: '#e5e7eb'
    }, {
      duration: 0.4,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
  }
  
  // Create a single firework explosion
  function createFireworkExplosion(x: number, y: number) {
    if (isAnimatingFireworks || !fireworksContainer) return;
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
    const particles: HTMLDivElement[] = [];
    
    // Batch DOM operations for better performance
    const fragment = document.createDocumentFragment();
    
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
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      particle.style.backgroundColor = color;
      
      // Set initial position
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      fragment.appendChild(particle);
      particles.push(particle);
    }
    
    // Add all particles to DOM at once (more efficient)
    fireworksContainer.appendChild(fragment);
    
    // Pre-calculate random animations for each particle
    particles.forEach((particle, index) => {
      // Detect streamers
      const isStreamer = particle.classList.contains('firework-streamer');
      
      // Use polar coordinates for more realistic spread - increased distance
      const distance = isStreamer ? 
        200 + Math.random() * 150 : 
        100 + Math.random() * 200;
        
      const angle = Math.random() * Math.PI * 2; // Random angle in radians
      
      // Calculate endpoint using polar coordinates for more natural arc
      const randomX = `${Math.cos(angle) * distance}px`;
      const randomY = `${Math.sin(angle) * distance + (isStreamer ? 50 : 0)}px`; // Streamers fall more
      
      // Simplified animations - removed z-axis for better performance
      const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)];
      
      // Reduced duration for better performance
      const duration = isStreamer ? 3.0 : 2.5;
      
      // Animate with fewer properties for better performance
      animate(
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
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          delay: index * 0.002 // Even faster stagger for less resource usage
        }
      ).finished.then(() => {
        // Remove each particle immediately when its animation completes
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    });
    
    // Reset animation flag after reasonable time (safety cleanup)
    setTimeout(() => {
      isAnimatingFireworks = false;
    }, 3500); // Shorter duration than before for better performance
  }
  
  onMount(() => {
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
        setTimeout(() => createFireworkExplosion(x - 50, y - 20), 800);  // Increased from 600ms
        setTimeout(() => createFireworkExplosion(x + 50, y - 20), 1600); // Increased from 1200ms
      });
    }
    
    // Dramatic entrance animation for nav icons
    try {
      const navIcons = document.querySelectorAll('.nav-icon');
      animate(navIcons, 
        { 
          opacity: [0, 1],
          scale: [0.2, 1.3, 1],
          y: [-40, 10, 0],
          rotate: ['30deg', '-5deg', '0deg']
        }, 
        { 
          delay: stagger(0.12, { from: "first" }),
          duration: 0.8,
          easing: 'cubic-bezier(0.22, 1.5, 0.36, 1)'
        }
      );
    } catch (error) {
      console.error("Nav icon animation error:", error);
    }
  });
</script>

<nav class="container mx-auto px-4 py-4 flex justify-between items-center">
  <div class="relative">
    <a href="/" class="text-xl font-bold text-blue-400 brand-logo">
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
        class="nav-item flex flex-col items-center group" 
        class:nav-active={item.path === activePath}
        aria-label={item.label}
        aria-current={item.path === activePath ? 'page' : undefined}
        on:mouseenter={(e) => handleIconEnter(e, item.path)}
        on:mouseleave={(e) => handleIconLeave(e, item.path)}
        data-path={item.path}
      >
        <svg 
          class="nav-icon mb-1" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill={item.path === activePath ? '#60a5fa' : '#d1d5db'} 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={item.icon} />
        </svg>
        <span 
          class="nav-text transition-colors"
          class:text-blue-400={item.path === activePath}
          class:text-gray-200={item.path !== activePath}
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
  
  .nav-icon {
    transform-origin: center;
    will-change: transform, fill, filter;
    filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0));
    transition: transform 0.3s ease, filter 0.3s ease;
  }
  
  .nav-item {
    position: relative;
    text-decoration: none;
  }
  
  .nav-text {
    will-change: transform;
    transform-origin: bottom center;
  }
  
  /* Create floating animation for active nav icon */
  .nav-active .nav-icon {
    animation: floating 3s ease-in-out infinite;
    fill: #60a5fa !important;
  }
  
  .nav-active .nav-text {
    color: #60a5fa !important;
  }
  
  @keyframes floating {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0px); }
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
    box-shadow: 0 0 10px rgba(255, 200, 100, 0.5); /* Glow for the trail */
  }
</style> 