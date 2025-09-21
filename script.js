// ===== GLOBAL VARIABLES =====
let currentChannel = 'hero';
let isAnimating = false;
let completedAnimations = new Set(); // Track completed animations

// ===== DATA STREAM VARIABLES =====
let dataStreamInterval;
let bitElements = [];

// Channel mapping
const channelMap = {
    'hero': '01',
    'about': '02', 
    'projects': '03',
    'skills': '04',
    'contact': '05'
};

// About text content
const aboutText = `Hello! I'm Venkata Pranay Bathini, a passionate Data Scientist and Machine Learning Engineer currently pursuing my M.S. in Data Science at the University of Maryland, College Park (GPA: 3.85/4.0).

I specialize in advanced machine learning, deep learning, and cloud technologies, with expertise in Python, PyTorch, TensorFlow, and cloud platforms like AWS, Azure, and GCP. My work focuses on developing innovative AI solutions for complex real-world problems.

My journey began with a Computer Science degree from PES University, where I developed a strong foundation in programming and algorithms. I've since specialized in cutting-edge areas like Graph Neural Networks, Large Language Models, and multimodal AI systems.

I've published research on LLM-based interview systems at IEEE ISML 2024 and have been recognized in top-tier competitions, including finishing in the top 15% at Datathon 2024. My projects span from fraud detection systems to rare disease diagnostics, consistently achieving high accuracy and real-world impact.

When I'm not developing ML models, you can find me exploring new AI research, contributing to open-source projects, or working on innovative solutions that bridge the gap between academic research and practical applications.

I'm always excited to work on challenging projects that push the boundaries of what's possible with AI and machine learning. Let's build the future together!`;

// Skills data
const skillsData = [
    {
        category: 'PROGRAMMING LANGUAGES',
        skills: [
            { name: 'Python', level: 95 },
            { name: 'SQL', level: 90 },
            { name: 'R', level: 85 },
            { name: 'Java', level: 82 },
            { name: 'C++', level: 80 }
        ]
    },
    {
        category: 'MACHINE LEARNING & AI',
        skills: [
            { name: 'PyTorch', level: 92 },
            { name: 'TensorFlow', level: 88 },
            { name: 'Scikit-learn', level: 94 },
            { name: 'LLMs (LLaMA 2)', level: 85 },
            { name: 'Deep Learning', level: 90 }
        ]
    },
    {
        category: 'DATA SCIENCE & ANALYTICS',
        skills: [
            { name: 'Pandas/NumPy', level: 96 },
            { name: 'Feature Engineering', level: 88 },
            { name: 'NLP', level: 85 },
            { name: 'Graph Neural Networks', level: 82 },
            { name: 'Reinforcement Learning', level: 78 }
        ]
    },
    {
        category: 'CLOUD & BIG DATA',
        skills: [
            { name: 'AWS (S3, EC2, SageMaker)', level: 88 },
            { name: 'Azure (ML, Analytics)', level: 85 },
            { name: 'Docker/Kubernetes', level: 82 },
            { name: 'Apache Spark', level: 80 },
            { name: 'Kafka', level: 75 }
        ]
    },
    {
        category: 'DATABASES & TOOLS',
        skills: [
            { name: 'PostgreSQL/MySQL', level: 85 },
            { name: 'Neo4j (Graph DB)', level: 80 },
            { name: 'Vector DBs (Pinecone)', level: 78 },
            { name: 'Snowflake', level: 75 },
            { name: 'Tableau/Power BI', level: 88 }
        ]
    },
    {
        category: 'SPECIALIZED TECHNOLOGIES',
        skills: [
            { name: 'Knowledge Graphs', level: 82 },
            { name: 'Medical Ontologies', level: 75 },
            { name: 'MLOps/CI-CD', level: 80 },
            { name: 'SHAP/Explainable AI', level: 78 },
            { name: 'Streamlit/FastAPI', level: 85 }
        ]
    }
];

