import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Scissors, HardHat, Heart, Check, Apple, Mail } from 'lucide-react';
import { useState } from 'react';

export default function Marketing() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo request submitted - would show toast notification
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Scheduled Pros</h1>
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
            <p className="text-xl text-gray-600">Pre-configured templates for professional service providers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Scissors className="text-white h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-gray-900">Beauty Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Salon management, client history, service tracking, and automated marketing for beauty experts.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <HardHat className="text-white h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-gray-900">Contractors</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Project management, job estimation, material tracking, and client communication for home service pros.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="text-white h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-gray-900">Wellness Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Health tracking, treatment plans, appointment optimization, and wellness program management.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Professional Pricing</h2>
            <p className="text-xl text-gray-600">Investment-grade platform with enterprise-level ROI</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Professional */}
            <Card className="border-2 border-gray-200 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Professional</CardTitle>
                <div className="text-4xl font-bold text-gray-900">$299<span className="text-lg text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Advanced scheduling system</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Client management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Basic AI insights</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Data migration</span>
                  </li>
                </ul>
                <Button className="w-full bg-gray-600 hover:bg-gray-700">
                  Start Professional
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="bg-blue-600 text-white transform scale-105 relative hover:shadow-xl transition-all">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-400 text-gray-900">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-white">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-white">$399<span className="text-lg text-blue-200">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-blue-200" />
                    <span className="text-blue-100">Everything in Professional</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-blue-200" />
                    <span className="text-blue-100">Advanced AI automation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-blue-200" />
                    <span className="text-blue-100">Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-blue-200" />
                    <span className="text-blue-100">Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                  Start Enterprise
                </Button>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="border-2 border-gray-200 hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Premium</CardTitle>
                <div className="text-4xl font-bold text-gray-900">$499<span className="text-lg text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Everything in Enterprise</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-gray-600">White-label options</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Dedicated account manager</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Custom development</span>
                  </li>
                </ul>
                <Button className="w-full bg-gray-600 hover:bg-gray-700">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Apple className="mr-2 h-5 w-5" />
              Download for iOS
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600">
              Request Demo
            </Button>
          </div>
          
          {/* Demo Form */}
          <Card id="demo" className="bg-blue-700 border-blue-500">
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
                  required
                />
                <Input 
                  type="email" 
                  placeholder="Business Email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white text-gray-900"
                  required
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