/**
 * Mirret - Award-Winning Interactive Experience
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
    initStoryScroll();
    initAccordion();
    initFAB();
});

// ============================================
// Loader
// ============================================
function initLoader() {
    const loader = document.getElementById('loader');

    if (!loader) {
        animateHeroEntrance();
        return;
    }

    // Hide loader function
    function hideLoader() {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
                loader.style.display = 'none';
                loader.classList.add('hidden');
                animateHeroEntrance();
            }
        });
    }

    // Check if page already loaded
    if (document.readyState === 'complete') {
        setTimeout(hideLoader, 1000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(hideLoader, 1000);
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

    // Resources dropdown
    const dropdown = document.querySelector('.nav-dropdown');
    const dropdownTrigger = document.getElementById('resources-trigger');

    if (dropdownTrigger && dropdown) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });

        // Close dropdown when clicking a link
        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                dropdown.classList.remove('open');
            });
        });
    }

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

    // Panel content is visible immediately - no reveal animations

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
    // Show terminal commands immediately - no scroll-triggered animation
    const commands = document.querySelectorAll('.command[data-type]');
    commands.forEach(command => {
        const text = command.dataset.type;
        command.textContent = text;
    });

    // Output lines are visible by default - no animation needed
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
    // Show final values immediately - no counting animation
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        counter.textContent = counter.dataset.count;
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

    const statusEl = document.getElementById('form-status');

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const button = document.getElementById('submit-btn');
        const buttonText = button.querySelector('span:first-child');
        const originalText = buttonText.textContent;

        button.disabled = true;
        buttonText.textContent = 'Sending...';

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                buttonText.textContent = 'Sent!';
                if (statusEl) {
                    statusEl.textContent = "Thanks! We'll get back to you within 24 hours.";
                    statusEl.className = 'form-status success';
                }
                form.reset();

                setTimeout(() => {
                    buttonText.textContent = originalText;
                    button.disabled = false;
                }, 3000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            buttonText.textContent = originalText;
            button.disabled = false;
            if (statusEl) {
                statusEl.textContent = 'Something went wrong. Please email us directly.';
                statusEl.className = 'form-status error';
            }
        }
    });
}

// ============================================
// Reveal Animations
// ============================================
function initRevealAnimations() {
    // Scene setter scroll effect - microsoft.ai style
    const sceneImage = document.querySelector('.scene-image');
    const sceneSetter = document.querySelector('.scene-setter');

    if (sceneImage && sceneSetter) {
        gsap.to(sceneImage, {
            scale: 0.9,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: sceneSetter,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
}

// ============================================
// Cinematic Story Scroll
// ============================================
function initStoryScroll() {
    const storyScroll = document.querySelector('.story-scroll');
    const chapters = document.querySelectorAll('.story-chapter');
    const progressIndicator = document.querySelector('.story-progress');
    const progressFill = document.querySelector('.story-progress-fill');
    const chapterDots = document.querySelectorAll('.chapter-dot');

    if (!storyScroll || chapters.length === 0) return;

    // Show/hide progress indicator based on story section visibility
    ScrollTrigger.create({
        trigger: storyScroll,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => progressIndicator?.classList.add('visible'),
        onLeave: () => progressIndicator?.classList.remove('visible'),
        onEnterBack: () => progressIndicator?.classList.add('visible'),
        onLeaveBack: () => progressIndicator?.classList.remove('visible')
    });

    // Update progress fill based on scroll through story section
    ScrollTrigger.create({
        trigger: storyScroll,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
            if (progressFill) {
                gsap.set(progressFill, { height: `${self.progress * 100}%` });
            }
        }
    });

    // Create scroll triggers for each chapter
    chapters.forEach((chapter, index) => {
        ScrollTrigger.create({
            trigger: chapter,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => activateChapter(chapter, index),
            onEnterBack: () => activateChapter(chapter, index),
            onLeave: () => {
                if (index === chapters.length - 1) {
                    // Keep last chapter active when scrolling past
                } else {
                    chapter.classList.remove('active');
                }
            },
            onLeaveBack: () => {
                if (index === 0) {
                    chapter.classList.remove('active');
                }
            }
        });
    });

    function activateChapter(chapter, index) {
        // Deactivate all chapters
        chapters.forEach(ch => ch.classList.remove('active'));

        // Activate current chapter
        chapter.classList.add('active');

        // Update chapter dots
        chapterDots.forEach((dot, i) => {
            if (i <= index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Parallax effect on chapter number background
    chapters.forEach(chapter => {
        const numberBg = chapter.querySelector('.chapter-number-bg');
        if (numberBg) {
            gsap.to(numberBg, {
                y: -100,
                ease: 'none',
                scrollTrigger: {
                    trigger: chapter,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
    });

    // Optional: Add subtle parallax to chapter visual
    const chapterVisuals = document.querySelectorAll('.chapter-visual');
    chapterVisuals.forEach(visual => {
        gsap.to(visual, {
            y: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: visual.closest('.story-chapter'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
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
// Mobile Accordion (FAQ)
// ============================================
function initAccordion() {
    const accordionItems = document.querySelectorAll('[data-accordion]');

    accordionItems.forEach(item => {
        const header = item.querySelector('.question-header');
        if (!header) return;

        header.addEventListener('click', () => {
            // Check if we're on mobile
            if (window.innerWidth > 768) return;

            const isOpen = item.classList.contains('open');

            // Close all other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    const otherHeader = otherItem.querySelector('.question-header');
                    if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('open');
            header.setAttribute('aria-expanded', !isOpen);
        });
    });
}

// ============================================
// Floating Action Button
// ============================================
function initFAB() {
    const fab = document.getElementById('fab');
    const contactSection = document.getElementById('contact');

    if (!fab || !contactSection) return;

    // Hide FAB when contact section is visible
    ScrollTrigger.create({
        trigger: contactSection,
        start: 'top 80%',
        end: 'bottom top',
        onEnter: () => fab.classList.add('hidden'),
        onLeave: () => fab.classList.remove('hidden'),
        onEnterBack: () => fab.classList.add('hidden'),
        onLeaveBack: () => fab.classList.remove('hidden')
    });
}

// ============================================
// Console Branding
// ============================================
console.log('%c Mirret ', 'background: #00ff88; color: #0a0a0a; font-size: 20px; padding: 12px 24px; border-radius: 8px; font-weight: bold;');
console.log('%c We hunt down brand impersonators. ', 'color: #666; font-size: 14px; padding: 8px 0;');
console.log('%c mirret.co.uk ', 'color: #00ff88; font-size: 12px;');
