# Brand Monitoring Guys - Project Handover Document

## Project Overview

**Brand Monitoring Guys (BMG)** is a premium, award-winning level landing page for a **productized service** (NOT a SaaS) run by **two engineers named Ryan and Mike**. The service helps brands identify and eliminate impersonators, fake websites, phishing sites, and social media clones.

### Key Business Context
- **Service Type**: Productized service, not software/SaaS
- **Founders**: Ryan and Mike (two engineers)
- **Pricing**: $2,500/month or $25,000/year (saves $5,000)
- **Value Proposition**: "We hunt down brand impersonators and make them disappear"
- **Target Audience**: Brands experiencing impersonation, phishing, or fraud issues

---

## Technical Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | - | Semantic structure |
| CSS3 | - | Custom properties, animations, responsive design |
| JavaScript | ES6+ | Interactions and animations |
| GSAP | 3.12.5 | Advanced animations, ScrollTrigger |
| Lenis | 1.1.18 | Smooth scroll |
| Splitting.js | 1.0.6 | Character-by-character text animations |

### CDN Dependencies
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollToPlugin.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/splitting@1.0.6/dist/splitting.min.js"></script>
```

### Fonts
- **Display**: Space Grotesk (400, 500, 600, 700)
- **Body**: Inter (400, 500, 600)
- **Mono**: SF Mono, Monaco (fallback)

---

## File Structure

```
brand-monitoring-site/
├── index.html          # Main HTML (565 lines)
├── styles.css          # All styles (1700+ lines)
├── script.js           # All JavaScript (1280+ lines)
└── HANDOVER.md         # This document
```

---

## Design System

### Color Palette
```css
--color-bg: #0a0a0a;              /* Primary background */
--color-bg-elevated: #141414;      /* Elevated surfaces */
--color-bg-card: #1a1a1a;          /* Card backgrounds */
--color-white: #ffffff;
--color-text: #f5f5f5;             /* Primary text */
--color-text-secondary: #888888;   /* Secondary text */
--color-text-muted: #666666;       /* Muted text */
--color-accent: #00ff88;           /* Primary accent (green) */
--color-accent-secondary: #00d4ff; /* Secondary accent (cyan) */
--color-danger: #ff4444;           /* Error/danger states */
--color-border: rgba(255, 255, 255, 0.1);
```

### Spacing Scale
```css
--space-xs: 0.5rem;   /* 8px */
--space-sm: 1rem;     /* 16px */
--space-md: 1.5rem;   /* 24px */
--space-lg: 2rem;     /* 32px */
--space-xl: 3rem;     /* 48px */
--space-2xl: 4rem;    /* 64px */
--space-3xl: 6rem;    /* 96px */
--space-4xl: 8rem;    /* 128px */
```

### Animation Easings
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

### Z-Index Layers
```css
--z-cursor: 9999;    /* Custom cursor */
--z-loader: 9000;    /* Loading screen */
--z-nav: 1000;       /* Navigation */
--z-modal: 500;      /* Modals */
```

---

## Page Sections (in order)

### 1. Loader
- Animated word reveal: "Brand" → "Monitoring" → "Guys"
- Progress line animation
- Hides after ~1.2 seconds, triggers hero entrance

### 2. Navigation
- Fixed header with scroll state change
- Logo: "BMG"
- Links: Work, About, Process
- CTA: "Let's Talk"
- Mobile hamburger menu

### 3. Hero Section
- **WebGL Canvas**: Custom particle system with 80 glowing green particles
  - Particles connect with lines when close
  - React to mouse movement (repel effect)
- **Floating gradient shapes**: 3 blurred color shapes with float animation
- **Title**: Three-line split text with character animations
  - "Someone's pretending"
  - "to be your brand."
  - "We make them stop." (accent color)
- **Subtitle**: Description of the service
- **CTAs**: "Get Protected" (primary) + "See Our Work" (ghost)
- **Stats**: 2,847 Threats Eliminated | <24h Average Takedown | 100% Success Rate
- **Floating notification cards**: 3 cards showing fake alerts
- **Scroll indicator**: Animated line at bottom

### 4. Marquee Section
- Scrolling text of threat types
- Pauses on hover
- Items: Phishing Sites, Fake Accounts, Domain Squatters, Impersonation, Scam Ads, Counterfeit Stores, Social Clones

### 5. Horizontal Scroll Section (id="work")
- **Pinned scrolling** - 4 panels that scroll horizontally
- **Panel 1 - The Problem**: Threat visualization with orbiting items
- **Panel 2 - We Find Them**: Scanner visual with pulsing rings
- **Panel 3 - We End Them**: Terminal window with typing animation
- **Panel 4 - You're Protected**: Results grid with stats
- Progress bar at bottom tracks scroll position

### 6. About Section (id="about")
- Founder story narrative
- Two founder cards:
  - Ryan: "10+ years building products. Now building protection."
  - Mike: "Former security researcher. Knows where they hide."
- Placeholder avatars with initials (R, M)

### 7. Process Section (id="process")
- 4-step process:
  1. "You tell us your brand"
  2. "We start hunting"
  3. "We take them down"
  4. "You stay protected"
- Animated step numbers

### 8. Testimonial Section
- Large quote mark
- Quote: "We had 23 fake sites stealing our customers. Ryan and Mike took them all down in a week."
- Author: Sarah Chen, CEO, Fintech Startup

### 9. Pricing Section
- Two cards with 3D tilt effect:
  - **Monthly**: $2,500/month
  - **Annual**: $25,000/year (featured, "Save $5,000")
- Features listed for each tier

### 10. Contact Section (id="contact")
- Form fields: Name, Email, Company, Message
- Animated input focus states
- Submit button with success animation

### 11. Footer
- Logo + tagline
- Email: hello@brandmonitoringguys.com
- Social links: X (Twitter), LinkedIn
- Copyright 2026

---

## JavaScript Architecture

### Initialization Order
```javascript
document.addEventListener('DOMContentLoaded', () => {
    Splitting();              // Text splitting first
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    initLoader();             // Loader animation
    initLenis();              // Smooth scroll
    initCursor();             // Custom cursor
    initProgressBar();        // Scroll progress
    initNavigation();         // Nav behavior
    initHeroCanvas();         // WebGL particles
    initHeroAnimations();     // Hero floating effects
    initMarquee();            // Marquee duplication
    initHorizontalScroll();   // Pinned horizontal scroll
    initScrollAnimations();   // Section reveals
    initMagneticButtons();    // Button hover effects
    initParallaxEffects();    // Scroll parallax
    initTerminalTyping();     // Terminal typing effect
    initCounterAnimations();  // Number counting
    initTiltCards();          // 3D card tilt
    initFormHandling();       // Form submission
    initRevealAnimations();   // [data-reveal] elements
});
```

### Key Functions

#### `initHeroCanvas()`
Canvas-based particle system:
- 80 particles with glow effect
- Connected by lines when within 150px
- Mouse repulsion within 200px radius
- Particles wrap around edges
- Uses requestAnimationFrame for smooth animation

#### `initHorizontalScroll()`
GSAP ScrollTrigger pinned horizontal scroll:
- Pins the section while scrolling
- Uses `scrub: 1` for smooth scrubbing
- Updates progress bar on scroll
- Triggers content animations per panel

#### `animateHeroEntrance()`
Orchestrated GSAP timeline:
- Navigation slides in
- Eyebrow fades up
- Title characters animate with 3D rotation
- Buttons scale in
- Floating cards bounce in
- Shapes elastically appear

### Animation Patterns Used
- **Character splitting**: Using Splitting.js with `.char` class
- **Staggered reveals**: `stagger: 0.02` for text, `0.15` for elements
- **3D transforms**: `rotateX`, `rotateY` with `transformPerspective`
- **Elastic easing**: `elastic.out(1, 0.5)` for bouncy effects
- **Scroll-triggered**: All section animations use ScrollTrigger
- **Magnetic effect**: Buttons follow cursor with elastic snap-back

---

## CSS Architecture

### Key Patterns

#### Grain Overlay
```css
.grain {
    position: fixed;
    inset: 0;
    z-index: 10000;
    pointer-events: none;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,..."); /* SVG noise filter */
}
```

#### Custom Cursor
- `.cursor` - Container following mouse
- `.cursor-dot` - Small white dot
- `.cursor-circle` - Larger circle on hover
- `.cursor.hovering` - Expands circle, hides dot

#### Horizontal Scroll Layout
```css
.horizontal-section { position: relative; }
.horizontal-wrapper { height: 100vh; overflow: hidden; }
.horizontal-track { display: flex; will-change: transform; }
.horizontal-panel { flex-shrink: 0; width: 100vw; height: 100%; }
```

#### Consolidated Section Titles
```css
.about-title,
.process-title,
.pricing-title,
.contact-title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    line-height: 1.15;
}
```

### Responsive Breakpoints
- **1024px**: Tablet adjustments
- **768px**: Mobile layout, horizontal scroll becomes vertical
- **480px**: Small mobile tweaks

---

## Known Issues & Considerations

### 1. Loader Timing
The loader uses multiple fallbacks to ensure it hides:
- `document.readyState === 'complete'` check
- `window.addEventListener('load')` listener
- `setTimeout` fallback at 3 seconds

### 2. Hero Content Visibility
Previously, hero elements had `opacity: 0` in CSS waiting for GSAP. This was removed to ensure content is visible even if JS fails. GSAP now animates FROM opacity 0.

### 3. Horizontal Scroll on Mobile
At 768px breakpoint, horizontal scroll is disabled and panels stack vertically.

### 4. Form Submission
Currently simulated with `setTimeout`. Needs backend integration:
```javascript
// In initFormHandling()
setTimeout(() => {
    btnText.textContent = 'Sent!';
    // ... success animation
}, 1500);
```

### 5. Particle Performance
The canvas particle system runs at 60fps. On older devices, consider:
- Reducing `particleCount` from 80
- Disabling on mobile with media query check

---

## Development Notes

### Running Locally
```bash
cd /Users/ryan/brand-monitoring-site
python3 -m http.server 8080
# Open http://localhost:8080
```

### Design References
- **Primary inspiration**: microsoft.ai (layered effects, storytelling, parallax)
- **Secondary reference**: bmg-design.png (bento grid, sticky notes, terminal UI)
- **Target quality**: Awwwards/Dribbble award-winning level

### Content to Replace
1. **Founder photos**: Currently using initial placeholders (R, M)
2. **Testimonial**: May need real client quote
3. **Email**: hello@brandmonitoringguys.com (verify this exists)
4. **Social links**: Currently placeholder `href="#"`

---

## Future Enhancements (Not Implemented)

1. **Three.js hero**: Could upgrade canvas particles to WebGL with Three.js
2. **Video background**: Add ambient video in hero
3. **Case studies**: Expandable work examples
4. **Blog section**: Content marketing integration
5. **Live chat**: Integration with support tool
6. **Analytics**: Add tracking (GA4, etc.)
7. **CMS**: Headless CMS for content management

---

## Quick Reference

### Adding a New Section
1. Add HTML structure in `index.html`
2. Add styles in `styles.css` (follow existing patterns)
3. Add scroll animation in `initScrollAnimations()` function
4. If interactive, add dedicated init function

### Modifying Animations
- Timing: Adjust `duration` and `stagger` values
- Easing: Use GSAP easing strings or CSS custom properties
- Triggers: Modify `start` value in ScrollTrigger (e.g., `'top 80%'`)

### Color Changes
Update CSS custom properties in `:root` - they cascade throughout.

---

## Contact

**Project Location**: `/Users/ryan/brand-monitoring-site`
**Last Updated**: January 2026
**Built By**: Claude Code (Opus 4.5)

---

*This document was created as a comprehensive handover for continuing development with limited context. All critical information about the codebase structure, design decisions, and implementation details is included above.*
