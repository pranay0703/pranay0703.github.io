# Premium Portfolio Website

A world-class, feature-rich personal portfolio website with sophisticated interactions, advanced visual effects, and professional polish. Built with vanilla HTML, CSS, and JavaScript - optimized for GitHub Pages deployment.

## ✨ Features

### Advanced Visual Polish
- ✅ Custom animated cursor follower with context-aware states
- ✅ Smooth scroll progress indicator
- ✅ Sophisticated page load animations with staggered reveals
- ✅ Magnetic button hover effects
- ✅ Dynamic gradient mesh backgrounds
- ✅ Glass morphism cards with frosted glass effects
- ✅ Subtle parallax depth on hero visuals
- ✅ Floating particle animation system

### Enhanced Sections
- ✅ **Hero**: Animated text reveal, availability badge, gradient mesh background
- ✅ **About**: Glass morphism fact cards with hover effects
- ✅ **Skills**: Animated skill bars with visual progress indicators
- ✅ **Timeline**: Career journey with scroll-based animated reveals
- ✅ **Work**: 3D tilt cards, tech stack badges, project metrics, filterable categories
- ✅ **Testimonials**: Auto-playing carousel with smooth transitions
- ✅ **Contact**: Functional form with validation, copy-to-clipboard email, social proof cards

### Micro-interactions
- ✅ Active navigation highlighting based on scroll position
- ✅ Smooth section transitions with IntersectionObserver
- ✅ Toast notifications for user feedback
- ✅ Ripple effects on button clicks
- ✅ Keyboard shortcuts (T for theme, ↑ for scroll to top, ? for shortcuts hint)
- ✅ Copy email with one-click tooltip confirmation

### Performance & Technical Excellence
- ✅ Lazy loading images
- ✅ GPU-accelerated animations with `will-change` and `transform3d`
- ✅ Resource preloading for critical assets
- ✅ Respects `prefers-reduced-motion`
- ✅ Performance metrics display (load time)
- ✅ Optimized for Core Web Vitals

### SEO & PWA
- ✅ Open Graph tags for rich social previews
- ✅ Structured data (JSON-LD) for better search indexing
- ✅ PWA manifest for installability
- ✅ Multiple favicon formats
- ✅ Semantic HTML5 with proper ARIA labels
- ✅ Accessible keyboard navigation

## 📁 File Structure

```
portfolio/
│
├── index.html              # Main HTML with all sections
│
├── assets/
│   ├── styles.css          # Complete CSS with design system
│   ├── script.js           # JavaScript interactions
│   ├── manifest.json       # PWA manifest
│   │
│   └── images/
│       ├── favicon.svg     # Site favicon
│       ├── hero-grid.svg   # Hero section visual
│       ├── thumb-1.svg     # Project thumbnail 1
│       ├── thumb-2.svg     # Project thumbnail 2
│       └── thumb-3.svg     # Project thumbnail 3
│
└── README.md               # This file
```

## 🚀 Quick Start

### Option 1: Local Development

1. Clone or download the repository
2. Open `index.html` in your browser
3. That's it! No build process required.

### Option 2: Live Server (Recommended)

For a better development experience with live reloading:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (install globally first: npm install -g live-server)
live-server

# Using VS Code Live Server extension
# Right-click on index.html → "Open with Live Server"
```

Then visit `http://localhost:8000` in your browser.

## 🌐 Deploy to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it `your-portfolio` (or any name you prefer)
3. Keep it **Public** (required for free GitHub Pages)
4. Don't initialize with README, .gitignore, or license

### Step 2: Push Your Code

```bash
# Navigate to your portfolio folder
cd /path/to/portfolio

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Premium portfolio"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/your-portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### Step 4: Access Your Site

After a minute or two, your site will be live at:

```
https://YOUR_USERNAME.github.io/your-portfolio/
```

You'll see a green success banner with the URL in the Pages settings.

## 🎨 Customization Guide

### Essential Customizations

Open `index.html` and search for `<!-- Customize:` comments. Update these areas:

#### 1. Personal Information

```html
<!-- Line 8-28: Meta tags -->
<title>Your Name — Designer & Developer</title>
<meta name="description" content="Your custom description" />
<meta property="og:title" content="Your Name — Designer & Developer" />

<!-- Line 21-22: Brand/Logo -->
<span class="brand-mark">YN</span>
<span class="brand-name">Your Name</span>

<!-- Line 54-58: Hero section -->
<h1 class="hero-title">
  <span class="word">Your</span>
  <span class="word">Name</span>
  <!-- Add more words as needed -->
</h1>
```

#### 2. About Section

```html
<!-- Line 78-91: About narrative -->
<p>Your background and expertise...</p>

