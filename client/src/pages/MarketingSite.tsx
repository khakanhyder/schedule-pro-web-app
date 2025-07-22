import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Scissors, HardHat, Spa, Paw, Palette, Settings, Brain, TrendingUp, Sync, Check, Apple, Mail } from 'lucide-react';
import { useState } from 'react';

export default function MarketingSite() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    message: ''
  });

  const industries = [
    {
      icon: Scissors,
      title: "Beauty Professionals",
      description: "Salon management, client history, service tracking, and automated marketing for beauty experts.",
      color: "from-pink-50 to-rose-50",
      borderColor: "border-pink-100",
      iconBg: "bg-pink-500"
    },
    {
      icon: HardHat,
      title: "Contractors",
      description: "Project management, job estimation, material tracking, and client communication for home service pros.",
      color: "from-orange-50 to-amber-50",
      borderColor: "border-orange-100",
      iconBg: "bg-orange-500"
    },
    {
      icon: Spa,
      title: "Wellness Professionals",
      description: "Health tracking, treatment plans, appointment optimization, and wellness program management.",
      color: "from-green-50 to-emerald-50",
      borderColor: "border-green-100",
      iconBg: "bg-green-500"
    },
    {
      icon: Paw,
      title: "Pet Care Professionals",
      description: "Pet profiles, health records, grooming schedules, and specialized care management.",
      color: "from-purple-50 to-violet-50",
      borderColor: "border-purple-100",
      iconBg: "bg-purple-500"
    },
    {
      icon: Palette,
      title: "Creative Professionals",
      description: "Project phases, portfolio management, client collaboration, and creative workflow optimization.",
      color: "from-indigo-50 to-blue-50",
      borderColor: "border-indigo-100",
      iconBg: "bg-indigo-500"
    },
    {
      icon: Settings,
      title: "Custom Business",
      description: "Fully customizable platform for unique business models with flexible workflows and automation.",
      color: "from-gray-50 to-slate-50",
      borderColor: "border-gray-100",
      iconBg: "bg-gray-500"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Predictive scheduling and business intelligence that adapts to your workflow.",
      iconBg: "bg-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Growth Analytics",
      description: "Track revenue, optimize pricing, and identify growth opportunities with precision.",
      iconBg: "bg-green-500"
    },
    {
      icon: Sync,
      title: "Seamless Migration",
      description: "Import from 12+ platforms including Vagaro, Booksy, Square, and GlossGenius.",
      iconBg: "bg-purple-500"
    }
  ];

  const pricingPlans = [
    {
      name: "Professional",
      price: 299,
      features: ["Advanced scheduling", "Client management", "Basic AI insights", "Data migration"],
      buttonStyle: "bg-gray-600 hover:bg-gray-700 text-white",
      buttonText: "Start Professional"
    },
    {
      name: "Enterprise",
      price: 399,
      features: ["Everything in Professional", "Advanced AI automation", "Custom integrations", "Priority support"],
      buttonStyle: "bg-white text-blue-600 hover:bg-gray-100",
      buttonText: "Start Enterprise",
      popular: true
    },
    {
      name: "Premium",
      price: 499,
      features: ["Everything in Enterprise", "White-label options", "Dedicated account manager", "Custom development"],
      buttonStyle: "bg-gray-600 hover:bg-gray-700 text-white",
      buttonText: "Contact Sales"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo request:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Scheduled Pros</h1>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Features</a>
                <a href="#industries" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Industries</a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Pricing</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#demo" className="text-blue-600 hover:text-blue-800 font-medium">Request Demo</a>
              <Button className="bg-blue-600 hover:bg-blue-700">Download App</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Built for <span className="text-blue-600">Professionals</span><br />
              Who Demand More
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The only business management platform that combines AI-powered scheduling, 
              comprehensive client management, and predictive business insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                <Apple className="mr-2 h-5 w-5" />
                Download Scheduled App
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-4">
                Request Live Demo
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Join 1000+ professionals who've transformed their business operations
            </p>
          </div>
        </div>
      </section>

      {/* Industry Focus */}
      <section id="industries" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Designed for Your Industry</h2>
            <p className="text-xl text-gray-600">Pre-configured templates and workflows for professional service providers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <Card key={index} className={`bg-gradient-to-br ${industry.color} ${industry.borderColor} border`}>
                <CardHeader>
                  <div className={`w-12 h-12 ${industry.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <industry.icon className="text-white h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{industry.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{industry.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Enterprise-Grade Features</h2>
            <p className="text-xl text-gray-600">Built for professionals who demand excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white shadow-sm">
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className="text-white h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Professional Pricing</h2>
            <p className="text-xl text-gray-600">Investment-grade platform with enterprise-level ROI</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`${plan.popular ? 'bg-blue-600 text-white transform scale-105 relative' : 'bg-white border-2 border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-400 text-gray-900">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className={`text-2xl ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.name}</CardTitle>
                  <div className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'} mb-6`}>
                    ${plan.price}<span className={`text-lg ${plan.popular ? 'text-blue-200' : 'text-gray-500'}`}>/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className={`mr-2 h-4 w-4 ${plan.popular ? 'text-blue-200' : 'text-green-500'}`} />
                        <span className={plan.popular ? 'text-blue-100' : 'text-gray-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.buttonStyle}`}>
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the professionals who've made the switch to intelligent business management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Apple className="mr-2 h-5 w-5" />
              Download for iOS
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600">
              Request Demo
            </Button>
          </div>
          
          {/* Demo Form */}
          <Card id="demo" className="mt-12 bg-blue-700 border-blue-500">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Request a Demo</CardTitle>
              <CardDescription className="text-blue-100">See how Scheduled Pros can transform your business operations</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <Input 
                  type="text" 
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white text-gray-900"
                />
                <Input 
                  type="email" 
                  placeholder="Business Email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white text-gray-900"
                />
                <Input 
                  type="text" 
                  placeholder="Business Type" 
                  value={formData.business}
                  onChange={(e) => setFormData({...formData, business: e.target.value})}
                  className="bg-white text-gray-900"
                />
                <Textarea 
                  placeholder="Tell us about your needs (optional)" 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="bg-white text-gray-900"
                  rows={3}
                />
                <Button type="submit" className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  <Mail className="mr-2 h-4 w-4" />
                  Request Demo
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Scheduled Pros</h3>
            <p className="text-gray-400 mb-4">Built for professionals who demand more</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white">Support</a>
            </div>
            <p className="text-gray-500 mt-4">&copy; 2025 Scheduled Pros. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}