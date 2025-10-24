'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Code, 
  Rocket, 
  Zap, 
  Globe,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  Flame,
  Star,
  Lightbulb,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

// Custom hook to detect if an element is on screen
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        try { observer.unobserve(currentRef); } catch (e) { /* noop */ }
      }
    };
  }, [ref, options]);

  return [ref, isVisible];
};

// Neon Particles Component
const NeonParticles = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const mouse = { x: null, y: null, radius: 150 };
    
    const handleMouseMove = e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    let particles;
    
    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      let num = Math.max(40, Math.floor((canvas.height * canvas.width) / 12000));
      
      for (let i = 0; i < num; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          color: Math.random() > 0.5 ? '#00ffff' : '#ff0080'
        });
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        let dx = (mouse.x ?? p.x) - p.x;
        let dy = (mouse.y ?? p.y) - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        
        if (mouse.x !== null && dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          p.vx -= (dx / dist) * force * 0.5;
          p.vy -= (dy / dist) * force * 0.5;
        }
        
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        p.vx *= 0.99;
        p.vy *= 0.99;
        
        // Create glowing effect
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const alphaHex = Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fillStyle = `${p.color}${alphaHex}`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    init();
    animate();
    
    const handleResize = () => init();
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Typewriter Effect Component (fixed)
const TypewriterText = ({ text, speed = 100, className = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const indexRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // reset
    indexRef.current = 0;
    setDisplayText('');

    // typing function uses slice(...) so we never rely on previous state concatenation
    const tick = () => {
      indexRef.current += 1;
      setDisplayText(text.slice(0, indexRef.current));

      if (indexRef.current < text.length) {
        timeoutRef.current = setTimeout(tick, speed);
      }
    };

    // start with a short delay so the first char is visible predictably
    timeoutRef.current = setTimeout(tick, speed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed]);

  // keep `white-space: pre` so spaces are respected and cursor sits after text reliably
  return (
    <span className={className} style={{ whiteSpace: 'pre' }}>
      {displayText}
      {/* Stable cursor glyph — doesn't rely on background-clip or color inheritance */}
      {displayText.length < text.length && (
        <span aria-hidden className="ml-1 animate-pulse text-cyan-400">│</span>
      )}
    </span>
  );
};

// Neon Card Component
const NeonCard = ({ children, className = "", glowColor = "cyan" }) => {
  const glowColors = {
    cyan: 'hover:shadow-cyan-500/50 border-cyan-500/30',
    pink: 'hover:shadow-pink-500/50 border-pink-500/30',
    purple: 'hover:shadow-purple-500/50 border-purple-500/30',
    green: 'hover:shadow-green-500/50 border-green-500/30',
    orange: 'hover:shadow-orange-500/50 border-orange-500/30'
  };
  
  return (
    <div className={`bg-gray-900/80 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl
      transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
      ${glowColors[glowColor]} ${className}
    `}>
      {children}
    </div>
  );
};

