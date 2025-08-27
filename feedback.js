// Initialize Lucide icons
lucide.createIcons();

const emailSettings = {
    serviceId: 'service_hdzypdf',
    templateId: 'template_0mmoz5o', 
    publicKey: 'xfooa-RHz07D3dGoh'
};

// Initialize EmailJS
emailjs.init(emailSettings.publicKey); // Replace with your actual EmailJS User ID

// DOM Elements
const stars = document.querySelectorAll('.star');
const faStar = document.querySelectorAll('.fa-star');
// const iconRating = 
const ratingText = document.getElementById('ratingText');
const tags = document.querySelectorAll('.tag');
const feedbackText = document.getElementById('feedbackText');
const customerName = document.getElementById('customerName');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

// State
let selectedRating = 0;
let selectedTags = [];
let isSubmitting = false;

// Rating descriptions
const ratingDescriptions = {
    1: "Poor - We're sorry to hear that",
    2: "Fair - We have room to improve",
    3: "Good - Thanks for your feedback",
    4: "Very Good - We're glad you enjoyed it",
    5: "Excellent - We're thrilled you loved it!"
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {

    setupStarRating();
    setupFeedbackTags();
    setupTextarea();
    setupMobileMenu();
    setupFormValidation();
    setupAnimations();

});

// Star Rating System
function setupStarRating() {
    stars.forEach((star, index) => {
        
        star.addEventListener('click', () => selectRating(index+1));
        star.addEventListener('mouseenter', () => previewRating(index + 1));
        star.addEventListener('mouseleave', () => clearPreview());
    });
}

function selectRating(rating) {
    selectedRating = rating;

    updateStarDisplay();
    updateRatingText();
    updateSubmitButton();
}

function previewRating(rating) {
    if (selectedRating === 0) {
        updateStarDisplay(rating);
        updateRatingText(rating);
    }
}

function clearPreview() {
    if (selectedRating === 0) {
        updateStarDisplay(0);
        updateRatingText(0);
    }
}

function updateStarDisplay(rating = selectedRating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color='#f59e0b';
        } else {
            star.style.color='';
        }
    });
}

function updateRatingText(rating = selectedRating) {
    if (rating === 0) {
        ratingText.textContent = "Select a rating";
        ratingText.style.color = 'var(--text-secondary)';
    } else {
        ratingText.textContent = ratingDescriptions[rating];
        ratingText.style.color = 'var(--#10b981)';
        ratingText.classList.add('animate-fade-in');
    }
}

// Feedback Tags System
function setupFeedbackTags() {
    tags.forEach(tag => {
        tag.addEventListener('click', () => toggleTag(tag));
    });
}

function toggleTag(tag) {
    const tagValue = tag.dataset.tag;
    
    if (tag.classList.contains('selected')) {
        tag.classList.remove('selected');
        selectedTags = selectedTags.filter(t => t !== tagValue);
    } else {
        tag.classList.add('selected');
        selectedTags.push(tagValue);
    }
    
    // Add animation
    tag.style.transform = 'scale(0.95)';
    setTimeout(() => {
        tag.style.transform = '';
    }, 150);
}

// Textarea Setup
function setupTextarea() {
    feedbackText.addEventListener('input', updateCharCount);
    feedbackText.addEventListener('focus', expandTextarea);
    feedbackText.addEventListener('blur', contractTextarea);
}
function setupCustomerName() {
    customerName.addEventListener('input', updateCharCount);
    customerName.addEventListener('focus', expandTextarea);
    customerName.addEventListener('blur', contractTextarea);
}

function updateCharCount() {
    const currentLength = feedbackText.value.length;
    charCount.textContent = currentLength;
    
    // Change color based on character count
    if (currentLength > 400) {
        charCount.style.color = 'var(--warning)';
    } else if (currentLength > 300) {
        charCount.style.color = 'var(--accent)';
    } else {
        charCount.style.color = 'var(--text-secondary)';
    }
}

function expandTextarea() {
    feedbackText.style.minHeight = '150px';
    feedbackText.style.transition = 'min-height 0.3s ease';
}

function contractTextarea() {
    if (feedbackText.value.length === 0) {
        feedbackText.style.minHeight = '120px';
    }
}

// Form Validation
function setupFormValidation() {
    updateSubmitButton();
}

function updateSubmitButton() {
    const isValid = selectedRating > 0;
    submitBtn.disabled = !isValid || isSubmitting;
    
    if (isValid) {
        submitBtn.classList.add('animate-fade-in');
    }
}

