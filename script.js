/**
 * Brand Monitoring Guys - Award-Winning Interactive Experience
 * GSAP + Lenis + Splitting.js + WebGL Particles
 */

// ============================================
// Global Variables
// ============================================
let lenis;
let mouseX = 0, mouseY = 0;

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    initLoader();
    initLenis();
    initProgressBar();
    initNavigation();
    initHeroCanvas();
    initHeroAnimations();
    initMarquee();
    initHorizontalScroll();
    initScrollAnimations();
    initMagneticButtons();
    initParallaxEffects();
    initTerminalTyping();
    initCounterAnimations();
    initTiltCards();
    initFormHandling();
    initRevealAnimations();
});

// ============================================
// Loader
// ============================================
function initLoader() {
    const loader = document.getElementById('loader');
    const words = document.querySelectorAll('.loader-word');

    if (!loader) {
        // No loader, animate hero immediately
        animateHeroEntrance();
        return;
    }

    // Animate loader words
    gsap.fromTo(words,
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.2
        }
    );

    // Animate loader line
    gsap.fromTo('.loader-line',
        { scaleX: 0 },
        {
            scaleX: 1,
            duration: 1,
            delay: 0.5,
            ease: 'power2.inOut'
        }
    );

    // Hide loader function
    function hideLoader() {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
                loader.style.display = 'none';
                animateHeroEntrance();
            }
        });
    }

    // Check if page already loaded
    if (document.readyState === 'complete') {
        setTimeout(hideLoader, 1200);
    } else {
        window.addEventListener('load', () => {
            setTimeout(hideLoader, 1200);
        });
    }

    // Fallback - ensure loader hides
    setTimeout(() => {
        if (loader.style.display !== 'none') {
            hideLoader();
        }
    }, 3000);
}

// ============================================
// Lenis Smooth Scroll
// ============================================
function initLenis() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                lenis.scrollTo(target, {
                    offset: -100,
                    duration: 1.5,
                });
                closeMobileMenu();
            }
        });
    });
}

