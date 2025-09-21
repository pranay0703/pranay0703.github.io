// ===== GLOBAL VARIABLES =====
let currentChannel = 'hero';
let isAnimating = false;
let completedAnimations = new Set(); // Track completed animations

// ===== DATA STREAM VARIABLES =====
let dataStreamInterval;
let bitElements = [];

// ===== GAME VARIABLES =====
let gameScore = 0;
let gameRunning = false;
let gameSpeed = 3;
let isJumping = false;
let gameInterval;
let obstacleInterval;

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
            { name: 'Python', level: 95, icon: '🐍' },
            { name: 'SQL', level: 90, icon: '🗄️' },
            { name: 'R', level: 85, icon: '📊' },
            { name: 'Java', level: 82, icon: '☕' },
            { name: 'C++', level: 80, icon: '⚡' }
        ]
    },
    {
        category: 'MACHINE LEARNING & AI',
        skills: [
            { name: 'PyTorch', level: 92, icon: '🔥' },
            { name: 'TensorFlow', level: 88, icon: '🧠' },
            { name: 'Scikit-learn', level: 94, icon: '🔬' },
            { name: 'LLMs (LLaMA 2)', level: 85, icon: '🤖' },
            { name: 'Deep Learning', level: 90, icon: '⚡' }
        ]
    },
    {
        category: 'DATA SCIENCE & ANALYTICS',
        skills: [
            { name: 'Pandas/NumPy', level: 96, icon: '🐼' },
            { name: 'Feature Engineering', level: 88, icon: '🔧' },
            { name: 'NLP', level: 85, icon: '💬' },
            { name: 'Graph Neural Networks', level: 82, icon: '🕸️' },
            { name: 'Reinforcement Learning', level: 78, icon: '🎮' }
        ]
    },
    {
        category: 'CLOUD & BIG DATA',
        skills: [
            { name: 'AWS (S3, EC2, SageMaker)', level: 88, icon: '☁️' },
            { name: 'Azure (ML, Analytics)', level: 85, icon: '🔵' },
            { name: 'Docker/Kubernetes', level: 82, icon: '🐳' },
            { name: 'Apache Spark', level: 80, icon: '⚡' },
            { name: 'Kafka', level: 75, icon: '📡' }
        ]
    },
    {
        category: 'DATABASES & TOOLS',
        skills: [
            { name: 'PostgreSQL/MySQL', level: 85, icon: '🐘' },
            { name: 'Neo4j (Graph DB)', level: 80, icon: '🕸️' },
            { name: 'Vector DBs (Pinecone)', level: 78, icon: '📐' },
            { name: 'Snowflake', level: 75, icon: '❄️' },
            { name: 'Tableau/Power BI', level: 88, icon: '📈' }
        ]
    },
    {
        category: 'SPECIALIZED TECHNOLOGIES',
        skills: [
            { name: 'Knowledge Graphs', level: 82, icon: '🧠' },
            { name: 'Medical Ontologies', level: 75, icon: '🏥' },
            { name: 'MLOps/CI-CD', level: 80, icon: '🔄' },
            { name: 'SHAP/Explainable AI', level: 78, icon: '🔍' },
            { name: 'Streamlit/FastAPI', level: 85, icon: '🚀' }
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

// ===== RETRO RUNNING GAME =====
function initializeGame() {
    const gameScreen = document.getElementById('game-screen');
    const character = document.getElementById('game-character');
    const obstacle = document.getElementById('game-obstacle');
    
    if (!gameScreen || !character || !obstacle) return;
    
    // Reset game state
    gameScore = 0;
    gameRunning = false;
    isJumping = false;
    gameSpeed = 3;
    
    // Clear any existing game over overlay
    const gameOver = gameScreen.querySelector('.game-over');
    if (gameOver) {
        gameOver.remove();
    }
    
    // Reset character position
    character.classList.remove('jumping');
    character.style.transform = 'translateY(0)';
    
    // Reset obstacle position
    obstacle.style.right = '-50px';
    obstacle.style.animation = 'none';
    
    // Update score display
    updateScore();
    
    // Start the game
    startGame();
}

function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    const obstacle = document.getElementById('game-obstacle');
    
    // Start obstacle movement
    obstacle.style.animation = `moveObstacle ${gameSpeed}s linear infinite`;
    
    // Start scoring
    gameInterval = setInterval(() => {
        if (gameRunning) {
            gameScore += 10;
            updateScore();
            
            // Increase speed over time
            if (gameScore % 500 === 0 && gameSpeed > 1.5) {
                gameSpeed -= 0.2;
                obstacle.style.animation = `moveObstacle ${gameSpeed}s linear infinite`;
            }
        }
    }, 100);
    
    // Check for collisions
    obstacleInterval = setInterval(checkCollision, 50);
}

function jump() {
    if (!gameRunning || isJumping) return;
    
    const character = document.getElementById('game-character');
    isJumping = true;
    character.classList.add('jumping');
    
    setTimeout(() => {
        character.classList.remove('jumping');
        isJumping = false;
    }, 600);
}

function checkCollision() {
    if (!gameRunning) return;
    
    const character = document.getElementById('game-character');
    const obstacle = document.getElementById('game-obstacle');
    
    if (!character || !obstacle) return;
    
    const characterRect = character.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    const gameScreenRect = document.getElementById('game-screen').getBoundingClientRect();
    
    // Adjust positions relative to game screen
    const charLeft = characterRect.left - gameScreenRect.left;
    const charRight = characterRect.right - gameScreenRect.left;
    const charTop = characterRect.top - gameScreenRect.top;
    const charBottom = characterRect.bottom - gameScreenRect.top;
    
    const obsLeft = obstacleRect.left - gameScreenRect.left;
    const obsRight = obstacleRect.right - gameScreenRect.left;
    const obsTop = obstacleRect.top - gameScreenRect.top;
    const obsBottom = obstacleRect.bottom - gameScreenRect.top;
    
    // Check if character and obstacle overlap
    if (charRight > obsLeft && charLeft < obsRight && charBottom > obsTop && charTop < obsBottom) {
        gameOver();
    }
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    
    const gameScreen = document.getElementById('game-screen');
    const gameOverDiv = document.createElement('div');
    gameOverDiv.className = 'game-over';
    gameOverDiv.innerHTML = `
        <h3>GAME OVER</h3>
        <p>FINAL SCORE: ${gameScore}</p>
        <button class="restart-btn" onclick="initializeGame()">RESTART</button>
    `;
    
    gameScreen.appendChild(gameOverDiv);
}

function updateScore() {
    const scoreElement = document.getElementById('game-score');
    if (scoreElement) {
        scoreElement.textContent = gameScore;
    }
}

function setupGameControls() {
    // Space bar to jump
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && currentChannel === 'hero') {
            e.preventDefault();
            jump();
        }
    });
    
    // Click to jump (mobile support)
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen) {
        gameScreen.addEventListener('click', () => {
            if (currentChannel === 'hero') {
                jump();
            }
        });
    }
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
    
    // Add system startup message
    const startupMsg = document.createElement('div');
    startupMsg.className = 'system-startup';
    startupMsg.innerHTML = `
        <div class="startup-line">> INITIALIZING SKILL DIAGNOSTICS...</div>
        <div class="startup-line">> SCANNING TECHNICAL CAPABILITIES...</div>
        <div class="startup-line">> LOADING EXPERTISE MATRIX...</div>
        <div class="startup-line">> READY FOR ANALYSIS</div>
        <div class="startup-line">========================================</div>
    `;
    skillsLog.appendChild(startupMsg);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (const category of skillsData) {
        // Add category header with terminal styling
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';
        categoryDiv.innerHTML = `
            <div class="category-header">
                <span class="category-icon">[${getCategoryIcon(category.category)}]</span>
                <span class="category-name">${category.category}</span>
                <span class="category-status">ACTIVE</span>
            </div>
        `;
        skillsLog.appendChild(categoryDiv);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Add skills grid for this category
        const skillsGrid = document.createElement('div');
        skillsGrid.className = 'skills-grid';
        
        for (const skill of category.skills) {
            await addSkillCard(skill, skillsGrid);
            await new Promise(resolve => setTimeout(resolve, 150));
        }
        
        skillsLog.appendChild(skillsGrid);
        await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    // Add completion message
    const completionMsg = document.createElement('div');
    completionMsg.className = 'system-completion';
    completionMsg.innerHTML = `
        <div class="completion-line">========================================</div>
        <div class="completion-line">> DIAGNOSTIC COMPLETE</div>
        <div class="completion-line">> ALL SYSTEMS OPERATIONAL</div>
        <div class="completion-line">> READY FOR DEPLOYMENT</div>
    `;
    skillsLog.appendChild(completionMsg);
}

