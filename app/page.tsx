"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import {
  Calendar,
  Clock,
  Bell,
  Globe,
  Smartphone,
  RefreshCw,
  CheckCircle,
  Play,
  ArrowRight,
  Users,
  Briefcase,
  Rocket,
  MapPin,
  Zap,
  Star,
  Menu,
  X,
  ChevronRight,
  Mail,
  Send,
  Check,
  ArrowUpRight,
  Sparkles,
  Shield,
  TrendingUp,
  MousePointer,
  Link as LinkIcon,
} from 'lucide-react';

// RevealUp Animation Component
interface RevealUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'rotate';
  distance?: number;
  once?: boolean;
}

const RevealUp: React.FC<RevealUpProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  direction = 'up',
  distance = 50,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [once]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(-${distance}px)`;
      case 'scale':
        return 'scale(0.9)';
      case 'rotate':
        return 'rotate(-5deg) scale(0.95)';
      default:
        return 'none';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getInitialTransform(),
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// Stagger Container for multiple animations
interface StaggerContainerProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
}

const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  className = '',
  direction = 'up',
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <RevealUp delay={index * staggerDelay} direction={direction}>
          {child}
        </RevealUp>
      ))}
    </div>
  );
};

// Animated Counter Component
interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
};

// Floating Animation Component
const FloatingElement: React.FC<{ children: ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = '',
}) => {
  return (
    <div
      className={`animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

