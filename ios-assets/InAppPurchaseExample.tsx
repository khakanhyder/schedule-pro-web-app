import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// This is an example component showing how to integrate in-app purchases in iOS
// You'll need to install the proper plugin when working on your Mac:
// npm install @capacitor/core @capacitor-community/purchases

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

const pricingPlans: Plan[] = [
  {
    id: 'basic_monthly',
    name: 'Basic',
    description: 'Essential scheduling tools for small businesses',
    price: '$29.99/month',
    features: [
      'Unlimited appointments',
      'Client management',
      'Email notifications',
      'Standard support'
    ]
  },
  {
    id: 'professional_monthly',
    name: 'Professional',
    description: 'Advanced scheduling with additional business tools',
    price: '$79.99/month',
    features: [
      'Everything in Basic',
      'Online payments',
      'SMS notifications',
      'Priority support',
      'Advanced analytics'
    ]
  },
  {
    id: 'enterprise_monthly',
    name: 'Enterprise',
    description: 'Complete business management solution',
    price: '$199.99/month',
    features: [
      'Everything in Professional',
      'Multiple staff members',
      'Custom branding',
      'API access',
      'Dedicated account manager',
      'White-label booking page'
    ]
  }
];

export default function InAppPurchaseExample() {
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<any | null>(null);

  useEffect(() => {
    // Initialize RevenueCat Purchases (would be implemented on your Mac)
    const initializePurchases = async () => {
      try {
        // This would be implemented with actual code when working on your Mac
        /*
        import { Purchases } from '@capacitor-community/purchases';
        
        await Purchases.setDebugLogsEnabled(true);
        
        // Configure with your RevenueCat API keys
        await Purchases.configure({
          apiKey: 'YOUR_REVENUECAT_API_KEY',
          appUserID: 'user-id-here' // User unique ID from your auth system
        });
        
        setPurchases(Purchases);
        
        // Get current subscription status
        const { customerInfo } = await Purchases.getCustomerInfo();
        const activeSubscriptions = customerInfo.activeSubscriptions;
        
        if (activeSubscriptions.includes('basic_monthly')) {
          setCurrentPlan('basic_monthly');
        } else if (activeSubscriptions.includes('professional_monthly')) {
          setCurrentPlan('professional_monthly');
        } else if (activeSubscriptions.includes('enterprise_monthly')) {
          setCurrentPlan('enterprise_monthly');
        }
        */
        
        // Simulated implementation for demonstration
        console.log('Purchases initialized');
        setPurchases({});
      } catch (error) {
        console.error('Failed to initialize purchases:', error);
      }
    };
    
    initializePurchases();
  }, []);
  
  const handlePurchase = async (planId: string) => {
    setLoading(true);
    
    try {
      // This would be implemented with actual code when working on your Mac
      /*
      // Get offering for this plan
      const { offerings } = await purchases.getOfferings();
      
      if (!offerings.current) throw new Error('No offerings available');
      
      // Find the package for this plan
      const pkg = offerings.current.availablePackages.find(
        (p) => p.identifier === planId
      );
      
      if (!pkg) throw new Error(`Package ${planId} not found`);
      
      // Make the purchase
      const { customerInfo } = await purchases.purchasePackage(pkg);
      
      // Update subscription status
      if (customerInfo.activeSubscriptions.includes(planId)) {
        setCurrentPlan(planId);
        // Update user's subscription in your backend
      }
      */
      
      // Simulated implementation for demonstration
      console.log(`Purchasing plan: ${planId}`);
      setTimeout(() => {
        setCurrentPlan(planId);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Purchase failed:', error);
      setLoading(false);
    }
  };
  
  const restorePurchases = async () => {
    setLoading(true);
    
    try {
      // This would be implemented with actual code when working on your Mac
      /*
      // Restore purchases
      const { customerInfo } = await purchases.restorePurchases();
      
      // Update subscription status
      const activeSubscriptions = customerInfo.activeSubscriptions;
      
      if (activeSubscriptions.includes('basic_monthly')) {
        setCurrentPlan('basic_monthly');
      } else if (activeSubscriptions.includes('professional_monthly')) {
        setCurrentPlan('professional_monthly');
      } else if (activeSubscriptions.includes('enterprise_monthly')) {
        setCurrentPlan('enterprise_monthly');
      }
      */
      
      // Simulated implementation for demonstration
      console.log('Restoring purchases');
      setTimeout(() => {
        setLoading(false);
        alert('Purchases restored successfully');
      }, 1500);
    } catch (error) {
      console.error('Restore failed:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card key={plan.id} className={`border-2 ${currentPlan === plan.id ? 'border-primary' : 'border-gray-200'}`}>
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-green-500 mr-2" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handlePurchase(plan.id)}
                disabled={loading || currentPlan === plan.id}
              >
                {loading ? 'Processing...' : currentPlan === plan.id ? 'Current Plan' : 'Subscribe'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button variant="outline" onClick={restorePurchases} disabled={loading}>
          Restore Purchases
        </Button>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-12">
        <p>Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period.</p>
        <p>You can manage your subscriptions in your App Store account settings.</p>
      </div>
    </div>
  );
}