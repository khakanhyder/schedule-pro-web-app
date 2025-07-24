import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [adminKey, setAdminKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Test admin key by making a request to protected endpoint
      const response = await fetch('/api/admin/stats', {
        headers: {
          'x-admin-key': adminKey
        }
      });

      if (response.ok) {
        // Store admin key in sessionStorage (more secure than localStorage)
        sessionStorage.setItem('admin-key', adminKey);
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the Scheduled admin dashboard"
        });
        setLocation('/admin');
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid admin key. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to verify admin credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Enter your admin key to access the Scheduled dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminKey">Admin Key</Label>
              <div className="relative">
                <Input
                  id="adminKey"
                  type={showKey ? "text" : "password"}
                  placeholder="Enter admin key..."
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading || !adminKey}>
              {isLoading ? "Verifying..." : "Access Admin Dashboard"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/')}
              className="text-sm text-gray-500"
            >
              ← Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}