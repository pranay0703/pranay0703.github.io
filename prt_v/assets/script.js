// ===============================================
// Premium Portfolio — Enhanced Interactions
// ===============================================

(() => {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;

  // ==========================================
  // Utility Functions
  // ==========================================

  function $(selector, context = doc) {
    return context.querySelector(selector);
  }

  function $$(selector, context = doc) {
    return Array.from(context.querySelectorAll(selector));
  }

  function debounce(fn, ms) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function throttle(fn, ms) {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= ms) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  }

  // ==========================================
  // Theme Management (Auto/Light/Dark)
  // ==========================================

  const ThemeManager = {
    storageKey: "theme-preference",
    themeBtn: $("#theme-toggle"),
    metaTheme: $('meta[name="theme-color"]'),
    systemQuery: window.matchMedia("(prefers-color-scheme: dark)"),

    init() {
      const saved = this.getStoredTheme();
      this.applyTheme(saved);
      this.systemQuery.addEventListener?.("change", () => {
        if (this.getStoredTheme() === "auto") this.applyTheme("auto");
      });
      this.themeBtn?.addEventListener("click", () => this.cycle());
    },

    getStoredTheme() {
      const v = localStorage.getItem(this.storageKey);
      return ["auto", "light", "dark"].includes(v) ? v : "auto";
    },

    setStoredTheme(mode) {
      localStorage.setItem(this.storageKey, mode);
    },

    applyTheme(mode) {
      root.setAttribute("data-theme", mode);
      this.updateButton(mode);
      this.updateMetaTheme();
    },

    updateButton(mode) {
      if (!this.themeBtn) return;
      this.themeBtn.dataset.mode = mode;
      const label = mode.charAt(0).toUpperCase() + mode.slice(1);
      this.themeBtn.setAttribute("aria-label", `Theme: ${label}`);
      const icon = mode === "dark" ? "◐" : mode === "light" ? "◯" : "◐";
      const iconEl = $(".theme-icon", this.themeBtn);
      if (iconEl) iconEl.textContent = icon;
    },

    updateMetaTheme() {
      try {
        const bg = getComputedStyle(root)
          .getPropertyValue("--bg")
          .trim();
        if (bg && this.metaTheme) this.metaTheme.setAttribute("content", bg);
      } catch (e) {}
    },

    cycle() {
      const current = this.getStoredTheme();
      const next = current === "auto" ? "light" : current === "light" ? "dark" : "auto";
      this.setStoredTheme(next);
      this.applyTheme(next);
    },
  };

  // ==========================================
  // Mobile Navigation Toggle
  // ==========================================

  const MobileNav = {
    toggle: $("#nav-toggle"),
    menu: $("#nav-menu"),

    init() {
      this.toggle?.addEventListener("click", () => this.toggleMenu());
      this.menu?.addEventListener("click", (e) => {
        if (e.target.tagName === "A") this.close();
      });
      doc.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.close();
      });
    },

    toggleMenu() {
      const isOpen = this.menu.classList.contains("is-open");
      isOpen ? this.close() : this.open();
    },

    open() {
      this.menu.classList.add("is-open");
      this.toggle?.setAttribute("aria-expanded", "true");
    },

    close() {
      this.menu.classList.remove("is-open");
      this.toggle?.setAttribute("aria-expanded", "false");
    },
  };

  // ==========================================
  // Scroll Progress Bar
  // ==========================================

  const ScrollProgress = {
    bar: $(".scroll-progress"),

    init() {
      if (!this.bar) return;
      window.addEventListener("scroll", throttle(() => this.update(), 16), {
        passive: true,
      });
      this.update();
    },

    update() {
      const scrollable = doc.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrollable > 0 ? scrolled / scrollable : 0;
      this.bar.style.transform = `scaleX(${progress})`;
    },
  };

  // ==========================================
  // Custom Cursor
  // ==========================================

  const CustomCursor = {
    cursor: $(".cursor"),
    follower: $(".cursor-follower"),
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    followerX: window.innerWidth / 2,
    followerY: window.innerHeight / 2,
    isHovering: false,
    isInitialized: false,

    init() {
      if (!this.cursor || !this.follower) return;
      if (window.matchMedia("(hover: none)").matches) return;

      // Initialize cursor position in center
      this.cursor.style.left = `${this.x}px`;
      this.cursor.style.top = `${this.y}px`;
      this.follower.style.left = `${this.followerX}px`;
      this.follower.style.top = `${this.followerY}px`;

      doc.addEventListener("mousemove", (e) => {
        this.x = e.clientX;
        this.y = e.clientY;
        
        // Enable custom cursor on first move
        if (!this.isInitialized) {
          body.classList.add("has-custom-cursor");
          this.isInitialized = true;
        }
      });

      // Show cursor immediately and start animation
      this.cursor.style.opacity = "1";
      this.follower.style.opacity = "1";

      // Hover states - Note: pointer-events must not be none on these elements
      const interactiveElements = $$("a, button, .tilt-card, input, textarea, select");
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          body.classList.add("cursor-hover");
          this.isHovering = true;
        });
        el.addEventListener("mouseleave", () => {
          body.classList.remove("cursor-hover");
          this.isHovering = false;
        });
        el.addEventListener("mousedown", () => body.classList.add("cursor-active"));
        el.addEventListener("mouseup", () => body.classList.remove("cursor-active"));
      });

      this.animate();
    },

    animate() {
      // Cursor follows immediately
      this.cursor.style.left = `${this.x}px`;
      this.cursor.style.top = `${this.y}px`;

      // Follower has smooth lag
      this.followerX += (this.x - this.followerX) * 0.15;
      this.followerY += (this.y - this.followerY) * 0.15;
      this.follower.style.left = `${this.followerX}px`;
      this.follower.style.top = `${this.followerY}px`;

      requestAnimationFrame(() => this.animate());
    },
  };

  // ==========================================
  // Active Navigation Highlighting
  // ==========================================

  const ActiveNav = {
    links: $$(".nav-link"),
    sections: [],

    init() {
      if (!this.links.length) return;
      this.sections = this.links
        .map((link) => {
          const id = link.getAttribute("href");
          return id?.startsWith("#") ? $(id) : null;
        })
        .filter(Boolean);

      window.addEventListener(
        "scroll",
        throttle(() => this.update(), 100),
        { passive: true }
      );
      this.update();
    },

    update() {
      const scrollY = window.scrollY + 100;
      let current = null;

      this.sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          current = section.id;
        }
      });

      this.links.forEach((link) => {
        const href = link.getAttribute("href")?.substring(1);
        link.classList.toggle("active", href === current);
      });
    },
  };

  // ==========================================
  // Reveal on Scroll (IntersectionObserver)
  // ==========================================

  const RevealOnScroll = {
    prefersReduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,

    init() {
      const reveals = $$(".reveal, .skill-item, .timeline-item");
      if (!reveals.length) return;

      if (this.prefersReduced) {
        reveals.forEach((el) => el.classList.add("in-view"));
        return;
      }

      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                io.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1 }
        );
        reveals.forEach((el) => io.observe(el));
      } else {
        // Fallback
        reveals.forEach((el) => el.classList.add("in-view"));
      }
    },
  };

  // ==========================================
  // Floating Particles (Hero Background)
  // ==========================================

  const Particles = {
    container: $(".particles"),
    count: 20,

    init() {
      if (!this.container) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      for (let i = 0; i < this.count; i++) {
        const particle = doc.createElement("div");
        particle.className = "particle";
        particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * 4 + 2}px;
          height: ${Math.random() * 4 + 2}px;
          background: var(--accent);
          opacity: ${Math.random() * 0.3 + 0.1};
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation: float ${Math.random() * 20 + 10}s linear infinite;
          animation-delay: ${Math.random() * -20}s;
        `;
        this.container.appendChild(particle);
      }

      // Inject keyframes
      if (!$("#particle-keyframes")) {
        const style = doc.createElement("style");
        style.id = "particle-keyframes";
        style.textContent = `
          @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(10px, -20px) rotate(90deg); }
            50% { transform: translate(-10px, -40px) rotate(180deg); }
            75% { transform: translate(20px, -30px) rotate(270deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
          }
        `;
        doc.head.appendChild(style);
      }
    },
  };

  // ==========================================
  // 3D Tilt Effect on Work Cards
  // ==========================================

  const TiltCards = {
    cards: $$(".tilt-card"),

    init() {
      if (window.matchMedia("(hover: none)").matches) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      this.cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => this.handleMove(e, card));
        card.addEventListener("mouseleave", () => this.handleLeave(card));
      });
    },

    handleMove(e, card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    },

    handleLeave(card) {
      card.style.transform = "";
    },
  };

  // ==========================================
  // Magnetic Button Effect
  // ==========================================

  const MagneticButtons = {
    buttons: $$(".magnetic"),

    init() {
      if (window.matchMedia("(hover: none)").matches) return;

      this.buttons.forEach((btn) => {
        btn.addEventListener("mousemove", (e) => this.handleMove(e, btn));
        btn.addEventListener("mouseleave", () => this.handleLeave(btn));
      });
    },

    handleMove(e, btn) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const distance = Math.sqrt(x * x + y * y);
      const strength = Math.min(distance / 2, 15);
      const angle = Math.atan2(y, x);
      const offsetX = Math.cos(angle) * strength * 0.3;
      const offsetY = Math.sin(angle) * strength * 0.3;

      btn.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    },

    handleLeave(btn) {
      btn.style.transform = "";
    },
  };

  // ==========================================
  // Project Filtering
  // ==========================================

  const ProjectFilter = {
    filters: $$(".filter-btn"),
    cards: $$(".work-card"),

    init() {
      this.filters.forEach((btn) => {
        btn.addEventListener("click", () => this.filter(btn));
      });
    },

    filter(btn) {
      const category = btn.dataset.filter;

      // Update active state
      this.filters.forEach((f) => f.classList.remove("active"));
      btn.classList.add("active");

      // Filter cards
      this.cards.forEach((card) => {
        const categories = card.dataset.category?.split(" ") || [];
        const match = category === "all" || categories.includes(category);

        if (match) {
          card.classList.remove("hidden");
          card.style.display = "";
        } else {
          card.classList.add("hidden");
          setTimeout(() => {
            if (card.classList.contains("hidden")) {
              card.style.display = "none";
            }
          }, 300);
        }
      });
    },
  };

  // ==========================================
  // Project Modal
  // ==========================================

  const ProjectModal = {
    modal: $("#project-modal"),
    body: $(".modal-body", $("#project-modal")),
    triggers: $$("[data-modal]"),
    closeButtons: $$("[data-close-modal]"),

    projects: {
      "project-1": {
        title: "Nimbus Dashboard",
        description: "Analytics system for product teams",
        fullDescription: `
          <h2>Nimbus Dashboard</h2>
          <p>A comprehensive analytics platform designed to help product teams make data-driven decisions with clarity and speed.</p>
          <h3>Challenge</h3>
          <p>Product teams were struggling with fragmented analytics tools and unclear data visualization, leading to slow decision-making.</p>
          <h3>Solution</h3>
          <p>We redesigned the information architecture from the ground up, creating a unified dashboard with intuitive chart components and responsive grid layouts.</p>
          <h3>Impact</h3>
          <ul>
            <li>28% improvement in task completion rates</li>
            <li>5,000+ active users within 6 months</li>
            <li>Reduced time-to-insight by 40%</li>
          </ul>
          <h3>Technologies</h3>
          <p>React, TypeScript, D3.js, Styled Components, REST API</p>
        `,
      },
      "project-2": {
        title: "Sable Commerce",
        description: "Minimal storefront with premium feel",
        fullDescription: `
          <h2>Sable Commerce</h2>
          <p>A high-performance e-commerce platform with a focus on minimalism and premium user experience.</p>
          <h3>Challenge</h3>
          <p>Create a storefront that feels premium while maintaining exceptional performance and accessibility.</p>
          <h3>Solution</h3>
          <p>Systemized typography and spacing, implemented accessible forms, optimized asset delivery, and focused on Core Web Vitals.</p>
          <h3>Impact</h3>
          <ul>
            <li>Time-to-Interactive under 1.2 seconds</li>
            <li>Lighthouse score of 98</li>
            <li>45% increase in conversion rates</li>
          </ul>
          <h3>Technologies</h3>
          <p>Next.js, Tailwind CSS, Stripe, Vercel, Headless CMS</p>
        `,
      },
      "project-3": {
        title: "Atlas Docs",
        description: "Documentation framework for API products",
        fullDescription: `
          <h2>Atlas Docs</h2>
          <p>A search-first documentation framework designed for complex API products.</p>
          <h3>Challenge</h3>
          <p>Developers needed faster access to documentation with better code samples and clearer navigation patterns.</p>
          <h3>Solution</h3>
          <p>Built a search-first navigation system with instant results, integrated live code samples, and created consistent content patterns.</p>
          <h3>Impact</h3>
          <ul>
            <li>Adopted by 3 internal product teams</li>
            <li>45% increase in search usage</li>
            <li>Reduced support tickets by 30%</li>
          </ul>
          <h3>Technologies</h3>
          <p>Vue.js, Markdown, Algolia Search, GitHub API</p>
        `,
      },
    },

    init() {
      this.triggers.forEach((btn) => {
        btn.addEventListener("click", () => {
          const projectId = btn.dataset.modal;
          this.open(projectId);
        });
      });

      this.closeButtons.forEach((btn) => {
        btn.addEventListener("click", () => this.close());
      });

      doc.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.close();
      });
    },

    open(projectId) {
      const project = this.projects[projectId];
      if (!project || !this.modal) return;

      this.body.innerHTML = project.fullDescription;
      this.modal.removeAttribute("hidden");
      this.modal.setAttribute("aria-hidden", "false");
      body.style.overflow = "hidden";
    },

    close() {
      if (!this.modal) return;
      this.modal.setAttribute("hidden", "");
      this.modal.setAttribute("aria-hidden", "true");
      body.style.overflow = "";
    },
  };

  // ==========================================
  // Testimonials Carousel
  // ==========================================

  const TestimonialsCarousel = {
    cards: $$(".testimonial-card"),
    dots: $$(".dot"),
    prevBtn: $(".carousel-btn.prev"),
    nextBtn: $(".carousel-btn.next"),
    current: 0,
    autoplayInterval: null,

    init() {
      if (!this.cards.length) return;

      this.prevBtn?.addEventListener("click", () => this.prev());
      this.nextBtn?.addEventListener("click", () => this.next());

      this.dots.forEach((dot, index) => {
        dot.addEventListener("click", () => this.goTo(index));
      });

      // Auto-play
      this.startAutoplay();

      // Pause on hover
      this.cards.forEach((card) => {
        card.addEventListener("mouseenter", () => this.stopAutoplay());
        card.addEventListener("mouseleave", () => this.startAutoplay());
      });
    },

    goTo(index) {
      this.cards.forEach((card, i) => {
        card.classList.toggle("active", i === index);
      });
      this.dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
        dot.setAttribute("aria-selected", i === index ? "true" : "false");
      });
      this.current = index;
    },

    next() {
      this.goTo((this.current + 1) % this.cards.length);
    },

    prev() {
      this.goTo((this.current - 1 + this.cards.length) % this.cards.length);
    },

    startAutoplay() {
      this.stopAutoplay();
      this.autoplayInterval = setInterval(() => this.next(), 6000);
    },

    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    },
  };

  // ==========================================
  // Contact Form Validation & Submission
  // ==========================================

  const ContactForm = {
    form: $("#contact-form"),
    status: $(".form-status", $("#contact-form")),

    init() {
      if (!this.form) return;
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));

      // Real-time validation
      $$("input, textarea", this.form).forEach((field) => {
        field.addEventListener("blur", () => this.validateField(field));
      });
    },

    validateField(field) {
      const error = field.parentElement.querySelector(".form-error");
      if (!error) return;

      if (!field.validity.valid) {
        error.textContent = field.validationMessage;
        field.setAttribute("aria-invalid", "true");
        return false;
      } else {
        error.textContent = "";
        field.removeAttribute("aria-invalid");
        return true;
      }
    },

    async handleSubmit(e) {
      e.preventDefault();

      // Validate all fields
      const fields = $$("input, textarea", this.form);
      const allValid = fields.every((field) => this.validateField(field));

      if (!allValid) {
        this.showStatus("Please fix the errors above.", "error");
        return;
      }

      const btn = $("button[type=submit]", this.form);
      if (btn) btn.classList.add("is-loading");

      // Simulate submission (replace with real API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (btn) btn.classList.remove("is-loading");

      // Success
      this.showStatus("Message sent successfully! I'll get back to you soon.", "success");
      this.form.reset();
      Toast.show("Message sent!");
    },

    showStatus(message, type) {
      if (!this.status) return;
      this.status.textContent = message;
      this.status.className = `form-status ${type}`;
    },
  };

  // ==========================================
  // Copy Email to Clipboard
  // ==========================================

  const CopyEmail = {
    buttons: $$(".copy-email"),

    init() {
      this.buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const email = btn.dataset.email;
          if (email) this.copy(email);
        });
      });
    },

    async copy(text) {
      try {
        await navigator.clipboard.writeText(text);
        Toast.show("Email copied to clipboard!");
      } catch (err) {
        Toast.show("Failed to copy email", "error");
      }
    },
  };

  // ==========================================
  // Toast Notifications
  // ==========================================

  const Toast = {
    el: $("#toast"),
    timeout: null,

    show(message, duration = 3000) {
      if (!this.el) return;
      this.el.textContent = message;
      this.el.classList.add("show");

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.hide(), duration);
    },

    hide() {
      if (!this.el) return;
      this.el.classList.remove("show");
    },
  };

  // ==========================================
  // Scroll to Top Button
  // ==========================================

  const ScrollToTop = {
    init() {
      // Wait for DOM to be fully ready and find button
      setTimeout(() => {
        const btn = document.querySelector(".scroll-top");
        
        if (!btn) {
          console.error("❌ Scroll to top button not found!");
          console.log("Available buttons:", document.querySelectorAll("button"));
          return;
        }

        console.log("✅ Scroll to top button found:", btn);

        // Direct onclick as most reliable method
        btn.onclick = function(e) {
          console.log("🚀 Scroll to top clicked!");
          e.preventDefault();
          e.stopPropagation();
          
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0; // For Safari
          
          // Smooth scroll
          window.scrollTo({ 
            top: 0, 
            left: 0,
            behavior: "smooth" 
          });
          
          return false;
        };

        // Test click detection
        btn.addEventListener("mouseenter", () => {
          console.log("🖱️ Mouse entered button");
        });

        btn.addEventListener("mousedown", () => {
          console.log("👆 Mouse down on button");
        });

        // Make absolutely sure it's clickable
        btn.style.pointerEvents = "auto";
        btn.style.cursor = "pointer";
        btn.style.position = "relative";
        btn.style.zIndex = "9999";

        console.log("Button styles:", {
          pointerEvents: btn.style.pointerEvents,
          cursor: btn.style.cursor,
          zIndex: btn.style.zIndex
        });

        // Visibility based on scroll
        const updateVisibility = () => {
          if (window.scrollY > 300) {
            btn.style.opacity = "1";
          } else {
            btn.style.opacity = "0.5";
          }
        };
        
        window.addEventListener("scroll", updateVisibility, { passive: true });
        updateVisibility();
      }, 100);
    },
  };

  // ==========================================
  // Keyboard Shortcuts
  // ==========================================

  const KeyboardShortcuts = {
    hint: $("#shortcuts-hint"),

    init() {
      doc.addEventListener("keydown", (e) => {
        // Ignore if typing in input
        if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

        switch (e.key.toLowerCase()) {
          case "t":
            ThemeManager.cycle();
            break;
          case "arrowup":
            if (e.shiftKey) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
            break;
          case "?":
            e.preventDefault();
            this.toggleHint();
            break;
        }
      });

      $(".close-hint", this.hint)?.addEventListener("click", () => this.hideHint());
    },

    toggleHint() {
      if (!this.hint) return;
      const isHidden = this.hint.hasAttribute("hidden");
      isHidden ? this.showHint() : this.hideHint();
    },

    showHint() {
      this.hint?.removeAttribute("hidden");
      setTimeout(() => this.hideHint(), 10000);
    },

    hideHint() {
      this.hint?.setAttribute("hidden", "");
    },
  };

  // ==========================================
  // Performance Metrics Display
  // ==========================================

  const PerformanceMetrics = {
    el: $("#load-time"),

    init() {
      if (!this.el) return;
      if (!window.performance) return;

      window.addEventListener("load", () => {
        setTimeout(() => {
          const perf = performance.getEntriesByType("navigation")[0];
          if (perf) {
            const loadTime = perf.loadEventEnd - perf.fetchStart;
            const seconds = (loadTime / 1000).toFixed(2);
            this.el.textContent = `${seconds}s load`;
          }
        }, 0);
      });
    },
  };

  // ==========================================
  // Lazy Load Images
  // ==========================================

  const LazyLoad = {
    init() {
      if ("loading" in HTMLImageElement.prototype) {
        // Native lazy loading supported
        return;
      }

      // Fallback for browsers without native support
      const images = $$("img[loading=lazy]");
      if (!images.length) return;

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            io.unobserve(img);
          }
        });
      });

      images.forEach((img) => io.observe(img));
    },
  };

  // ==========================================
  // Footer Year Auto-Update
  // ==========================================

  const UpdateYear = {
    init() {
      const yearEl = $("#year");
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    },
  };

  // ==========================================
  // Initialize All Features
  // ==========================================

  function init() {
    ThemeManager.init();
    MobileNav.init();
    ScrollProgress.init();
    CustomCursor.init();
    ActiveNav.init();
    RevealOnScroll.init();
    Particles.init();
    TiltCards.init();
    MagneticButtons.init();
    ProjectFilter.init();
    ProjectModal.init();
    TestimonialsCarousel.init();
    ContactForm.init();
    CopyEmail.init();
    ScrollToTop.init();
    KeyboardShortcuts.init();
    PerformanceMetrics.init();
    LazyLoad.init();
    UpdateYear.init();

    // Add loaded class to body
    body.classList.add("loaded");
  }

  // Start when DOM is ready
  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