// Progress Bar Component
const NeonProgressBar = ({ percentage, color, label }) => {
  const [currentPercentage, setCurrentPercentage] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPercentage(percentage);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [percentage]);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-semibold text-lg">{label}</span>
        {/* Using inline style for colored percentage text to avoid Tailwind class generation issues */}
        <span style={{ color: color === 'cyan' ? '#06b6d4' : color === 'pink' ? '#ec4899' : color === 'green' ? '#10b981' : color === 'yellow' ? '#f59e0b' : color === 'purple' ? '#7c3aed' : '#3b82f6' }} className="font-bold">{currentPercentage}%</span>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-2000 ease-out relative overflow-hidden shadow-lg`}
          style={{ width: `${currentPercentage}%`, background: color === 'cyan' ? 'linear-gradient(90deg,#06b6d4,#0ea5e9)' : color === 'pink' ? 'linear-gradient(90deg,#f472b6,#ec4899)' : color === 'green' ? 'linear-gradient(90deg,#34d399,#10b981)' : color === 'yellow' ? 'linear-gradient(90deg,#fde68a,#f59e0b)' : color === 'purple' ? 'linear-gradient(90deg,#c084fc,#7c3aed)' : 'linear-gradient(90deg,#60a5fa,#3b82f6)'}}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, index }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <NeonCard glowColor={project.glowColor} className="h-full p-6 group cursor-pointer hover:scale-105">
        <div className={`w-full h-32 rounded-xl mb-6 bg-gradient-to-br ${project.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <div className="text-white text-5xl group-hover:animate-pulse">
            {project.icon}
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
          {project.title}
        </h3>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech) => (
            <span key={tech} className="px-3 py-1 bg-gray-800/50 border border-cyan-400/50 text-cyan-400 rounded-full text-sm hover:bg-cyan-400/10 transition-colors duration-300">
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex items-center text-pink-400 group-hover:text-pink-300 transition-colors duration-300">
          <span className="mr-2 font-medium">View Project</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </NeonCard>
    </div>
  );
};

