<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';

  let container: HTMLElement;
  let isVisible = false;
  let animationId: number;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let particles: THREE.Points;
  let starField: THREE.Points;
  let galaxyCore: THREE.Points; // New galaxy core object
  let positions: Float32Array;
  let colors: Float32Array;
  let sizes: Float32Array;
  let velocities: Float32Array;
  let lastTime = 0;
  let startTime = 0;
  
  // Animation properties
  let particleCount: number;
  const particleSize = 5;
  const maxRange = 2000;
  
  // Spiral galaxy properties
  const spiralArms = 8; // Number of spiral arms
  const spiralTightness = 0.5; // How tight the spiral is
  const galaxyRadius = 1500; // Size of the galaxy
  const coreSize = 650; // Size of the dense central core
  const galaxyCoreParticles = 700; // Particles in the galaxy core - reduced density
  
  // Animation timing control
  let animationPhase = 'entry'; // 'entry', 'normal'
  let entryDuration = 6800; // ms - extended to 6 seconds for more dramatic entry
  let entryProgress = 0; // 0-1 progress through entry
  
  // Camera properties - adjusted positions for better vertical positioning and core entry
  let cameraPosition = new THREE.Vector3(0, 2500, 6000); // Start higher and further back
  let cameraTarget = new THREE.Vector3(0, 200, 0); // Look slightly above the center
  let targetCameraPosition = new THREE.Vector3(0, 50, 50); // End position INSIDE the galaxy core
  
  // Cluster properties for more dramatic visual effects
  let clusters: { 
    position: THREE.Vector3, 
    size: number, 
    speed: number, 
    phase: number,
    colorBase: number,
    armIndex: number // Which spiral arm this cluster belongs to
  }[] = [];
  const clusterCount = 6; // Increased for more variety
  
  // Travel path for continuous movement
  let travelPath: { position: THREE.Vector3, lookAt: THREE.Vector3 }[] = [];
  let currentPathIndex = 0;
  let pathProgress = 0;
  const pathTransitionTime = 12000; // Time to travel between path points (ms)
  
  // Customizable props
  export let speed = 0.210; // Speed reduced by 40% from previous value
  export let autoStart = true;
  export let highPerformance = true;
  
  // Directional flow particles for enhanced travel effect
  let flowParticles: THREE.Points;
  const flowParticleCount = 800; // Number of flowing particles
  
  // Create a circular texture for particles
  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    const size = 128;
    canvas.width = size;
    canvas.height = size;
    
    const context = canvas.getContext('2d');
    if (!context) return null;
    
    // Draw a circle with soft edges
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;
    
    // Create radial gradient for softer edges
    const gradient = context.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    
    // Semi-transparent white for better color blending
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fill();
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }
  
  // Generate a galaxy-themed color palette
  function getColorPalette() {
    return [
      { hue: 0.7, name: 'blue' },       // Blue
      { hue: 0.85, name: 'purple' },    // Purple
      { hue: 0.65, name: 'teal' },      // Teal
      { hue: 0.1, name: 'orange' },     // Orange
      { hue: 0.95, name: 'pink' },      // Pink
      { hue: 0.55, name: 'turquoise' }  // Turquoise
    ];
  }
  
  // Create spiral pattern coordinates
  function getSpiralPosition(radius: number, angle: number, armIndex: number, height: number = 0): THREE.Vector3 {
    // Add arm offset angle
    const armOffset = (Math.PI * 2 / spiralArms) * armIndex;
    const totalAngle = angle + armOffset;
    
    // Logarithmic spiral formula
    const adjustedRadius = radius * Math.exp(spiralTightness * totalAngle);
    const x = adjustedRadius * Math.cos(totalAngle);
    const y = height + (Math.random() - 0.5) * 100; // Small vertical variation
    const z = adjustedRadius * Math.sin(totalAngle);
    
    return new THREE.Vector3(x, y, z);
  }
  
  function init() {
    // Record start time for animation phases
    startTime = performance.now();
    
    // Set particle count based on performance mode
    particleCount = highPerformance ? 3000 : 1200;
    
    // Create scene with fog for depth effect
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000a15, 0.00023); // Lighter fog for more visibility
    
    // Create camera with a fixed position (no movement)
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(85, aspectRatio, 1, 15000);
    camera.position.copy(cameraPosition);
    camera.lookAt(cameraTarget);
    
    // Set up the travel path for continuous movement through the galaxy
    setupTravelPath();
    
    // Create spiral galaxy structure
    createGalaxyStructure();
    
    // Create bright, dense galaxy core
    createGalaxyCore();
    
    // Create flowing particles that enhance the travel feeling
    createFlowingParticles();
    
    // Add a background starfield
    createStarField();
    
    // Create renderer with post-processing effects
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    // Set higher pixel ratio for better quality on high-DPI displays, but cap at 2
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Start with galaxy almost invisible to enhance the entry effect
    const particleMaterial = particles.material as THREE.PointsMaterial;
    const coreMaterial = galaxyCore.material as THREE.PointsMaterial;
    const flowMaterial = flowParticles.material as THREE.PointsMaterial;
    
    particleMaterial.opacity = 0.2;
    coreMaterial.opacity = 0.1;
    flowMaterial.opacity = 0.2;
    
    // Handle resize
    window.addEventListener('resize', onWindowResize);
  }
  
  // Setup travel path for continuous journey through the galaxy
  function setupTravelPath() {
    // Create interesting path points that take us throughout the galaxy
    travelPath = [
      // Initial entry point (inside core)
      {
        position: new THREE.Vector3(0, 50, 50),
        lookAt: new THREE.Vector3(0, 0, -100)
      },
      // Move through first arm
      {
        position: new THREE.Vector3(400, 100, -300),
        lookAt: new THREE.Vector3(700, 50, -500)
      },
      // Fly above the galaxy plane
      {
        position: new THREE.Vector3(800, 400, -200),
        lookAt: new THREE.Vector3(0, -100, 0)
      },
      // Descend into another spiral arm
      {
        position: new THREE.Vector3(-600, 100, -400),
        lookAt: new THREE.Vector3(-800, 0, -100)
      },
      // Wide orbit around the galaxy
      {
        position: new THREE.Vector3(-1000, 300, 500),
        lookAt: new THREE.Vector3(0, 0, 0)
      },
      // Dive back toward the center
      {
        position: new THREE.Vector3(-300, 50, 800),
        lookAt: new THREE.Vector3(0, 0, 0)
      },
      // Return to core from opposite side
      {
        position: new THREE.Vector3(0, 80, 300),
        lookAt: new THREE.Vector3(0, 0, -100)
      }
    ];
  }
  
  // Create the spiral galaxy structure
  function createGalaxyStructure() {
    const geometry = new THREE.BufferGeometry();
    positions = new Float32Array(particleCount * 3);
    colors = new Float32Array(particleCount * 3);
    sizes = new Float32Array(particleCount);
    velocities = new Float32Array(particleCount * 3);
    
    const color = new THREE.Color();
    const colorPalette = getColorPalette();
    
    // Create clusters along spiral arms
    for (let i = 0; i < clusterCount; i++) {
      // Choose a spiral arm for this cluster
      const armIndex = i % spiralArms;
      
      // Assign a color theme based on the arm
      const colorBase = colorPalette[i % colorPalette.length].hue;
      
      // Determine position along the spiral
      const angle = (Math.random() * 1.5) + 1; // Position along spiral (1-2.5 radians)
      const radiusOffset = galaxyRadius * (0.4 + Math.random() * 0.5); // 40-90% out from center
      
      // Get position on the spiral
      const position = getSpiralPosition(radiusOffset, angle, armIndex);
      
      clusters.push({
        position: position,
        size: Math.random() * 400 + 300,
        speed: Math.random() * 0.3 + 0.2,
        phase: Math.random() * Math.PI * 2,
        colorBase: colorBase,
        armIndex: armIndex
      });
    }
    
    for (let i = 0; i < particleCount; i++) {
      let x, y, z;
      let colorBase = Math.random();
      
      if (i < particleCount * 0.8) {
        // 80% of particles follow the spiral structure
        const armIndex = Math.floor(Math.random() * spiralArms);
        const angle = Math.random() * 3; // 0 to 3 radians along spiral
        
        // Distance from center follows galaxy density distribution
        // Square root creates more density in the center
        const radius = Math.sqrt(Math.random()) * galaxyRadius;
        
        // Vertical position with bell curve distribution
        const height = (Math.random() + Math.random() + Math.random() - 1.5) * 150;
        
        // Get position along spiral
        const spiralPos = getSpiralPosition(radius, angle, armIndex, height);
        
        // Apply some random scatter to make it look natural
        const scatter = 30 + radius * 0.05; // More scatter further out
        x = spiralPos.x + (Math.random() - 0.5) * scatter;
        y = spiralPos.y + (Math.random() - 0.5) * scatter;
        z = spiralPos.z + (Math.random() - 0.5) * scatter;
        
        // Color based on arm index for consistent color per arm
        const clusterForArm = clusters.find(c => c.armIndex === armIndex);
        if (clusterForArm) {
          colorBase = clusterForArm.colorBase;
        }
      } else {
        // 20% of particles are scattered around
        const radius = Math.random() * maxRange;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 2;
        
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = (Math.random() - 0.5) * 500; // Flatter distribution for galaxy shape
        z = radius * Math.sin(phi) * Math.sin(theta);
        
        // Outer particles can be any color
        colorBase = Math.random();
      }
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Individual floating velocities - slow rotation around center
      const distanceFromCenter = Math.sqrt(x*x + z*z);
      const rotationSpeed = Math.max(0.5, 10 / (distanceFromCenter + 10)); // Faster rotation near center
      
      // Circular orbital velocities
      const angle = Math.atan2(z, x);
      velocities[i * 3] = -Math.sin(angle) * rotationSpeed;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2; // Slight vertical drift
      velocities[i * 3 + 2] = Math.cos(angle) * rotationSpeed;
      
      // Dynamic color based on position and arm
      const distanceNorm = Math.min(1, distanceFromCenter / galaxyRadius);
      
      // Add variation to the base color while keeping within themed range
      const hueVariation = 0.1; // Less variation for more consistent arm colors
      const hue = (colorBase + (Math.random() - 0.5) * hueVariation) % 1.0;
      
      // Vary saturation and lightness based on distance from center
      const saturation = 0.7 + Math.random() * 0.3;
      // Brighter in center, dimmer at edges
      const lightness = 0.3 + Math.random() * 0.3 + (1 - distanceNorm) * 0.2;
      
      color.setHSL(hue, saturation, lightness);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Size based on distance from center - larger in center
      const baseSize = Math.random() * particleSize;
      sizes[i] = baseSize * (0.8 + 1.8 * (1 - distanceNorm)); // Larger if closer to center
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create a circular texture for the particles
    const circleTexture = createCircleTexture();
    
    // Use a custom shader material for more dramatic particle rendering
    const material = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: circleTexture
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
  }
  
  // Create a bright, dense galaxy core
  function createGalaxyCore() {
    const coreGeometry = new THREE.BufferGeometry();
    const corePositions = new Float32Array(galaxyCoreParticles * 3);
    const coreColors = new Float32Array(galaxyCoreParticles * 3);
    const coreSizes = new Float32Array(galaxyCoreParticles);
    
    const color = new THREE.Color();
    
    // Create a less dense center with particles that are more spread out
    for (let i = 0; i < galaxyCoreParticles; i++) {
      // Use a modified distribution for a less dense center
      const radiusSq = Math.pow(Math.random(), 0.5) * coreSize; // Less concentrated
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI - Math.PI / 2;
      
      // Convert spherical to cartesian coordinates with more vertical spread
      corePositions[i * 3] = radiusSq * Math.cos(phi) * Math.cos(theta);
      corePositions[i * 3 + 1] = (radiusSq * 0.4) * Math.sin(phi) + 100; // Added +100 to move particles up
      corePositions[i * 3 + 2] = radiusSq * Math.cos(phi) * Math.sin(theta);
      
      // Color - bright white-yellow in center, matching arm colors at edges
      const distFromCenter = radiusSq / coreSize;
      
      // Weighted random choice to select between white and colored core
      let hue, saturation, lightness;
      
      if (Math.random() < 0.6 - distFromCenter * 0.5) { // Reduced central brightness probability
        // Bright white-yellow center (60% of inner particles, down from 70%)
        hue = 0.14; // Slight yellow tint
        saturation = 0.4 * distFromCenter; // Higher saturation for more visible color
        lightness = 0.65 - 0.3 * distFromCenter; // Slightly less bright
      } else {
        // More colored particles matching arms
        const colorIndex = Math.floor(Math.random() * getColorPalette().length);
        hue = getColorPalette()[colorIndex].hue;
        saturation = 0.7;
        lightness = 0.5;
      }
      
      color.setHSL(hue, saturation, lightness);
      
      coreColors[i * 3] = color.r;
      coreColors[i * 3 + 1] = color.g;
      coreColors[i * 3 + 2] = color.b;
      
      // Size - more variation for a less uniform appearance
      const sizeVariation = Math.random() * 0.8 + 0.3;
      coreSizes[i] = particleSize * (1.2 - distFromCenter * 0.4) * sizeVariation;
    }
    
    coreGeometry.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
    coreGeometry.setAttribute('color', new THREE.BufferAttribute(coreColors, 3));
    coreGeometry.setAttribute('size', new THREE.BufferAttribute(coreSizes, 1));
    
    // Create a circular texture
    const circleTexture = createCircleTexture();
    
    // Less intense core material with lower opacity
    const coreMaterial = new THREE.PointsMaterial({
      size: 5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8, // Reduced opacity from 0.9
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: circleTexture
    });
    
    galaxyCore = new THREE.Points(coreGeometry, coreMaterial);
    galaxyCore.position.y = 250; // Move the entire core up by 100 units - adjust this value as needed
    scene.add(galaxyCore);
  }
  
  // Create a background star field for additional depth
  function createStarField() {
    const starCount = highPerformance ? 4000 : 2000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    
    const farRange = maxRange * 2.5; // Extended range for dramatic entry
    const starColor = new THREE.Color();
    
    for (let i = 0; i < starCount; i++) {
      // Position stars in a full sphere around the camera
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;
      const distance = Math.random() * farRange + maxRange;
      
      // Add more stars in the forward direction for "traveling through space" effect
      let x, y, z;
      if (Math.random() < 0.4) {
        // 40% of stars are in front of us for travel effect
        const forwardDistance = Math.random() * 4000 + 2000; // Well ahead of camera
        const spread = Math.random() * 2500;
        x = (Math.random() - 0.5) * spread;
        y = (Math.random() - 0.5) * spread;
        z = -forwardDistance; // Negative z is forward
      } else {
        // Rest of stars are all around
        x = Math.sin(angle1) * Math.cos(angle2) * distance;
        y = Math.sin(angle1) * Math.sin(angle2) * distance;
        z = Math.cos(angle1) * distance;
      }
      
      starPositions[i * 3] = x ;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = z;
      
      // More varied star colors - from blue to gold to red
      const hue = Math.random(); // Full spectrum for stars
      const saturation = 0.2 + Math.random() * 0.5;
      const lightness = 0.4 + Math.random() * 0.4;
      
      starColor.setHSL(hue, saturation, lightness);
      
      starColors[i * 3] = starColor.r;
      starColors[i * 3 + 1] = starColor.g;
      starColors[i * 3 + 2] = starColor.b;
      
      // Smaller sizes for background stars, but vary for depth
      starSizes[i] = Math.random() * 2 + 0.5;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    
    // Create circular texture for star field as well
    const circleTexture = createCircleTexture();
    
    const starMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: circleTexture
    });
    
    starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
  }
  
  // Create flowing particles for enhanced travel effect
  function createFlowingParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(flowParticleCount * 3);
    const colors = new Float32Array(flowParticleCount * 3);
    const sizes = new Float32Array(flowParticleCount);
    
    const color = new THREE.Color();
    
    // Create particles in a tube shape pointing toward the center
    // These will create the illusion of flowing toward the core
    for (let i = 0; i < flowParticleCount; i++) {
      // Set particles in a cylindrical pattern around camera path
      // More concentrated toward the final path for more intensity
      const progressOnPath = Math.pow(Math.random(), 0.5); // Bias toward entry point (end of path)
      
      // Calculate position along camera path
      const pathX = cameraPosition.x + (targetCameraPosition.x - cameraPosition.x) * progressOnPath;
      const pathY = cameraPosition.y + (targetCameraPosition.y - cameraPosition.y) * progressOnPath;
      const pathZ = cameraPosition.z + (targetCameraPosition.z - cameraPosition.z) * progressOnPath;
      
      // Add some spread perpendicular to path direction
      // Less spread further along the path (converging tube)
      const spread = 2000 * (1 - progressOnPath);
      
      // Random position around path with decreasing spread
      positions[i * 3] = pathX + (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = pathY + (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = pathZ + (Math.random() - 0.5) * spread;
      
      // Colors: brighter and more blue/purple toward the front
      // More varied colors toward the back
      let hue, saturation, lightness;
      
      if (progressOnPath > 0.7) {
        // Front section - more blue/white streaks
        hue = 0.6 + Math.random() * 0.2; // Blue to purple range
        saturation = 0.3 + Math.random() * 0.3;
        lightness = 0.6 + Math.random() * 0.2; // Brighter
      } else {
        // Back section - more varied colors
        hue = Math.random(); // Full spectrum
        saturation = 0.4 + Math.random() * 0.4;
        lightness = 0.4 + Math.random() * 0.3;
      }
      
      color.setHSL(hue, saturation, lightness);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Smaller particles further away, larger toward the front for better depth
      const size = 2 + (3 * progressOnPath);
      sizes[i] = size * (0.5 + Math.random() * 0.5);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create a circular texture
    const circleTexture = createCircleTexture();
    
    // Material with elongated streaks for motion blur effect
    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: circleTexture
    });
    
    flowParticles = new THREE.Points(geometry, material);
    scene.add(flowParticles);
  }
  
  function animate(time = 0) {
    if (!isVisible) return;
    
    const delta = (time - lastTime) * 0.001;
    lastTime = time;
    
    // Calculate time since animation started
    const elapsedTime = time - startTime;
    
    // Handle entry animation phase (first 6 seconds)
    if (elapsedTime < entryDuration) {
      entryProgress = elapsedTime / entryDuration;
      handleEntryPhase(entryProgress, delta);
    } else if (animationPhase === 'entry') {
      // Transition to normal traveling phase
      animationPhase = 'normal';
      
      // Set up continuous travel animation
      startContinuousTravel();
    }
    
    // If in normal phase, update the continuous travel
    if (animationPhase === 'normal') {
      updateContinuousTravel(delta, elapsedTime);
    }
    
    // Update particles with galaxy motion
    updateGalaxyParticles(delta, elapsedTime);
    
    // Update galaxy core with subtle pulsing
    updateGalaxyCore(delta, elapsedTime);
    
    // Update flow particles for continuous travel effect in normal phase
    if (animationPhase === 'normal' && flowParticles) {
      updateContinuousFlow(delta, elapsedTime);
    }
    
    // Render scene
    renderer.render(scene, camera);
    
    // Request next frame
    animationId = requestAnimationFrame(animate);
  }
  
  // Handle the dramatic entry phase
  function handleEntryPhase(progress: number, delta: number) {
    // Create a more dramatic, three-stage camera movement
    // Stage 1: Approach from distance (0-30%)
    // Stage 2: Fly toward and through the outer galaxy (30-70%)
    // Stage 3: Dive into the core (70-100%)
    let smoothProgress;
    let cameraTemp = new THREE.Vector3();
    let lookTemp = new THREE.Vector3();
    
    if (progress < 0.3) {
      // Stage 1 - approach from a distance (see the whole galaxy)
      // Slower approach initially, then accelerating
      const adjustedProgress = progress / 0.3; // Scale to 0-1 for this phase
      smoothProgress = adjustedProgress * adjustedProgress; // Quadratic ease-in
      
      // Move from starting position to a mid observation point
      const midPosition1 = new THREE.Vector3(0, 1200, 3500);
      cameraTemp.lerpVectors(cameraPosition, midPosition1, smoothProgress);
      
      // Look at the galaxy center but slightly elevated
      lookTemp.set(0, 200, 0);
      
      // Gradually reduce camera FOV for zoom feel
      const startFOV = 85;
      const midFOV = 75;
      camera.fov = startFOV - (startFOV - midFOV) * smoothProgress;
    } 
    else if (progress < 0.7) {
      // Stage 2 - fly toward outer parts of galaxy
      const adjustedProgress = (progress - 0.3) / 0.4; // Scale to 0-1 for this phase
      smoothProgress = adjustedProgress; // Linear motion during middle section
      
      // Move from mid observation to entry point of outer galaxy arms
      const midPosition1 = new THREE.Vector3(0, 1200, 3500);
      const midPosition2 = new THREE.Vector3(0, 600, 1200);
      cameraTemp.lerpVectors(midPosition1, midPosition2, smoothProgress);
      
      // Look at where we're going - slightly ahead and into the core
      const lookStart = new THREE.Vector3(0, 200, 0);
      const lookMid = new THREE.Vector3(0, 100, -300);
      lookTemp.lerpVectors(lookStart, lookMid, smoothProgress);
      
      // Maintain mid FOV during this phase
      camera.fov = 75;
    } 
    else {
      // Stage 3 - dive into the galaxy core
      const adjustedProgress = (progress - 0.7) / 0.3; // Scale to 0-1 
      // Ease out for a smooth arrival - decelerating
      smoothProgress = 1 - Math.pow(1 - adjustedProgress, 3);
      
      // Final dive into the core
      const midPosition2 = new THREE.Vector3(0, 600, 1200);
      cameraTemp.lerpVectors(midPosition2, targetCameraPosition, smoothProgress);
      
      // Look toward core center as we approach
      const lookMid = new THREE.Vector3(0, 100, -300);
      const lookFinal = new THREE.Vector3(0, 0, -150);
      lookTemp.lerpVectors(lookMid, lookFinal, smoothProgress);
      
      // Widen FOV as we enter to enhance immersion
      const midFOV = 75;
      const finalFOV = 90; // Wider at the end for more immersive feeling
      camera.fov = midFOV + (finalFOV - midFOV) * smoothProgress;
    }
    
    // Apply the calculated position and look direction
    camera.position.copy(cameraTemp);
    camera.lookAt(lookTemp);
    camera.updateProjectionMatrix(); // Update after FOV changes
    
    // Dynamic rotation based on phase
    if (progress < 0.7) {
      // Earlier phases - faster rotation viewed from outside
      const rotationBase = (1 - progress * 1.3) * 0.015;
      galaxyCore.rotation.y += rotationBase;
      particles.rotation.y += rotationBase * 0.7;
    } else {
      // Final phase - slowing rotation as we approach core (feels more stable)
      const finalPhaseProgress = (progress - 0.7) / 0.3;
      const rotationSpeed = 0.004 * (1 - finalPhaseProgress);
      galaxyCore.rotation.y += rotationSpeed;
      particles.rotation.y += rotationSpeed * 0.7;
    }
    
    // Update flow particles to enhance the moving effect
    updateFlowParticles(progress, delta);
    
    // Add galaxy approach special effects
    // Increase brightness and overall saturation as we get closer
    const brightnessFactor = Math.min(1, progress * 1.5); // Ramp up brightness
    
    // Make galaxy and stars more visible as we approach
    if (progress > 0.1) {
      // Type casting to access the opacity property
      const particleMaterial = particles.material as THREE.PointsMaterial;
      const coreMaterial = galaxyCore.material as THREE.PointsMaterial;
      const flowMaterial = flowParticles.material as THREE.PointsMaterial;
      
      particleMaterial.opacity = 0.3 + brightnessFactor * 0.5; // Fade in the galaxy
      coreMaterial.opacity = 0.2 + brightnessFactor * 0.6; // Fade in the core
      flowMaterial.opacity = 0.2 + brightnessFactor * 0.6; // Fade in flow particles
    }
    
    // Increase perceived speed during entry (trail effect)
    const speedMultiplier = 3 - progress * 1.5; // More gradual speed reduction
    
    // Update star field for "warp" effect during entry
    const starPositions = starField.geometry.attributes.position.array as Float32Array;
    const starCount = starPositions.length / 3;
    
    for (let i = 0; i < starCount; i++) {
      if (Math.random() < 0.25) { // More stars updated for denser effect
        const ix = i * 3;
        const z = starPositions[ix + 2];
        
        // More dramatic star movement (streak effect)
        starPositions[ix + 2] += 80 * delta * speedMultiplier;
        
        // If star passes camera, reset it far in front
        if (z > 1000) {
          const distance = Math.random() * 5000 + 2000;
          starPositions[ix] = (Math.random() - 0.5) * 3000; // Wider spread
          starPositions[ix + 1] = (Math.random() - 0.5) * 3000; // Wider spread
          starPositions[ix + 2] = -distance;
        }
      }
    }
    
    starField.geometry.attributes.position.needsUpdate = true;
  }
  
  // Update the flow particles for a more dynamic traveling effect
  function updateFlowParticles(progress: number, delta: number) {
    if (!flowParticles) return;
    
    const flowPositions = flowParticles.geometry.attributes.position.array as Float32Array;
    const flowCount = flowPositions.length / 3;
    
    // Speed gets faster as we progress - feeling of acceleration
    const flowSpeedBase = 100 * (0.5 + progress * 2); // Starts slow, gets very fast
    
    // Update flow particles - giving the impression of movement
    for (let i = 0; i < flowCount; i++) {
      if (Math.random() < 0.3) { // Update 30% of particles each frame for performance
        const ix = i * 3;
        const x = flowPositions[ix];
        const y = flowPositions[ix + 1];
        const z = flowPositions[ix + 2];
        
        // Calculate distance from camera view line
        const dx = x - camera.position.x;
        const dy = y - camera.position.y;
        const distFromViewLine = Math.sqrt(dx*dx + dy*dy);
        
        // Movement speed based on distance from view line and progress
        // Particles closer to view line move faster
        const speedFactor = Math.max(0.2, 1 - (distFromViewLine / 1000));
        const flowSpeed = flowSpeedBase * speedFactor * delta;
        
        // Move particles forward (toward camera and past it)
        flowPositions[ix + 2] += flowSpeed;
        
        // If particle passes behind camera, reset it ahead with some randomization
        if (z > camera.position.z + 500) {
          // Calculate new position ahead of the camera
          // More concentrated toward where we're heading as we progress
          const newPosVariance = 3000 * (1 - progress);
          const aheadDistance = 2000 + Math.random() * 3000;
          
          flowPositions[ix] = camera.position.x + (Math.random() - 0.5) * newPosVariance;
          flowPositions[ix + 1] = camera.position.y + (Math.random() - 0.5) * newPosVariance;
          flowPositions[ix + 2] = camera.position.z - aheadDistance;
        }
      }
    }
    
    flowParticles.geometry.attributes.position.needsUpdate = true;
  }
  
  // Update the galaxy particles
  function updateGalaxyParticles(delta: number, elapsedTime: number) {
    // Get position, color and size arrays
    const positionsArray = particles.geometry.attributes.position.array as Float32Array;
    const colorsArray = particles.geometry.attributes.color.array as Float32Array;
    const sizesArray = particles.geometry.attributes.size.array as Float32Array;
    const count = positionsArray.length / 3;
    
    // Global time-based oscillation factors
    const timeScale = elapsedTime * 0.0001;
    const globalWaveX = Math.sin(timeScale) * 0.3;
    const globalWaveY = Math.cos(timeScale * 1.5) * 0.3;
    
    // Make clusters follow spiral motion
    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      cluster.phase += delta * 0.2 * cluster.speed;
      
      // Calculate rotation around galactic center
      const clusterDistFromCenter = cluster.position.length();
      const rotationSpeed = 0.05 * (1000 / (clusterDistFromCenter + 500)); // Faster rotation near center
      
      // Rotate cluster position around center
      const originalX = cluster.position.x;
      const originalZ = cluster.position.z;
      const angle = Math.atan2(originalZ, originalX) + rotationSpeed * delta;
      const radius = Math.sqrt(originalX * originalX + originalZ * originalZ);
      
      cluster.position.x = Math.cos(angle) * radius;
      cluster.position.z = Math.sin(angle) * radius;
      
      // Gentle oscillation of entire clusters in 3D space
      const oscillationAmplitude = 30 * cluster.speed;
      const offsetY = Math.sin(cluster.phase) * oscillationAmplitude;
      
      // Apply the movement to related particles
      for (let j = 0; j < count; j++) {
        const ix = j * 3;
        const x = positionsArray[ix];
        const y = positionsArray[ix + 1];
        const z = positionsArray[ix + 2];
        
        // Calculate distance to this cluster
        const dx = x - originalX;
        const dy = y - cluster.position.y;
        const dz = z - originalZ;
        const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        // If close to this cluster, move with it
        if (distance < cluster.size) {
          const influence = 1 - (distance / cluster.size); // Closer particles move more
          
          // Move with the cluster rotation
          const particleAngle = Math.atan2(z, x) + rotationSpeed * delta * influence;
          const particleRadius = Math.sqrt(x * x + z * z);
          
          positionsArray[ix] = Math.cos(particleAngle) * particleRadius;
          positionsArray[ix + 2] = Math.sin(particleAngle) * particleRadius;
          
          // Apply vertical oscillation
          positionsArray[ix + 1] += offsetY * influence * delta * 2;
        }
      }
    }
    
    // Update individual particles with galaxy rotation and floating motion
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const x = positionsArray[ix];
      const z = positionsArray[ix + 2];
      
      // Calculate distance from galaxy center
      const distanceFromCenter = Math.sqrt(x*x + z*z);
      
      // Apply orbital rotation - closer particles orbit faster
      if (distanceFromCenter > 1) { // Avoid division by zero
        const rotationSpeed = speed * (0.5 + (1000 / distanceFromCenter)) * delta;
        const angle = Math.atan2(z, x) + rotationSpeed * 0.1;
        
        positionsArray[ix] = Math.cos(angle) * distanceFromCenter;
        positionsArray[ix + 2] = Math.sin(angle) * distanceFromCenter;
      }
      
      // Apply individual velocity influences
      const vix = i * 3;
      const floatFactor = speed * 3 * delta;
      
      // Add small random movements
      positionsArray[ix] += velocities[vix] * floatFactor * (1 + globalWaveX);
      positionsArray[ix + 1] += velocities[vix + 1] * floatFactor;
      positionsArray[ix + 2] += velocities[vix + 2] * floatFactor * (1 + globalWaveY);
      
      // Add subtle pulsing size effect
      const particleTime = elapsedTime * 0.001 + i * 0.1;
      const pulseFactor = 0.15 * Math.sin(particleTime);
      const originalSize = sizesArray[i];
      sizesArray[i] = originalSize * (1 + pulseFactor);
      
      // Subtle color shift over time for twinkling effect
      if (Math.random() < 0.005) { // Only update some particles each frame for performance
        const colorIx = i * 3;
        
        // Extract current color components 
        const r = colorsArray[colorIx];
        const g = colorsArray[colorIx + 1];
        const b = colorsArray[colorIx + 2];
        
        // Convert to HSL for easier modification
        const color = new THREE.Color(r, g, b);
        const hsl = { h: 0, s: 0, l: 0 };
        color.getHSL(hsl);
        
        // Slightly shift hue and lightness
        hsl.h = (hsl.h + 0.001) % 1.0;
        hsl.l = Math.max(0.2, Math.min(0.8, hsl.l + (Math.random() - 0.5) * 0.05));
        
        // Convert back to RGB
        color.setHSL(hsl.h, hsl.s, hsl.l);
        
        // Update color
        colorsArray[colorIx] = color.r;
        colorsArray[colorIx + 1] = color.g;
        colorsArray[colorIx + 2] = color.b;
      }
    }
    
    // Update geometry attributes
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.size.needsUpdate = true;
    particles.geometry.attributes.color.needsUpdate = true;
  }
  
  // Update galaxy core with pulsing effect
  function updateGalaxyCore(delta: number, elapsedTime: number) {
    // Gentle rotation of the core
    galaxyCore.rotation.y += delta * 0.05;
    
    // Pulsing effect for galaxy core
    const pulseMagnitude = Math.sin(elapsedTime * 0.001) * 0.1 + 1;
    galaxyCore.scale.set(pulseMagnitude, pulseMagnitude, pulseMagnitude);
    
    // Update galaxy core particles
    const coreSizes = galaxyCore.geometry.attributes.size.array as Float32Array;
    const coreColors = galaxyCore.geometry.attributes.color.array as Float32Array;
    const coreCount = coreSizes.length;
    
    // Occasional bright flashes in the core
    if (Math.random() < 0.01) {
      const flashIndex = Math.floor(Math.random() * coreCount);
      
      // Make this particle temporarily brighter
      const originalSize = coreSizes[flashIndex];
      coreSizes[flashIndex] = originalSize * (1.5 + Math.random());
      
      // Brighter color
      const colorIx = flashIndex * 3;
      const color = new THREE.Color(
        coreColors[colorIx],
        coreColors[colorIx + 1],
        coreColors[colorIx + 2]
      );
      
      const hsl = { h: 0, s: 0, l: 0 };
      color.getHSL(hsl);
      
      // Increase brightness
      color.setHSL(hsl.h, hsl.s, Math.min(0.9, hsl.l + 0.2));
      
      coreColors[colorIx] = color.r;
      coreColors[colorIx + 1] = color.g;
      coreColors[colorIx + 2] = color.b;
    }
    
    galaxyCore.geometry.attributes.size.needsUpdate = true;
    galaxyCore.geometry.attributes.color.needsUpdate = true;
  }
  
  // Start continuous travel after entry phase
  function startContinuousTravel() {
    // Begin the continuous travel through the galaxy
    currentPathIndex = 0;
    pathProgress = 0;
    
    // Ensure we have the correct starting position
    camera.position.copy(travelPath[0].position);
    camera.lookAt(travelPath[0].lookAt);
    camera.fov = 85; // Set a good FOV for traveling
    camera.updateProjectionMatrix();
    
    // Make sure all elements are fully visible
    const particleMaterial = particles.material as THREE.PointsMaterial;
    const coreMaterial = galaxyCore.material as THREE.PointsMaterial;
    const flowMaterial = flowParticles.material as THREE.PointsMaterial;
    
    particleMaterial.opacity = 0.8;
    coreMaterial.opacity = 0.8;
    flowMaterial.opacity = 0.8;
    
    // Reset flow particles to enhance travel effect
    resetFlowParticlesForTravel();
  }
  
  // Update the continuous travel animation
  function updateContinuousTravel(delta: number, elapsedTime: number) {
    // Update path progress
    pathProgress += (delta * 1000) / pathTransitionTime;
    
    // If we've reached the end of current path segment, move to next one
    if (pathProgress >= 1) {
      currentPathIndex = (currentPathIndex + 1) % travelPath.length;
      pathProgress = 0;
    }
    
    // Get current and next path points
    const currentPoint = travelPath[currentPathIndex];
    const nextIndex = (currentPathIndex + 1) % travelPath.length;
    const nextPoint = travelPath[nextIndex];
    
    // Smooth easing for more natural camera movement
    // Use sine curve for smooth acceleration and deceleration
    const smoothProgress = 0.5 - 0.5 * Math.cos(pathProgress * Math.PI);
    
    // Interpolate position and lookAt
    const newPosition = new THREE.Vector3();
    newPosition.lerpVectors(currentPoint.position, nextPoint.position, smoothProgress);
    
    const newLookAt = new THREE.Vector3();
    newLookAt.lerpVectors(currentPoint.lookAt, nextPoint.lookAt, smoothProgress);
    
    // Apply to camera
    camera.position.copy(newPosition);
    camera.lookAt(newLookAt);
    
    // Subtle FOV changes based on distance to galaxy center for dynamism
    const distanceToCenter = camera.position.length();
    const baseFOV = 85;
    const fovVariation = 10;
    
    // Closer to center = wider FOV for immersion
    camera.fov = baseFOV - fovVariation * (Math.min(1, distanceToCenter / 1000));
    camera.updateProjectionMatrix();
    
    // Update flow particles to match travel direction
    updateFlowParticlesForTravel(newLookAt.clone().sub(newPosition).normalize());
  }
  
  // Reset flow particles for continuous travel animation
  function resetFlowParticlesForTravel() {
    if (!flowParticles) return;
    
    const flowPositions = flowParticles.geometry.attributes.position.array as Float32Array;
    const flowCount = flowPositions.length / 3;
    
    // Direction we're looking at
    const direction = travelPath[0].lookAt.clone().sub(travelPath[0].position).normalize();
    
    // Create particles in a tunnel shape along our travel path
    for (let i = 0; i < flowCount; i++) {
      const ix = i * 3;
      
      // Random position in a cylinder around the view direction
      // Basic orthogonal vectors to the direction
      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(direction, up).normalize();
      const trueUp = new THREE.Vector3().crossVectors(right, direction).normalize();
      
      // Random angle around the view direction
      const angle = Math.random() * Math.PI * 2;
      const radius = 100 + Math.random() * 600;
      
      // Random distance along the view direction
      const distance = -1000 - Math.random() * 3000;
      
      // Calculate final position
      const pos = new THREE.Vector3()
        .addScaledVector(direction, distance)
        .addScaledVector(right, Math.cos(angle) * radius)
        .addScaledVector(trueUp, Math.sin(angle) * radius)
        .add(camera.position);
      
      // Set the position
      flowPositions[ix] = pos.x;
      flowPositions[ix + 1] = pos.y;
      flowPositions[ix + 2] = pos.z;
    }
    
    flowParticles.geometry.attributes.position.needsUpdate = true;
  }
  
  // Update flow particles to match current travel direction
  function updateFlowParticlesForTravel(direction: THREE.Vector3) {
    if (!flowParticles) return;
    
    const flowPositions = flowParticles.geometry.attributes.position.array as Float32Array;
    const flowCount = flowPositions.length / 3;
    
    // Find orthogonal vectors to our direction for creating tunnel effect
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(direction, up).normalize();
    const trueUp = new THREE.Vector3().crossVectors(right, direction).normalize();
    
    // Speed is slower now (reduced by 40% as requested)
    const baseSpeed = 180; // Reduced from 300
    
    for (let i = 0; i < flowCount; i++) {
      if (Math.random() < 0.15) { // Process fewer particles each frame for better performance
        const ix = i * 3;
        
        // Current position
        const pos = new THREE.Vector3(
          flowPositions[ix],
          flowPositions[ix + 1],
          flowPositions[ix + 2]
        );
        
        // Vector from camera to particle
        const vectorToParticle = pos.clone().sub(camera.position);
        
        // Projected distance along view direction
        const distanceAlong = vectorToParticle.dot(direction);
        
        // Move particles along the view direction
        const moveSpeed = baseSpeed * (0.008 + 0.004 * Math.random());
        pos.addScaledVector(direction, moveSpeed);
        
        // If particle is too far behind us or too far ahead, reset it
        if (distanceAlong > 500 || distanceAlong < -4000 || pos.distanceTo(camera.position) > 5000) {
          // Random angle around the view direction
          const angle = Math.random() * Math.PI * 2;
          const radius = 100 + Math.random() * 600;
          
          // Random distance ahead
          const distance = -1000 - Math.random() * 3000;
          
          // Calculate new position
          pos.copy(camera.position)
            .addScaledVector(direction, distance)
            .addScaledVector(right, Math.cos(angle) * radius)
            .addScaledVector(trueUp, Math.sin(angle) * radius);
        }
        
        // Update position
        flowPositions[ix] = pos.x;
        flowPositions[ix + 1] = pos.y;
        flowPositions[ix + 2] = pos.z;
      }
    }
    
    flowParticles.geometry.attributes.position.needsUpdate = true;
  }
  
  // Update flow particles in normal (post-entry) phase - now part of continuous travel
  function updateContinuousFlow(delta: number, elapsedTime: number) {
    // This is now handled by updateFlowParticlesForTravel
    // We'll still use this function for special effects
    
    // Gentle pulsing of particle sizes for more dynamic look
    const flowSizes = flowParticles.geometry.attributes.size?.array as Float32Array;
    
    if (flowSizes) {
      const sizePulse = 0.2 * Math.sin(elapsedTime * 0.0003);
      const baseSize = 3 * (1 + sizePulse);
      
      for (let i = 0; i < flowSizes.length; i++) {
        if (Math.random() < 0.05) {
          // Randomize a few particle sizes each frame
          flowSizes[i] = baseSize * (0.8 + Math.random() * 0.4);
        }
      }
      
      flowParticles.geometry.attributes.size.needsUpdate = true;
    }
  }
  
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  export function start() {
    if (!isVisible) {
      isVisible = true;
      startTime = performance.now(); // Reset start time for entry animation
      lastTime = startTime;
      animationPhase = 'entry'; // Reset to entry phase
      
      animationId = requestAnimationFrame(animate);
      
      // Add visible class for transition effect
      if (container) {
        container.classList.add('visible');
      }
    }
  }
  
  export function stop() {
    isVisible = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = 0;
    }
    // Remove visible class
    if (container) {
      container.classList.remove('visible');
    }
  }
  
  onMount(() => {
    if (typeof window !== 'undefined') {
      init();
      if (autoStart) {
        start();
      }
    }
    
    return () => {
      stop();
      if (renderer) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      window.removeEventListener('resize', onWindowResize);
    };
  });
  
  onDestroy(() => {
    stop();
    if (renderer) {
      renderer.dispose();
    }
  });
</script>

<div bind:this={container} class="background-animation">
  <!-- Three.js canvas will be inserted here -->
</div>

<style>
  .background-animation {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }
</style>