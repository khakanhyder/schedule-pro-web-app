import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LogoCustomizerProps {
  onLogoChange: (logoUrl: string | null, businessName: string) => void;
  currentLogo?: string | null;
  currentBusinessName?: string;
}

export default function LogoCustomizer({ onLogoChange, currentLogo, currentBusinessName = "" }: LogoCustomizerProps) {
  const [businessName, setBusinessName] = useState(currentBusinessName);
  const [logoPreview, setLogoPreview] = useState<string | null>(currentLogo || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (PNG, JPG, etc.)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      onLogoChange(result, businessName);
      toast({
        title: "Logo Uploaded",
        description: "Your logo has been added successfully"
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    onLogoChange(null, businessName);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBusinessNameChange = (name: string) => {
    setBusinessName(name);
    onLogoChange(logoPreview, name);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Business Branding
          </CardTitle>
          <CardDescription>
            Add your business name and logo to personalize your app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              placeholder="Enter your business name"
              value={businessName}
              onChange={(e) => handleBusinessNameChange(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Business Logo</Label>
            
            {logoPreview ? (
              <div className="relative">
                <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2"
                  onClick={removeLogo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-1">
                  Drag and drop your logo here, or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Preview */}
          {(businessName || logoPreview) && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-4 border rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  {logoPreview && (
                    <img 
                      src={logoPreview} 
                      alt="Logo" 
                      className="h-8 w-8 object-contain"
                    />
                  )}
                  <span className="font-semibold text-lg">
                    {businessName || "Your Business Name"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}