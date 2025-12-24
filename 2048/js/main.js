document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Preloader
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader?.classList.add('hidden');
        }, 600);
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add transition class for smooth theme change
        document.documentElement.classList.add('theme-transition');
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        const sunIcon = themeToggle.querySelector('.fa-sun');
        const moonIcon = themeToggle.querySelector('.fa-moon');
        const glow = themeToggle.querySelector('.toggle-glow');
        if (!sunIcon || !moonIcon || !glow) return;
        
        if (theme === 'dark') {
            sunIcon.classList.remove('active');
            moonIcon.classList.add('active');
            glow.classList.add('active');
        } else {
            moonIcon.classList.remove('active');
            sunIcon.classList.add('active');
            glow.classList.remove('active');
        }
    }
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.nav');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Toggle body scroll when menu is open
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to nav links on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNav() {
        let scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (!sectionId) return;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector(`.nav-link[href*="${sectionId}"]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-link[href*="${sectionId}"]`)?.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNav);
    highlightNav();

    // Sticky header state
    const header = document.querySelector('.header');
    const handleHeaderSticky = () => {
        if (!header) return;
        if (window.scrollY > 10) {
            header.classList.add('header--sticky');
        } else {
            header.classList.remove('header--sticky');
        }
    };
    
    window.addEventListener('scroll', handleHeaderSticky);
    handleHeaderSticky();

    // Add parallax effect to blobs
    const blobs = document.querySelectorAll('.blob');
    
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.5;
            const xPos = (x * 20 * speed) - (10 * speed);
            const yPos = (y * 20 * speed) - (10 * speed);
            
            blob.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
    });
    
    // Hero counter animation
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                let current = 0;
                const increment = Math.ceil(target / 50);
                
                const updateCounter = () => {
                    current += increment;
                    if (current >= target) {
                        el.textContent = target;
                    } else {
                        el.textContent = current;
                        requestAnimationFrame(updateCounter);
                    }
                };
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.4 });
    
    counters.forEach(counter => counterObserver.observe(counter));

    // Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            tabButtons.forEach(button => button.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tab}-tab`)?.classList.add('active');
        });
    });

    // FAQ Accordion + modal
    const faqItems = document.querySelectorAll('.faq-item');
    const faqModal = document.getElementById('faqModal');
    const modalTitle = faqModal?.querySelector('.faq-modal__title');
    const modalBody = faqModal?.querySelector('.faq-modal__body');
    const modalCloseTargets = faqModal?.querySelectorAll('[data-close-modal]');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(other => other.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    const openFaqModal = (title, detail) => {
        if (!faqModal) return;
        modalTitle.textContent = title;
        modalBody.textContent = detail;
        faqModal.classList.add('show');
        faqModal.setAttribute('aria-hidden', 'false');
    };
    
    const closeFaqModal = () => {
        if (!faqModal) return;
        faqModal.classList.remove('show');
        faqModal.setAttribute('aria-hidden', 'true');
    };
    
    document.querySelectorAll('.faq-more').forEach(button => {
        button.addEventListener('click', () => {
            openFaqModal(button.dataset.title || 'More info', button.dataset.detail || '');
        });
    });
    
    modalCloseTargets?.forEach(el => {
        el.addEventListener('click', closeFaqModal);
    });
    
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeFaqModal();
        }
    });

    // Back to top visibility
    const backToTop = document.getElementById('backToTop');
    
    const toggleBackToTop = () => {
        if (!backToTop) return;
        if (window.scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    };
    
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();
    
    backToTop?.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Add hover effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
            
            // Glow effect
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            
            card.style.setProperty('--glow-x', `${glowX}%`);
            card.style.setProperty('--glow-y', `${glowY}%`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Add scroll reveal animation
    const scrollReveal = () => {
        const elements = document.querySelectorAll('.feature-card, .section-header, .about-content, .cta-card, .progress-container, .status-message');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    window.addEventListener('scroll', scrollReveal);
    scrollReveal(); // Initial check
    
    // Add loading animation
    document.body.classList.add('loaded');

    // Waitlist form handling
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = waitlistForm.querySelector('button[type="submit"]');
            const formData = new FormData(waitlistForm);
            
            // Basic validation
            const email = formData.get('email');
            const name = formData.get('name');
            
            if (!email || !name) {
                alert('Please fill in all required fields');
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Added to Waitlist';
            
            // Simulate API call
            setTimeout(() => {
                waitlistForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-rocket"></i> Get Early Access';
            }, 2000);
        });
    }
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button:not([disabled]), .btn:not([disabled]), .nav-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('disabled')) return;
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });
});

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .theme-transition *,
    .theme-transition *::before,
    .theme-transition *::after {
        transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease !important;
    }
`;
document.head.appendChild(style);
