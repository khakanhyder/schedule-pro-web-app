import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Upload, Image as ImageIcon, Check, Star, Palette, Camera, 
  Scissors, Heart, Wrench, Leaf, Home, Edit3, Eye, Users
} from "lucide-react";
import { useIndustry, industryTemplates } from "@/lib/industryContext";

interface ImageSlot {
  id: string;
  name: string;
  description: string;
  location: string;
  size: string;
  defaultImage: string;
  customImage?: string;
  isUploaded?: boolean;
}

const industryImageSlots = {
  beauty: {
    icon: Scissors,
    color: "#4f46e5",
    slots: [
      {
        id: "hero-background",
        name: "Hero Background",
        description: "Main background image on homepage",
        location: "Homepage header - first thing clients see",
        size: "1920x1080px",
        defaultImage: "Modern salon interior with elegant styling stations"
      },
      {
        id: "about-team",
        name: "Team Photo",
        description: "Professional team image",
        location: "About section and booking page",
        size: "800x600px", 
        defaultImage: "Professional stylists with warm, welcoming smiles"
      },
      {
        id: "services-showcase",
        name: "Services Showcase",
        description: "Before/after or service gallery",
        location: "Services page and testimonials",
        size: "600x400px",
        defaultImage: "Beautiful hair transformation results"
      },
      {
        id: "workspace",
        name: "Salon Interior",
        description: "Your actual workspace",
        location: "Contact page and social media",
        size: "800x500px",
        defaultImage: "Clean, professional salon environment"
      }
    ]
  },
  
  petServices: {
    icon: Heart,
    color: "#059669",
    slots: [
      {
        id: "hero-background",
        name: "Hero Background", 
        description: "Main background with happy pets",
        location: "Homepage header - first impression",
        size: "1920x1080px",
        defaultImage: "Happy dogs in professional grooming environment"
      },
      {
        id: "groomer-profile",
        name: "Pet Care Expert",
        description: "You with pets you care for",
        location: "About section and booking confirmation",
        size: "800x600px",
        defaultImage: "Professional pet groomer with gentle demeanor"
      },
      {
        id: "transformation-gallery",
        name: "Grooming Results",
        description: "Before/after pet transformations",
        location: "Services gallery and testimonials",
        size: "600x400px", 
        defaultImage: "Amazing pet grooming transformations"
      },
      {
        id: "facility-tour",
        name: "Pet Care Facility",
        description: "Your grooming space and equipment",
        location: "Contact page and facility information",
        size: "800x500px",
        defaultImage: "Clean, safe pet grooming facility"
      }
    ]
  },
  
  skilledTrades: {
    icon: Wrench,
    color: "#ea580c",
    slots: [
      {
        id: "hero-background",
        name: "Hero Background",
        description: "Professional worksite or completed project",
        location: "Homepage header - builds immediate trust",
        size: "1920x1080px",
        defaultImage: "Professional contractor with quality tools and results"
      },
      {
        id: "contractor-profile",
        name: "Master Craftsman",
        description: "You with your tools and expertise",
        location: "About section and quote requests",
        size: "800x600px",
        defaultImage: "Experienced tradesperson demonstrating skill"
      },
      {
        id: "project-portfolio",
        name: "Quality Work",
        description: "Before/after project results",
        location: "Portfolio and testimonials section",
        size: "600x400px",
        defaultImage: "Impressive home improvement transformations"
      },
      {
        id: "work-in-progress",
        name: "Active Worksite",
        description: "Professional work environment",
        location: "Services page and contact information",
        size: "800x500px",
        defaultImage: "Organized, professional construction worksite"
      }
    ]
  },
  
  wellness: {
    icon: Leaf,
    color: "#059669", 
    slots: [
      {
        id: "hero-background",
        name: "Hero Background",
        description: "Peaceful, healing environment", 
        location: "Homepage header - creates calm first impression",
        size: "1920x1080px",
        defaultImage: "Serene wellness space with natural elements"
      },
      {
        id: "practitioner-profile",
        name: "Wellness Expert",
        description: "You in your healing practice",
        location: "About section and appointment booking",
        size: "800x600px",
        defaultImage: "Compassionate wellness practitioner"
      },
      {
        id: "treatment-results",
        name: "Wellness Journey",
        description: "Client progress and healing",
        location: "Services and success stories",
        size: "600x400px",
        defaultImage: "Peaceful clients experiencing wellness"
      },
      {
        id: "healing-space",
        name: "Treatment Room",
        description: "Your actual wellness environment",
        location: "Contact page and facility tour",
        size: "800x500px", 
        defaultImage: "Tranquil, professional wellness space"
      }
    ]
  },
  
  homeServices: {
    icon: Home,
    color: "#2563eb",
    slots: [
      {
        id: "hero-background",
        name: "Hero Background",
        description: "Professional team in action",
        location: "Homepage header - shows reliability",
        size: "1920x1080px",
        defaultImage: "Professional cleaning team with spotless results"
      },
      {
        id: "team-action",
        name: "Service Team",
        description: "Your team providing excellent service",
        location: "About section and service booking",
        size: "800x600px",
        defaultImage: "Dedicated home service professionals"
      },
      {
        id: "transformation-showcase",
        name: "Amazing Results",
        description: "Before/after home transformations",
        location: "Services gallery and testimonials",
        size: "600x400px",
        defaultImage: "Incredible home cleaning transformations"
      },
      {
        id: "satisfied-families",
        name: "Happy Clients",
        description: "Families enjoying clean homes",
        location: "Testimonials and contact page",
        size: "800x500px",
        defaultImage: "Families relaxing in beautifully maintained homes"
      }
    ]
  }
};