// Gradient Blob Animation
const GradientBlob: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className="w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-blob" />
    </div>
  );
};

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 30px) scale(1.05); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 10s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        
        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .glow {
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
        }
        
        .glow-hover:hover {
          box-shadow: 0 0 60px rgba(59, 130, 246, 0.4);
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-gray-100/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <RevealUp direction="left" delay={0.1}>
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Calendly
                </span>
              </div>
            </RevealUp>
            
            <RevealUp direction="right" delay={0.2}>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
                </a>
                <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
                  How It Works
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group">
                  Pricing
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
                </a>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium
                            hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 overflow-hidden group"
                >
                  <span className="relative z-10">Sign up free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </RevealUp>

            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-4 px-4 py-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">How It Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Pricing</a>
            <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Log in</Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-medium text-center"
            >
              Start for free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30" />
        <GradientBlob className="top-20 -left-20 opacity-60" />
        <GradientBlob className="bottom-20 right-0 opacity-40" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <RevealUp delay={0.1}>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold border border-blue-200/50 shadow-sm">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>Scheduling made simple</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </RevealUp>
              
              <RevealUp delay={0.2}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                  Schedule meetings without the{' '}
                  <span className="text-gradient animate-gradient relative">
                    back-and-forth
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                      <path d="M2 10C50 4 100 2 150 6C200 10 250 4 298 8" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                          <stop stopColor="#3b82f6"/>
                          <stop offset="0.5" stopColor="#8b5cf6"/>
                          <stop offset="1" stopColor="#ec4899"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>
              </RevealUp>
              
              <RevealUp delay={0.3}>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl">
                  Share your availability, let others book time instantly, and stay in control of your calendar — all in one simple link.
                </p>
              </RevealUp>
              
              <RevealUp delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/login"
                    className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] glow-hover"
                  >
                    <span>👉 Get Started for Free</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="group flex items-center justify-center space-x-3 bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20" />
                      <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                    <span>Watch Demo</span>
                  </button>
                </div>
              </RevealUp>
              
              <RevealUp delay={0.5}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
                  <div className="flex -space-x-4">
                    {[
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                    ].map((src, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-full border-3 border-white bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden shadow-lg hover:scale-110 hover:z-10 transition-transform cursor-pointer"
                      >
                        <img 
                          src={src}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-gray-600 font-semibold ml-2">4.9</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Trusted by <span className="font-bold text-gray-900"><AnimatedCounter end={50000} suffix="+" /></span> professionals
                    </p>
                  </div>
                </div>
              </RevealUp>
            </div>
            
            <RevealUp delay={0.3} direction="left">
              <div className="relative">
                {/* Decorative Elements */}
                <FloatingElement delay={0} className="absolute -top-8 -right-8 z-20">
                  <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Meeting Booked!</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                </FloatingElement>
                
                <FloatingElement delay={2} className="absolute -bottom-4 -left-4 z-20">
                  <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Reminder sent</p>
                      <p className="text-xs text-gray-500">Automatic</p>
                    </div>
                  </div>
                </FloatingElement>
                
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl blur-3xl opacity-20 transform rotate-6 scale-110" />
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover-lift glow">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
                        C
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">Calendly</h3>
                        <p className="text-gray-500">30 min meeting</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">30 min</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 35 }, (_, i) => (
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center text-sm rounded-xl cursor-pointer transition-all duration-200 font-medium ${
                          i === 15
                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                            : i > 10 && i < 25 && i % 3 !== 0
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105'
                            : 'text-gray-300'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700 mb-4">Available times</p>
                    {['9:00 AM', '10:30 AM', '2:00 PM', '4:30 PM'].map((time, i) => (
                      <button
                        key={time}
                        className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          i === 1
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                            : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-[1.01]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </RevealUp>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <RevealUp delay={1} className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
          <div className="flex flex-col items-center space-y-2 text-gray-400 animate-bounce">
            <MousePointer className="w-5 h-5" />
            <span className="text-xs font-medium">Scroll to explore</span>
          </div>
        </RevealUp>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: 10, suffix: 'M+', label: 'Meetings Scheduled', icon: Calendar },
              { value: 50, suffix: 'K+', label: 'Active Users', icon: Users },
              { value: 150, suffix: '+', label: 'Countries', icon: Globe },
              { value: 99, suffix: '%', label: 'Uptime', icon: Shield },
            ].map((stat, index) => (
              <RevealUp key={index} delay={index * 0.1} direction="up">
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                    <stat.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </RevealUp>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-50">
          <div className="absolute top-20 left-10 w-64 h-64 bg-red-100 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <RevealUp>
            <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <X className="w-4 h-4" />
              <span>The Old Way</span>
            </div>
          </RevealUp>
          
          <RevealUp delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Tired of endless emails just to{' '}
              <span className="text-red-500 line-through decoration-4">book one meeting?</span>
            </h2>
          </RevealUp>
          
          <RevealUp delay={0.2}>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              We've all been there. The back-and-forth emails that make scheduling harder than it needs to be.
            </p>
          </RevealUp>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {[
              { text: '"Are you free tomorrow at 4?"', icon: Mail, color: 'red' },
              { text: '"Sorry, that doesn\'t work for me."', icon: X, color: 'orange' },
              { text: 'Time zone confusion', icon: Globe, color: 'yellow' },
              { text: 'Missed meetings & double bookings', icon: Calendar, color: 'red' },
            ].map((item, index) => (
              <RevealUp key={index} delay={0.1 * index} direction={index % 2 === 0 ? 'left' : 'right'}>
                <div className="group flex items-center space-x-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:border-red-200 transition-all hover-lift">
                  <div className={`w-14 h-14 bg-${item.color}-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-7 h-7 text-${item.color}-500`} />
                  </div>
                  <p className="text-gray-700 font-semibold text-lg text-left">{item.text}</p>
                </div>
              </RevealUp>
            ))}
          </div>
          
          <RevealUp delay={0.5}>
            <p className="text-2xl text-gray-900 font-bold">
              Scheduling shouldn't feel harder than the meeting itself. 😤
            </p>
          </RevealUp>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <GradientBlob className="-top-40 -right-40 opacity-30" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <RevealUp delay={0.1} direction="right" className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-15" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop"
                    alt="Team collaboration"
                    className="w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                
                <FloatingElement delay={1} className="absolute -bottom-8 -right-8">
                  <div className="bg-white rounded-2xl shadow-2xl p-5 flex items-center space-x-4 border border-gray-100">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">Meeting Confirmed</p>
                      <p className="text-gray-500">Added to calendar automatically</p>
                    </div>
                  </div>
                </FloatingElement>
                
                <FloatingElement delay={3} className="absolute -top-4 -left-4">
                  <div className="bg-white rounded-xl shadow-xl p-3 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-gray-700 text-sm">Instant booking</span>
                  </div>
                </FloatingElement>
              </div>
            </RevealUp>
            
            <div className="order-1 lg:order-2 space-y-8">
              <RevealUp>
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>The New Way</span>
                </div>
              </RevealUp>
              
              <RevealUp delay={0.1}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  One link. One calendar.{' '}
                  <span className="text-gradient">Zero hassle.</span>
                </h2>
              </RevealUp>
              
              <RevealUp delay={0.2}>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Our platform automates scheduling so you can focus on what actually matters — <strong>conversations, not coordination.</strong>
                </p>
              </RevealUp>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: LinkIcon, text: 'Share a single booking link', color: 'blue' },
                  { icon: Clock, text: 'Real-time availability', color: 'green' },
                  { icon: CheckCircle, text: 'Automatic confirmations', color: 'purple' },
                  { icon: Bell, text: 'Smart reminders', color: 'orange' },
                ].map((benefit, index) => (
                  <RevealUp key={index} delay={0.1 * index + 0.3}>
                    <div className="group flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer">
                      <div className={`w-12 h-12 bg-${benefit.color}-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                        <benefit.icon className={`w-6 h-6 text-${benefit.color}-600`} />
                      </div>
                      <span className="text-gray-700 font-semibold">{benefit.text}</span>
                    </div>
                  </RevealUp>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 via-indigo-50/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <RevealUp className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Book meetings in <span className="text-gradient">seconds</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to eliminate scheduling friction forever
            </p>
          </RevealUp>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                title: 'Create your availability',
                description: 'Set your working hours, buffers, and meeting types in minutes.',
                icon: Calendar,
                image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop',
                color: 'blue',
              },
              {
                step: '02',
                title: 'Share your booking link',
                description: 'Send via email, WhatsApp, LinkedIn, or embed on your website.',
                icon: Send,
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
                color: 'indigo',
              },
              {
                step: '03',
                title: 'Get booked instantly',
                description: "Invitees pick a time — it's automatically added to your calendar.",
                icon: CheckCircle,
                image: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=400&h=300&fit=crop',
                color: 'purple',
              },
            ].map((item, index) => (
              <RevealUp key={index} delay={0.15 * index} direction="up">
                <div className="relative group h-full">
                  <div className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full border border-gray-100">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-6 left-6">
                        <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg`}>
                          <span className={`text-${item.color}-600 font-bold text-xl`}>{item.step}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className={`inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full`}>
                          <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                          <span className="font-semibold text-gray-900 text-sm">Step {item.step}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  
                  {index < 2 && (
                    <div className="hidden md:flex absolute top-1/2 -right-6 lg:-right-8 z-10 transform -translate-y-1/2">
                      <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <ChevronRight className="w-6 h-6 text-blue-500" />
                      </div>
                    </div>
                  )}
                </div>
              </RevealUp>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <RevealUp className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to{' '}
              <span className="text-gradient">schedule smarter</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that save you hours every week and make you look professional
            </p>
          </RevealUp>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Custom Event Types',
                description: 'Create different meeting types for different purposes — one-on-ones, interviews, demos, consultations.',
                color: 'blue',
              },
              {
                icon: RefreshCw,
                title: 'Calendar Sync',
                description: 'Connect Google Calendar, Outlook, or iCloud to automatically block busy times.',
                color: 'green',
              },
              {
                icon: Globe,
                title: 'Time Zone Detection',
                description: 'Automatically shows times in your invitee\'s local timezone. No more confusion.',
                color: 'purple',
              },
              {
                icon: Bell,
                title: 'Automated Notifications',
                description: 'Send email confirmations and reminders automatically. Reduce no-shows by 90%.',
                color: 'orange',
              },
              {
                icon: Clock,
                title: 'Booking Management',
                description: 'Reschedule or cancel meetings with one click. Changes sync everywhere.',
                color: 'pink',
              },
              {
                icon: Smartphone,
                title: 'Mobile Friendly',
                description: 'Book and manage meetings from anywhere. Works perfectly on all devices.',
                color: 'indigo',
              },
            ].map((feature, index) => {
              const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
                blue: { bg: 'bg-blue-100', icon: 'text-blue-600', border: 'hover:border-blue-200' },
                green: { bg: 'bg-green-100', icon: 'text-green-600', border: 'hover:border-green-200' },
                purple: { bg: 'bg-purple-100', icon: 'text-purple-600', border: 'hover:border-purple-200' },
                orange: { bg: 'bg-orange-100', icon: 'text-orange-600', border: 'hover:border-orange-200' },
                pink: { bg: 'bg-pink-100', icon: 'text-pink-600', border: 'hover:border-pink-200' },
                indigo: { bg: 'bg-indigo-100', icon: 'text-indigo-600', border: 'hover:border-indigo-200' },
              };
              const colors = colorClasses[feature.color];
              
              return (
                <RevealUp key={index} delay={0.1 * index} direction="up">
                  <div className={`group bg-white p-8 rounded-3xl border-2 border-gray-100 ${colors.border} hover:shadow-xl transition-all duration-300 h-full hover-lift`}>
                    <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <feature.icon className={`w-8 h-8 ${colors.icon}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </RevealUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-100 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <RevealUp className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Users className="w-4 h-4" />
              <span>For Everyone</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Built for anyone who{' '}
              <span className="text-gradient">values their time</span>
            </h2>
          </RevealUp>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Briefcase,
                title: 'Freelancers & Consultants',
                description: 'Book clients effortlessly and look professional',
                image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop',
                color: 'blue',
              },
              {
                icon: Users,
                title: 'Recruiters & HR Teams',
                description: 'Schedule interviews 10x faster',
                image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop',
                color: 'green',
              },
              {
                icon: Rocket,
                title: 'Founders & Startups',
                description: 'Save hours every week for what matters',
                image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
                color: 'purple',
              },
              {
                icon: MapPin,
                title: 'Remote Teams',
                description: 'Stay aligned across all time zones',
                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
                color: 'orange',
              },
            ].map((persona, index) => (
              <RevealUp key={index} delay={0.1 * index} direction="up">
                <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={persona.image}
                      alt={persona.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <persona.icon className={`w-6 h-6 text-${persona.color}-600`} />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{persona.title}</h3>
                    <p className="text-gray-600">{persona.description}</p>
                  </div>
                </div>
              </RevealUp>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <GradientBlob className="top-0 left-0 opacity-20" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8">
              <RevealUp>
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  <span>Real Results</span>
                </div>
              </RevealUp>
              
              <RevealUp delay={0.1}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  More time.{' '}
                  <span className="text-gradient">Fewer interruptions.</span>
                </h2>
              </RevealUp>
              
              <RevealUp delay={0.2}>
                <p className="text-xl text-gray-600">
                  Join thousands of professionals who've reclaimed their time and boosted productivity.
                </p>
              </RevealUp>
              
              <div className="space-y-4">
                {[
                  { text: 'Eliminate manual scheduling', emoji: '⚡' },
                  { text: 'Reduce no-shows by 90%', emoji: '📉' },
                  { text: 'Look more professional', emoji: '✨' },
                  { text: 'Improve response speed', emoji: '🚀' },
                  { text: 'Scale without chaos', emoji: '📈' },
                ].map((benefit, index) => (
                  <RevealUp key={index} delay={0.1 * index + 0.3} direction="left">
                    <div className="group flex items-center space-x-4 p-4 rounded-2xl hover:bg-green-50 transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-2xl">{benefit.emoji}</span>
                      </div>
                      <span className="text-lg text-gray-700 font-semibold">{benefit.text}</span>
                      <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                    </div>
                  </RevealUp>
                ))}
              </div>
              
              <RevealUp delay={0.8}>
                <Link
                  href="/register"
                  className="inline-flex items-center space-x-2 text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors group"
                >
                  <span>Start scheduling smarter today</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </RevealUp>
            </div>
            
            <RevealUp delay={0.2} direction="left">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-3xl opacity-15" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&h=600&fit=crop"
                    alt="Productive work"
                    className="w-full object-cover"
                  />
                </div>
                
                <FloatingElement delay={2} className="absolute -top-6 -right-6">
                  <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">+5 hrs/week</p>
                      <p className="text-xs text-gray-500">Time saved</p>
                    </div>
                  </div>
                </FloatingElement>
              </div>
            </RevealUp>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-100 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <RevealUp className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Star className="w-4 h-4 fill-current" />
              <span>Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by <span className="text-gradient">thousands</span> of users
            </h2>
          </RevealUp>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: 'I stopped wasting 30 minutes per meeting just scheduling. This tool changed my entire workflow.',
                author: 'Sarah Chen',
                role: 'Freelance Designer',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                rating: 5,
              },
              {
                quote: 'Interview scheduling is now automatic. Our hiring process is 3x faster than before.',
                author: 'Michael Roberts',
                role: 'Startup Founder',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                rating: 5,
              },
              {
                quote: 'The timezone detection alone saves me hours of confusion with international clients.',
                author: 'Emma Wilson',
                role: 'Marketing Consultant',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <RevealUp key={index} delay={0.1 * index} direction="up">
                <div className="group bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full hover-lift">
                  <div className="flex space-x-1 mb-6">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-xl text-gray-700 mb-8 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-14 h-14 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.author}</p>
                      <p className="text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </RevealUp>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <GradientBlob className="-top-40 right-0 opacity-20" />
        
        <div className="max-w-6xl mx-auto relative">
          <RevealUp className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              <span>Simple Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Start free, <span className="text-gradient">scale as you grow</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No hidden fees. No credit card required. Upgrade anytime.
            </p>
          </RevealUp>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                description: 'Perfect to get started',
                features: ['1 calendar connection', '1 event type', 'Email notifications', 'Mobile app access', 'Basic support'],
                highlighted: false,
                cta: 'Get Started Free',
              },
              {
                name: 'Pro',
                price: '$12',
                description: 'For power users',
                features: ['Unlimited event types', 'Multiple calendars', 'Custom branding', 'Zoom & Meet integration', 'Priority support', 'Analytics dashboard'],
                highlighted: true,
                cta: 'Start Pro Trial',
                badge: 'Most Popular',
              },
              {
                name: 'Team',
                price: '$20',
                description: 'For growing teams',
                features: ['Everything in Pro', 'Team scheduling', 'Round-robin events', 'Collective availability', 'Admin controls', 'SSO & SAML'],
                highlighted: false,
                cta: 'Contact Sales',
              },
            ].map((plan, index) => (
              <RevealUp key={index} delay={0.1 * index} direction="up">
                <div
                  className={`relative rounded-3xl p-8 transition-all duration-300 h-full ${
                    plan.highlighted
                      ? 'bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl shadow-blue-500/30 scale-105 z-10'
                      : 'bg-white border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={plan.highlighted ? 'text-white/80' : 'text-gray-500'}>/month</span>
                  </div>
                  <p className={`mb-8 ${plan.highlighted ? 'text-white/80' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          plan.highlighted ? 'bg-white/20' : 'bg-green-100'
                        }`}>
                          <Check className={`w-4 h-4 ${plan.highlighted ? 'text-white' : 'text-green-600'}`} />
                        </div>
                        <span className={plan.highlighted ? 'text-white/90' : 'text-gray-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </RevealUp>
            ))}
          </div>
          
          <RevealUp delay={0.4}>
            <div className="text-center mt-12">
              <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center space-x-2 mx-auto group">
                <span>Compare all features</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </RevealUp>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <RevealUp>
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[2.5rem] p-12 md:p-16 text-center overflow-hidden shadow-2xl">
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />
              </div>
              
              {/* Floating Elements */}
              <FloatingElement delay={0} className="absolute top-8 left-8">
                <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white/60" />
                </div>
              </FloatingElement>
              
              <FloatingElement delay={2} className="absolute bottom-8 right-8">
                <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white/60" />
                </div>
              </FloatingElement>
              
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-8">
                  <Sparkles className="w-4 h-4" />
                  <span>Ready to get started?</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Start scheduling smarter today
                </h2>
                <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                  Join <strong>50,000+</strong> professionals who've already transformed their scheduling. No credit card required.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/register"
                    className="group inline-flex items-center justify-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <span>🚀 Create Your Free Account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold border-2 border-white/20 hover:bg-white/20 transition-all duration-300">
                    <span>Schedule a Demo</span>
                  </button>
                </div>
                
                <p className="text-white/60 text-sm mt-8">
                  Free forever • No credit card • Setup in 2 minutes
                </p>
              </div>
            </div>
          </RevealUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <RevealUp>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-2xl font-bold">Calendly</span>
                </div>
                <p className="text-gray-400 text-lg mb-6 max-w-sm">
                  The modern way to schedule meetings. Simple, smart, and beautifully designed.
                </p>
                <div className="flex space-x-4">
                  {['twitter', 'facebook', 'linkedin', 'instagram'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </RevealUp>
            </div>
            
            {[
              {
                title: 'Product',
                links: ['Features', 'Integrations', 'Pricing', 'Updates', 'Beta'],
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
              },
              {
                title: 'Support',
                links: ['Help Center', 'Privacy', 'Terms', 'Security', 'Status'],
              },
            ].map((column, index) => (
              <RevealUp key={column.title} delay={0.1 * (index + 1)}>
                <div>
                  <h4 className="font-bold text-lg mb-6">{column.title}</h4>
                  <ul className="space-y-4">
                    {column.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                          <span>{link}</span>
                          <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealUp>
            ))}
          </div>
          
          <RevealUp>
            <div className="border-t border-gray-800 pt-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400">
                © 2025 Calendly — Scheduling made simple.
              </p>
              <div className="flex items-center space-x-6 text-gray-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </RevealUp>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;