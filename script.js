// Portfolio Interactive Features
// Author: Sam Mungai
// Description: Interactive JavaScript for portfolio website

class PortfolioApp {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.createParticleBackground();
        this.setupScrollAnimations();
        this.setupTypingAnimation();
        this.setupThemeToggle();
        this.setupInteractiveCards();
        this.setupSmoothScrolling();
    }

    init() {
        // Initialize app
        console.log('Portfolio App Initialized');
        this.updateYear();
        this.setupNavigation();
        this.debugThemeToggle();
    }

    debugThemeToggle() {
        // Debug function to check theme toggle
        console.log('Theme toggle debug:', {
            currentTheme: document.documentElement.getAttribute('data-theme'),
            savedTheme: localStorage.getItem('theme'),
            hasThemeToggle: document.querySelector('.theme-toggle') !== null
        });
    }

    updateYear() {
        const yearElement = document.getElementById('y');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    setupNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navLinks = document.querySelectorAll('.site-nav a');
        
        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navToggle) {
                    navToggle.checked = false;
                }
            });
        });

        // Highlight active section in navigation
        this.highlightActiveSection();
    }

    highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.site-nav a');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
    }

    setupEventListeners() {
        // Add event listeners for various interactions
        this.setupFormHandling();
        this.setupKeyboardNavigation();
        this.setupMouseEffects();
        this.setupScrollProgress();
    }

    setupFormHandling() {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show success message
        this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#4f8cff'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC key closes mobile menu
            if (e.key === 'Escape') {
                const navToggle = document.getElementById('nav-toggle');
                if (navToggle && navToggle.checked) {
                    navToggle.checked = false;
                }
            }
        });
    }

    setupMouseEffects() {
        // Add cursor trail effect
        this.createCursorTrail();
        
        // Add parallax effect to hero section
        this.setupParallaxEffect();
    }

    createCursorTrail() {
        const trail = [];
        const trailLength = 20;

        document.addEventListener('mousemove', (e) => {
            trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (trail.length > trailLength) {
                trail.shift();
            }

            this.updateTrail(trail);
        });
    }

    updateTrail(trail) {
        // Remove existing trail elements
        document.querySelectorAll('.cursor-trail').forEach(el => el.remove());

        trail.forEach((point, index) => {
            const trailElement = document.createElement('div');
            trailElement.className = 'cursor-trail';
            
            const opacity = (index + 1) / trail.length;
            const size = (index + 1) * 0.5;
            
            Object.assign(trailElement.style, {
                position: 'fixed',
                left: `${point.x}px`,
                top: `${point.y}px`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: '#4f8cff',
                borderRadius: '50%',
                pointerEvents: 'none',
                opacity: opacity * 0.3,
                zIndex: '9999',
                transform: 'translate(-50%, -50%)',
                transition: 'opacity 0.1s ease'
            });

            document.body.appendChild(trailElement);
        });
    }

    setupParallaxEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    createParticleBackground() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.6;
        `;
        
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;

        // Resize canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(79, 140, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(79, 140, 255, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.card, .t-item, .panel').forEach(el => {
            observer.observe(el);
        });
    }

    setupTypingAnimation() {
        const titleElement = document.querySelector('.title');
        if (!titleElement) return;

        const originalText = titleElement.innerHTML;
        const textToType = "Hi, I'm Sam Mungai. I build reliable web & mobile apps.";
        
        titleElement.innerHTML = '';
        titleElement.style.borderRight = '2px solid #4f8cff';
        
        let i = 0;
        const typeWriter = () => {
            if (i < textToType.length) {
                titleElement.innerHTML += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                setTimeout(() => {
                    titleElement.style.borderRight = 'none';
                    titleElement.innerHTML = originalText;
                }, 1000);
            }
        };

        // Start typing animation after a delay
        setTimeout(typeWriter, 1000);
    }

    setupThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '🌙';
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        
        Object.assign(themeToggle.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
            cursor: 'pointer',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow)'
        });

        document.body.appendChild(themeToggle);

        // Theme toggle functionality
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Apply theme with smooth transition
            document.documentElement.style.transition = 'all 0.3s ease';
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Update button icon
            themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
            
            // Save to localStorage
            localStorage.setItem('theme', newTheme);
            
            // Remove transition after animation
            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 300);
        });

        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
        
        // Add hover effect
        themeToggle.addEventListener('mouseenter', () => {
            themeToggle.style.transform = 'scale(1.1)';
            themeToggle.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });
        
        themeToggle.addEventListener('mouseleave', () => {
            themeToggle.style.transform = 'scale(1)';
            themeToggle.style.boxShadow = 'var(--shadow)';
        });
    }

    setupInteractiveCards() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            // Add tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });

            // Add click ripple effect
            card.addEventListener('click', (e) => {
                this.createRippleEffect(e, card);
            });
        });
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        Object.assign(ripple.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}px`,
            top: `${y}px`,
            background: 'rgba(79, 140, 255, 0.3)',
            borderRadius: '50%',
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear',
            pointerEvents: 'none'
        });
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupScrollProgress() {
        const progressBar = document.getElementById('scroll-progress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        });
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling with easing
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .theme-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .site-nav a.active {
        color: var(--primary) !important;
        background: rgba(79, 140, 255, 0.1) !important;
    }
    
    .card {
        transition: all 0.3s ease;
    }
    
    .card:hover {
        transform: translateY(-8px) !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
    }
    
    .notification {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    
    /* Enhanced focus styles */
    .btn:focus-visible,
    .theme-toggle:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }
    
    /* Loading animation for images */
    .card-media {
        position: relative;
        overflow: hidden;
    }
    
    .card-media::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
    }
`;

document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add loaded styles
    const loadedStyle = document.createElement('style');
    loadedStyle.textContent = `
        body:not(.loaded) * {
            animation-play-state: paused !important;
        }
        
        .loaded .hero {
            animation: fadeInUp 1s ease forwards;
        }
    `;
    document.head.appendChild(loadedStyle);
});
