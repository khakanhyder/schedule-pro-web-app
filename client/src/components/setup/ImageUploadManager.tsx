import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Star, 
  AlertCircle,
  Camera,
  Palette
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Industry } from "@/lib/industryContext";

interface ImageUploadManagerProps {
  selectedIndustry: Industry;
  onImagesUpdate: (images: CustomImages) => void;
}

export interface CustomImages {
  heroImage?: string;
  galleryImages: string[];
  serviceShowcaseImages: string[];
}

export default function ImageUploadManager({ selectedIndustry, onImagesUpdate }: ImageUploadManagerProps) {
  const [customImages, setCustomImages] = useState<CustomImages>({
    heroImage: undefined,
    galleryImages: [],
    serviceShowcaseImages: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File, type: 'hero' | 'gallery' | 'service') => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload only image files (JPG, PNG, WebP)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload images smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        
        let updatedImages = { ...customImages };
        
        if (type === 'hero') {
          updatedImages.heroImage = imageUrl;
        } else if (type === 'gallery') {
          updatedImages.galleryImages = [...updatedImages.galleryImages, imageUrl];
        } else if (type === 'service') {
          updatedImages.serviceShowcaseImages = [...updatedImages.serviceShowcaseImages, imageUrl];
        }
        
        setCustomImages(updatedImages);
        onImagesUpdate(updatedImages);
        
        toast({
          title: "Image uploaded successfully",
          description: `${type === 'hero' ? 'Hero' : type === 'gallery' ? 'Gallery' : 'Service'} image added to your template`
        });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (type: 'hero' | 'gallery' | 'service', index?: number) => {
    let updatedImages = { ...customImages };
    
    if (type === 'hero') {
      updatedImages.heroImage = undefined;
    } else if (type === 'gallery' && index !== undefined) {
      updatedImages.galleryImages.splice(index, 1);
    } else if (type === 'service' && index !== undefined) {
      updatedImages.serviceShowcaseImages.splice(index, 1);
    }
    
    setCustomImages(updatedImages);
    onImagesUpdate(updatedImages);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Customize Your Images</h3>
        <p className="text-sm text-muted-foreground">
          Upload your own photos to personalize your {selectedIndustry.name.toLowerCase()} template
        </p>
      </div>

      {/* Hero Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Main Hero Image
            <Badge variant="secondary">Required</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            This is the main image visitors see when they land on your page. Choose your best work!
          </div>
          
          {customImages.heroImage ? (
            <div className="relative">
              <img 
                src={customImages.heroImage} 
                alt="Hero" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeImage('hero')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <Label htmlFor="hero-upload" className="cursor-pointer">
                <Button variant="outline" disabled={isUploading}>
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload Hero Image'}
                </Button>
              </Label>
              <Input
                id="hero-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'hero');
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Portfolio Gallery
            <Badge variant="outline">{customImages.galleryImages.length}/6</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Showcase your best work with up to 6 portfolio images
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {customImages.galleryImages.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={image} 
                  alt={`Gallery ${index + 1}`} 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1"
                  onClick={() => removeImage('gallery', index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            {customImages.galleryImages.length < 6 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Label htmlFor="gallery-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" disabled={isUploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                </Label>
                <Input
                  id="gallery-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'gallery');
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Showcase Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Service Showcase
            <Badge variant="outline">{customImages.serviceShowcaseImages.length}/4</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Add images that represent your specific services (up to 4 images)
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {customImages.serviceShowcaseImages.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={image} 
                  alt={`Service ${index + 1}`} 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1"
                  onClick={() => removeImage('service', index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            {customImages.serviceShowcaseImages.length < 4 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Label htmlFor="service-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" disabled={isUploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                </Label>
                <Input
                  id="service-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'service');
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro Tips:</strong> Use high-quality images (1200x800px or larger) for best results. 
          Make sure all images are well-lit and showcase your professional work clearly.
        </AlertDescription>
      </Alert>
    </div>
  );
}