// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Create 3D Particles Background
    createParticlesBackground();

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference or use device preference
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                
                // Scroll to the target element
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form handling with Formspree
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formSubmitBtn = contactForm.querySelector('.form-submit-btn');
        const buttonText = formSubmitBtn.querySelector('.button-text');
        const loadingIndicator = formSubmitBtn.querySelector('.loading-indicator');
        const formSuccess = document.getElementById('form-success');
        const formError = document.getElementById('form-error');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Hide button text and show loading spinner
            buttonText.style.display = 'none';
            loadingIndicator.style.display = 'inline-block';
            formSubmitBtn.classList.add('loading');

            // Get form data
            const formData = new FormData(contactForm);
            
            // Handle form submission
            const honeypot = formData.get('honeypot');
            // If honeypot field is filled, it's probably a bot
            if (honeypot && honeypot.trim() !== '') {
                console.log('Bot submission detected');
                resetButtonState();
                return false;
            }

            // Send form data to Formspree
            fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // Show success message with animation
                formSuccess.style.display = 'block';
                formSuccess.style.animation = 'slideInUp 0.5s forwards';
                
                // Reset form
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.style.animation = 'slideOutDown 0.5s forwards';
                    setTimeout(() => {
                        formSuccess.style.display = 'none';
                    }, 500);
                }, 5000);
            })
            .catch(error => {
                console.error('Form submission error:', error);
                
                // Show error message with animation
                formError.style.display = 'block';
                formError.style.animation = 'slideInUp 0.5s forwards, shakeX 0.5s 0.5s';
                
                // Hide error message after 5 seconds
                setTimeout(() => {
                    formError.style.animation = 'slideOutDown 0.5s forwards';
                    setTimeout(() => {
                        formError.style.display = 'none';
                    }, 500);
                }, 5000);
            })
            .finally(() => {
                // Reset button state
                resetButtonState();
            });
        });

        function resetButtonState() {
            buttonText.style.display = 'inline-block';
            loadingIndicator.style.display = 'none';
            formSubmitBtn.classList.remove('loading');
        }

        function showError(message) {
            formError.textContent = message;
            formError.style.display = 'block';
            formError.style.animation = 'slideInUp 0.5s forwards, shakeX 0.5s 0.5s';
            
            setTimeout(() => {
                formError.style.animation = 'slideOutDown 0.5s forwards';
                setTimeout(() => {
                    formError.style.display = 'none';
                }, 500);
            }, 5000);
        }

        // Add input animation effects
        const formInputs = document.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.classList.remove('focused');
                }
            });
            
            // Check if input already has value on page load
            if (input.value !== '') {
                input.classList.add('focused');
            }
        });
    }

    // Add active class to nav links based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    function updateActiveLink() {
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('text-blue-500');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('text-blue-500');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // Scroll reveal animation for skills
    const animateSkills = () => {
        const skills = document.querySelectorAll('.skill-card');
        
        skills.forEach((skill, index) => {
            setTimeout(() => {
                skill.classList.add('animated');
            }, 100 * index);
        });
    };

    // Trigger skill animation when skills section is in view
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(skillsSection);
    }

    // Typed.js effect for hero section (optional - if you include the typed.js library)
    if (typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: ['Software Developer', 'Web Designer', 'UX Enthusiast', 'Problem Solver'],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true
        });
    }
});

// Prevent FOUC (Flash of Unstyled Content) when switching themes
document.documentElement.classList.add('transition-colors', 'duration-200');

// Lazy load images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    imageObserver.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(function(lazyImage) {
            imageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        let lazyLoadThrottleTimeout;
        
        function lazyLoad() {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            
            lazyLoadThrottleTimeout = setTimeout(function() {
                const scrollTop = window.pageYOffset;
                
                lazyImages.forEach(function(lazyImage) {
                    if (lazyImage.offsetTop < window.innerHeight + scrollTop) {
                        lazyImage.src = lazyImage.dataset.src;
                    }
                });
                
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationChange', lazyLoad);
                }
            }, 20);
        }
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
    }
});

// Create 3D Particles Background
function createParticlesBackground() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-background';
    document.body.appendChild(particlesContainer);

    const numberOfParticles = 50;
    
    for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 8 + 2; // Random size between 2-10px
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration between 10-20 seconds
        const duration = Math.random() * 10 + 10;
        particle.style.setProperty('--duration', `${duration}s`);
        
        // Random animation delay so they don't all move together
        particle.style.animationDelay = `${Math.random() * 10}s`;
        
        particlesContainer.appendChild(particle);
    }
} 