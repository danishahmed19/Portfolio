// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initScrollAnimations();
    initSmoothScrolling();
    initHeroAnimations();
    initSkillsAnimation();
    initButtonInteractions();
    initProjectCardInteractions();
    
    // Set up performance optimizations
    setupPerformanceOptimizations();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // Mobile menu toggle
    navToggle?.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle?.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', throttle(function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(239, 239, 229, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
            navbar.style.boxShadow = '0 2px 20px rgba(35, 32, 47, 0.1)';
        } else {
            navbar.style.background = 'rgba(239, 239, 229, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    }, 16));
    
    // Update active navigation link based on scroll position
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
}

/**
 * Update active navigation link based on current section
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;
    
    let activeSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            activeSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Intersection Observer for scroll animations
 */
function initScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Show all elements immediately if reduced motion is preferred
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => el.classList.add('visible'));
        return;
    }
    
    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
}

/**
 * Hero section animations
 */
function initHeroAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return;
    
    // Parallax effect for floating elements
    const floatingElements = document.querySelectorAll('.floating-element');
    
    window.addEventListener('scroll', throttle(function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.2);
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    }, 16));
    
    // Mouse move effect for hero image
    const heroImage = document.querySelector('.image-container');
    const hero = document.querySelector('.hero');
    
    if (heroImage && hero) {
        hero.addEventListener('mousemove', function(e) {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const moveX = (x - 0.5) * 20;
            const moveY = (y - 0.5) * 20;
            
            heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        hero.addEventListener('mouseleave', function() {
            heroImage.style.transform = 'translate(0, 0)';
        });
    }
}

/**
 * Skills section animations - Progress bars with percentage counters
 */
function initSkillsAnimation() {
    const skillItems = document.querySelectorAll('.skill-item');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Track which skills have been animated to prevent re-animation
    const animatedSkills = new Set();
    
    const skillsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const skillId = skillItem.dataset.skill;
                
                // Only animate if not already animated
                if (!animatedSkills.has(skillId)) {
                    animatedSkills.add(skillId);
                    animateSkill(skillItem, prefersReducedMotion);
                }
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    });
    
    // Observe all skill items
    skillItems.forEach(item => {
        skillsObserver.observe(item);
    });
}

/**
 * Animate individual skill progress bar and percentage counter
 */
function animateSkill(skillItem, prefersReducedMotion) {
    const percentage = parseInt(skillItem.dataset.percentage);
    const progressBar = skillItem.querySelector('.skill-progress');
    const percentageElement = skillItem.querySelector('.skill-percentage');
    
    if (prefersReducedMotion) {
        // Instantly show final values if reduced motion is preferred
        progressBar.style.width = `${percentage}%`;
        percentageElement.textContent = `${percentage}%`;
        return;
    }
    
    // Animate progress bar width
    setTimeout(() => {
        progressBar.style.width = `${percentage}%`;
    }, 200);
    
    // Animate percentage counter
    let currentPercentage = 0;
    const increment = percentage / 60; // 60 frames for smooth animation
    const duration = 1500; // 1.5 seconds
    const frameTime = duration / 60;
    
    const counter = setInterval(() => {
        currentPercentage += increment;
        
        if (currentPercentage >= percentage) {
            currentPercentage = percentage;
            clearInterval(counter);
        }
        
        percentageElement.textContent = `${Math.round(currentPercentage)}%`;
    }, frameTime);
}

/**
 * Enhanced button interactions with ripple effect
 */
function initButtonInteractions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.classList.add('ripple');
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Enhanced hover effects
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Special handling for CV download button
    const cvBtn = document.querySelector('.cv-btn');
    if (cvBtn) {
        cvBtn.addEventListener('click', function(e) {
            // Add download animation
            const icon = this.querySelector('.btn-icon');
            if (icon) {
                icon.style.animation = 'bounce 0.6s ease-in-out';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 600);
            }
            
            // Analytics tracking could go here
            console.log('CV download initiated');
        });
    }
}

/**
 * Project card interactions with staggered tech tag animations
 */
function initProjectCardInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add staggered animation to tech tags
            const techTags = this.querySelectorAll('.tech-tag');
            techTags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'translateY(-2px)';
                    tag.style.background = 'var(--color-taupe)';
                    tag.style.color = 'var(--color-white)';
                }, index * 50);
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const techTags = this.querySelectorAll('.tech-tag');
            techTags.forEach(tag => {
                tag.style.transform = 'translateY(0)';
                tag.style.background = 'var(--color-beige)';
                tag.style.color = 'var(--color-charcoal)';
            });
        });
    });
}

/**
 * Contact features initialization
 */
function initContactFeatures() {
    // WhatsApp button click tracking
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            // Analytics tracking could go here
            console.log('WhatsApp contact initiated');
        });
    }
}

/**
 * Performance optimizations
 */
function setupPerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    const criticalImages = [
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Initialize contact features
    initContactFeatures();
}

/**
 * Utility function for throttling
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Utility function for debouncing
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Handle window resize events
 */
window.addEventListener('resize', debounce(function() {
    // Recalculate any position-dependent elements
    updateActiveNavLink();
}, 250));

/**
 * Handle page visibility changes for performance
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause any heavy animations or processes
        document.body.classList.add('page-hidden');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('page-hidden');
    }
});

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', function(e) {
    // Add keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                document.querySelector('#hero').scrollIntoView({ behavior: 'smooth' });
                break;
            case '2':
                e.preventDefault();
                document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
                break;
            case '3':
                e.preventDefault();
                document.querySelector('#skills').scrollIntoView({ behavior: 'smooth' });
                break;
            case '4':
                e.preventDefault();
                document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
                break;
            case '5':
                e.preventDefault();
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                break;
        }
    }
    
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu?.classList.contains('active')) {
            navToggle?.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
});

// Add CSS for animations dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-3px);
        }
        60% {
            transform: translateY(-2px);
        }
    }
    
    .page-hidden * {
        animation-play-state: paused !important;
    }
`;
document.head.appendChild(style);