function getCategoryIcon(category) {
    const icons = {
        'PROGRAMMING LANGUAGES': '💻',
        'MACHINE LEARNING & AI': '🤖',
        'DATA SCIENCE & ANALYTICS': '📊',
        'CLOUD & BIG DATA': '☁️',
        'DATABASES & TOOLS': '🗄️',
        'SPECIALIZED TECHNOLOGIES': '⚡'
    };
    return icons[category] || '🔧';
}

async function addSkillCard(skill, container) {
    const skillCard = document.createElement('div');
    skillCard.className = 'skill-card';
    
    // Create skill level visualization
    const levelBars = createLevelVisualization(skill.level);
    
    skillCard.innerHTML = `
        <div class="skill-header">
            <span class="skill-icon">${skill.icon}</span>
            <span class="skill-name">${skill.name}</span>
        </div>
        <div class="skill-level">
            <div class="level-bars">${levelBars}</div>
            <div class="level-text">${getLevelText(skill.level)}</div>
        </div>
        <div class="skill-percentage">${skill.level}%</div>
    `;
    
    container.appendChild(skillCard);
    
    // Animate the skill card appearance
    await animateSkillCard(skillCard);
}

function createLevelVisualization(level) {
    const totalBars = 10;
    const filledBars = Math.round((level / 100) * totalBars);
    let bars = '';
    
    for (let i = 0; i < totalBars; i++) {
        if (i < filledBars) {
            bars += '<span class="level-bar filled">█</span>';
        } else {
            bars += '<span class="level-bar empty">░</span>';
        }
    }
    
    return bars;
}

