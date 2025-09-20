// Simplified JavaScript with enhanced animations and music functionality
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
                duration: 1600,
                easing: 'cubic-bezier(0.2, 1, 0.3, 1)',
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
            }, { threshold: 0.3 });
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
                bg.style.transform = `translateY(${scrollY * 0.1}px) scale(1.01)`;
                fog.style.opacity = Math.min(0.7 + scrollY / 800, 0.9);
            });
        }
    };

    // Social Links Animation
    const SocialAnim = {
        init: () => {
            DOM.selectAll('.social-link').forEach((link, index) => {
                Anim.animate(link, [
                    { opacity: 0, transform: 'translateY(40px) scale(0.7)' },
                    { opacity: 1, transform: 'translateY(0) scale(1)' }
                ], { delay: index * 400 });
            });
        }
    };

    // Micro-Interactions
    const MicroInteractions = {
        init: () => {
            DOM.selectAll('.about-section, .social-link').forEach(el => {
                DOM.on(el, 'mouseenter', () => {
                    Anim.animate(el, [
                        { transform: 'scale(1)', filter: 'brightness(1)' },
                        { transform: 'scale(1.05)', filter: 'brightness(1.1)' }
                    ], { duration: 600 });
                });
                DOM.on(el, 'mouseleave', () => {
                    Anim.animate(el, [
                        { transform: 'scale(1.05)', filter: 'brightness(1.1)' },
                        { transform: 'scale(1)', filter: 'brightness(1)' }
                    ], { duration: 600 });
                });
            });
        }
    };

    // Music Player
    const MusicPlayer = {
        init: () => {
            const audio = DOM.select('#background-music');
            const button = DOM.select('#music-toggle');
            let isPlaying = false;

            DOM.on(button, 'click', () => {
                if (isPlaying) {
                    audio.pause();
                    button.textContent = '▶️';
                    button.classList.remove('playing');
                } else {
                    audio.play();
                    button.textContent = '⏸️';
                    button.classList.add('playing');
                }
                isPlaying = !isPlaying;
            });
        }
    };

    // App Init
    const App = {
        bootstrap: () => {
            const sections = DOM.selectAll('#hero, #about, #contact, #main-footer');
            sections.forEach((section, index) => {
                section.dataset.delay = (index * 300).toString();
                Anim.animateOnScroll([section], [
                    { opacity: 0, transform: 'translateY(70px)', filter: 'brightness(0.9)' },
                    { opacity: 1, transform: 'translateY(0)', filter: 'brightness(1)' }
                ]);
            });
            ParallaxFog.init();
            SocialAnim.init();
            MicroInteractions.init();
            MusicPlayer.init();
        }
    };

    DOM.on(doc, 'DOMContentLoaded', App.bootstrap);
})(window, document);
