/* ==========================================================================
   Apple-Style 3D Portfolio Interactive Script
   Moh. Siraj Khan Mansoori - AI Security & ML Engineer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initScrollAnimations();
    initSecurityConsole();
    initResumePrint();
    initMobileMenu();
    initResizeListener();
});

// --- Global 3D Variables ---
let scene, camera, renderer;
let neuralCoreGroup;
let particleSystem, connectionLines;
let shieldRing1, shieldRing2;
let floatingShapes = [];
let targetCoreX = 0, targetCoreY = 0, targetCoreZ = 0;
let targetCoreRotX = 0, targetCoreRotY = 0;
let mouseX = 0, mouseY = 0;
let coreScale = 1.0;

// Particle count and parameters
const PARTICLE_COUNT = 300;
const MAX_CONNECT_DIST = 3.5;

// --- Initialize Three.js WebGL Scene ---
function initThreeJS() {
    const canvas = document.getElementById('webgl-canvas');
    
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Group to hold all neural core elements
    neuralCoreGroup = new THREE.Group();
    scene.add(neuralCoreGroup);

    // Create Neural Particles (AI Core Nodes)
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleSpeeds = [];

    // Distribute particles in a spherical formation
    for(let i = 0; i < PARTICLE_COUNT; i++) {
        // Spherical distribution
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 2.0 + Math.random() * 0.8; // Radius between 2.0 and 2.8

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        // Save drift parameters
        particleSpeeds.push({
            x: (Math.random() - 0.5) * 0.005,
            y: (Math.random() - 0.5) * 0.005,
            z: (Math.random() - 0.5) * 0.005,
            ox: x, oy: y, oz: z // Original position
        });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle Texture (Procedural Glowing Dot)
    const pTexture = createParticleTexture();

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00f2fe,
        size: 0.12,
        map: pTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    neuralCoreGroup.add(particleSystem);

    // Create Connection Lines (Synapses)
    const lineIndices = [];
    const positions = particleGeometry.attributes.position.array;

    // Find pairs that are close and connect them
    for(let i = 0; i < PARTICLE_COUNT; i++) {
        const x1 = positions[i * 3];
        const y1 = positions[i * 3 + 1];
        const z1 = positions[i * 3 + 2];

        // Connect up to 3 neighbors per particle to limit line count (performance optimization)
        let connections = 0;
        for(let j = i + 1; j < PARTICLE_COUNT; j++) {
            if (connections >= 3) break;
            
            const x2 = positions[j * 3];
            const y2 = positions[j * 3 + 1];
            const z2 = positions[j * 3 + 2];

            const dist = Math.sqrt((x1 - x2)**2 + (y1 - y2)**2 + (z1 - z2)**2);
            if (dist < MAX_CONNECT_DIST) {
                lineIndices.push(i, j);
                connections++;
            }
        }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    lineGeometry.setIndex(lineIndices);

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x8a2be2,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    neuralCoreGroup.add(connectionLines);

    // Create Outer Security Rings (Orbiting Shield Bands)
    const ringGeom1 = new THREE.RingGeometry(3.6, 3.7, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    shieldRing1 = new THREE.Mesh(ringGeom1, ringMat1);
    shieldRing1.rotation.x = Math.PI / 3;
    shieldRing1.rotation.y = Math.PI / 4;
    neuralCoreGroup.add(shieldRing1);

    const ringGeom2 = new THREE.RingGeometry(4.0, 4.05, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
        color: 0x8a2be2,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    shieldRing2 = new THREE.Mesh(ringGeom2, ringMat2);
    shieldRing2.rotation.x = -Math.PI / 4;
    shieldRing2.rotation.y = Math.PI / 3;
    neuralCoreGroup.add(shieldRing2);

    // Create Floating Holographic 3D Geometries (Modern Abstract Shapes)
    const shapesConfig = [
        { geom: new THREE.TorusGeometry(0.5, 0.12, 12, 48), color: 0x00f2fe, pos: [-4, 2, -2] },
        { geom: new THREE.OctahedronGeometry(0.6, 0), color: 0x8a2be2, pos: [4, -3, -3] },
        { geom: new THREE.DodecahedronGeometry(0.5, 0), color: 0x00f2fe, pos: [-3, -2, -1] },
        { geom: new THREE.IcosahedronGeometry(0.55, 0), color: 0x8a2be2, pos: [3.5, 3.2, -2.5] },
        { geom: new THREE.TorusKnotGeometry(0.35, 0.1, 64, 8), color: 0x00f2fe, pos: [5, 0.5, -4] }
    ];

    shapesConfig.forEach((config) => {
        const group = new THREE.Group();
        
        // Translucent solid faces
        const meshMat = new THREE.MeshStandardMaterial({
            color: config.color,
            roughness: 0.2,
            metalness: 0.8,
            transparent: true,
            opacity: 0.3,
            flatShading: true,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(config.geom, meshMat);
        group.add(mesh);

        // Neon wireframe overlay
        const wireMat = new THREE.MeshBasicMaterial({
            color: config.color === 0x00f2fe ? 0x8a2be2 : 0x00f2fe,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        const wire = new THREE.Mesh(config.geom, wireMat);
        wire.scale.setScalar(1.02);
        group.add(wire);

        // Position
        group.position.set(config.pos[0], config.pos[1], config.pos[2]);
        
        // Random initial rotations
        group.rotation.x = Math.random() * Math.PI;
        group.rotation.y = Math.random() * Math.PI;
        
        // Store drift parameters
        floatingShapes.push({
            group: group,
            ox: config.pos[0],
            oy: config.pos[1],
            oz: config.pos[2],
            rotSpeedX: (Math.random() - 0.5) * 0.4,
            rotSpeedY: (Math.random() - 0.5) * 0.4,
            driftSpeed: 0.3 + Math.random() * 0.4,
            driftDist: 0.2 + Math.random() * 0.3,
            seed: Math.random() * 10
        });

        neuralCoreGroup.add(group);
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f2fe, 2, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8a2be2, 2, 20);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Mouse Move Event Listener for Parallax
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // Start Rendering Loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        const delta = clock.getDelta();

        // 1. Core Node Drift Animations
        const posAttr = particleGeometry.attributes.position;
        const posArray = posAttr.array;

        for(let i = 0; i < PARTICLE_COUNT; i++) {
            // Apply slight sinusoidal drift to nodes to make them feel organic
            const speedData = particleSpeeds[i];
            const waveX = Math.sin(elapsedTime * 0.5 + i) * 0.05;
            const waveY = Math.cos(elapsedTime * 0.4 + i) * 0.05;
            const waveZ = Math.sin(elapsedTime * 0.6 + i) * 0.05;

            posArray[i * 3] = speedData.ox + waveX;
            posArray[i * 3 + 1] = speedData.oy + waveY;
            posArray[i * 3 + 2] = speedData.oz + waveZ;
        }
        posAttr.needsUpdate = true;
        
        // Synapse positions match nodes because they share reference buffer
        connectionLines.geometry.attributes.position.needsUpdate = true;

        // 2. Slow Ambient Rotations of Groups & Rings
        particleSystem.rotation.y = elapsedTime * 0.05;
        particleSystem.rotation.x = elapsedTime * 0.02;
        connectionLines.rotation.y = elapsedTime * 0.05;
        connectionLines.rotation.x = elapsedTime * 0.02;

        shieldRing1.rotation.z = -elapsedTime * 0.08;
        shieldRing2.rotation.z = elapsedTime * 0.06;

        // 3. Floating Holographic shapes drift and spin animations
        floatingShapes.forEach((shape) => {
            // Spin shapes smoothly using absolute elapsed time
            shape.group.rotation.x = elapsedTime * shape.rotSpeedX;
            shape.group.rotation.y = elapsedTime * shape.rotSpeedY;

            // Slowly drift shapes up and down
            const drift = Math.sin(elapsedTime * shape.driftSpeed + shape.seed) * shape.driftDist;
            shape.group.position.y = shape.oy + drift;
            shape.group.position.x = shape.ox + Math.cos(elapsedTime * 0.2 + shape.seed) * 0.08;
        });
        
        // 3. Scroll & Mouse Interpolations (Parallax)
        // Combine scroll animation positions + mouse parallax offsets
        const targetX = targetCoreX + (mouseX * 2.0);
        const targetY = targetCoreY - (mouseY * 2.0);
        
        neuralCoreGroup.position.x += (targetX - neuralCoreGroup.position.x) * 0.05;
        neuralCoreGroup.position.y += (targetY - neuralCoreGroup.position.y) * 0.05;
        neuralCoreGroup.position.z += (targetCoreZ - neuralCoreGroup.position.z) * 0.05;

        neuralCoreGroup.scale.x += (coreScale - neuralCoreGroup.scale.x) * 0.05;
        neuralCoreGroup.scale.y += (coreScale - neuralCoreGroup.scale.y) * 0.05;
        neuralCoreGroup.scale.z += (coreScale - neuralCoreGroup.scale.z) * 0.05;

        // Rotate core group slightly based on mouse parallax
        const targetRotX = targetCoreRotX + (mouseY * 0.3);
        const targetRotY = targetCoreRotY + (mouseX * 0.3);
        neuralCoreGroup.rotation.x += (targetRotX - neuralCoreGroup.rotation.x) * 0.05;
        neuralCoreGroup.rotation.y += (targetRotY - neuralCoreGroup.rotation.y) * 0.05;

        // Core glow pulse intensity
        const pulse = 1.0 + Math.sin(elapsedTime * 2.0) * 0.15;
        pointLight1.intensity = 2.0 * pulse;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Generate procedurally glowing circle texture for particles
function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(0, 242, 254, 0.8)');
    grad.addColorStop(0.5, 'rgba(138, 43, 226, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// --- Initialize GSAP Scroll Trigger Animations ---
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Helper function to check screen size profile
    const getDeviceState = () => {
        const w = window.innerWidth;
        if (w <= 768) return 'mobile';
        if (w <= 1024) return 'tablet';
        return 'desktop';
    };

    // Timeline to animate the 3D Neural Core positions through scroll sections
    // --- Hero -> About ---
    gsap.timeline({
        scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;
                const device = getDeviceState();
                
                if (device === 'mobile') {
                    // Mobile: core shifts slightly up to leave space for stacked cards below
                    targetCoreX = 0;
                    targetCoreY = 1.2 * p;
                    targetCoreZ = -1.0 * p;
                    coreScale = 1.0 - (0.35 * p);
                } else if (device === 'tablet') {
                    // Tablet: shift to left column behind about text panel (since photo is on right)
                    targetCoreX = -1.8 * p;
                    targetCoreY = 0.5 * p;
                    targetCoreZ = -1.5 * p;
                    coreScale = 1.0 - (0.2 * p);
                } else {
                    // Desktop: core moves to the right panel
                    targetCoreX = 3.2 * p;
                    targetCoreY = 0;
                    targetCoreZ = -1.0 * p;
                    coreScale = 1.0 - (0.15 * p);
                }
            }
        }
    });

    // --- About -> Skills ---
    gsap.timeline({
        scrollTrigger: {
            trigger: '#skills',
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;
                const device = getDeviceState();
                
                if (device === 'mobile') {
                    targetCoreX = 0;
                    targetCoreY = 1.2 - (0.6 * p);
                    targetCoreZ = -1.0 - (1.0 * p);
                    coreScale = 0.65 + (0.15 * p);
                } else if (device === 'tablet') {
                    // Shift back to center background and expand matrix behind bento grid
                    targetCoreX = -1.8 + (1.8 * p);
                    targetCoreY = 0.5 - (0.1 * p);
                    targetCoreZ = -1.5 - (2.0 * p);
                    coreScale = 0.8 + (0.5 * p);
                } else {
                    // Move core to center background and disperse particles (expanding the scale)
                    targetCoreX = 3.2 - (3.2 * p);
                    targetCoreY = 0.4 * p;
                    targetCoreZ = -1.0 - (2.5 * p);
                    coreScale = 0.85 + (0.75 * p);
                }
                // Disperse shield rings
                shieldRing1.scale.set(1 + p * 0.5, 1 + p * 0.5, 1 + p * 0.5);
                shieldRing2.scale.set(1 + p * 0.5, 1 + p * 0.5, 1 + p * 0.5);
            }
        }
    });

    // --- Skills -> Projects ---
    gsap.timeline({
        scrollTrigger: {
            trigger: '#projects',
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;
                const device = getDeviceState();
                
                if (device === 'mobile') {
                    targetCoreX = 0;
                    targetCoreY = 0.6 + (0.4 * p);
                    targetCoreZ = -2.0 + (0.5 * p);
                    coreScale = 0.8 - (0.3 * p);
                } else if (device === 'tablet') {
                    // Shift core back to the left panel to anchor project headlines
                    targetCoreX = -2.0 * p;
                    targetCoreY = 0.4 - (0.6 * p);
                    targetCoreZ = -3.5 + (1.5 * p);
                    coreScale = 1.3 - (0.4 * p);
                } else {
                    // Shift core back to the left panel to anchor project headlines
                    targetCoreX = -3.5 * p;
                    targetCoreY = -0.4 * p;
                    targetCoreZ = -3.5 + (2.0 * p);
                    coreScale = 1.6 - (0.7 * p);
                }
                
                // Rotate core along different axis for variety
                targetCoreRotX = (Math.PI / 4) * p;
                targetCoreRotY = (Math.PI / 3) * p;
            }
        }
    });

    // --- Projects -> Security Lab ---
    gsap.timeline({
        scrollTrigger: {
            trigger: '#security-console',
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;
                const device = getDeviceState();
                
                if (device === 'mobile') {
                    targetCoreX = 0;
                    targetCoreY = 1.0 - (0.5 * p);
                    targetCoreZ = -1.5;
                    coreScale = 0.5;
                } else if (device === 'tablet') {
                    // Position core to hover exactly behind the terminal card center
                    targetCoreX = -2.0 + (2.0 * p);
                    targetCoreY = -0.2 - (0.4 * p);
                    targetCoreZ = -2.0 + (0.5 * p);
                    coreScale = 0.9 + (0.2 * p);
                } else {
                    // Position core to hover exactly behind the terminal card center
                    targetCoreX = -3.5 + (3.5 * p);
                    targetCoreY = -0.8 * p;
                    targetCoreZ = -1.5;
                    coreScale = 0.9 + (0.4 * p);
                }
                
                targetCoreRotX = (Math.PI / 4) - ((Math.PI / 4) * p);
                targetCoreRotY = (Math.PI / 3) - ((Math.PI / 3) * p);
            }
        }
    });

    // --- Security Lab -> Contact ---
    gsap.timeline({
        scrollTrigger: {
            trigger: '#contact',
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;
                const device = getDeviceState();
                
                if (device === 'mobile') {
                    targetCoreX = 0;
                    targetCoreY = 0.5 - (1.2 * p);
                    targetCoreZ = -1.5;
                    coreScale = 0.5 - (0.2 * p);
                } else if (device === 'tablet') {
                    // Condense core into a tight pulsing beacon at the bottom center
                    targetCoreX = 0;
                    targetCoreY = -0.6 - (2.0 * p);
                    targetCoreZ = -1.5;
                    coreScale = 1.1 - (0.5 * p);
                } else {
                    // Condense core into a tight pulsing beacon at the bottom center
                    targetCoreX = 0;
                    targetCoreY = -2.8 * p;
                    targetCoreZ = -1.5 + (0.5 * p);
                    coreScale = 1.3 - (0.6 * p);
                }
            }
        }
    });
}

// --- Interactive AI Security Console Simulator ---
function initSecurityConsole() {
    const screen = document.getElementById('console-screen');
    const btnScan = document.getElementById('btn-scan-model');
    const btnAttack = document.getElementById('btn-run-attack');
    const btnHarden = document.getElementById('btn-deploy-defense');
    const btnLogs = document.getElementById('btn-audit-logs');
    
    let isExecuting = false;
    let isHardened = false;

    // Helper to print a line with a small delay
    function printLine(text, type = 'system-msg', delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = `output-line ${type}`;
                line.innerHTML = text;
                
                // Insert before the prompt line
                const prompt = screen.querySelector('.prompt-line');
                screen.insertBefore(line, prompt);
                
                // Scroll terminal down
                screen.scrollTop = screen.scrollHeight;
                resolve();
            }, delay);
        });
    }

    // Clear previous dynamic outputs except header
    function clearDynamicLines() {
        const lines = screen.querySelectorAll('.output-line:not(.system-msg):not(.success-msg)');
        lines.forEach(l => l.remove());
    }

    // Set active class on buttons
    function setActiveButton(activeBtn) {
        const buttons = document.querySelectorAll('.terminal-action-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    // Command Line Prompt simulator
    function updatePrompt(cmdText) {
        const prompt = screen.querySelector('.prompt-line');
        prompt.innerHTML = `siraj@nitk-sec:~$ ${cmdText}<span class="cursor-blink">_</span>`;
    }

    // SCAN ROUTINE
    async function runScan() {
        if(isExecuting) return;
        isExecuting = true;
        setActiveButton(btnScan);
        updatePrompt('./scan_model.py');
        
        await printLine('Checking target neural network configuration...', 'system-msg', 400);
        await printLine('Verifying weights integrity (hash check: SHA-256)...', 'system-msg', 500);
        await printLine('Running baseline verification on 500 test samples...', 'system-msg', 600);
        
        if (isHardened) {
            await printLine('Model Status: DEFENDED [Distilled Adversarial Training Wrapper active]', 'success-msg', 500);
            await printLine('Baseline accuracy: 98.4%', 'success-msg', 300);
            await printLine('Poisoning rate: 0.00% (Clean)', 'success-msg', 200);
        } else {
            await printLine('Model Status: UNPROTECTED [Standard PyTorch ResNet Weights]', 'warning-msg', 500);
            await printLine('Baseline accuracy: 94.2%', 'success-msg', 300);
            await printLine('Poisoning rate: 0.00% (Clean - No backdoor detected)', 'success-msg', 200);
            await printLine('WARNING: Model is vulnerable to adversarial evasion attacks (FGSM/PGD).', 'warning-msg', 400);
        }
        
        updatePrompt('');
        isExecuting = false;
    }

    // ATTACK ROUTINE
    async function runAttack() {
        if(isExecuting) return;
        isExecuting = true;
        setActiveButton(btnAttack);
        updatePrompt('./fgsm_attack.sh --epsilon 0.08');

        // Visual feedback on 3D particles: make particles turn red and fluctuate
        gsap.to(particleSystem.material.color, { r: 1.0, g: 0.2, b: 0.2, duration: 0.5 });
        gsap.to(connectionLines.material.color, { r: 1.0, g: 0.0, b: 0.0, duration: 0.5 });
        
        await printLine('Generating Fast Gradient Sign Method (FGSM) perturbations...', 'system-msg', 400);
        await printLine('Injecting adversarial noise to input tensor arrays...', 'warning-msg', 600);
        await printLine('Processing perturbed images through model graph...', 'system-msg', 500);
        
        if (isHardened) {
            await printLine('Adversarial training protection intercepted perturbation.', 'success-msg', 600);
            await printLine('Attack Result: FAILED (Model output matches true labels)', 'success-msg', 300);
            await printLine('Adversarial accuracy: 96.1% (Robustness index stable)', 'success-msg', 200);
            
            // Revert particles to cyan
            gsap.to(particleSystem.material.color, { r: 0.0, g: 0.95, b: 1.0, duration: 0.5 });
            gsap.to(connectionLines.material.color, { r: 0.54, g: 0.17, b: 0.88, duration: 0.5 });
        } else {
            await printLine('Gradient direction misalignment completed.', 'warning-msg', 600);
            await printLine('Attack Result: SUCCESS (Classification boundaries bypassed)', 'error-msg', 300);
            await printLine('Classification accuracy: dropped from 94.2% -> 12.8%', 'error-msg', 200);
            await printLine('CRITICAL: Incorrect predictions logged (High confidence misclassifications).', 'error-msg', 400);
            
            // Pulsate particles red representing breached model
            gsap.timeline()
                .to(neuralCoreGroup.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.2, yoyo: true, repeat: 3 })
                .call(() => {
                    // Keep colors red until hardened
                });
        }

        updatePrompt('');
        isExecuting = false;
    }

    // HARDEN ROUTINE
    async function runHarden() {
        if(isExecuting) return;
        isExecuting = true;
        setActiveButton(btnHarden);
        updatePrompt('./harden_model.py --method ADV_TRAIN --distill');
        
        await printLine('Initiating robust training loops with adversarially perturbed inputs...', 'system-msg', 400);
        await printLine('Distilling output logits to smooth decision boundaries...', 'system-msg', 600);
        await printLine('Running 5 defensive epochs. Optimizing robust loss values...', 'system-msg', 800);
        
        // Visual feedback: spin 3D rings rapidly and glow white
        gsap.to([shieldRing1.rotation, shieldRing2.rotation], { z: '+=15', duration: 1.5, ease: 'power2.out' });
        gsap.to(particleSystem.material.color, { r: 1.0, g: 1.0, b: 1.0, duration: 0.5 });
        
        isHardened = true;
        
        await printLine('Model boundaries successfully smoothed.', 'success-msg', 400);
        await printLine('Defense wrap applied: [ADV_TRAINING_WRAPPER_V1]', 'success-msg', 200);
        await printLine('Model hardened. Current robustness status: SECURED (98.4% robustness).', 'success-msg', 300);

        // Reset particles to cyan/purple glow
        gsap.to(particleSystem.material.color, { r: 0.0, g: 0.95, b: 1.0, duration: 0.5 });
        gsap.to(connectionLines.material.color, { r: 0.54, g: 0.17, b: 0.88, duration: 0.5 });

        updatePrompt('');
        isExecuting = false;
    }

    // AUDIT LOGS ROUTINE
    async function runAuditLogs() {
        if(isExecuting) return;
        isExecuting = true;
        setActiveButton(btnLogs);
        updatePrompt('cat /var/log/intrusion_detect.log | grep "ATTACK"');
        
        await printLine('Fetching network packet logs from Vector database...', 'system-msg', 400);
        await printLine('Parsing 12,459 active packet payloads (CICIDS-2018 format)...', 'system-msg', 500);
        
        await printLine('18:41:02 [ALARM] Suspicious packet burst from IP: 192.168.1.145 - Syn Flood match', 'error-msg', 400);
        await printLine('18:41:25 [SHIELD] Dropped TCP session index: 4402 - Anomalous packet header shape', 'success-msg', 300);
        await printLine('18:42:10 [ALARM] Adversarial query trigger pattern matched on endpoint /v1/chat', 'warning-msg', 200);
        await printLine('18:42:11 [SHIELD] RAG vector fallback active: blocked token response.', 'success-msg', 250);
        await printLine('Audit completed. 2 alarms flagged. 2 shield triggers executed. Log buffer: CLEAR.', 'success-msg', 400);

        updatePrompt('');
        isExecuting = false;
    }

    // Attach click listeners to sidebar actions
    btnScan.addEventListener('click', runScan);
    btnAttack.addEventListener('click', runAttack);
    btnHarden.addEventListener('click', runHarden);
    btnLogs.addEventListener('click', runAuditLogs);
}

// --- Window Resize & Responsive Canvas Handling ---
function initResizeListener() {
    window.addEventListener('resize', () => {
        // Update camera dimensions
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // Update renderer size
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}

// --- Print Resume Functionality ---
function initResumePrint() {
    // Handled natively by HTML5 download attributes on index.html
}

// --- Mobile Hamburger Menu ---
function initMobileMenu() {
    const navbar = document.getElementById('apple-nav');
    const toggleBtn = document.getElementById('menu-toggle-btn');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (toggleBtn && navbar) {
        toggleBtn.addEventListener('click', () => {
            navbar.classList.toggle('menu-open');
        });
    }

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar) {
                navbar.classList.remove('menu-open');
            }
        });
    });
}