function getLevelText(level) {
    if (level >= 90) return 'EXPERT';
    if (level >= 80) return 'ADVANCED';
    if (level >= 70) return 'INTERMEDIATE';
    if (level >= 60) return 'BEGINNER';
    return 'LEARNING';
}

async function animateSkillCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px) scale(0.9)';
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    card.style.transition = 'all 0.5s ease-out';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0) scale(1)';
    
    // Animate level bars
    const levelBars = card.querySelectorAll('.level-bar.filled');
    for (let i = 0; i < levelBars.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        levelBars[i].style.animation = 'barFill 0.3s ease-out';
    }
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
    
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const project = card.dataset.project;
            console.log(`Clicked on project: ${project}`);
            // Add your project click handling here
            // For example: window.open(projectUrl, '_blank');
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
    
    // Set up game controls
    setupGameControls();
    
    // Initialize the game
    setTimeout(() => {
        initializeGame();
    }, 1000);
    
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
// ===== GLOBAL VARIABLES =====
let currentChannel = 'hero';
let isAnimating = false;
let completedAnimations = new Set(); // Track completed animations

// ===== DATA STREAM VARIABLES =====
let dataStreamInterval;
let bitElements = [];

// ===== GAME VARIABLES =====
let gameScore = 0;
let gameRunning = false;
let gameSpeed = 3;
let isJumping = false;
let gameInterval;
let obstacleInterval;

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
            { name: 'Python', level: 95, icon: '🐍' },
            { name: 'SQL', level: 90, icon: '🗄️' },
            { name: 'R', level: 85, icon: '📊' },
            { name: 'Java', level: 82, icon: '☕' },
            { name: 'C++', level: 80, icon: '⚡' }
        ]
    },
    {
        category: 'MACHINE LEARNING & AI',
        skills: [
            { name: 'PyTorch', level: 92, icon: '🔥' },
            { name: 'TensorFlow', level: 88, icon: '🧠' },
            { name: 'Scikit-learn', level: 94, icon: '🔬' },
            { name: 'LLMs (LLaMA 2)', level: 85, icon: '🤖' },
            { name: 'Deep Learning', level: 90, icon: '⚡' }
        ]
    },
    {
        category: 'DATA SCIENCE & ANALYTICS',
        skills: [
            { name: 'Pandas/NumPy', level: 96, icon: '🐼' },
            { name: 'Feature Engineering', level: 88, icon: '🔧' },
            { name: 'NLP', level: 85, icon: '💬' },
            { name: 'Graph Neural Networks', level: 82, icon: '🕸️' },
            { name: 'Reinforcement Learning', level: 78, icon: '🎮' }
        ]
    },
    {
        category: 'CLOUD & BIG DATA',
        skills: [
            { name: 'AWS (S3, EC2, SageMaker)', level: 88, icon: '☁️' },
            { name: 'Azure (ML, Analytics)', level: 85, icon: '🔵' },
            { name: 'Docker/Kubernetes', level: 82, icon: '🐳' },
            { name: 'Apache Spark', level: 80, icon: '⚡' },
            { name: 'Kafka', level: 75, icon: '📡' }
        ]
    },
    {
        category: 'DATABASES & TOOLS',
        skills: [
            { name: 'PostgreSQL/MySQL', level: 85, icon: '🐘' },
            { name: 'Neo4j (Graph DB)', level: 80, icon: '🕸️' },
            { name: 'Vector DBs (Pinecone)', level: 78, icon: '📐' },
            { name: 'Snowflake', level: 75, icon: '❄️' },
            { name: 'Tableau/Power BI', level: 88, icon: '📈' }
        ]
    },
    {
        category: 'SPECIALIZED TECHNOLOGIES',
        skills: [
            { name: 'Knowledge Graphs', level: 82, icon: '🧠' },
            { name: 'Medical Ontologies', level: 75, icon: '🏥' },
            { name: 'MLOps/CI-CD', level: 80, icon: '🔄' },
            { name: 'SHAP/Explainable AI', level: 78, icon: '🔍' },
            { name: 'Streamlit/FastAPI', level: 85, icon: '🚀' }
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

// ===== RETRO RUNNING GAME =====
function initializeGame() {
    const gameScreen = document.getElementById('game-screen');
    const character = document.getElementById('game-character');
    const obstacle = document.getElementById('game-obstacle');
    
    if (!gameScreen || !character || !obstacle) return;
    
    // Reset game state
    gameScore = 0;
    gameRunning = false;
    isJumping = false;
    gameSpeed = 3;
    
    // Clear any existing game over overlay
    const gameOver = gameScreen.querySelector('.game-over');
    if (gameOver) {
        gameOver.remove();
    }
    
    // Reset character position
    character.classList.remove('jumping');
    character.style.transform = 'translateY(0)';
    
    // Reset obstacle position
    obstacle.style.right = '-50px';
    obstacle.style.animation = 'none';
    
    // Update score display
    updateScore();
    
    // Start the game
    startGame();
}

function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    const obstacle = document.getElementById('game-obstacle');
    
    // Start obstacle movement
    obstacle.style.animation = `moveObstacle ${gameSpeed}s linear infinite`;
    
    // Start scoring
    gameInterval = setInterval(() => {
        if (gameRunning) {
            gameScore += 10;
            updateScore();
            
            // Increase speed over time
            if (gameScore % 500 === 0 && gameSpeed > 1.5) {
                gameSpeed -= 0.2;
                obstacle.style.animation = `moveObstacle ${gameSpeed}s linear infinite`;
            }
        }
    }, 100);
    
    // Check for collisions
    obstacleInterval = setInterval(checkCollision, 50);
}

function jump() {
    if (!gameRunning || isJumping) return;
    
    const character = document.getElementById('game-character');
    isJumping = true;
    character.classList.add('jumping');
    
    setTimeout(() => {
        character.classList.remove('jumping');
        isJumping = false;
    }, 600);
}

function checkCollision() {
    if (!gameRunning) return;
    
    const character = document.getElementById('game-character');
    const obstacle = document.getElementById('game-obstacle');
    
    if (!character || !obstacle) return;
    
    const characterRect = character.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    const gameScreenRect = document.getElementById('game-screen').getBoundingClientRect();
    
    // Adjust positions relative to game screen
    const charLeft = characterRect.left - gameScreenRect.left;
    const charRight = characterRect.right - gameScreenRect.left;
    const charTop = characterRect.top - gameScreenRect.top;
    const charBottom = characterRect.bottom - gameScreenRect.top;
    
    const obsLeft = obstacleRect.left - gameScreenRect.left;
    const obsRight = obstacleRect.right - gameScreenRect.left;
    const obsTop = obstacleRect.top - gameScreenRect.top;
    const obsBottom = obstacleRect.bottom - gameScreenRect.top;
    
    // Check if character and obstacle overlap
    if (charRight > obsLeft && charLeft < obsRight && charBottom > obsTop && charTop < obsBottom) {
        gameOver();
    }
}

function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    
    const gameScreen = document.getElementById('game-screen');
    const gameOverDiv = document.createElement('div');
    gameOverDiv.className = 'game-over';
    gameOverDiv.innerHTML = `
        <h3>GAME OVER</h3>
        <p>FINAL SCORE: ${gameScore}</p>
        <button class="restart-btn" onclick="initializeGame()">RESTART</button>
    `;
    
    gameScreen.appendChild(gameOverDiv);
}