// ===== UTILITY FUNCTIONS =====
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit', 
        second: '2-digit'
    });
    const footerTimeString = now.toLocaleTimeString('en-US', { 
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
    });
    
    document.getElementById('clock').textContent = timeString;
    const footerClock = document.getElementById('footer-clock');
    if (footerClock) {
        footerClock.textContent = footerTimeString;
    }
}

// Function to reset animations (useful for testing)
function resetAnimations() {
    completedAnimations.clear();
    // Clear about text content
    const aboutTextElement = document.getElementById('about-text-content');
    if (aboutTextElement) {
        aboutTextElement.innerHTML = '';
    }
    // Clear skills log
    const skillsLog = document.getElementById('skills-log');
    if (skillsLog) {
        skillsLog.innerHTML = '';
    }
}

function updateChannelDisplay(channelId) {
    document.getElementById('current-channel').textContent = channelMap[channelId] || '01';
}

function addStaticTransition() {
    const screenContainer = document.querySelector('.screen-container');
    screenContainer.classList.add('static-transition');
    
    setTimeout(() => {
        screenContainer.classList.remove('static-transition');
    }, 800);
}

// ===== TYPEWRITER EFFECT =====
async function typeWriter(element, text, speed = 10) {
    element.innerHTML = '';
    let i = 0;
    
    while (i < text.length) {
        if (text[i] === '\n') {
            element.innerHTML += '<br>';
        } else {
            element.innerHTML += text[i];
        }
        i++;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

// ===== MATRIX REVEAL EFFECT =====
async function matrixReveal(element, text) {
    element.innerHTML = '';
    
    // Split text into lines
    const lines = text.split('\n');
    
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        
        // Create a line container
        const lineDiv = document.createElement('div');
        lineDiv.className = 'matrix-line';
        lineDiv.style.opacity = '0';
        lineDiv.style.transform = 'translateY(20px)';
        lineDiv.style.transition = 'all 0.8s ease-out';
        
        // Add glitch effect characters first
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        let displayText = '';
        
        for (let i = 0; i < line.length; i++) {
            if (line[i] === ' ') {
                displayText += ' ';
            } else {
                displayText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
        }
        
        lineDiv.innerHTML = displayText;
        element.appendChild(lineDiv);
        
        // Animate line appearance
        await new Promise(resolve => setTimeout(resolve, 100));
        lineDiv.style.opacity = '1';
        lineDiv.style.transform = 'translateY(0)';
        
        // Glitch effect - change characters rapidly
        for (let glitchStep = 0; glitchStep < 3; glitchStep++) {
            await new Promise(resolve => setTimeout(resolve, 150));
            
            let glitchText = '';
            for (let i = 0; i < line.length; i++) {
                if (line[i] === ' ') {
                    glitchText += ' ';
                } else {
                    glitchText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }
            }
            lineDiv.innerHTML = glitchText;
        }
        
        // Reveal actual text
        await new Promise(resolve => setTimeout(resolve, 200));
        lineDiv.innerHTML = line;
        lineDiv.style.color = 'var(--accent-cyan-active)';
        lineDiv.style.textShadow = '0 0 8px var(--accent-cyan-active)';
        
        // Add a subtle glow effect
        lineDiv.style.animation = 'textGlow 0.5s ease-out';
        
        // Wait before next line
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

// ===== SKILLS DIAGNOSTICS =====
async function runDiagnostics() {
    const skillsLog = document.getElementById('skills-log');
    skillsLog.innerHTML = '';
    
    for (const category of skillsData) {
        // Add category header
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';
        categoryDiv.innerHTML = `<h3>${category.category}</h3>`;
        skillsLog.appendChild(categoryDiv);
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Add each skill in the category
        for (const skill of category.skills) {
            await addSkillLine(skill, skillsLog);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

async function addSkillLine(skill, container) {
    const skillLine = document.createElement('div');
    skillLine.className = 'skill-line';
    
    skillLine.innerHTML = `
        <div class="skill-name">${skill.name}</div>
        <div class="skill-bar">
            <div class="skill-fill" style="width: 0%"></div>
        </div>
        <div class="skill-percentage">0%</div>
    `;
    
    container.appendChild(skillLine);
    
    // Animate the skill bar
    await fillBar(skillLine, skill.level);
}

async function fillBar(skillLine, targetLevel) {
    const skillFill = skillLine.querySelector('.skill-fill');
    const skillPercentage = skillLine.querySelector('.skill-percentage');
    
    let currentLevel = 0;
    const increment = targetLevel / 20; // 20 steps for faster animation
    
    return new Promise(resolve => {
        const interval = setInterval(() => {
            currentLevel += increment;
            if (currentLevel >= targetLevel) {
                currentLevel = targetLevel;
                clearInterval(interval);
                resolve();
            }
            
            skillFill.style.width = `${currentLevel}%`;
            skillPercentage.textContent = `${Math.round(currentLevel)}%`;
        }, 10);
    });
}

// ===== CHANNEL SWITCHING =====
async function changeChannel(channelId) {
    if (isAnimating || currentChannel === channelId) return;
    
    isAnimating = true;
    
    // Add static transition effect
    addStaticTransition();
    
    // Wait for transition to complete
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-channel="${channelId}"]`).classList.add('active');
    
    // Scroll to the target section
    const targetSection = document.getElementById(channelId);
    if (targetSection) {
        targetSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Update channel display
    updateChannelDisplay(channelId);
    currentChannel = channelId;
    
    // Trigger section-specific animations
    await triggerSectionAnimation(channelId);
    
    isAnimating = false;
}

async function triggerSectionAnimation(channelId) {
    // Check if animation has already been completed
    if (completedAnimations.has(channelId)) {
        return;
    }
    
    switch (channelId) {
        case 'about':
            await new Promise(resolve => setTimeout(resolve, 300));
            await matrixReveal(document.getElementById('about-text-content'), aboutText);
            completedAnimations.add('about');
            break;
            
        case 'skills':
            await new Promise(resolve => setTimeout(resolve, 300));
            await runDiagnostics();
            completedAnimations.add('skills');
            break;
            
        case 'hero':
            // Trigger power-on animation if coming from another section
            const heroTitle = document.querySelector('.hero-title');
            heroTitle.style.animation = 'none';
            heroTitle.offsetHeight; // Trigger reflow
            heroTitle.style.animation = 'powerOn 2s ease-out';
            completedAnimations.add('hero');
            break;
    }
}

// ===== CONTACT FORM HANDLING =====
function handleContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('transmission-status');
    const submitBtn = form.querySelector('.transmit-btn');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable form and show transmitting state
        submitBtn.textContent = '[ TRANSMITTING... ]';
        submitBtn.disabled = true;
        form.style.display = 'none';
        
        // Show status div
        statusDiv.style.display = 'block';
        statusDiv.innerHTML = '';
        
        // Simulate transmission delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message with typewriter effect
        const successMessage = '// TRANSMISSION_SUCCESSFUL. //\n// MESSAGE_RECEIVED. //\n// THANK_YOU_FOR_CONTACTING. //';
        await typeWriter(statusDiv, successMessage, 15);
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            submitBtn.textContent = '[ TRANSMIT MESSAGE ]';
            submitBtn.disabled = false;
            statusDiv.style.display = 'none';
        }, 3000);
    });
}

// ===== PROJECT CARD INTERACTIONS =====
function setupProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    // GitHub repository URLs mapping
    const projectUrls = {
        'multimodal-cib-detection': 'https://github.com/pranay0703/multimodal-cib-detection',
        'rare-disease-ai': 'https://github.com/pranay0703/rare-disease-ai',
        'air-quality-health-risk': 'https://github.com/pranay0703/air_quality_health_risk',
        'multilingual-nlp-platform': 'https://github.com/pranay0703/multilingual_nlp_platform',
        'neurosymbolic-storyteller': 'https://github.com/pranay0703/neurosymbolic_storyteller',
        'eco-challenge-hub': 'https://github.com/pranay0703/eco-challenge-hub'
    };
    
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const project = card.dataset.project;
            const projectUrl = projectUrls[project];
            
            if (projectUrl) {
                console.log(`Opening project: ${project} - ${projectUrl}`);
                window.open(projectUrl, '_blank');
            } else {
                console.log(`No URL found for project: ${project}`);
            }
        });
        
        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

// ===== KEYBOARD NAVIGATION =====
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (isAnimating) return;
        
        const channels = ['hero', 'about', 'projects', 'skills', 'contact'];
        const currentIndex = channels.indexOf(currentChannel);
        
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : channels.length - 1;
                changeChannel(channels[prevIndex]);
                break;
                
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = currentIndex < channels.length - 1 ? currentIndex + 1 : 0;
                changeChannel(channels[nextIndex]);
                break;
                
            case '1':
                changeChannel('hero');
                break;
            case '2':
                changeChannel('about');
                break;
            case '3':
                changeChannel('projects');
                break;
            case '4':
                changeChannel('skills');
                break;
            case '5':
                changeChannel('contact');
                break;
        }
    });
}

// ===== SCROLL DETECTION =====
function setupScrollDetection() {
    const sections = document.querySelectorAll('.content-section');
    const navButtons = document.querySelectorAll('.nav-btn');
    const fixedNav = document.querySelector('.fixed-nav');
    let lastTriggeredSection = '';
    
    function updateActiveSection() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        if (current && current !== currentChannel) {
            currentChannel = current;
            updateChannelDisplay(current);
            
            // Update navigation buttons
            navButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.channel === current) {
                    btn.classList.add('active');
                }
            });
        }
        
        // Trigger section animations when scrolling to them
        if (current && current !== lastTriggeredSection) {
            lastTriggeredSection = current;
            console.log(`Scrolling to section: ${current}`);
            triggerSectionAnimation(current);
        }
        
        // Handle transparent effect on scroll
        if (window.scrollY > 50) {
            fixedNav.classList.add('scrolled');
        } else {
            fixedNav.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateActiveSection);
}

// ===== INITIALIZATION =====
function initializeApp() {
    // Set up clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Set up navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const channel = btn.dataset.channel;
            changeChannel(channel);
        });
    });
    
    // Set up contact form
    handleContactForm();
    
    // Set up project cards
    setupProjectCards();
    
    // Set up keyboard navigation
    setupKeyboardNavigation();
    
    // Set up scroll detection
    setupScrollDetection();
    
    // Trigger initial hero animation
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.animation = 'powerOn 2s ease-out';
        }
    }, 500);
    
    // Add some random glitch effects to the hero title
    setInterval(() => {
        if (currentChannel === 'hero') {
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle && Math.random() < 0.1) { // 10% chance every interval
                heroTitle.style.animation = 'none';
                heroTitle.offsetHeight; // Trigger reflow
                heroTitle.style.animation = 'glitch 0.5s ease-in-out';
            }
        }
    }, 3000);
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function optimizePerformance() {
    // Throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Handle scroll if needed
        }, 16); // ~60fps
    });
    
    // Use requestAnimationFrame for smooth animations
    function smoothAnimation(callback) {
        requestAnimationFrame(callback);
    }
    
    // Preload critical resources
    const criticalImages = [
        // Add any critical image URLs here
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// ===== ERROR HANDLING =====
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Portfolio Error:', e.error);
        // Gracefully handle errors without breaking the user experience
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
        e.preventDefault();
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function setupAccessibility() {
    // Add focus indicators for keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add ARIA labels and roles
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section, index) => {
        section.setAttribute('role', 'tabpanel');
        section.setAttribute('aria-labelledby', `nav-${section.id}`);
    });
    
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-controls', btn.dataset.channel);
    });
}

// ===== GSAP DATA STREAM FUNCTIONS =====
function createDataStream() {
    const dataStream = document.querySelector('.data-stream');
    if (!dataStream) return;
    
    // Clear existing content
    dataStream.innerHTML = '';
    
    // Create two rows
    for (let row = 0; row < 2; row++) {
        const streamLine = document.createElement('div');
        streamLine.className = 'stream-line';
        streamLine.style.position = 'absolute';
        streamLine.style.top = `${row * 12}px`;
        streamLine.style.left = '100%';
        streamLine.style.display = 'flex';
        streamLine.style.gap = '6px';
        
        // Generate random bits for this row
        const bits = Array.from({length: 20}, () => Math.random() > 0.5 ? '1' : '0');
        bits.forEach((bit, index) => {
            const bitElement = document.createElement('div');
            bitElement.className = 'data-bit';
            bitElement.textContent = bit;
            bitElement.style.fontFamily = 'VT323, monospace';
            bitElement.style.fontSize = '0.7rem';
            bitElement.style.color = 'var(--accent-cyan-active)';
            bitElement.style.textShadow = '0 0 6px var(--accent-cyan-active)';
            bitElement.style.minWidth = '10px';
            bitElement.style.textAlign = 'center';
            bitElement.style.display = 'inline-block';
            streamLine.appendChild(bitElement);
        });
        
        dataStream.appendChild(streamLine);
        
        // Animate the stream line with GSAP
        gsap.set(streamLine, { x: 0 });
        gsap.to(streamLine, {
            x: '-200%',
            duration: 3,
            ease: 'none',
            repeat: -1,
            delay: row * 0.5
        });
    }
}

function animateDataBits() {
    const bitElements = document.querySelectorAll('.data-bit');
    
    bitElements.forEach((bit, index) => {
        // Random flicker animation
        gsap.to(bit, {
            opacity: Math.random() * 0.5 + 0.5,
            scale: Math.random() * 0.3 + 0.9,
            duration: Math.random() * 0.5 + 0.2,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
            delay: Math.random() * 2
        });
        
        // Randomly change bit values
        gsap.to({}, {
            duration: Math.random() * 2 + 1,
            onComplete: () => {
                if (Math.random() < 0.3) {
                    bit.textContent = Math.random() > 0.5 ? '1' : '0';
                    gsap.fromTo(bit, 
                        { scale: 1.5, opacity: 0.8 },
                        { scale: 1, opacity: 1, duration: 0.2 }
                    );
                }
            },
            repeat: -1
        });
    });
}

function addDataStreamInteractions() {
    const dataStream = document.querySelector('.data-stream');
    if (!dataStream) return;
    
    // Mouse hover effect
    dataStream.addEventListener('mouseenter', () => {
        gsap.to(dataStream, {
            filter: 'brightness(1.3)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    dataStream.addEventListener('mouseleave', () => {
        gsap.to(dataStream, {
            filter: 'brightness(1)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    // Click to regenerate
    dataStream.addEventListener('click', () => {
        gsap.to(dataStream, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                createDataStream();
                animateDataBits();
            }
        });
    });
}

function startDataStream() {
    createDataStream();
    animateDataBits();
    addDataStreamInteractions();
}

function stopDataStream() {
    gsap.killTweensOf('.data-bit');
    gsap.killTweensOf('.stream-line');
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    optimizePerformance();
    setupErrorHandling();
    setupAccessibility();
    
    // Start data stream
    startDataStream();
    
    console.log('🎮 CRT Portfolio Terminal Initialized');
    console.log('📡 Use arrow keys or number keys (1-5) to navigate');
    console.log('🎯 Click navigation buttons or use keyboard shortcuts');
});

// ===== EXPORT FOR TESTING (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        changeChannel,
        typeWriter,
        runDiagnostics,
        fillBar
    };
}
