// Custom cursor
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    // Scale effect on hoverable elements
    const hoverable = e.target.closest('button, .nav-link, .project-card, .skill-card');
    if (hoverable) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    } else {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }
});

// Scroll animations with enhanced options
const observerOptions = {
    threshold: [0.2, 0.5, 0.8],
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.transitionDelay = entry.target.dataset.delay || '0s';
            
            // Add custom animations based on element type
            if (entry.target.classList.contains('skill-card')) {
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.style.opacity = '1';
            } else if (entry.target.classList.contains('project-card')) {
                entry.target.style.transform = 'translateX(0) rotateY(0)';
                entry.target.style.opacity = '1';
            }
        }
    });
}, observerOptions);

const animateElements = document.querySelectorAll(
    '.hero-content, .about-content, .skill-card, .project-card, .testimonial-card'
);

animateElements.forEach(element => {
    element.classList.add('fade-in');
    observer.observe(element);
});

// Stats counter animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const steps = 50;
    const stepValue = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += stepValue;
        if (current > target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
}

// Animate counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
});

const counters = document.querySelectorAll('.stat-number');
counters.forEach(counter => counterObserver.observe(counter));

// Three.js Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

const container = document.querySelector('.shape-container');
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// Create abstract shape
// Create abstract shape
const geometry = new THREE.IcosahedronGeometry(2, 1);
const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x00F0FF) },
        color2: { value: new THREE.Color(0xFF00D4) }
    },
    vertexShader: `
        varying vec2 vUv;
        varying float vDisplacement;
        uniform float time;
        
        void main() {
            vUv = uv;
            vec3 newPosition = position;
            float displacement = sin(position.x * 5.0 + time) * 0.1 +
                               cos(position.y * 5.0 + time) * 0.1;
            newPosition += normal * displacement;
            vDisplacement = displacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying float vDisplacement;
        
        void main() {
            vec3 color = mix(color1, color2, vUv.y + vDisplacement);
            gl_FragColor = vec4(color, 1.0);
        }
    `,
    wireframe: true
});

const shape = new THREE.Mesh(geometry, material);
scene.add(shape);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFF007A, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;
    material.uniforms.time.value = time;

    shape.rotation.x = Math.sin(time * 0.5) * 0.3;
    shape.rotation.y = Math.cos(time * 0.3) * 0.3;
    shape.position.y = Math.sin(time * 0.7) * 0.2;

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Project carousel scroll buttons
const projectCarousel = document.querySelector('.project-carousel');
let isScrolling = false;

projectCarousel.addEventListener('scroll', () => {
    isScrolling = true;
});

setInterval(() => {
    if (isScrolling) {
        isScrolling = false;
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.left >= 0 && rect.left <= window.innerWidth) {
                card.style.transform = 'scale(1.05)';
            } else {
                card.style.transform = 'scale(1)';
            }
        });
    }
}, 150);