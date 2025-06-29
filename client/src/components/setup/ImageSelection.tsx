import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, Image as ImageIcon, Check, Star, Palette, 
  Scissors, Heart, Wrench, Leaf, Home 
} from "lucide-react";
import { useIndustry, industryTemplates } from "@/lib/industryContext";

interface ImageOption {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'professional' | 'lifestyle' | 'workspace' | 'results';
}

const industryImageCollections = {
  beauty: {
    icon: Scissors,
    color: "#4f46e5",
    images: [
      {
        id: "beauty-salon-1",
        name: "Modern Salon Interior",
        description: "Clean, professional styling stations with natural lighting",
        url: "/api/placeholder/beauty-salon-modern",
        category: "workspace" as const
      },
      {
        id: "beauty-results-1", 
        name: "Hair Transformation",
        description: "Before/after styling showcase",
        url: "/api/placeholder/beauty-transformation",
        category: "results" as const
      },
      {
        id: "beauty-lifestyle-1",
        name: "Client Experience",
        description: "Happy client receiving premium service",
        url: "/api/placeholder/beauty-experience", 
        category: "lifestyle" as const
      },
      {
        id: "beauty-professional-1",
        name: "Stylist Portrait",
        description: "Professional stylist with tools and expertise",
        url: "/api/placeholder/beauty-professional",
        category: "professional" as const
      }
    ]
  },
  
  petServices: {
    icon: Heart,
    color: "#059669", 
    images: [
      {
        id: "pet-grooming-1",
        name: "Pet Grooming Studio",
        description: "Professional grooming station with happy pets",
        url: "/api/placeholder/pet-grooming-studio",
        category: "workspace" as const
      },
      {
        id: "pet-results-1",
        name: "Grooming Results", 
        description: "Before/after pet grooming transformation",
        url: "/api/placeholder/pet-transformation",
        category: "results" as const
      },
      {
        id: "pet-lifestyle-1",
        name: "Pet & Owner Joy",
        description: "Happy pet owners with their freshly groomed pets",
        url: "/api/placeholder/pet-happiness",
        category: "lifestyle" as const
      },
      {
        id: "pet-professional-1",
        name: "Pet Care Expert",
        description: "Professional pet groomer with expertise and care",
        url: "/api/placeholder/pet-professional", 
        category: "professional" as const
      }
    ]
  },
  
  skilledTrades: {
    icon: Wrench,
    color: "#ea580c",
    images: [
      {
        id: "trades-workspace-1",
        name: "Professional Worksite",
        description: "Clean, organized workspace with quality tools",
        url: "/api/placeholder/trades-workspace",
        category: "workspace" as const
      },
      {
        id: "trades-results-1",
        name: "Quality Craftsmanship",
        description: "Before/after home improvement results",
        url: "/api/placeholder/trades-results",
        category: "results" as const
      },
      {
        id: "trades-lifestyle-1", 
        name: "Satisfied Homeowners",
        description: "Happy clients with completed project",
        url: "/api/placeholder/trades-satisfaction",
        category: "lifestyle" as const
      },
      {
        id: "trades-professional-1",
        name: "Master Craftsman",
        description: "Experienced tradesperson with tools and expertise",
        url: "/api/placeholder/trades-professional",
        category: "professional" as const
      }
    ]
  },
  
  wellness: {
    icon: Leaf,
    color: "#059669",
    images: [
      {
        id: "wellness-space-1",
        name: "Tranquil Treatment Room",
        description: "Peaceful, healing environment for wellness",
        url: "/api/placeholder/wellness-space",
        category: "workspace" as const
      },
      {
        id: "wellness-results-1",
        name: "Wellness Journey",
        description: "Client transformation and healing progress",
        url: "/api/placeholder/wellness-transformation",
        category: "results" as const
      },
      {
        id: "wellness-lifestyle-1",
        name: "Holistic Wellbeing",
        description: "Clients experiencing peace and restoration",
        url: "/api/placeholder/wellness-experience",
        category: "lifestyle" as const
      },
      {
        id: "wellness-professional-1",
        name: "Wellness Practitioner",
        description: "Certified practitioner with healing expertise",
        url: "/api/placeholder/wellness-professional",
        category: "professional" as const
      }
    ]
  },
  
  homeServices: {
    icon: Home,
    color: "#2563eb",
    images: [
      {
        id: "home-service-1",
        name: "Professional Cleaning",
        description: "Team providing exceptional home cleaning service",
        url: "/api/placeholder/home-cleaning",
        category: "workspace" as const
      },
      {
        id: "home-results-1",
        name: "Spotless Results",
        description: "Before/after home cleaning transformation",
        url: "/api/placeholder/home-transformation",
        category: "results" as const
      },
      {
        id: "home-lifestyle-1",
        name: "Happy Families",
        description: "Families enjoying their clean, organized homes",
        url: "/api/placeholder/home-satisfaction",
        category: "lifestyle" as const
      },
      {
        id: "home-professional-1",
        name: "Service Professional",
        description: "Trusted home service professional with equipment",
        url: "/api/placeholder/home-professional",
        category: "professional" as const
      }
    ]
  }
};