function updateScore() {
    const scoreElement = document.getElementById('game-score');
    if (scoreElement) {
        scoreElement.textContent = gameScore;
    }
}

function setupGameControls() {
    // Space bar to jump
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && currentChannel === 'hero') {
            e.preventDefault();
            jump();
        }
    });
    
    // Click to jump (mobile support)
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen) {
        gameScreen.addEventListener('click', () => {
            if (currentChannel === 'hero') {
                jump();
            }
        });
    }
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
    
    // Add system startup message
    const startupMsg = document.createElement('div');
    startupMsg.className = 'system-startup';
    startupMsg.innerHTML = `
        <div class="startup-line">> INITIALIZING SKILL DIAGNOSTICS...</div>
        <div class="startup-line">> SCANNING TECHNICAL CAPABILITIES...</div>
        <div class="startup-line">> LOADING EXPERTISE MATRIX...</div>
        <div class="startup-line">> READY FOR ANALYSIS</div>
        <div class="startup-line">========================================</div>
    `;
    skillsLog.appendChild(startupMsg);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (const category of skillsData) {
        // Add category header with terminal styling
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';
        categoryDiv.innerHTML = `
            <div class="category-header">
                <span class="category-icon">[${getCategoryIcon(category.category)}]</span>
                <span class="category-name">${category.category}</span>
                <span class="category-status">ACTIVE</span>
            </div>
        `;
        skillsLog.appendChild(categoryDiv);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Add skills grid for this category
        const skillsGrid = document.createElement('div');
        skillsGrid.className = 'skills-grid';
        
        for (const skill of category.skills) {
            await addSkillCard(skill, skillsGrid);
            await new Promise(resolve => setTimeout(resolve, 150));
        }
        
        skillsLog.appendChild(skillsGrid);
        await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    // Add completion message
    const completionMsg = document.createElement('div');
    completionMsg.className = 'system-completion';
    completionMsg.innerHTML = `
        <div class="completion-line">========================================</div>
        <div class="completion-line">> DIAGNOSTIC COMPLETE</div>
        <div class="completion-line">> ALL SYSTEMS OPERATIONAL</div>
        <div class="completion-line">> READY FOR DEPLOYMENT</div>
    `;
    skillsLog.appendChild(completionMsg);
}

