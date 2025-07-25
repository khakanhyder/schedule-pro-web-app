import { useState, useEffect } from "react";
import type { CustomImages } from "@/components/setup/ImageUploadManager";

export function useCustomImages() {
  const [customImages, setCustomImages] = useState<CustomImages>({
    heroImage: undefined,
    galleryImages: [],
    serviceShowcaseImages: []
  });

  useEffect(() => {
    const savedImages = localStorage.getItem('customImages');
    if (savedImages) {
      try {
        const parsed = JSON.parse(savedImages);
        setCustomImages(parsed);
      } catch (error) {
        // Error parsing custom images
      }
    }
  }, []);

  const updateCustomImages = (images: CustomImages) => {
    setCustomImages(images);
    localStorage.setItem('customImages', JSON.stringify(images));
  };

  const hasCustomImages = () => {
    return customImages.heroImage || 
           customImages.galleryImages.length > 0 || 
           customImages.serviceShowcaseImages.length > 0;
  };

  return {
    customImages,
    updateCustomImages,
    hasCustomImages
  };
}