export default function ImageSelection() {
  const { selectedIndustry } = useIndustry();
  const [selectedImages, setSelectedImages] = useState<Record<string, string>>({});
  const [customUploads, setCustomUploads] = useState<Record<string, File>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const currentTemplate = selectedIndustry || industryTemplates[0];
  const industryKey = currentTemplate.id as keyof typeof industryImageCollections;
  const industryData = industryImageCollections[industryKey] || industryImageCollections.beauty;
  
  const IconComponent = industryData.icon;
  
  const categories = [
    { id: 'all', name: 'All Images', description: 'View all available options' },
    { id: 'professional', name: 'Professional', description: 'Team and expertise photos' },
    { id: 'workspace', name: 'Workspace', description: 'Your business environment' },
    { id: 'results', name: 'Results', description: 'Before/after transformations' },
    { id: 'lifestyle', name: 'Lifestyle', description: 'Happy clients and experiences' }
  ];
  
  const filteredImages = selectedCategory === 'all' 
    ? industryData.images 
    : industryData.images.filter(img => img.category === selectedCategory);
  
  const handleImageSelect = (imageId: string, imageUrl: string) => {
    setSelectedImages(prev => ({
      ...prev,
      [imageId]: imageUrl
    }));
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setCustomUploads(prev => ({
        ...prev,
        [category]: file
      }));
      
      // Create preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setSelectedImages(prev => ({
        ...prev,
        [`custom-${category}`]: previewUrl
      }));
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="border-l-4" style={{ borderLeftColor: industryData.color }}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${industryData.color}15` }}
            >
              <IconComponent className="h-6 w-6" style={{ color: industryData.color }} />
            </div>
            <div>
              <CardTitle className="text-xl">Visual Brand Assets</CardTitle>
              <CardDescription>
                Choose professional images for your {currentTemplate.name.toLowerCase()} business or upload your own branded photos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex flex-col h-auto p-3"
            style={selectedCategory === category.id ? {
              backgroundColor: industryData.color,
              borderColor: industryData.color
            } : {}}
          >
            <span className="font-medium text-sm">{category.name}</span>
            <span className="text-xs opacity-75">{category.description}</span>
          </Button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <Card 
            key={image.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedImages[image.id] ? 'ring-2 ring-offset-2' : ''
            }`}
            style={selectedImages[image.id] ? { 
              ringColor: industryData.color 
            } : {}}
            onClick={() => handleImageSelect(image.id, image.url)}
          >
            <CardContent className="p-0">
              <div className="relative">
                {/* Placeholder for actual image */}
                <div 
                  className="h-48 rounded-t-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: industryData.color + '20' }}
                >
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium opacity-75">{image.name}</p>
                  </div>
                </div>
                
                {/* Selection Indicator */}
                {selectedImages[image.id] && (
                  <div 
                    className="absolute top-3 right-3 p-2 rounded-full text-white"
                    style={{ backgroundColor: industryData.color }}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                )}
                
                {/* Category Badge */}
                <Badge 
                  className="absolute top-3 left-3 text-white"
                  style={{ backgroundColor: industryData.color }}
                >
                  {image.category}
                </Badge>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold mb-1">{image.name}</h3>
                <p className="text-sm text-muted-foreground">{image.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Your Own Images
          </CardTitle>
          <CardDescription>
            Add your own branded photos to create a personalized experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.slice(1).map((category) => (
            <div key={category.id} className="space-y-3">
              <Label className="text-sm font-medium">
                {category.name} Image
                <span className="text-muted-foreground ml-2">({category.description})</span>
              </Label>
              
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, category.id)}
                  className="flex-1"
                />
                
                {customUploads[category.id] && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Check className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
              </div>
              
              {selectedImages[`custom-${category.id}`] && (
                <div className="text-sm text-muted-foreground">
                  Preview available - your custom {category.name.toLowerCase()} image will be used
                </div>
              )}
            </div>
          ))}
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Pro Tip</h4>
                <p className="text-sm text-blue-700">
                  High-quality images (1920x1080px or larger) work best. Show your actual workspace, 
                  team, and results for maximum client trust and engagement.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline">
          <Palette className="h-4 w-4 mr-2" />
          Preview Changes
        </Button>
        
        <Button 
          style={{ backgroundColor: industryData.color }}
          className="text-white"
        >
          Save Image Selection
          <Check className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}