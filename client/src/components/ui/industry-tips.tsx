import { useIndustry } from "@/lib/industryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Lightbulb, Camera, Users, Palette, Wrench } from "lucide-react";

export function IndustryTips() {
  const { selectedIndustry } = useIndustry();

  const industryTips = {
    beauty: {
      title: "Beauty & Salon Tips",
      icon: <Palette className="h-5 w-5" />,
      tips: [
        "Upload before/after photos to showcase your transformations",
        "Include photos of your salon's atmosphere and professional tools",
        "Add team photos to build trust with potential clients",
        "Keep service photos well-lit and focused on results"
      ]
    },
    wellness: {
      title: "Wellness & Spa Tips", 
      icon: <Users className="h-5 w-5" />,
      tips: [
        "Focus on creating a calming, peaceful atmosphere in your photos",
        "Show your treatment rooms and relaxation spaces",
        "Include images of natural elements and wellness products",
        "Highlight the serene environment clients will experience"
      ]
    },
    home_services: {
      title: "Contractor & Home Services Tips",
      icon: <Wrench className="h-5 w-5" />,
      tips: [
        "Before/after project photos are extremely powerful",
        "Show your team in action with professional equipment",
        "Include completed project galleries to demonstrate quality",
        "Use the 3D room builder to showcase planning capabilities"
      ]
    },
    pet_care: {
      title: "Pet Care Tips",
      icon: <Users className="h-5 w-5" />,
      tips: [
        "Photos of happy pets and satisfied owners work best",
        "Show your clean, safe facility and grooming stations",
        "Include action shots of pets being cared for",
        "Highlight your experience with different breeds and sizes"
      ]
    },
    creative: {
      title: "Creative Professional Tips",
      icon: <Camera className="h-5 w-5" />,
      tips: [
        "Showcase your best portfolio pieces prominently",
        "Include behind-the-scenes shots of your creative process",
        "Show your workspace and professional setup",
        "Highlight variety in your work and different project types"
      ]
    },
    custom: {
      title: "Professional Tips",
      icon: <Info className="h-5 w-5" />,
      tips: [
        "Use professional photos that represent your brand",
        "Include team photos to build personal connections",
        "Show your workspace or business location",
        "Focus on images that convey professionalism and quality"
      ]
    }
  };

  const currentTips = industryTips[selectedIndustry.id as keyof typeof industryTips] || industryTips.custom;

  return (
    <Card className="mt-6 bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          {currentTips.icon}
          {currentTips.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {currentTips.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-blue-700">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm">{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}