import { Bot, Clock, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIFeatures() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">AI Features</h2>
      
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">AI Features Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              We're working on exciting AI-powered features to help automate and enhance your business operations.
            </p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-blue-500" />
                <span className="text-sm">AI Voice Assistant for Appointments</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Smart Business Insights</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Automated Scheduling Optimization</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                Stay tuned for these powerful AI features that will transform how you manage your business!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}