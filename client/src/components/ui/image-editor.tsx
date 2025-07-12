import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IndustryTips } from "./industry-tips";

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string;
  onSave: (imageUrl: string) => void;
  title: string;
}

export function ImageEditor({ isOpen, onClose, currentImage, onSave, title }: ImageEditorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const imageToSave = selectedImage || currentImage;
    onSave(imageToSave);
    toast({
      title: "Image Updated!",
      description: "Your image has been successfully saved.",
    });
    handleClose();
  };

  const handleKeepCurrent = () => {
    onSave(currentImage);
    handleClose();
  };

  const handleClose = () => {
    setSelectedImage(null);
    onClose();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit {title}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Image Preview */}
          <div className="text-center">
            <img 
              src={selectedImage || currentImage} 
              alt={title}
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="w-full h-12 text-base"
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload New Image"}
            </Button>

            <Button
              onClick={handleKeepCurrent}
              variant="outline"
              className="w-full h-12 text-base"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Keep Current Image
            </Button>
          </div>

          {/* Save/Cancel Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>

        {/* Industry Tips */}
        <IndustryTips />

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
}