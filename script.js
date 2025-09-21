// Simple JavaScript for animations
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
                duration: 1800,
                easing: 'cubic-bezier(0.18, 1, 0.32, 1)',
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
            }, { threshold: 0.4 });
            elements.forEach(el => observer.observe(el));
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
            DOM.selectAll('.avatar-image, .about-section, .social-link').forEach(el => {
                DOM.on(el, 'mouseenter', () => {
                    Anim.animate(el, [
                        { transform: 'scale(1)', filter: 'brightness(1)' },
                        { transform: 'scale(1.08)', filter: 'brightness(1.15)' }
                    ], { duration: 600 });
                });
                DOM.on(el, 'mouseleave', () => {
                    Anim.animate(el, [
                        { transform: 'scale(1.08)', filter: 'brightness(1.15)' },
                        { transform: 'scale(1)', filter: 'brightness(1)' }
                    ], { duration: 600 });
                });
            });
        }
    };

    // App Init
    const App = {
        bootstrap: () => {
            const sections = DOM.selectAll('.avatar-container, #about, #contact, #main-footer');
            sections.forEach((section, index) => {
                section.dataset.delay = (index * 400).toString();
                Anim.animateOnScroll([section], [
                    { opacity: 0, transform: 'translateY(50px)', filter: 'brightness(0.9)' },
                    { opacity: 1, transform: 'translateY(0)', filter: 'brightness(1)' }
                ]);
            });
            SocialAnim.init();
            MicroInteractions.init();
        }
    };

    DOM.on(doc, 'DOMContentLoaded', App.bootstrap);
})(window, document);
