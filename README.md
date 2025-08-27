# Everbloom Feedback Page

A modern, interactive feedback page with star ratings, feedback tags, and EmailJS integration.

## Features

- ⭐ **Interactive Star Rating System** - 1-5 star rating with hover effects and animations
- 🏷️ **Quick Feedback Tags** - Selectable chips for common feedback responses
- 📝 **Detailed Feedback Textarea** - Optional text input with character counter
- 📧 **EmailJS Integration** - Automatic email sending with customizable templates
- 📱 **Fully Responsive** - Mobile-friendly design with touch support
- 🎨 **Modern UI/UX** - Smooth animations, hover effects, and visual feedback
- ♿ **Accessibility** - Keyboard navigation and screen reader support
- 💾 **Auto-save Drafts** - Local storage for unsaved feedback
- 🔔 **Smart Notifications** - Success, error, and info notifications

## Setup Instructions

### 1. EmailJS Configuration

The feedback page uses EmailJS to send feedback emails. You'll need to set up EmailJS:

1. **Sign up for EmailJS** at [https://www.emailjs.com/](https://www.emailjs.com/)
2. **Create an Email Service** (Gmail, Outlook, etc.)
3. **Create an Email Template** with the following variables:
   - `{{rating}}` - Star rating (1-5)
   - `{{rating_description}}` - Human-readable rating description
   - `{{tags}}` - Selected feedback tags
   - `{{feedback}}` - Detailed feedback text
   - `{{timestamp}}` - Submission timestamp
   - `{{user_agent}}` - User's browser information

4. **Update the JavaScript file** with your EmailJS credentials:

```javascript
// In feedback.js, replace these placeholders:
emailjs.init("YOUR_EMAILJS_USER_ID"); // Your EmailJS User ID

// In the handleSubmit function:
const response = await emailjs.send(
    'YOUR_SERVICE_ID',     // Your EmailJS Service ID
    'YOUR_TEMPLATE_ID',    // Your EmailJS Template ID
    templateParams
);
```

### 2. EmailJS Template Example

Here's a sample email template you can use:

```html
Subject: New Feedback Received - Rating: {{rating}}/5

Hello,

You've received new feedback from your website:

Rating: {{rating}}/5 - {{rating_description}}

Quick Feedback Tags: {{tags}}

Detailed Feedback:
{{feedback}}

Submitted: {{timestamp}}
User Agent: {{user_agent}}

---
This feedback was sent from your website's feedback form.
```

### 3. File Structure

```
everbloom/
├── feedback.html          # Main feedback page
├── feedback-styles.css    # Styling and animations
├── feedback.js           # Interactive functionality
├── assets/               # Images and logos
└── README.md    # This file
```

## Customization

### Colors and Theme

The page uses CSS variables for easy customization. Edit the `:root` section in `feedback-styles.css`:

```css
:root {
    --primary: #10b981;        /* Main brand color */
    --accent: #f59e0b;         /* Star rating color */
    --background: #ffffff;     /* Page background */
    --surface: #f9fafb;        /* Card backgrounds */
    /* ... more variables */
}
```

### Feedback Tags

Modify the tags in `feedback.html`:

```html
<div class="tags-container" id="tagsContainer">
    <button class="tag" data-tag="Fast">Fast</button>
    <button class="tag" data-tag="Easy">Easy</button>
    <!-- Add or modify tags as needed -->
</div>
```

### Rating Descriptions

Update the rating descriptions in `feedback.js`:

```javascript
const ratingDescriptions = {
    1: "Poor - We're sorry to hear that",
    2: "Fair - We have room to improve",
    3: "Good - Thanks for your feedback",
    4: "Very Good - We're glad you enjoyed it",
    5: "Excellent - We're thrilled you loved it!"
};
```

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- **Throttled scroll events** for smooth performance
- **Intersection Observer** for efficient animations
- **Local storage** for draft saving
- **Optimized animations** with CSS transforms

## Accessibility Features

- **Keyboard navigation** for star ratings and tags
- **Screen reader support** with proper ARIA labels
- **Focus management** and visual indicators
- **High contrast mode** support
- **Reduced motion** support for users with vestibular disorders

## Troubleshooting

### EmailJS Issues

1. **Check browser console** for JavaScript errors
2. **Verify EmailJS credentials** are correct
3. **Test email template** variables are properly formatted
4. **Check EmailJS service** is active and configured

### Styling Issues

1. **Clear browser cache** if styles aren't updating
2. **Check CSS file path** is correct
3. **Verify CSS variables** are supported in your browser

### Mobile Issues

1. **Test touch interactions** on actual devices
2. **Check viewport meta tag** is present
3. **Verify responsive breakpoints** work correctly

## License

This feedback page is part of the Everbloom project. Feel free to modify and use as needed.

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify all files are properly linked
3. Test EmailJS configuration separately
4. Ensure all dependencies are loaded (Lucide icons, EmailJS)

## Dependencies

- **Lucide Icons** - For UI icons (loaded via CDN)
- **EmailJS** - For email functionality (loaded via CDN)
- **Modern CSS** - CSS Grid, Flexbox, CSS Variables
- **ES6+ JavaScript** - Async/await, arrow functions, etc. 