/* ========================================
   PORTFOLIO — Main JavaScript
   Bhagyesh Shah
   ======================================== */

(function () {
    'use strict';

    /* ========================================
       PRELOADER
       ======================================== */
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = 'auto';
            initHeroAnimations();
            animateStats();
        }, 800);
    });

    // Prevent scroll while loading
    document.body.style.overflow = 'hidden';

    /* ========================================
       THEME TOGGLE
       ======================================== */
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        updateGithubStatsTheme('light');
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
            updateGithubStatsTheme('dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
            updateGithubStatsTheme('light');
        }
    });

    function updateGithubStatsTheme(theme) {
        const statsImages = document.querySelectorAll('.stats-cards img');
        statsImages.forEach(img => {
            let src = img.src;
            if (theme === 'light') {
                src = src.replace('title_color=6c63ff', 'title_color=3b82f6');
                src = src.replace('text_color=a0a0b8', 'text_color=495057');
            } else {
                src = src.replace('title_color=3b82f6', 'title_color=6c63ff');
                src = src.replace('text_color=495057', 'text_color=a0a0b8');
            }
            img.src = src;
        });
    }

    /* ========================================
       SCROLL PROGRESS BAR
       ======================================== */
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }

    /* ========================================
       NAVBAR
       ======================================== */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');

    // Sticky navbar
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveSection() {
        const scrollY = window.scrollY + 150;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);

            if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinkItems.forEach(l => l.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }

    // Back to top button
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ========================================
       PAGE TRANSITIONS
       ======================================== */
    const pageTransition = document.getElementById('pageTransition');

    function triggerPageTransition(callback) {
        pageTransition.classList.add('active');
        
        setTimeout(() => {
            if (callback) callback();
            
            setTimeout(() => {
                pageTransition.classList.remove('active');
                pageTransition.classList.add('exit');
                
                setTimeout(() => {
                    pageTransition.classList.remove('exit');
                }, 600);
            }, 300);
        }, 600);
    }

    // Update smooth scroll to include transitions
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // If it's a mobile link, close the menu first
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');

                triggerPageTransition(() => {
                    target.scrollIntoView({ behavior: 'auto', block: 'start' });
                    // Update active state manually since 'auto' scroll won't trigger observer immediately
                    navLinkItems.forEach(l => l.classList.remove('active'));
                    const navLink = document.querySelector(`.nav-link[data-section="${targetId.substring(1)}"]`);
                    if (navLink) navLink.classList.add('active');
                });
            }
        });
    });

    /* ========================================
       NAVBAR & SCROLL
       ======================================== */
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                handleNavbarScroll();
                highlightActiveSection();
                updateScrollProgress();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    /* ========================================
       TYPING ANIMATION
       ======================================== */
    const typedTextEl = document.getElementById('typedText');
    const roles = [
        'AI Developer',
        'Full-Stack Web Developer',
        'Machine Learning Engineer',
        'Problem Solver',
        'Python Enthusiast'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    /* ========================================
       HERO ANIMATIONS
       ======================================== */
    function initHeroAnimations() {
        // Stagger hero elements
        const heroElements = document.querySelectorAll('.hero .animate-in');
        heroElements.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, i * 120);
        });

        // Start typing after hero is visible
        setTimeout(typeEffect, 800);
    }

    /* ========================================
       STAT COUNTER ANIMATION
       ======================================== */
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.dataset.count);
            const isFloat = target % 1 !== 0;
            let current = 0;
            const increment = target / 60;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
            }, 25);
        });
    }

    /* ========================================
       INTERSECTION OBSERVER — Scroll Animations
       ======================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .section-title');
    animatableElements.forEach(el => observer.observe(el));

    /* ========================================
       PROJECT FILTERING
       ======================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* ========================================
       PROJECT CARD TILT EFFECT
       ======================================== */
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    /* ========================================
       CONTACT FORM
       ======================================== */
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        // Formspree handling
        const formData = new FormData(contactForm);
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                contactForm.reset();
            } else {
                throw new Error('Oops! There was a problem submitting your form');
            }
        } catch (error) {
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error!';
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        } finally {
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }
    });

    /* ========================================
       PARTICLE CANVAS BACKGROUND
       ======================================== */
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.color = Math.random() > 0.5 ? '108, 99, 255' : '168, 85, 247';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();
        animationId = requestAnimationFrame(animateParticles);
    }

    // Initialize canvas
    resizeCanvas();
    initParticles();
    animateParticles();

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resizeCanvas();
            initParticles();
        }, 200);
    });

    // Pause particles when not visible (performance)
    const heroSection = document.getElementById('hero');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animateParticles();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    }, { threshold: 0.1 });
    heroObserver.observe(heroSection);

    /* ========================================
       PARALLAX ON SCROLL
       ======================================== */
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 0.7;
        }
    });

    /* ========================================
       LAZY LOAD IMAGES
       ======================================== */

    /* ========================================
       LAZY LOAD IMAGES
       ======================================== */
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.add('loaded');
                    imgObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imgObserver.observe(img));
    }

    /* ========================================
       FADE-IN-UP KEYFRAME (used by filter)
       ======================================== */
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    /* ========================================
       IMAGE MODAL LOGIC
       ======================================== */
    const imageModal = document.getElementById('imageModal');
    const logoNavbar = document.getElementById('logoNavbar');
    const closeModal = document.getElementById('closeModal');
    const modalGlassOverlay = document.querySelector('.modal-glass-overlay');

    const openModalHandler = () => {
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeHandler = () => {
        imageModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (logoNavbar) logoNavbar.addEventListener('click', openModalHandler);
    if (closeModal) closeModal.addEventListener('click', closeHandler);
    if (modalGlassOverlay) modalGlassOverlay.addEventListener('click', closeHandler);

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    });

    /* ========================================
       PROJECT CASE STUDY MODAL
       ======================================== */
    const projectData = {
        voicesql: {
            title: "VoiceSQL",
            year: "2026",
            tech: ["Python", "Flask", "Groq AI (Llama 3.3-70b)", "FAISS", "sentence-transformers", "Web Speech API", "Chart.js"],
            challenge: "Enabling non-technical users to query structured data using natural language and voice, while ensuring SQL accuracy across diverse and unpredictable schemas.",
            solution: "Built a RAG pipeline using FAISS and sentence-transformers to embed schema context and few-shot examples, injecting them into Groq's Llama 3.3-70b for accurate SQL generation. Added a rule-based fallback, read-only query enforcement, auto-generated charts, and a Web Speech API voice interface. Deployed on Hugging Face Spaces via Docker.",
            link: "https://github.com/Bhagyesh312/VoiceSQL",
            demo: "https://huggingface.co/spaces/BhagyeshShah11/VoiceSQL"
        },
        chatroom: {
            title: "Real-time Chatroom",
            year: "2026",
            tech: ["Node.js", "Socket.io", "PostgreSQL", "Express", "bcrypt"],
            challenge: "Synchronizing real-time state across thousands of active users while ensuring zero message loss and high-speed data persistence.",
            solution: "Implemented WebSocket-based bi-directional communication using Socket.io. Used PostgreSQL with JSONB columns for flexible message storage, ensuring ACID compliance while maintaining real-time responsiveness.",
            link: "https://github.com/Bhagyesh312/Chatroom"
        },
        bookswap: {
            title: "BookSwap-HUB",
            year: "2026",
            tech: ["Flask", "PostgreSQL", "HTML5", "CSS3", "JS"],
            challenge: "Creating a trust-based localized marketplace where inventory management and user-matching need to be seamless and regional.",
            solution: "Developed a community-driven Flask architecture with a PostgreSQL back-end. Integrated geolocation-based search to connect nearby book enthusiasts and simplified the listing process to encourage high user engagement.",
            link: "https://github.com/Bhagyesh312/BookSwap-HUB"
        },
        mediscan: {
            title: "MediScan-AI",
            year: "2025",
            tech: ["Python", "Flask", "Scikit-learn", "Pandas", "NumPy"],
            challenge: "Achieving high accuracy in disease prediction across diverse symptom profiles while maintaining a user-friendly, non-technical interface.",
            solution: "Engineered a robust Random Forest Classifier model trained on extensive medical datasets. Built a lightweight Flask API to serve predictions in real-time and a clean UI to make medical insights accessible to non-experts.",
            link: "https://github.com/Bhagyesh312/MediScan-AI"
        },
        robot: {
            title: "Human Following Car Robot",
            year: "2025",
            tech: ["Arduino", "Ultrasonic Sensor", "IR Sensors", "Motor Driver"],
            challenge: "Implementing precise distance tracking and obstacle avoidance using limited hardware processing power.",
            solution: "Programmed a real-time PID-like feedback loop in Arduino. Used an array of Ultrasonic and IR sensors to create a high-fidelity spatial map for stable human following behavior and proactive collision prevention.",
            link: "https://github.com/Bhagyesh312"
        }
    };

    const projectModal = document.getElementById('projectModal');
    const closeProjectModal = document.getElementById('closeProjectModal');

    document.querySelectorAll('.trigger-project-modal').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Stop propagation to prevent nested clicks
            e.stopPropagation();
            
            // Find the parent project card to get the ID
            const card = trigger.closest('.project-card');
            const projectId = card.getAttribute('data-project-id');
            const data = projectData[projectId];

            if (data) {
                document.getElementById('modalProjectTitle').textContent = data.title;
                document.getElementById('modalProjectYear').textContent = data.year;
                document.getElementById('modalProjectChallenge').textContent = data.challenge;
                document.getElementById('modalProjectSolution').textContent = data.solution;
                document.getElementById('modalProjectLink').href = data.link;

                const techContainer = document.getElementById('modalProjectTech');
                techContainer.innerHTML = '';
                data.tech.forEach(t => {
                    const span = document.createElement('span');
                    span.textContent = t;
                    techContainer.appendChild(span);
                });

                projectModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (closeProjectModal) {
        closeProjectModal.addEventListener('click', () => {
            projectModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    /* ========================================
       RESUME PREVIEW MODAL
       ======================================== */
    const resumeModal = document.getElementById('resumeModal');
    const resumePreviewBtn = document.getElementById('resumePreviewBtn');
    const closeResumeModal = document.getElementById('closeResumeModal');

    if (resumePreviewBtn) {
        resumePreviewBtn.addEventListener('click', () => {
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeResumeModal) {
        closeResumeModal.addEventListener('click', () => {
            resumeModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Modal background clicks and other globals
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-glass-overlay')) {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = 'auto';
        }
    });

    /* ========================================
       AOS INITIALIZATION
       ======================================== */
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 120,
            delay: 100
        });
    }

})();