<!-- Line 96-108: Facts -->
<span class="value">Your City</span>
<span class="value">What you're working on</span>
<span class="value">Your focus areas</span>
```

#### 3. Skills & Timeline

```html
<!-- Line 226-252: Skills -->
<span class="skill-name">Your Skill Name</span>
<div class="skill-fill" data-level="90"></div>

<!-- Line 261-282: Timeline -->
<span class="timeline-year">2023 — Present</span>
<h4>Your Job Title</h4>
<p>What you did</p>
```

#### 4. Projects

```html
<!-- Line 302-330: Each project card -->
<h3 class="work-title">Your Project Name</h3>
<p class="work-one-liner">Brief description</p>

<div class="tech-stack">
  <span class="tech-badge">Technology 1</span>
  <span class="tech-badge">Technology 2</span>
</div>

<div class="project-metrics">
  <span class="metric-value">50%</span>
  <span class="metric-label">Your metric</span>
</div>
```

#### 5. Testimonials

```html
<!-- Line 401-420: Testimonial cards -->
<blockquote>
  <p>"Quote from client or colleague..."</p>
</blockquote>
<cite class="author-name">Client Name</cite>
<span class="author-title">Their Title, Company</span>
```

#### 6. Contact Information

```html
<!-- Line 480-495: Contact details -->
<button class="copy-email" data-email="your@email.com">
  your@email.com
</button>

<a href="https://github.com/yourhandle">GitHub</a>
<a href="https://linkedin.com/in/yourhandle">LinkedIn</a>
```

### Theme Customization

Edit CSS custom properties in `assets/styles.css` (lines 30-60):

```css
:root {
  /* Change accent color */
  --accent: hsl(221 100% 62%);  /* Your brand color */
  
  /* Adjust spacing */
  --space-xl: 2rem;
  
  /* Typography scale */
  --text-xl: clamp(1.5rem, 1.2rem + 2.2vw, 2.5rem);
}
```

### Adding More Projects

Copy an existing project card (lines 302-330) and paste it, then update:
- Title, description, tech stack
- Metrics and bullet points
- Data attributes (`data-category="design frontend"`)
- Modal ID (`data-modal="project-4"`)

Don't forget to add project details in `assets/script.js` (lines 540-600).

## ⌨️ Keyboard Shortcuts

- `T` — Toggle theme (Auto/Light/Dark)
- `↑` — Scroll to top
- `Esc` — Close modals or menus
- `?` — Show shortcuts hint

## 🎨 Color Schemes

The site automatically adapts to your system preferences (light/dark mode). Users can manually override with the theme toggle button that cycles through:

1. **Auto** — Matches system preference
2. **Light** — Always light theme
3. **Dark** — Always dark theme

Preference is saved in localStorage.

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

### Progressive Enhancement

The site works on older browsers with graceful degradation:
- Custom cursor only on devices with hover capability
- Animations respect `prefers-reduced-motion`
- Native lazy loading with IntersectionObserver fallback

## ♿ Accessibility

- Semantic HTML5 with proper heading hierarchy
- ARIA labels for interactive elements
- Keyboard navigable (all features accessible via keyboard)
- High contrast text (WCAG AA compliant)
- Visible focus states
- Screen reader friendly
- Skip to content link

## 🔧 Troubleshooting

### Images not loading

Ensure your folder structure matches:
```
assets/
  images/
    favicon.svg
    hero-grid.svg
    thumb-1.svg
    thumb-2.svg
    thumb-3.svg
```

### Custom cursor not working

The custom cursor only appears on devices with `hover` capability (desktop). It's hidden on touch devices.

### Animations not smooth

Check if "Reduce motion" is enabled in your system settings. The site respects this preference.

### GitHub Pages not updating

- Check Settings → Pages shows a green checkmark
- Wait 1-2 minutes after pushing changes
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors

## 📝 License

This is a template portfolio. Feel free to use it for your personal portfolio. No attribution required.

## 🙏 Credits

Designed and developed as a premium portfolio template demonstrating senior-level frontend expertise.

---

## 💡 Tips for Success

1. **Add real content**: Replace placeholder text with your actual work and achievements
2. **Update project links**: Link to real GitHub repos and live demos
3. **Add real testimonials**: Reach out to colleagues and clients for quotes
4. **Custom domain**: Consider connecting a custom domain in GitHub Pages settings
5. **SEO**: Update all meta tags with your actual information
6. **Analytics**: Add Google Analytics or Plausible for traffic insights
7. **Performance**: Run Lighthouse audits and aim for 95+ scores
8. **Images**: Replace SVG placeholders with actual project screenshots (optimize them first!)

---

**Questions?** Open an issue or reach out!

Built with ❤️ using HTML, CSS, and JavaScript.

