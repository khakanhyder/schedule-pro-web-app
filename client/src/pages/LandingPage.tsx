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
import profile1 from "@assets/Ellipse 54_1757064789129.png";
import profile2 from "@assets/Ellipse 55_1757064789130.png";
import profile3 from "@assets/Ellipse 56_1757064789130.png";
import profile4 from "@assets/Ellipse 57_1757064789131.png";
import playButton from "@assets/Group 215_1757064789132.png";

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
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left Column */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 
                1500s, when an unknown printer took a galley of type and scrambled it to 
                make a type specimen book.
              </p>
              
              {/* Ratings */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-2">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">4.9 / 5 rating</p>
                  <p className="text-sm text-gray-600">Google</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-2">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">4.8 / 5 rating</p>
                  <p className="text-sm text-gray-600">Trust Pilot</p>
                </div>
              </div>
            </div>

            {/* Right Column - Steps */}
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-6">
                  <img 
                    src={step1Frame} 
                    alt="Step 1" 
                    className="w-12 h-12"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Sign up & Register your business</h3>
                  <p className="text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mr-6">
                  <img 
                    src={step2Frame} 
                    alt="Step 2" 
                    className="w-12 h-12"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">We auto-generate your Appearance</h3>
                  <p className="text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mr-6">
                  <img 
                    src={step3Frame} 
                    alt="Step 3" 
                    className="w-12 h-12"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Share it with customers & start selling</h3>
                  <p className="text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
              </div>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Choose Plan</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">That's Right For You</h3>
            <p className="text-gray-600 mb-8">Choose plan that works best for you, feel free to contact us</p>
            
            {/* Toggle Buttons */}
            <div className="inline-flex bg-gray-100 rounded-lg p-1 mb-8">
              <button className="px-6 py-2 rounded-md text-gray-600 hover:text-gray-900">
                Bil Monthly
              </button>
              <button className="px-6 py-2 bg-blue-500 text-white rounded-md">
                Bil Yearly
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <Card className="p-8 border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <p className="text-sm text-gray-600 mb-8">Have a go and test your<br />superpowers</p>
              
              <div className="mb-8">
                <div className="relative inline-block">
                  <span className="text-5xl font-bold text-gray-900">15</span>
                  <span className="text-sm text-gray-400 absolute top-2 -left-3">$</span>
                </div>
              </div>
              
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center">
                  <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                  <span className="text-sm">2 Users</span>
                </li>
                <li className="flex items-center">
                  <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                  <span className="text-sm">2 Files</span>
                </li>
                <li className="flex items-center">
                  <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                  <span className="text-sm">Public Share & Comments</span>
                </li>
                <li className="flex items-center">
                  <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                  <span className="text-sm">Chat Support</span>
                </li>
                <li className="flex items-center">
                  <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                  <span className="text-sm">New income apps</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full">
                Signup for free
              </Button>
            </Card>

            {/* Pro Plan - Highlighted */}
            <Card className="p-0 border-none relative text-center transform scale-105 overflow-hidden rounded-xl">
              <div 
                className="absolute inset-0 w-full h-full rounded-xl"
                style={{
                  backgroundImage: `url(${gradientBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              
              <div className="relative z-10 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-sm text-white/90 mb-6">Experiment the power<br />of infinite possibilities</p>
                
                <div className="mb-4">
                  <div className="relative inline-block">
                    <span className="text-5xl font-bold text-white">30</span>
                    <span className="text-sm text-white/80 absolute top-2 -left-3">$</span>
                  </div>
                </div>
                <p className="text-xs text-white/80 mb-8">Save $50 a year</p>
                
                {/* White content box for features */}
                <div className="bg-white rounded-xl p-6 mb-6">
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center">
                      <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                      <span className="text-sm text-gray-900">4 Users</span>
                    </li>
                    <li className="flex items-center">
                      <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                      <span className="text-sm text-gray-900">All apps</span>
                    </li>
                    <li className="flex items-center">
                      <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                      <span className="text-sm text-gray-900">Unlimited editable exports</span>
                    </li>
                    <li className="flex items-center">
                      <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                      <span className="text-sm text-gray-900">Folders and collaboration</span>
                    </li>
                    <li className="flex items-center">
                      <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                      <span className="text-sm text-gray-900">All incoming apps</span>
                    </li>
                  </ul>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl">
                  Go to pro
                </Button>
              </div>
            </Card>

            {/* Business Plan */}
            <Card className="p-8 border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
              <p className="text-sm text-gray-600 mb-8">Unveil new superpowers and<br />join the Design Leaque</p>
              
              <div className="mb-8">
                <div className="relative inline-block">
                  <span className="text-5xl font-bold text-gray-900">46</span>
                  <span className="text-sm text-gray-400 absolute top-2 -left-3">$</span>
                </div>
              </div>
              
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center">
                  <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                  <span className="text-sm">All the features of pro plan</span>
                </li>
                <li className="flex items-center">
                  <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                  <span className="text-sm">Account success Manager</span>
                </li>
                <li className="flex items-center">
                  <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                  <span className="text-sm">Single Sign-On (SSO)</span>
                </li>
                <li className="flex items-center">
                  <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                  <span className="text-sm">Co-conception pogram</span>
                </li>
                <li className="flex items-center">
                  <img src={checkmarkIcon} alt="Check" className="w-4 h-4 mr-3" />
                  <span className="text-sm">Collaboration-Soon</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full">
                Goto Business
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-400 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            {/* Left Column - Testimonials */}
            <div>
              <h2 className="text-3xl font-bold mb-6">People are Saying About Scheduled Pro</h2>
              <p className="text-white/90 mb-8 leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
              
              <div className="mb-8">
                <div className="text-6xl text-white/30 mb-4">"</div>
                <p className="text-lg mb-6 leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                </p>
                <p className="text-white/80 mb-6">— Ana Zaharija</p>
                
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    <img src={profile1} alt="Profile 1" className="w-12 h-12 rounded-full border-2 border-white" />
                    <img src={profile2} alt="Profile 2" className="w-12 h-12 rounded-full border-2 border-white" />
                    <img src={profile3} alt="Profile 3" className="w-12 h-12 rounded-full border-2 border-white" />
                    <img src={profile4} alt="Profile 4" className="w-12 h-12 rounded-full border-2 border-white" />
                  </div>
                  <img src={playButton} alt="Play" className="w-12 h-12 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-8">Get Started</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    placeholder="What are you say ?" 
                    rows={4}
                    className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white py-3 text-lg rounded-lg">
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/20 pt-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Company Info */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="ml-3 text-lg font-bold">Scheduled Pro</h4>
                </div>
                <p className="text-white/80 text-sm mb-4">
                  Get started now try our product
                </p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Enter your email here" 
                    className="flex-1 p-2 rounded-l-lg bg-white/20 text-white placeholder-white/70 focus:outline-none"
                  />
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-r-lg">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li><a href="#" className="hover:text-white">Help Centre</a></li>
                  <li><a href="#" className="hover:text-white">Account Information</a></li>
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Contact us</a></li>
                </ul>
              </div>

              {/* Help and Solution */}
              <div>
                <h4 className="font-semibold mb-4">Help and Solution</h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li><a href="#" className="hover:text-white">Talk to support</a></li>
                  <li><a href="#" className="hover:text-white">Support docs</a></li>
                  <li><a href="#" className="hover:text-white">System status</a></li>
                  <li><a href="#" className="hover:text-white">Covid responde</a></li>
                </ul>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li><a href="#" className="hover:text-white">Update</a></li>
                  <li><a href="#" className="hover:text-white">Security</a></li>
                  <li><a href="#" className="hover:text-white">Beta test</a></li>
                  <li><a href="#" className="hover:text-white">Pricing product</a></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/20">
              <p className="text-white/60 text-sm">
                © 2025 Scheduled Pro. Copyright and rights reserved
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-white/60 hover:text-white text-sm">Terms and Conditions</a>
                <a href="#" className="text-white/60 hover:text-white text-sm">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}