// ============================================
// Progress Bar
// ============================================
function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;

    ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
            gsap.to(progressBar, {
                scaleX: self.progress,
                duration: 0.1,
                ease: 'none'
            });
        }
    });
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // Header scroll effect
    ScrollTrigger.create({
        start: 'top -100',
        onUpdate: () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // Mobile menu toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');

            if (mobileMenu.classList.contains('active')) {
                lenis.stop();
                gsap.from('.mobile-link', {
                    opacity: 0,
                    y: 30,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power3.out'
                });
            } else {
                lenis.start();
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
}

function closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (navToggle) navToggle.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (lenis) lenis.start();
}

// ============================================
// WebGL Hero Canvas - Particle System
// ============================================
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationId;
    const particleCount = 80;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.1,
            pulse: Math.random() * Math.PI * 2
        };
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
    }

    function drawParticle(p) {
        const pulsedOpacity = p.opacity * (0.5 + Math.sin(p.pulse) * 0.5);

        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `rgba(0, 255, 136, ${pulsedOpacity})`);
        gradient.addColorStop(0.5, `rgba(0, 255, 136, ${pulsedOpacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 255, 136, ${pulsedOpacity})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections first (behind particles)
        drawConnections();

        // Update and draw particles
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.pulse += 0.02;

            // Wrap around edges
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Mouse interaction
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const force = (200 - dist) / 200;
                p.x -= dx * force * 0.02;
                p.y -= dy * force * 0.02;
            }

            drawParticle(p);
        });

        animationId = requestAnimationFrame(animate);
    }

    init();
    animate();

    window.addEventListener('resize', () => {
        resize();
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
    });
}

// ============================================
// Hero Entrance Animation
// ============================================
function animateHeroEntrance() {
    // No entrance animation - content appears immediately like microsoft.ai
}

function initHeroAnimations() {
    // No continuous animations - static like microsoft.ai
}

// ============================================
// Marquee
// ============================================
function initMarquee() {
    const marquee = document.querySelector('.marquee-content');
    if (!marquee) return;

    // Clone for seamless loop
    const clone = marquee.cloneNode(true);
    marquee.parentElement.appendChild(clone);

    // Pause on hover
    const marqueeSection = document.querySelector('.marquee');
    if (marqueeSection) {
        marqueeSection.addEventListener('mouseenter', () => {
            gsap.to('.marquee-content', { timeScale: 0.2, duration: 0.5 });
        });
        marqueeSection.addEventListener('mouseleave', () => {
            gsap.to('.marquee-content', { timeScale: 1, duration: 0.5 });
        });
    }
}

// ============================================
// Horizontal Scroll Section
// ============================================
function initHorizontalScroll() {
    const section = document.querySelector('.horizontal-section');
    const track = document.querySelector('.horizontal-track');
    const panels = document.querySelectorAll('.horizontal-panel');

    if (!section || !track || panels.length === 0) return;

    // Calculate the scroll distance
    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

    // Create the horizontal scroll animation
    const horizontalScroll = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                // Update progress bar
                const progressBar = document.querySelector('.horizontal-progress-bar');
                if (progressBar) {
                    gsap.to(progressBar, {
                        scaleX: self.progress,
                        duration: 0.1
                    });
                }
            }
        }
    });

    // Animate individual panel elements
    panels.forEach((panel, i) => {
        const content = panel.querySelector('.panel-content');
        const visual = panel.querySelector('.panel-visual');
        const number = panel.querySelector('.panel-number');
        const title = panel.querySelector('.panel-title');

        // Stagger reveal for content
        ScrollTrigger.create({
            trigger: panel,
            containerAnimation: horizontalScroll,
            start: 'left 80%',
            onEnter: () => {
                gsap.from([number, title, content?.querySelector('.panel-text')], {
                    opacity: 0,
                    y: 40,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out'
                });

                if (visual) {
                    gsap.from(visual, {
                        opacity: 0,
                        scale: 0.9,
                        duration: 1,
                        delay: 0.3,
                        ease: 'power3.out'
                    });
                }
            },
            once: true
        });
    });

    // Threat orbit animation
    gsap.to('.threat-item', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center center'
    });

    // Scanner animation
    gsap.to('.scanner-ring', {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        stagger: 0.6,
        repeat: -1,
        ease: 'power1.out'
    });

    // Scan dots pulse
    gsap.to('.scan-dot', {
        scale: 1.5,
        opacity: 0.5,
        duration: 1,
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    // No scroll animations - static like microsoft.ai
}

// ============================================
// Magnetic Buttons
// ============================================
function initMagneticButtons() {
    // No magnetic effect - static like microsoft.ai
}

// ============================================
// Parallax Effects
// ============================================
function initParallaxEffects() {
    // No parallax - static like microsoft.ai
}

// ============================================
// Terminal Typing Effect
// ============================================
function initTerminalTyping() {
    const commands = document.querySelectorAll('.command[data-type]');

    commands.forEach((command, i) => {
        const text = command.dataset.type;
        command.textContent = '';

        ScrollTrigger.create({
            trigger: command.closest('.terminal-window'),
            start: 'top 75%',
            onEnter: () => {
                setTimeout(() => {
                    typeText(command, text, 40);
                }, i * 800 + 500);
            },
            once: true
        });
    });

    // Animate output lines
    const outputLines = document.querySelectorAll('.output-line');
    outputLines.forEach((line, i) => {
        const originalText = line.textContent;
        line.style.opacity = '0';

        ScrollTrigger.create({
            trigger: line.closest('.terminal-window'),
            start: 'top 75%',
            onEnter: () => {
                setTimeout(() => {
                    gsap.to(line, {
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }, i * 150 + 1500);
            },
            once: true
        });
    });
}

function typeText(element, text, speed = 50) {
    let index = 0;
    element.style.opacity = '1';

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ============================================
// Counter Animations
// ============================================
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');

    counters.forEach(counter => {
        const finalValue = counter.dataset.count;

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            onEnter: () => animateCounter(counter, finalValue),
            once: true
        });
    });

    // Also animate stat numbers without data-count
    const statNumbers = document.querySelectorAll('.stat-number:not([data-count])');
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        if (text.match(/\d/)) {
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 85%',
                onEnter: () => {
                    gsap.from(stat, {
                        opacity: 0,
                        y: 20,
                        duration: 0.6,
                        ease: 'power3.out'
                    });
                },
                once: true
            });
        }
    });
}

function animateCounter(element, finalValue) {
    const duration = 2000;
    const startTime = performance.now();
    const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));

    function formatValue(current, isComplete) {
        if (isComplete) return finalValue;

        let formatted;
        if (finalValue.includes('M')) {
            formatted = current.toFixed(1) + 'M';
        } else if (/[kK]/.test(finalValue)) {
            formatted = current.toFixed(0) + 'k';
        } else if (finalValue.includes(',')) {
            formatted = Math.floor(current).toLocaleString();
        } else if (finalValue.includes('.')) {
            formatted = current.toFixed(1);
        } else {
            formatted = Math.floor(current).toString();
        }

        if (finalValue.includes('$')) formatted = '$' + formatted;
        if (finalValue.includes('%')) formatted += '%';
        return formatted;
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = eased * numericValue;

        element.textContent = formatValue(current, progress >= 1);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ============================================
// Tilt Cards
// ============================================
function initTiltCards() {
    // No tilt effect - static like microsoft.ai
}

// ============================================
// Form Handling
// ============================================
function initFormHandling() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Input animations
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        const line = input.nextElementSibling;

        input.addEventListener('focus', () => {
            if (line && line.classList.contains('input-line')) {
                gsap.to(line, { scaleX: 1, duration: 0.4, ease: 'power2.out' });
            }
        });

        input.addEventListener('blur', () => {
            if (line && line.classList.contains('input-line') && !input.value) {
                gsap.to(line, { scaleX: 0, duration: 0.4, ease: 'power2.out' });
            }
        });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const button = form.querySelector('button[type="submit"]');
        const btnText = button.querySelector('.btn-text');
        const originalText = btnText.textContent;

        gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });

        button.disabled = true;
        btnText.textContent = 'Sending...';

        setTimeout(() => {
            btnText.textContent = 'Sent!';
            gsap.to(button, {
                background: 'var(--color-accent)',
                duration: 0.3
            });

            gsap.from(button, {
                scale: 1.05,
                duration: 0.4,
                ease: 'back.out(2)'
            });

            setTimeout(() => {
                btnText.textContent = originalText;
                gsap.to(button, {
                    background: '',
                    duration: 0.3
                });
                button.disabled = false;
                form.reset();

                // Reset input lines
                form.querySelectorAll('.input-line').forEach(line => {
                    gsap.to(line, { scaleX: 0, duration: 0.3 });
                });
            }, 2500);
        }, 1500);
    });
}

// ============================================
// Reveal Animations
// ============================================
function initRevealAnimations() {
    // No reveal animations - static like microsoft.ai
}

// ============================================
// Utility Functions
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle resize
const handleResize = debounce(() => {
    ScrollTrigger.refresh();
}, 250);

window.addEventListener('resize', handleResize);

// Cleanup
window.addEventListener('beforeunload', () => {
    if (lenis) lenis.destroy();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});

// ============================================
// Console Branding
// ============================================
console.log('%c Brand Monitoring Guys ', 'background: #00ff88; color: #0a0a0a; font-size: 20px; padding: 12px 24px; border-radius: 8px; font-weight: bold;');
console.log('%c We hunt down brand impersonators. ', 'color: #666; font-size: 14px; padding: 8px 0;');
console.log('%c Built by Ryan & Mike ', 'color: #00ff88; font-size: 12px;');
