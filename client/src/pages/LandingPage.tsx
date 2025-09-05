import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, BarChart3, Settings, Shield, Zap, Calendar, MessageCircle, FileText, Globe, Star, ArrowRight, Play } from "lucide-react";

// Import assets
import gradientBg from "@assets/Group 477_1757064264173.png";
import step3Frame from "@assets/Frame 47_1757064264174.png";
import step2Frame from "@assets/Frame 48_1757064264174.png";
import step1Frame from "@assets/Frame 49_1757064264175.png";
import checkmarkIcon from "@assets/Subtract_1757064264175.png";
import heroImage from "@assets/Group 138 (1)_1757064264176.png";
import ratingStars from "@assets/Group 154_1757064264176.png";

interface Plan {
  id: string;
  name: string;
  price: number;
  billing: string;
  features: string[];
  maxUsers: number;
  storageGB: number;
  isActive: boolean;
}

export default function LandingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ['/api/public/plans'],
    queryFn: async () => {
      const response = await fetch('/api/public/plans');
      if (!response.ok) throw new Error('Failed to fetch plans');
      return response.json();
    }
  });

  const handleGetStarted = async (planId: string) => {
    try {
      const response = await fetch('/api/onboarding/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });
      
      if (!response.ok) throw new Error('Failed to start onboarding');
      
      const { sessionId } = await response.json();
      window.location.href = `/onboarding/${sessionId}`;
    } catch (error) {
      console.error('Error starting onboarding:', error);
      alert('Failed to start onboarding. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">Scheduled Pro</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Grow Your Business Visibility 
                <span className="block">with Scheduled Pro</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Take your business to the next level with our comprehensive scheduling and management platform designed for modern entrepreneurs.
              </p>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg">
                Learn More
              </Button>
            </div>
            
            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="Professional with business dashboard" 
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 mb-6">More than 25,000 teams use Collabs</p>
            <div className="flex justify-center items-center space-x-12 text-gray-500">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span className="text-sm">DASHBOARD</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">PROJECTS</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">TEAM CHAT</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm">ANALYTICS</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span className="text-sm">INTEGRATIONS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <img 
                  src={step1Frame} 
                  alt="Step 1" 
                  className="w-16 h-16"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sign in Register your Account</h3>
              <p className="text-gray-600">Create your account and get started with our intuitive platform in just a few clicks.</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <img 
                  src={step2Frame} 
                  alt="Step 2" 
                  className="w-16 h-16"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">Set up your projects and Applications</h3>
              <p className="text-gray-600">Configure your workspace, add team members, and set up your first project with our guided setup.</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <img 
                  src={step3Frame} 
                  alt="Step 3" 
                  className="w-16 h-16"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">Share it with customers & start selling</h3>
              <p className="text-gray-600">Launch your booking system and start accepting appointments from customers right away.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Features you can get</h2>
            <p className="text-lg text-gray-600">We offer a variety of interesting features that you can help increase your productivity at work and manage your project easily</p>
            <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
              Get Started Free
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-full h-32 bg-blue-200 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Appointment Management</h3>
              <p className="text-gray-600 text-sm">Track and manage all your appointments in one centralized location.</p>
            </Card>

            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-full h-32 bg-blue-200 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Revenue Management</h3>
              <p className="text-gray-600 text-sm">Monitor your business revenue and track financial performance.</p>
            </Card>

            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-full h-32 bg-blue-200 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Leads Management</h3>
              <p className="text-gray-600 text-sm">Capture and nurture leads to grow your customer base.</p>
            </Card>

            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-full h-32 bg-blue-200 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Web Page Builder</h3>
              <p className="text-gray-600 text-sm">Create beautiful web pages without any coding knowledge.</p>
            </Card>

            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-full h-32 bg-blue-200 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Team and Collaboration</h3>
              <p className="text-gray-600 text-sm">Work seamlessly with your team members and collaborate effectively.</p>
            </Card>

            <Card className="p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-full h-32 bg-blue-200 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">All in One Agent</h3>
              <p className="text-gray-600 text-sm">Comprehensive solution that handles all your business needs in one place.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Plan</h2>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">That's Right For You</h3>
            <p className="text-lg text-gray-600">Choose plan that works best for you, feel free to contact us</p>
            
            <div className="flex justify-center mt-6 space-x-2">
              <Button variant="outline" className="px-6">Bill Monthly</Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6">Bill Yearly</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <Card className="p-8 border border-gray-200">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Basic</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$15</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <img src={checkmarkIcon} alt="Check" className="w-5 h-5 mr-3" />
                    <span>Get started with messaging</span>
                  </li>
                  <li className="flex items-center">
                    <img src={checkmarkIcon} alt="Check" className="w-5 h-5 mr-3" />
                    <span>Flexible team meetings</span>
                  </li>
                  <li className="flex items-center">
                    <img src={checkmarkIcon} alt="Check" className="w-5 h-5 mr-3" />
                    <span>5 TB cloud storage</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Start Free Trial
                </Button>
              </div>
            </Card>

            {/* Pro Plan - Highlighted */}
            <Card className="p-8 border-2 border-orange-500 relative bg-gradient-to-b from-orange-50 to-white overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <img 
                  src={gradientBg} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white px-4 py-1">Most Popular</Badge>
                </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$30</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <img src={checkmarkIcon} alt="Check" className="w-5 h-5 mr-3" />
                    <span>All features in Basic</span>
                  </li>
                  <li className="flex items-center">
                    <img src={checkmarkIcon} alt="Check" className="w-5 h-5 mr-3" />
                    <span>Flexible call scheduling</span>
                  </li>
                  <li className="flex items-center">
                    <img src={checkmarkIcon} alt="Check" className="w-5 h-5 mr-3" />
                    <span>15 TB cloud storage</span>
                  </li>
                </ul>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Start Free Trial
                </Button>
              </div>
              </div>
            </Card>

            {/* Business Plan */}
            <Card className="p-8 border border-gray-200">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Business</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$45</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <img src={checkmarkIcon} alt="Check" className="w-5 h-5 mr-3" />
                    <span>All features in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <img src={checkmarkIcon} alt="Check" className="w-5 h-5 mr-3" />
                    <span>Growth tracking & reporting</span>
                  </li>
                  <li className="flex items-center">
                    <img src={checkmarkIcon} alt="Check" className="w-5 h-5 mr-3" />
                    <span>Unlimited cloud storage</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Start Free Trial
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Testimonials */}
            <div>
              <h2 className="text-3xl font-bold mb-8">People are Saying About Scheduled Pro</h2>
              
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={ratingStars} 
                      alt="4.9/5 rating" 
                      className="h-8"
                    />
                  </div>
                  <p className="mb-4">"Everything you need to grow your business with advanced features and seamless integration."</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold">Sarah Johnson</p>
                      <p className="text-sm opacity-80">Business Owner</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-8 space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white"></div>
                </div>
                <p className="text-sm">More than 2000+ teams use our platform</p>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-white rounded-2xl p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-6">Ready to get started?</h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg">
                  Get Started Now
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="ml-3 text-xl font-bold text-gray-900">Scheduled Pro</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Get started with Scheduled Pro today and transform your business operations with our comprehensive platform.
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Get Started Now
              </Button>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900">Live Chat</a></li>
                <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900">Community</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About Us</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900">Press</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-900">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-gray-900">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 text-gray-600">
                <Globe className="w-5 h-5" />
                <span>English (United States)</span>
              </div>
              <p className="text-gray-600 mt-4 md:mt-0">
                &copy; 2024 Scheduled Pro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}