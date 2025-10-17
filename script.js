// Main JavaScript functionality for Key Solutions website

class KeySolutionsApp {
    constructor() {
        this.currentSection = null;
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupFormHandling();
        this.setupHeaderScrollEffect();
        this.setupIntersectionObserver();
        this.setupImageClickHandlers();
    }

    // Smooth scrolling for navigation links
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Form handling with validation
    setupFormHandling() {
        const form = document.getElementById('quoteForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Basic validation
                if (this.validateForm(form)) {
                    this.submitForm(form);
                }
            });
        }
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Email validation
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                this.showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Phone validation
        const phoneField = form.querySelector('input[type="tel"]');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(phoneField.value.replace(/[\s\-\(\)]/g, ''))) {
                this.showFieldError(phoneField, 'Please enter a valid phone number');
                isValid = false;
            }
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.style.borderColor = '#e53e3e';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#e53e3e';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    submitForm(form) {
        // Show loading state
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showSuccessMessage();
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    showSuccessMessage() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2f5233;
            color: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        `;
        successDiv.innerHTML = `
            <h3 style="margin-bottom: 1rem;">Thank You!</h3>
            <p>We'll contact you within 24 hours with your free quote.</p>
        `;

        document.body.appendChild(successDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Header scroll effect
    setupHeaderScrollEffect() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.9)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.8)';
                header.style.backdropFilter = 'blur(20px)';
            }
        });
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.project-card, .feature-item, .service-item, .info-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Setup image click handlers
    setupImageClickHandlers() {
        const slabImage = document.querySelector('.hero-slab-image');
        const deckImage = document.querySelector('.hero-deck-image');
        const roofImage = document.querySelector('.hero-roof-image');

        if (slabImage) {
            slabImage.addEventListener('click', () => this.toggleSection('slab'));
        }
        if (deckImage) {
            deckImage.addEventListener('click', () => this.toggleSection('deck'));
        }
        if (roofImage) {
            roofImage.addEventListener('click', () => this.toggleSection('roof'));
        }
    }

    // Improved section toggling
    toggleSection(sectionType) {
        const sections = {
            slab: document.getElementById('slab-details'),
            deck: document.getElementById('deck-details'),
            roof: document.getElementById('roof-details')
        };

        const heroSection = document.querySelector('.hero');
        const targetSection = sections[sectionType];

        if (!targetSection) {
            console.error(`Section ${sectionType} not found`);
            return;
        }

        const isCurrentlyVisible = targetSection.style.display !== 'none';

        // Close all sections first
        Object.values(sections).forEach(section => {
            if (section) {
                section.style.display = 'none';
            }
        });

        // Reset hero section
        heroSection.style.height = 'auto';
        heroSection.style.overflow = 'visible';

        if (!isCurrentlyVisible) {
            // Show the selected section
            targetSection.style.display = 'block';
            this.currentSection = sectionType;

            // Adjust hero section to show both hero and section
            heroSection.style.height = '50vh';
            heroSection.style.overflow = 'hidden';

            // Smooth scroll to show both hero and section
            setTimeout(() => {
                const scrollPosition = heroSection.offsetTop + heroSection.offsetHeight - window.innerHeight * 0.4;
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }, 100);
        } else {
            this.currentSection = null;
        }
    }

    // Utility method to close all sections
    closeAllSections() {
        const sections = ['slab-details', 'deck-details', 'roof-details'];
        const heroSection = document.querySelector('.hero');

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });

        heroSection.style.height = 'auto';
        heroSection.style.overflow = 'visible';
        this.currentSection = null;
    }

    // Method to handle escape key to close sections
    handleEscapeKey(e) {
        if (e.key === 'Escape' && this.currentSection) {
            this.closeAllSections();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new KeySolutionsApp();
    
    // Add escape key listener
    document.addEventListener('keydown', (e) => app.handleEscapeKey(e));
    
    // Make app globally available for debugging
    window.KeySolutionsApp = app;
});

// Legacy function support for backward compatibility
function toggleSlabSection() {
    if (window.KeySolutionsApp) {
        window.KeySolutionsApp.toggleSection('slab');
    }
}

function toggleDeckSection() {
    if (window.KeySolutionsApp) {
        window.KeySolutionsApp.toggleSection('deck');
    }
}

function toggleRoofSection() {
    if (window.KeySolutionsApp) {
        window.KeySolutionsApp.toggleSection('roof');
    }
}