function getCategoryIcon(category) {
    const icons = {
        'PROGRAMMING LANGUAGES': '💻',
        'MACHINE LEARNING & AI': '🤖',
        'DATA SCIENCE & ANALYTICS': '📊',
        'CLOUD & BIG DATA': '☁️',
        'DATABASES & TOOLS': '🗄️',
        'SPECIALIZED TECHNOLOGIES': '⚡'
    };
    return icons[category] || '🔧';
}

async function addSkillCard(skill, container) {
    const skillCard = document.createElement('div');
    skillCard.className = 'skill-card';
    
    // Create skill level visualization
    const levelBars = createLevelVisualization(skill.level);
    
    skillCard.innerHTML = `
        <div class="skill-header">
            <span class="skill-icon">${skill.icon}</span>
            <span class="skill-name">${skill.name}</span>
        </div>
        <div class="skill-level">
            <div class="level-bars">${levelBars}</div>
            <div class="level-text">${getLevelText(skill.level)}</div>
        </div>
        <div class="skill-percentage">${skill.level}%</div>
    `;
    
    container.appendChild(skillCard);
    
    // Animate the skill card appearance
    await animateSkillCard(skillCard);
}

function createLevelVisualization(level) {
    const totalBars = 10;
    const filledBars = Math.round((level / 100) * totalBars);
    let bars = '';
    
    for (let i = 0; i < totalBars; i++) {
        if (i < filledBars) {
            bars += '<span class="level-bar filled">█</span>';
        } else {
            bars += '<span class="level-bar empty">░</span>';
        }
    }
    
    return bars;
}

function getLevelText(level) {
    if (level >= 90) return 'EXPERT';
    if (level >= 80) return 'ADVANCED';
    if (level >= 70) return 'INTERMEDIATE';
    if (level >= 60) return 'BEGINNER';
    return 'LEARNING';
}

async function animateSkillCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px) scale(0.9)';
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    card.style.transition = 'all 0.5s ease-out';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0) scale(1)';
    
    // Animate level bars
    const levelBars = card.querySelectorAll('.level-bar.filled');
    for (let i = 0; i < levelBars.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        levelBars[i].style.animation = 'barFill 0.3s ease-out';
    }
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
    
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const project = card.dataset.project;
            console.log(`Clicked on project: ${project}`);
            // Add your project click handling here
            // For example: window.open(projectUrl, '_blank');
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
    
    // Set up game controls
    setupGameControls();
    
    // Initialize the game
    setTimeout(() => {
        initializeGame();
    }, 1000);
    
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
