import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, BarChart3, Settings, Shield, Zap } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">SaaS Platform</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Scale Your Business with Our 
            <span className="text-blue-600"> SaaS Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Powerful tools, seamless workflows, and intelligent insights to help your business grow faster than ever before.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              Get Started Free
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-lg text-gray-600">Comprehensive tools designed for modern businesses</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Management</h3>
              <p className="text-gray-600">Collaborate seamlessly with your team members and manage permissions effortlessly.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Get deep insights into your business with comprehensive analytics and reporting.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
              <p className="text-gray-600">Connect with your favorite tools and streamline your workflow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-600">Choose the plan that's right for your business</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card key={plan.id} className="relative">
                  {plan.name === "Pro" && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/{plan.billing.toLowerCase()}</span>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.name === "Pro" ? "default" : "outline"}
                      onClick={() => handleGetStarted(plan.id)}
                    >
                      Get Started
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by thousands</h2>
            <p className="text-lg text-gray-600">See what our customers have to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  "This platform has revolutionized how we manage our business. The analytics are incredible!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">CEO, TechStart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  "The onboarding process was seamless, and we were up and running in minutes."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Mike Chen</p>
                    <p className="text-sm text-gray-600">Founder, GrowthCorp</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  "Customer support is outstanding. They're always there when we need them."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Emily Davis</p>
                    <p className="text-sm text-gray-600">COO, ScalePlus</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="ml-3 text-xl font-bold">SaaS Platform</h3>
              </div>
              <p className="text-gray-400">
                Empowering businesses with powerful tools and insights.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SaaS Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}