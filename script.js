// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('.nav-link');
const scrollButtons = document.querySelectorAll('[data-section]');

// Carousel Elements
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.querySelectorAll('.indicator');

// Carousel State
let currentSlide = 0;
const totalSlides = 3;
let isTransitioning = false;

// Mobile Menu Toggle
function toggleMobileMenu() {
    mobileNav.classList.toggle('active');
    
    // Update menu icon
    const menuIcon = mobileMenuBtn.querySelector('i');
    if (mobileNav.classList.contains('active')) {
        menuIcon.setAttribute('data-lucide', 'x');
    } else {
        menuIcon.setAttribute('data-lucide', 'menu');
    }
    
    // Reinitialize icons
    lucide.createIcons();
}

// Smooth Scroll Function
function scrollToSection(sectionId) {
    if(sectionId === 'feedback'){
        window.location="feedback.html"
    }
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        // Close mobile menu if open
        if (mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

// Header Scroll Effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Intersection Observer for Animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-fade-in-up, .animate-scale-in, .animate-slide-in-left, .animate-slide-in-right');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

// Form Handling
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    // Simulate form submission
    console.log('Form submitted:', data);
    
    // Show success message
    showNotification('Message sent successfully!', 'success');
    
    // Reset form
    contactForm.reset();
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i data-lucide="x"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1rem;
        box-shadow: var(--shadow-soft);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Reinitialize icons
    lucide.createIcons();
}

// Parallax Effect for Hero Section
function handleParallax() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    const floatingElements = document.querySelectorAll('.floating-element');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    floatingElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.05);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// Product Carousel Functions
function updateCarousel() {
    if (isTransitioning || !carouselTrack) return;
    
    isTransitioning = true;
    
    // Calculate transform position
    // Each slide is 1/3 of track width, so we move by (100/3)% per slide
    const slidePercentage = 100 / totalSlides; // 33.33%
    const translateX = -(currentSlide * slidePercentage);
    
    // Apply transform to track
    carouselTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
    // Update navigation buttons
    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    // Add animation effect to current slide
    setTimeout(() => {
        const slides = document.querySelectorAll('.carousel-slide');
        const activeSlide = slides[currentSlide];
        
        if (activeSlide) {
            const productImage = activeSlide.querySelector('.product-image');
            const productImageBg = activeSlide.querySelector('.product-image-bg');
            
            if (productImage && productImageBg) {
                productImageBg.style.transform = 'rotate(5deg) scale(1.02)';
                setTimeout(() => {
                    productImageBg.style.transform = 'rotate(3deg) scale(1)';
                }, 300);
            }
        }
    }, 300);
    
    setTimeout(() => {
        isTransitioning = false;
    }, 600);
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateCarousel();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
    }
}

function goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < totalSlides && slideIndex !== currentSlide) {
        currentSlide = slideIndex;
        updateCarousel();
    }
}

// Auto-play carousel
let autoPlayInterval;

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        // Move to next slide, or loop back to first slide
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }, 20000); // Change slide every 5 seconds
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// Setup carousel event listeners
function setupCarousel() {
    // Check if carousel elements exist
    if (!carouselTrack) {
        console.warn('Carousel track not found');
        return;
    }
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    } else {
        console.warn('Previous button not found');
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    } else {
        console.warn('Next button not found');
    }
    
    // Indicators
    if (indicators.length > 0) {
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });
    } else {
        console.warn('Carousel indicators not found');
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carouselTrack) {
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - prev slide
                prevSlide();
            }
        }
    }
    
    // Pause auto-play on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Initialize carousel with a small delay to ensure DOM is ready
    setTimeout(() => {
        updateCarousel();
        startAutoPlay();
    }, 100);
}

// Product Image Hover Effect (updated for carousel)
function setupProductImageHover() {
    const productImages = document.querySelectorAll('.product-image');
    const productImageBgs = document.querySelectorAll('.product-image-bg');
    
    productImages.forEach((productImage, index) => {
        const productImageBg = productImageBgs[index];
        
        if (productImage && productImageBg) {
            productImage.addEventListener('mouseenter', () => {
                productImageBg.style.transform = 'rotate(5deg) scale(1.02)';
            });
            
            productImage.addEventListener('mouseleave', () => {
                productImageBg.style.transform = 'rotate(3deg) scale(1)';
            });
        }
    });
}

// Smooth Scroll for Navigation Links
function setupSmoothScroll() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            scrollToSection(section);
        });
    });
    
    // Scroll buttons
    scrollButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const section = button.getAttribute('data-section');
            scrollToSection(section);
        });
    });
}

// Add CSS for notifications
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }
        
        .notification-message {
            flex: 1;
            color: var(--foreground);
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--muted-foreground);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 0.25rem;
            transition: var(--transition-smooth);
        }
        
        .notification-close:hover {
            background: var(--muted);
            color: var(--foreground);
        }
        
        .notification-success {
            border-left: 4px solid #10b981;
        }
        
        .notification-error {
            border-left: 4px solid #ef4444;
        }
        
        .notification-info {
            border-left: 4px solid #3b82f6;
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Setup functionality
    setupSmoothScroll();
    setupAnimations();
    setupProductImageHover();
    setupCarousel();
    addNotificationStyles();
    
    // Scroll event listeners
    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        handleParallax();
    });
    
    // Initial header state
    handleHeaderScroll();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
            if (mobileNav.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (mobileNav.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
    
    // Form validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            clearFieldError(input);
        });
    });
});

// Form validation functions
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'text':
            if (!value) {
                errorMessage = 'This field is required';
                isValid = false;
            }
            break;
            
        case 'textarea':
            if (!value) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--destructive)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--destructive);
        font-size: 0.75rem;
        margin-top: 0.25rem;
        margin-left: 0.25rem;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Performance optimization: Throttle scroll events
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
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    handleHeaderScroll();
    handleParallax();
}, 16)); // ~60fps 