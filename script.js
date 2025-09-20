// Hyper-complex JavaScript with reactive state, animations, and micro-interactions
(function(global, doc) {
    'use strict';

    // Reactive State Module
    const ReactiveStateModule = (function() {
        class ReactiveState {
            constructor(initial) {
                this.value = initial;
                this.observers = new Set();
            }
            set(value) {
                this.value = value;
                this.observers.forEach(fn => fn(value));
            }
            subscribe(fn) {
                this.observers.add(fn);
                return () => this.observers.delete(fn);
            }
        }
        return initial => new ReactiveState(initial);
    })();

    // DOM Manipulation Service
    const DOMService = (function() {
        const select = selector => doc.querySelector(selector);
        const selectAll = selector => Array.from(doc.querySelectorAll(selector));
        const on = (el, event, handler) => el.addEventListener(event, handler, { passive: true });
        const toggleClass = (el, className, force) => el.classList.toggle(className, force);
        const getRect = el => el.getBoundingClientRect();
        return { select, selectAll, on, toggleClass, getRect };
    })();

    // Animation Engine with Web Animations API
    const AnimationEngine = (function() {
        const animate = (element, keyframes, options = {}) => {
            return element.animate(keyframes, {
                duration: 1200,
                easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
                fill: 'forwards',
                ...options
            });
        };
        const animateOnScroll = (elements, keyframes) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate(entry.target, keyframes, { delay: entry.target.dataset.delay || 0 });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });
            elements.forEach(el => observer.observe(el));
        };
        return { animate, animateOnScroll };
    })();

    // Parallax Effect Manager
    const ParallaxManager = (function(DOM, Anim) {
        const init = () => {
            const bg = DOM.select('.parallax-background');
            DOM.on(global, 'scroll', () => {
                const scrollY = global.scrollY;
                bg.style.transform = `translateY(${scrollY * 0.2}px)`;
            });
        };
        return { init };
    })(DOMService, AnimationEngine);

    // Navigation Controller
    const NavigationController = (function(DOM, Anim, State) {
        const navState = State({ activeSection: '' });
        const init = () => {
            DOM.selectAll('.nav-link').forEach(link => {
                DOM.on(link, 'click', e => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const target = DOM.select(targetId);
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    navState.set(targetId);
                });
            });
        };
        navState.subscribe(section => {
            DOM.selectAll('.nav-link').forEach(link => {
                const href = link.getAttribute('href');
                DOM.toggleClass(link, 'active', href === section);
            });
        });
        return { init };
    })(DOMService, AnimationEngine, ReactiveStateModule);

    // Social Links Animation Controller
    const SocialLinksController = (function(DOM, Anim) {
        const init = () => {
            DOM.selectAll('.social-link').forEach((link, index) => {
                Anim.animate(link, [
                    { opacity: 0, transform: 'translateY(20px) scale(0.8)' },
                    { opacity: 1, transform: 'translateY(0) scale(1)' }
                ], { delay: index * 250 });
            });
        };
        return { init };
    })(DOMService, AnimationEngine);

    // Micro-Interactions for Hover
    const MicroInteractionManager = (function(DOM, Anim) {
        const init = () => {
            DOM.selectAll('.skill-item, .project-card, .social-link').forEach(el => {
                DOM.on(el, 'mouseenter', () => {
                    Anim.animate(el, [
                        { transform: 'translateY(0)' },
                        { transform: 'translateY(-10px)' }
                    ], { duration: 400 });
                });
                DOM.on(el, 'mouseleave', () => {
                    Anim.animate(el, [
                        { transform: 'translateY(-10px)' },
                        { transform: 'translateY(0)' }
                    ], { duration: 400 });
                });
            });
        };
        return { init };
    })(DOMService, AnimationEngine);

    // Main Application Orchestrator
    const AppOrchestrator = (function(DOM, Anim, Parallax, Nav, Social, Micro) {
        const sections = ['#hero', '#about', '#skills', '#projects', '#social'];
        const init = () => {
            // Animate sections
            DOM.selectAll(sections.join(',')).forEach((section, index) => {
                section.dataset.delay = (index * 150).toString();
                Anim.animateOnScroll([section], [
                    { opacity: 0, transform: 'translateY(50px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ]);
            });
            // Initialize managers
            Parallax.init();
            Nav.init();
            Social.init();
            Micro.init();
        };
        return { bootstrap: init };
    })(DOMService, AnimationEngine, ParallaxManager, NavigationController, SocialLinksController, MicroInteractionManager);

    // Bootstrap
    DOMService.on(doc, 'DOMContentLoaded', () => AppOrchestrator.bootstrap());

    // Expose for extensions
    global.App = AppOrchestrator;
})(window, document);
