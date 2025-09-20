// Simplified JavaScript with enhanced animations
(function(global, doc) {
    'use strict';

    // DOM Manipulation
    const DOM = {
        select: selector => doc.querySelector(selector),
        selectAll: selector => Array.from(doc.querySelectorAll(selector)),
        on: (el, event, handler) => el.addEventListener(event, handler, { passive: true })
    };

    // Animation Engine
    const Anim = {
        animate: (element, keyframes, options = {}) => {
            return element.animate(keyframes, {
                duration: 1400,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                fill: 'forwards',
                ...options
            });
        },
        animateOnScroll: (elements, keyframes) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Anim.animate(entry.target, keyframes, { delay: entry.target.dataset.delay || 0 });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            elements.forEach(el => observer.observe(el));
        }
    };

    // Parallax and Fog Manager
    const ParallaxFog = {
        init: () => {
            const bg = DOM.select('.parallax-background');
            const fog = DOM.select('.fog-overlay');
            DOM.on(global, 'scroll', () => {
                const scrollY = global.scrollY;
                bg.style.transform = `translateY(${scrollY * 0.15}px)`;
                fog.style.opacity = Math.min(0.6 + scrollY / 1000, 0.8);
            });
        }
    };

    // Social Links Animation
    const SocialAnim = {
        init: () => {
            DOM.selectAll('.social-link').forEach((link, index) => {
                Anim.animate(link, [
                    { opacity: 0, transform: 'translateY(30px) scale(0.8)' },
                    { opacity: 1, transform: 'translateY(0) scale(1)' }
                ], { delay: index * 300 });
            });
        }
    };

    // Micro-Interactions
    const MicroInteractions = {
        init: () => {
            DOM.selectAll('.skill-item, .project-card, .social-link').forEach(el => {
                DOM.on(el, 'mouseenter', () => {
                    Anim.animate(el, [
                        { transform: 'translateY(0) scale(1)' },
                        { transform: 'translateY(-12px) scale(1.05)' }
                    ], { duration: 500 });
                });
                DOM.on(el, 'mouseleave', () => {
                    Anim.animate(el, [
                        { transform: 'translateY(-12px) scale(1.05)' },
                        { transform: 'translateY(0) scale(1)' }
                    ], { duration: 500 });
                });
            });
        }
    };

    // App Init
    const App = {
        bootstrap: () => {
            const sections = DOM.selectAll('#hero, #about, #skills, #projects, #social, #main-footer');
            sections.forEach((section, index) => {
                section.dataset.delay = (index * 200).toString();
                Anim.animateOnScroll([section], [
                    { opacity: 0, transform: 'translateY(60px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ]);
            });
            ParallaxFog.init();
            SocialAnim.init();
            MicroInteractions.init();
        }
    };

    DOM.on(doc, 'DOMContentLoaded', App.bootstrap);
})(window, document);
