import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, LogIn } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function TeamLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);

    try {
      console.log("Attempting team login for:", email);
      const response = await apiRequest("/api/auth/team-login", "POST", {
        email,
        password,
      }) as any;

      console.log("Login response:", response);

      if (response && response.teamMember && response.client) {
        // Store team member session data
        const sessionData = {
          teamMember: response.teamMember,
          client: response.client,
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem("teamMemberSession", JSON.stringify(sessionData));
        console.log("Session stored, redirecting to team dashboard");

        toast({
          title: "Login successful",
          description: `Welcome back, ${response.teamMember.name}!`,
        });

        // Use setTimeout to ensure state updates complete before redirect
        setTimeout(() => {
          setLocation("/team-dashboard");
        }, 100);
      } else {
        console.error("Invalid response structure:", response);
        toast({
          title: "Login failed",
          description: "Invalid response from server.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your email and password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Team Member Login</CardTitle>
          <CardDescription>
            Enter your team member credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email || !password}
            >
              <LogIn className="h-4 w-4 mr-2" />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          {/* Demo Credentials */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm font-medium text-blue-800 mb-2">Demo Team Member:</p>
            <div className="text-sm text-blue-700 space-y-1">
              <p>Email: khisal@test.com</p>
              <p>Password: password123</p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Business owner?{" "}
              <button
                onClick={() => setLocation("/client-login")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}