<script>
  // Navigation component for the header
  import { onMount } from 'svelte';
  import { animate, stagger } from 'motion';

  // Track active link
  let currentPath = '/';
  
  onMount(() => {
    // Get current path for active state
    currentPath = window.location.pathname;
    
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
    
    // Add hover animations to nav items
    document.querySelectorAll('.nav-item').forEach((item) => {
      const icon = item.querySelector('.nav-icon');
      const text = item.querySelector('.nav-text');
      
      if (!icon || !text) return;
      
      item.addEventListener('mouseenter', () => {
        // Animate icon
        animate(icon, { 
          scale: 1.4,
          y: -8,
          fill: '#60a5fa', // blue-400
          filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.7))'
        }, { 
          duration: 0.3, 
          easing: 'cubic-bezier(0.34, 2.56, 0.64, 1)' 
        });
        
        // Animate text
        animate(text, {
          y: 5,
          scale: 1.1,
          color: '#60a5fa' // blue-400
        }, {
          duration: 0.3,
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        });
      });
      
      item.addEventListener('mouseleave', () => {
        // Check if this is the active link
        const isActive = item.getAttribute('href') === currentPath;
        const fillColor = isActive ? '#60a5fa' : '#d1d5db';
        const textColor = isActive ? '#60a5fa' : '#e5e7eb';
        
        // Animate icon back
        animate(icon, { 
          scale: 1,
          y: 0,
          fill: fillColor,
          filter: 'drop-shadow(0 0 0 rgba(59, 130, 246, 0))'
        }, { 
          duration: 0.4, 
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' 
        });
        
        // Animate text back
        animate(text, {
          y: 0,
          scale: 1,
          color: textColor
        }, {
          duration: 0.4,
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        });
      });
    });
  });
</script>

<nav class="container mx-auto px-4 py-4 flex justify-between items-center">
  <a href="/" class="text-xl font-bold text-blue-400 brand-logo">Szu-Han Chou aka Hank</a>
  <div class="flex gap-8">
    <!-- Home Link -->
    <a href="/" class="nav-item flex flex-col items-center group" aria-label="Home">
      <svg class="nav-icon mb-1" width="24" height="24" viewBox="0 0 24 24" fill={currentPath === '/' ? '#60a5fa' : '#d1d5db'} xmlns="http://www.w3.org/2000/svg">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/>
      </svg>
      <span class="nav-text text-gray-200 group-hover:text-blue-400 transition-colors">Home</span>
    </a>
    
    <!-- Work Link -->
    <a href="/portfolio" class="nav-item flex flex-col items-center group" aria-label="Work">
      <svg class="nav-icon mb-1" width="24" height="24" viewBox="0 0 24 24" fill={currentPath === '/portfolio' ? '#60a5fa' : '#d1d5db'} xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
      </svg>
      <span class="nav-text text-gray-200 group-hover:text-blue-400 transition-colors">Work</span>
    </a>
    
    <!-- Skills Link -->
    <a href="/services" class="nav-item flex flex-col items-center group" aria-label="Skills">
      <svg class="nav-icon mb-1" width="24" height="24" viewBox="0 0 24 24" fill={currentPath === '/services' ? '#60a5fa' : '#d1d5db'} xmlns="http://www.w3.org/2000/svg">
        <path d="M21.67 18.17l-5.3-5.3h-.99l-2.54 2.54v.99l5.3 5.3c.39.39 1.02.39 1.41 0l2.12-2.12c.39-.38.39-1.02 0-1.41zm-2.83 1.42l-4.24-4.24.71-.71 4.24 4.24-.71.71z"/>
        <path d="M17.34 10.19l1.41-1.41 2.12 2.12c1.17-1.17 1.17-3.07 0-4.24l-3.54-3.54-1.41 1.41V1.71l-.7-.71-3.54 3.54.71.71h2.83l-1.41 1.41 1.06 1.06-2.89 2.89-4.13-4.13V5.06L4.83 2.04 2 4.87 5.03 7.9h1.41l4.13 4.13-.85.85H7.6l-5.3 5.3c-.39.39-.39 1.02 0 1.41l2.12 2.12c.39.39 1.02.39 1.41 0l5.3-5.3v-2.12l5.15-5.15 1.06 1.05zm-7.98 5.15l-4.24 4.24-.71-.71 4.24-4.24.71.71z"/>
      </svg>
      <span class="nav-text text-gray-200 group-hover:text-blue-400 transition-colors">Skills</span>
    </a>
  </div>
</nav>

<style>
  .brand-logo {
    position: relative;
    overflow: hidden;
  }
  
  .brand-logo::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #60a5fa;
    transition: width 0.4s ease-in-out;
  }
  
  .brand-logo:hover::after {
    width: 100%;
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
  .nav-item[href="/"] .nav-icon {
    animation: floating 3s ease-in-out infinite;
  }
  
  .nav-item[href="/portfolio"] .nav-icon {
    animation: floating 3.5s ease-in-out infinite 0.5s;
  }
  
  .nav-item[href="/services"] .nav-icon {
    animation: floating 4s ease-in-out infinite 1s;
  }
  
  @keyframes floating {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0px); }
  }
</style> 