import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Sparkles, CheckCircle } from "lucide-react";

interface QuickDemoButtonProps {
  onDemoStart: () => void;
}

export default function QuickDemoButton({ onDemoStart }: QuickDemoButtonProps) {
  const [isDemo, setIsDemo] = useState(false);

  const startDemo = () => {
    setIsDemo(true);
    onDemoStart();
    
    // Reset demo state after 5 seconds
    setTimeout(() => {
      setIsDemo(false);
    }, 5000);
  };

  return (
    <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-blue-600" />
          Quick Demo Mode
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Test the 3D room visualization instantly with pre-filled sample data. 
            No real email addresses required!
          </p>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              ✓ Sample Client Info
            </Badge>
            <Badge variant="outline" className="text-xs">
              ✓ Demo Materials
            </Badge>
            <Badge variant="outline" className="text-xs">
              ✓ 3D Preview Ready
            </Badge>
          </div>

          <Button 
            onClick={startDemo}
            disabled={isDemo}
            className="w-full flex items-center gap-2"
            size="sm"
          >
            {isDemo ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Demo Data Loaded!
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                Start Quick Demo
              </>
            )}
          </Button>
          
          {isDemo && (
            <div className="space-y-2">
              <p className="text-xs text-green-600 text-center">
                ✓ Demo data filled! Now click "Create New Project" to start.
              </p>
              <div className="text-xs text-gray-600 space-y-1">
                <div>📧 Client: demo@example.com</div>
                <div>🏠 Kitchen: 12×10×9 ft</div>
                <div>🎨 Materials: Pre-selected</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}