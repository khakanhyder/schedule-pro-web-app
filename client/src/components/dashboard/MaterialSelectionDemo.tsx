import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Palette, 
  Calculator, 
  Eye, 
  CheckCircle, 
  DollarSign,
  Home,
  Play
} from "lucide-react";

interface DemoStep {
  title: string;
  description: string;
  action: string;
  result: string;
}

export default function MaterialSelectionDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSteps: DemoStep[] = [
    {
      title: "Step 1: Choose Room Category",
      description: "Select material categories to customize (flooring, paint, tiles, fixtures, cabinets)",
      action: "Click on category tabs (Flooring, Paint, Tiles, etc.)",
      result: "Each tab shows different material options with pricing"
    },
    {
      title: "Step 2: Select Materials",
      description: "Choose specific materials from dropdown menus",
      action: "Select 'Oak Hardwood' from flooring dropdown",
      result: "3D room updates instantly with selected material color/texture"
    },
    {
      title: "Step 3: Real-time Preview",
      description: "See materials applied to 3D room in real-time",
      action: "Material appears on room surfaces immediately",
      result: "Visual feedback shows how materials look together"
    },
    {
      title: "Step 4: Cost Calculation",
      description: "Automatic cost estimation based on room dimensions",
      action: "Costs update automatically as you select materials",
      result: "Total project cost appears in bottom panel"
    },
    {
      title: "Step 5: Toggle Visibility",
      description: "Show/hide material layers using eye icons",
      action: "Click eye icon next to category names",
      result: "Toggle materials on/off to compare options"
    },
    {
      title: "Step 6: Save & Share",
      description: "Save configuration and share with clients",
      action: "Click 'Save View' button",
      result: "Generate client-ready project estimate"
    }
  ];

  const playDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= demoSteps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Material Selection System Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Interactive material selection for 3D room visualization
              </p>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  Real-time 3D Preview
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calculator className="h-3 w-3" />
                  Automatic Cost Estimation
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Layer Toggle Controls
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={playDemo} 
                disabled={isPlaying}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isPlaying ? 'Playing...' : 'Play Demo'}
              </Button>
              <Button variant="outline" onClick={resetDemo}>
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demoSteps.map((step, index) => (
          <Card 
            key={index}
            className={`transition-all ${
              index === currentStep 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : index < currentStep 
                  ? 'bg-green-50 border-green-200' 
                  : 'opacity-60'
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : index === currentStep ? (
                  <div className="h-5 w-5 rounded-full bg-blue-500 animate-pulse" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-gray-300" />
                )}
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-blue-600">ACTION:</span>
                    <span className="text-xs">{step.action}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-green-600">RESULT:</span>
                    <span className="text-xs">{step.result}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Material Selection Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Palette className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-medium">Visual Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from categorized materials with visual previews and detailed specifications
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <Eye className="h-6 w-6 text-green-600 mb-2" />
                <h3 className="font-medium">Real-time Preview</h3>
                <p className="text-sm text-muted-foreground">
                  See materials applied instantly to the 3D room model with accurate colors and textures
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Calculator className="h-6 w-6 text-purple-600 mb-2" />
                <h3 className="font-medium">Auto Calculation</h3>
                <p className="text-sm text-muted-foreground">
                  Automatic cost estimation based on room dimensions and material pricing
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Material Options */}
      <Card>
        <CardHeader>
          <CardTitle>Available Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Flooring</h4>
              <div className="space-y-1">
                {['Oak Hardwood', 'Marble Tiles', 'Luxury Vinyl'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                    <span>{item}</span>
                    <Badge variant="secondary">${(25 + i * 15).toFixed(2)}/sq ft</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Paint</h4>
              <div className="space-y-1">
                {['Warm White', 'Sage Green', 'Ocean Blue'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                    <span>{item}</span>
                    <Badge variant="secondary">${(8 + i * 3).toFixed(2)}/sq ft</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Fixtures</h4>
              <div className="space-y-1">
                {['Brushed Nickel', 'Matte Black', 'Chrome'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                    <span>{item}</span>
                    <Badge variant="secondary">${(150 + i * 50).toFixed(2)}/unit</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}