export default function VisualPreviewCustomizer() {
  const { selectedIndustry } = useIndustry();
  const [customImages, setCustomImages] = useState<Record<string, File>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [selectedSlot, setSelectedSlot] = useState<ImageSlot | null>(null);
  
  const currentTemplate = selectedIndustry || industryTemplates[0];
  const industryKey = currentTemplate.id as keyof typeof industryImageSlots;
  const industryData = industryImageSlots[industryKey] || industryImageSlots.beauty;
  
  const IconComponent = industryData.icon;
  
  const handleImageUpload = (slotId: string, file: File) => {
    setCustomImages(prev => ({
      ...prev,
      [slotId]: file
    }));
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviewUrls(prev => ({
      ...prev,
      [slotId]: previewUrl
    }));
    
    setSelectedSlot(null);
  };
  
  const removeCustomImage = (slotId: string) => {
    setCustomImages(prev => {
      const newImages = { ...prev };
      delete newImages[slotId];
      return newImages;
    });
    
    setPreviewUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[slotId];
      return newUrls;
    });
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
              <CardTitle className="text-xl">Preview & Customize Your Visual Brand</CardTitle>
              <CardDescription>
                Click on any image area below to see where it appears and upload your own photo
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Visual Preview Layout */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Your Website Preview</h3>
        
        {/* Homepage Hero Section */}
        <Card className="overflow-hidden">
          <div className="relative h-64 bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center">
            {previewUrls['hero-background'] ? (
              <img 
                src={previewUrls['hero-background']} 
                alt="Hero background"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold">{industryData.slots[0].defaultImage}</p>
              </div>
            )}
            
            {/* Clickable overlay */}
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center group"
                  onClick={() => setSelectedSlot(industryData.slots[0])}
                >
                  <div className="bg-white rounded-lg p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-6 w-6" style={{ color: industryData.color }} />
                    <span className="text-sm font-medium ml-2">Customize Background</span>
                  </div>
                </button>
              </DialogTrigger>
              
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    {industryData.slots[0].name}
                  </DialogTitle>
                  <DialogDescription>
                    <strong>Where it appears:</strong> {industryData.slots[0].location}
                    <br />
                    <strong>Recommended size:</strong> {industryData.slots[0].size}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Currently showing:</strong> {industryData.slots[0].defaultImage}
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="hero-upload" className="text-sm font-medium">
                      Upload Your Own Background Image
                    </Label>
                    <Input
                      id="hero-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload('hero-background', file);
                      }}
                      className="mt-2"
                    />
                  </div>
                  
                  {customImages['hero-background'] && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">Custom image uploaded</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => removeCustomImage('hero-background')}
                      >
                        Use Default
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            {customImages['hero-background'] && (
              <Badge className="absolute top-4 right-4 bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                Custom
              </Badge>
            )}
          </div>
          
          {/* Hero Content */}
          <div className="p-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Excellence in Every Detail</h1>
            <p className="text-muted-foreground mb-4">
              Experience premium {currentTemplate.name.toLowerCase()} services
            </p>
            <Button style={{ backgroundColor: industryData.color }}>
              Book Appointment
            </Button>
          </div>
        </Card>

        {/* Other Image Slots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {industryData.slots.slice(1).map((slot, index) => (
            <Card key={slot.id} className="overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                {previewUrls[slot.id] ? (
                  <img 
                    src={previewUrls[slot.id]} 
                    alt={slot.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">{slot.defaultImage}</p>
                  </div>
                )}
                
                {/* Clickable overlay */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button 
                      className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center group"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <div className="bg-white rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="h-5 w-5" style={{ color: industryData.color }} />
                      </div>
                    </button>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        {slot.name}
                      </DialogTitle>
                      <DialogDescription>
                        <strong>Where it appears:</strong> {slot.location}
                        <br />
                        <strong>Recommended size:</strong> {slot.size}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Currently showing:</strong> {slot.defaultImage}
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor={`${slot.id}-upload`} className="text-sm font-medium">
                          Upload Your Own {slot.name}
                        </Label>
                        <Input
                          id={`${slot.id}-upload`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(slot.id, file);
                          }}
                          className="mt-2"
                        />
                      </div>
                      
                      {customImages[slot.id] && (
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-800">Custom image uploaded</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => removeCustomImage(slot.id)}
                          >
                            Use Default
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                {customImages[slot.id] && (
                  <Badge className="absolute top-2 right-2 bg-green-600 text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Custom
                  </Badge>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-sm">{slot.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{slot.description}</p>
                <p className="text-xs text-blue-600 mt-2">{slot.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Customization Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.keys(customImages).length === 0 ? (
              <p className="text-muted-foreground">
                Using beautiful default images for your {currentTemplate.name.toLowerCase()} business. 
                Click any image above to upload your own branded photos.
              </p>
            ) : (
              <>
                <p className="text-green-700 font-medium">
                  {Object.keys(customImages).length} custom image{Object.keys(customImages).length > 1 ? 's' : ''} uploaded
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(customImages).map(slotId => {
                    const slot = industryData.slots.find(s => s.id === slotId);
                    return (
                      <Badge key={slotId} variant="outline" className="text-green-600 border-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        {slot?.name}
                      </Badge>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}