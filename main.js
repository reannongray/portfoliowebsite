// Particle System Class
class ParticleSystem {
    constructor() {
      this.particles = [];
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.numberOfParticles = 500;
      this.particleMaxSize = 2;
      this.maxVelocity = 0.2;
      this.colors = [
        'rgba(255, 255, 255, 0.9)',
        'rgba(0, 212, 255, 0.8)',
        'rgba(255, 97, 216, 0.8)',
        'rgba(129, 180, 255, 0.8)',
      ];
      this.mouseX = 0;
      this.mouseY = 0;
      this.isActive = false;
    }
  
    async init() {
      try {
        this.setupCanvas();
        this.addEventListeners();
        this.createParticles();
        this.isActive = true;
        this.animate();
        return true;
      } catch (error) {
        console.error('Failed to initialize particle system:', error);
        this.destroy();
        return false;
      }
    }
  
    setupCanvas() {
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.zIndex = '-1';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.className = 'particle-canvas';
      
      // Create a gradient background
      this.canvas.style.background = 'radial-gradient(circle at center, #240046 0%, #10002b 100%)';
      
      document.body.appendChild(this.canvas);
      this.handleResize();
    }
  
    addEventListeners() {
      window.addEventListener('resize', () => this.handleResize());
      window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
  
    createParticles() {
      for (let i = 0; i < this.numberOfParticles; i++) {
        const baseColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * this.particleMaxSize + 0.5,
          velocityX: (Math.random() - 0.5) * this.maxVelocity,
          velocityY: (Math.random() - 0.5) * this.maxVelocity,
          color: baseColor,
          glowColor: baseColor.replace(/([\d.]+)\)$/, '0.3)'),
          alpha: Math.random() * 0.5 + 0.5,
          pulse: Math.random() * Math.PI,
          glowSize: Math.random() * 1 + 1,
        });
      }
    }
  
    drawParticles() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      this.particles.forEach((particle) => {
        // Mouse interaction
        const dx = this.mouseX - particle.x;
        const dy = this.mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;
  
        if (distance < maxDistance) {
          const influence = (1 - distance / maxDistance) * 0.05;
          particle.velocityX -= dx * influence;
          particle.velocityY -= dy * influence;
        }
  
        // Update position
        particle.velocityX *= 0.99;
        particle.velocityY *= 0.99;
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
  
        // Screen wrapping
        if (particle.x < -50) particle.x = this.canvas.width + 50;
        if (particle.x > this.canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = this.canvas.height + 50;
        if (particle.y > this.canvas.height + 50) particle.y = -50;
  
        // Pulsing and glow effect
        particle.pulse += 0.02;
        const pulseFactor = Math.sin(particle.pulse) * 0.2 + 0.8;
        const size = particle.size * pulseFactor;
  
        // Draw glow
        const gradient = this.ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          size * particle.glowSize * 2
        );
  
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.4, particle.glowColor);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
        // Draw larger glow
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, size * particle.glowSize * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.globalAlpha = particle.alpha * 0.3;
        this.ctx.fill();
  
        // Draw core
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.globalAlpha = particle.alpha;
        this.ctx.fill();
      });
    }
  
    handleResize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  
    handleMouseMove(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }
  
    animate() {
      if (!this.isActive) return;
  
      this.drawParticles();
      requestAnimationFrame(() => this.animate());
    }
  
    destroy() {
      this.isActive = false;
  
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('mousemove', this.handleMouseMove);
  
      if (this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
  
      this.particles = [];
      this.ctx = null;
    }
  }
  
  // Skills Data
  const skills = {
    frontend: {
      title: "Frontend Development",
      skills: [
        "JavaScript", "React.js", "HTML5", "CSS3", "GSAP Animation", 
        "Responsive Design", "UI/UX Implementation", "Performance Optimization"
      ]
    },
    software: {
      title: "Software Engineering & Tools",
      skills: [
        "Node.js", "Vite", "Git/GitHub", "VS Code", "API Integration", 
        "Python (Beginner)", "Testing/Debugging", "Code Review"
      ]
    },
    data: {
      title: "Data Analysis & Systems",
      skills: [
        "Data Analysis", "Data Visualization", "Excel", "ServiceNow", 
        "CXONE", "Healthcare Systems", "Technical Support"
      ]
    },
    professional: {
      title: "Professional Skills",
      skills: [
        "Agile Methodology", "Problem-Solving", "Team Collaboration", 
        "Critical Thinking", "Project Management", "Technical Documentation"
      ]
    }
  };
  
  // Wait for DOM content to be loaded
  document.addEventListener('DOMContentLoaded', async function() {
    // Initialize Particle System
    const particleSystem = new ParticleSystem();
    await particleSystem.init();
    
    // Initialize site functionality
    initializeLoading();
    initializeCustomCursor();
    populateSkills();
    initializeNavbar();
    initializeScrollAnimation();
    initializeTilt();
    initializeMagneticButtons();
    initializeScrollableCards();
  });
  
  // Loading screen functionality
  function initializeLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (!loadingScreen) return;
    
    // Hide loading screen after content loads
    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 1500);
  }
  
  // Custom cursor functionality
  function initializeCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;
  
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  
    const updateCursor = () => {
      posX += (mouseX - posX) * 0.1;
      posY += (mouseY - posY) * 0.1;
  
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
      follower.style.left = `${posX - 17}px`;
      follower.style.top = `${posY - 17}px`;
  
      requestAnimationFrame(updateCursor);
    };
    updateCursor();
  
    // Enhanced cursor effects on links and buttons
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        follower.style.transform = 'scale(1.5)';
        follower.style.borderColor = 'var(--accent-light)';
      });
      link.addEventListener('mouseleave', () => {
        follower.style.transform = 'scale(1)';
        follower.style.borderColor = 'var(--accent-light)';
      });
    });
  }
  
  // Populate skills from data
  function populateSkills() {
    const populateSkillCategory = (containerId, skillsArray) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      skillsArray.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'skill-tag';
        span.textContent = skill;
        container.appendChild(span);
      });
    };
  
    populateSkillCategory('frontend-skills', skills.frontend.skills);
    populateSkillCategory('software-skills', skills.software.skills);
    populateSkillCategory('data-skills', skills.data.skills);
    populateSkillCategory('professional-skills', skills.professional.skills);
  }
  
  // Navbar functionality
  function initializeNavbar() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  
    // Mobile navigation
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
      });
    }
  
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
  
  // Scroll animation functionality
  function initializeScrollAnimation() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const isInViewport = (element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 && 
        rect.bottom >= 0
      );
    };
    
    const handleScrollAnimation = () => {
      animateElements.forEach(element => {
        if (isInViewport(element)) {
          element.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', handleScrollAnimation);
    window.addEventListener('resize', handleScrollAnimation);
    
    // Initial check
    setTimeout(handleScrollAnimation, 300);
  }
  
  // Initialize tilt effect
  function initializeTilt() {
    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.2
      });
    }
  }
  
  // Magnetic button effect
  function initializeMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic');
    const follower = document.querySelector('.cursor-follower');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        if (follower) follower.style.transform = 'scale(1.5)';
      });
  
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0px, 0px)';
        if (follower) follower.style.transform = 'scale(1)';
      });
    });
  }
  
  // Initialize scrollable cards
  function initializeScrollableCards() {
    // Get scrollable card elements
    const scrollableCard = document.querySelector('.scrollable-card');
    
    if (!scrollableCard) return;
    
    const scrollContainer = scrollableCard.querySelector('.scroll-container');
    const scrollContent = scrollableCard.querySelector('.scroll-content');
    const prevArrow = scrollableCard.querySelector('.scroll-prev');
    const nextArrow = scrollableCard.querySelector('.scroll-next');
    
    if (!scrollContainer || !scrollContent || !prevArrow || !nextArrow) return;
    
    // Initially hide arrows
    prevArrow.style.opacity = '0';
    nextArrow.style.opacity = '0';
    
    // Variable to track scroll position
    let scrollPosition = 0;
    const scrollStep = 100; // Amount to scroll each time
    
    // Check if scrolling is possible
    const checkScrollable = () => {
      // Check if content is wider than container
      const isScrollable = scrollContent.scrollHeight > scrollContainer.clientHeight;
      
      if (isScrollable) {
        // Hide prev arrow if at the beginning
        prevArrow.style.display = scrollPosition <= 0 ? 'none' : 'flex';
        
        // Hide next arrow if at the end
        const maxScroll = scrollContent.scrollHeight - scrollContainer.clientHeight;
        nextArrow.style.display = scrollPosition >= maxScroll ? 'none' : 'flex';
        
        // Show arrows on hover
        scrollableCard.addEventListener('mouseenter', () => {
          if (scrollPosition > 0) {
            prevArrow.style.opacity = '0.8';
          }
          if (scrollPosition < maxScroll) {
            nextArrow.style.opacity = '0.8';
          }
        });
        
        scrollableCard.addEventListener('mouseleave', () => {
          prevArrow.style.opacity = '0';
          nextArrow.style.opacity = '0';
        });
      } else {
        // Hide both arrows if not scrollable
        prevArrow.style.display = 'none';
        nextArrow.style.display = 'none';
      }
    };
    
    // Handle scroll previous
    prevArrow.addEventListener('click', () => {
      scrollPosition = Math.max(0, scrollPosition - scrollStep);
      scrollContent.style.transform = `translateY(-${scrollPosition}px)`;
      checkScrollable();
    });
    
    // Handle scroll next
    nextArrow.addEventListener('click', () => {
      const maxScroll = scrollContent.scrollHeight - scrollContainer.clientHeight;
      scrollPosition = Math.min(maxScroll, scrollPosition + scrollStep);
      scrollContent.style.transform = `translateY(-${scrollPosition}px)`;
      checkScrollable();
    });
    
    // Initial check
    window.addEventListener('load', checkScrollable);
    window.addEventListener('resize', checkScrollable);
  }