// Timeline Component
const TimelineItem = ({ icon, title, description, color }) => (
  <div className="flex items-start mb-8">
    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r ${color} flex items-center justify-center mr-6 shadow-lg`}>
      {icon}
    </div>
    <div className="flex-grow">
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  </div>
);

// Main Portfolio Component
const NeonPortfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [skillProgress, setSkillProgress] = useState({});
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const [skillsRef, skillsAreVisible] = useOnScreen({ threshold: 0.2 });
  const [aboutRef, aboutAreVisible] = useOnScreen({ threshold: 0.2 });
  const [projectsRef, projectsAreVisible] = useOnScreen({ threshold: 0.2 });

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 2000);
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setNavVisible(currentScrollY <= 100 || currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercentage(totalHeight > 0 ? (currentScrollY / totalHeight) * 100 : 0);
      
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      const scrollPosition = currentScrollY + window.innerHeight / 2;
      let newActiveSection = 'home';
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element && element.offsetTop <= scrollPosition) {
          newActiveSection = sectionId;
        }
      }
      
      if (window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 2) {
        newActiveSection = 'contact';
      }
      
      setActiveSection(newActiveSection);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(loadingTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  
  // Effect for triggering skill bar animation
  useEffect(() => {
    if (skillsAreVisible) {
      setTimeout(() => {
        setSkillProgress({
          React: 95,
          'Next.js': 90,
          'Node.js': 85,
          Python: 88,
          MongoDB: 82,
          'AI/ML': 78
        });
      }, 300);
    }
  }, [skillsAreVisible]);
  
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };
  
  const menuItems = [
    { id: 'home', label: 'Home', icon: <Flame className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Star className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Rocket className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Globe className="w-4 h-4" /> }
  ];
  
  const skills = [
    { name: 'React', level: 95, color: 'cyan' },
    { name: 'Next.js', level: 90, color: 'pink' },
    { name: 'Node.js', level: 85, color: 'green' },
    { name: 'Python', level: 88, color: 'yellow' },
    { name: 'MongoDB', level: 82, color: 'purple' },
    { name: 'AI/ML', level: 78, color: 'blue' }
  ];
  
  const projects = [
    {
      title: "Neon E-commerce Platform",
      description: "Next-generation e-commerce with AI recommendations, real-time analytics, and cyberpunk aesthetics.",
      tech: ["React", "Node.js", "AI/ML", "Stripe"],
      gradient: "from-purple-600 via-pink-600 to-cyan-600",
      glowColor: "purple",
      icon: <Globe />
    },
    {
      title: "Neural Network Chatbot",
      description: "Advanced conversational AI with natural language processing and machine learning capabilities.",
      tech: ["Python", "TensorFlow", "NLP", "FastAPI"],
      gradient: "from-cyan-500 via-purple-600 to-pink-600",
      glowColor: "cyan",
      icon: <Zap />
    },
    {
      title: "Quantum Analytics Dashboard",
      description: "Real-time data visualization with interactive charts and quantum computing integration.",
      tech: ["React", "D3.js", "WebSocket", "Python"],
      gradient: "from-orange-500 via-pink-600 to-purple-600",
      glowColor: "pink",
      icon: <Rocket />
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 border-4 border-cyan-400/30 rounded-full animate-spin border-t-cyan-400 mb-8"></div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
            Loading...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <NeonParticles />
      
      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 z-50 bg-gradient-to-r from-cyan-400 to-pink-400 transition-all duration-300"
        style={{ width: `${scrollPercentage}%` }}
      />
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800/50 transition-transform duration-500 ${navVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center border-2 border-cyan-400/50 shadow-lg hover:shadow-cyan-400/50 transition-all duration-300">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
                Dhanush D
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'text-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20' 
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          <div className={`transition-all duration-500 ease-in-out md:hidden overflow-hidden ${
            isMenuOpen ? 'max-h-96 mt-6 pt-6 border-t border-gray-800/50' : 'max-h-0'
          }`}>
            <div className="flex flex-col space-y-3">
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'text-cyan-400 bg-cyan-400/10' 
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50'
                  }`}
                  style={{
                    transitionDelay: `${index * 50}ms`,
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: isMenuOpen ? 1 : 0
                  }}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 pt-24">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex flex-col justify-center text-center mb-20">
          <div className="mb-12">
            <div className="relative w-40 h-40 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-600 rounded-full blur-xl opacity-60 animate-pulse"></div>
              <div className="relative w-40 h-40 bg-gray-900 border-4 border-cyan-400 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-400/50">
                <Code className="w-16 h-16 text-cyan-400" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-6">
              <TypewriterText text="Dhanush D" speed={150} />
            </h1>
            
            <h2 className="text-2xl md:text-3xl text-gray-300 mb-8 font-light">
              <TypewriterText text="Full Stack Developer & AI Innovator" speed={80} />
            </h2>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
              Crafting the future with neon-bright code and cutting-edge AI. 
              Building digital experiences that glow in the dark web.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => scrollToSection('projects')}
                className="group flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105"
              >
                <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                <span>View Projects</span>
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="group flex items-center space-x-2 px-8 py-4 border-2 border-pink-400 text-pink-400 rounded-full font-semibold transition-all duration-300 hover:bg-pink-400 hover:text-black hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-105"
              >
                <Globe className="w-5 h-5 group-hover:animate-spin" />
                <span>Get In Touch</span>
              </button>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section id="about" ref={aboutRef} className="py-20 mb-20">
          <h2 className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            About Me
          </h2>
          <div className={`transition-all duration-1000 ease-out ${aboutAreVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <NeonCard glowColor="pink" className="p-8">
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Greetings, fellow cybernauts! I&apos;m Dhanush D, a full-stack developer with a passion for
                creating immersive digital experiences. My journey began with a curiosity for how things work
                under the hood, leading me to master a blend of frontend and backend technologies.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Over the years, I&apos;ve honed my skills in frameworks like **React** and **Next.js**, while
                building robust server-side applications with **Node.js** and **Python**. But my true
                fascination lies in the world of **AI and machine learning**, where I&apos;m constantly
                exploring new ways to integrate intelligent features into my projects.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                I thrive on challenges and am dedicated to building solutions that are not only
                functional and performant but also visually stunning. Let&apos;s build something extraordinary together.
              </p>
            </NeonCard>
            
            <div className="mt-12 text-center">
              <h3 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                My Journey
              </h3>
              <div className="relative">
                {/* Vertical glowing line */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-60"></div>
                
                <div className="flex flex-col items-center">
                  <div className="relative mb-12">
                    <div className="w-4 h-4 rounded-full bg-cyan-400 ring-2 ring-cyan-400/50 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse"></div>
                    <NeonCard glowColor="cyan" className="p-6 max-w-lg mx-auto">
                      <h4 className="text-xl font-bold text-white mb-2">2018 - The Spark</h4>
                      <p className="text-gray-300 leading-relaxed">
                        Began my coding adventure, fascinated by the web and how to build interactive experiences from scratch.
                      </p>
                    </NeonCard>
                  </div>
                  
                  <div className="relative mb-12">
                    <div className="w-4 h-4 rounded-full bg-pink-400 ring-2 ring-pink-400/50 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse"></div>
                    <NeonCard glowColor="pink" className="p-6 max-w-lg mx-auto">
                      <h4 className="text-xl font-bold text-white mb-2">2021 - Embracing Full Stack</h4>
                      <p className="text-gray-300 leading-relaxed">
                        Transitioned to full-stack development, mastering the art of connecting frontend interfaces with powerful backend systems.
                      </p>
                    </NeonCard>
                  </div>
                  
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-purple-400 ring-2 ring-purple-400/50 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse"></div>
                    <NeonCard glowColor="purple" className="p-6 max-w-lg mx-auto">
                      <h4 className="text-xl font-bold text-white mb-2">2024 - AI Integration & Innovation</h4>
                      <p className="text-gray-300 leading-relaxed">
                        Started incorporating AI and machine learning into my projects, building intelligent applications that learn and adapt.
                      </p>
                    </NeonCard>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" ref={skillsRef} className="py-20 mb-20">
          <h2 className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <NeonCard key={skill.name} glowColor="cyan" className="p-6">
                <NeonProgressBar 
                  percentage={skillProgress[skill.name] || 0}
                  color={skill.color}
                  label={skill.name}
                />
              </NeonCard>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" ref={projectsRef} className="py-20 mb-20">
          <h2 className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="text-center py-20">
          <h2 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
            Let&apos;s Connect
          </h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
            Ready to illuminate the digital world together? Let&apos;s create something extraordinary.
          </p>
          
          <NeonCard glowColor="purple" className="max-w-2xl mx-auto mb-12 p-8">
            <div className="space-y-8">
              <TimelineItem
                icon={<Lightbulb className="w-6 h-6 text-white" />}
                title="Have an idea?"
                description="Let's discuss how we can bring it to life with cutting-edge technology"
                color="from-cyan-400 to-cyan-600"
              />
              <TimelineItem
                icon={<Rocket className="w-6 h-6 text-white" />}
                title="Ready to build?"
                description="I'll help you create something amazing that stands out from the crowd"
                color="from-pink-400 to-pink-600"
              />
              <TimelineItem
                icon={<Star className="w-6 h-6 text-white" />}
                title="Launch together"
                description="Watch your vision glow in the digital realm and captivate your audience"
                color="from-purple-400 to-purple-600"
              />
            </div>
          </NeonCard>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="https://www.linkedin.com/in/dhanush-d"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 px-6 py-3 bg-blue-600 rounded-xl font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
            >
              <Linkedin className="w-5 h-5 group-hover:animate-bounce" />
              <span>LinkedIn</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
            <a
              href="https://github.com/dhanushd"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-3 px-6 py-3 bg-gray-800 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-900 hover:shadow-lg hover:shadow-gray-500/50 hover:scale-105"
            >
              <Github className="w-5 h-5 group-hover:animate-spin" />
              <span>GitHub</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
            <a
              href="mailto:dhanush.d@example.com"
              className="group flex items-center space-x-3 px-6 py-3 bg-purple-600 rounded-xl font-semibold transition-all duration-300 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105"
            >
              <Mail className="w-5 h-5 group-hover:animate-pulse" />
              <span>Email</span>
            </a>
          </div>
        </section>
      </main>

      <style jsx global>{`
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #111827;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00ffff, #ff0080);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ff0080, #00ffff);
        }

        /* Smooth animations */
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default NeonPortfolio;