// Submit Form
submitBtn.addEventListener('click', handleSubmit);
async function handleSubmit() {
    if (isSubmitting || selectedRating === 0) return;
    
    isSubmitting = true;
    updateSubmitButton();
    showLoadingState();
    
    try {
        // Prepare email template parameters
        
        if(customerName.value.length === 0 ){
            showNotification('Failed to send feedback. Please fill up the Customer Name.', 'error');
            return;
        }
        if (feedbackText.value.trim().length > 0 && feedbackText.value.trim().length < 10) {
            showNotification('Please provide more detailed feedback (at least 10 characters)', 'warning');
            return;
        }
        const templateParams = {
            rating: selectedRating,
            rating_description: ratingDescriptions[selectedRating],
            tags: selectedTags.length > 0 ? selectedTags.join(', ') : 'None selected',
            feedback: feedbackText.value.trim() || 'No additional comments',
            customerName: customerName.value,
            timestamp: new Date().toLocaleString(),
        };
        // Send email using EmailJS
        const response = await emailjs.send(
            emailSettings.serviceId, // Replace with your EmailJS Service ID
            emailSettings.templateId, // Replace with your EmailJS Template ID
            templateParams
        );
        
        if (response.status === 200) {
            showSuccessModal();
            resetForm();
        } else {
            throw new Error('Failed to send feedback');
        }
        
    } catch (error) {
        showNotification('Failed to send feedback. Please try again.', 'error');
    } finally {
        isSubmitting = false;
        hideLoadingState();
        updateSubmitButton();
    }
}

function showLoadingState() {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
}

function hideLoadingState() {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
}

// Success Modal
function showSuccessModal() {
    successModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    successModal.classList.remove('show');
    document.body.style.overflow = '';
}

function resetForm() {
    // Reset rating
    selectedRating = 0;
    updateStarDisplay();
    updateRatingText();
    
    // Reset tags
    selectedTags = [];
    tags.forEach(tag => tag.classList.remove('selected'));
    
    // Reset textarea
    feedbackText.value = '';
    customerName.value = '';
    updateCharCount();
    contractTextarea();
    
    // Reset button
    updateSubmitButton();
    
    // Close modal
    closeSuccessModal();
    
    // Show success notification
    showNotification('Feedback submitted successfully!', 'success');
}

// Mobile Menu
function setupMobileMenu() {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
            if (mobileNav.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
    
    // Close mobile menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

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

// Animations
function setupAnimations() {
    // Intersection Observer for fade-in animations
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

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feedback-card, .hero-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Reinitialize icons
    lucide.createIcons();
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
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

// Event listeners
window.addEventListener('scroll', throttle(handleHeaderScroll, 16));

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    // Star rating with arrow keys
    if (e.target.closest('.stars')) {
        const currentStar = e.target.closest('.star');
        if (currentStar) {
            const currentIndex = Array.from(stars).indexOf(currentStar);
            
            if (e.key === 'ArrowRight' && currentIndex < stars.length - 1) {
                e.preventDefault();
                stars[currentIndex + 1].focus();
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                e.preventDefault();
                stars[currentIndex - 1].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectRating(currentIndex + 1);
            }
        }
    }
    
    // Tag selection with Enter key
    if (e.target.classList.contains('tag') && e.key === 'Enter') {
        e.preventDefault();
        toggleTag(e.target);
    }
});

// Form validation on blur
feedbackText.addEventListener('blur', () => {
    if (feedbackText.value.trim().length > 0 && feedbackText.value.trim().length < 10) {
        showNotification('Please provide more detailed feedback (at least 10 characters)', 'warning');
        return;        
    }
});

// Auto-save draft (optional feature)
let autoSaveTimeout;
feedbackText.addEventListener('input', () => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        const draft = {
            rating: selectedRating,
            tags: selectedTags,
            feedback: feedbackText.value,
            customerName: customerName.value,
            timestamp: Date.now()
        };
        localStorage.setItem('feedbackDraft', JSON.stringify(draft));
    }, 1000);
});

// Load draft on page load
window.addEventListener('load', () => {
    const savedDraft = localStorage.getItem('feedbackDraft');
    if (savedDraft) {
        try {
            const draft = JSON.parse(savedDraft);
            const draftAge = Date.now() - draft.timestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (draftAge < maxAge) {
                // Restore draft
                selectedRating = draft.rating;
                selectedTags = draft.tags;
                feedbackText.value = draft.feedback;
                customerName.value = draft.customerName;

                
                updateStarDisplay();
                updateRatingText();
                updateCharCount();
                
                // Restore tag selections
                tags.forEach(tag => {
                    if (selectedTags.includes(tag.dataset.tag)) {
                        tag.classList.add('selected');
                    }
                });
                
                updateSubmitButton();
                
                // Show notification about restored draft
                showNotification('Previous feedback draft restored', 'info');
            } else {
                // Clear expired draft
                localStorage.removeItem('feedbackDraft');
            }
        } catch (error) {
            console.error('Error loading draft:', error);
            localStorage.removeItem('feedbackDraft');
        }
    }
});

// Clear draft after successful submission
function clearDraft() {
    localStorage.removeItem('feedbackDraft');
}

// Enhanced form reset to also clear draft
const originalResetForm = resetForm;
resetForm = function() {
    originalResetForm();
    clearDraft();
};

// Export functions for global access
window.closeSuccessModal = closeSuccessModal;
window.resetForm = resetForm; 