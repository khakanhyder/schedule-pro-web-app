import { useIndustry } from "@/lib/industryContext";
import { useCustomImages } from "@/hooks/useCustomImages";
import { ImageEditor } from "@/components/ui/image-editor";
import { useState } from "react";
import { Edit3 } from "lucide-react";

export default function Gallery() {
  const { selectedIndustry } = useIndustry();
  const { customImages, updateCustomImages } = useCustomImages();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Industry-specific gallery images
  const industryGalleryImages = {
    beauty: [
      {
        url: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Modern salon interior"
      },
      {
        url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Salon reception area"
      },
      {
        url: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Hair washing station"
      }
    ],
    wellness: [
      {
        url: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Massage therapy room"
      },
      {
        url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Yoga studio"
      },
      {
        url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Meditation space"
      }
    ],
    home_services: [
      {
        url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Modern kitchen renovation"
      },
      {
        url: "https://images.unsplash.com/photo-1565453006698-a17d83b9e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Bathroom remodel"
      },
      {
        url: "https://images.unsplash.com/photo-1558882224-dda166733046?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Custom deck installation"
      }
    ],
    pet_care: [
      {
        url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Pet grooming salon"
      },
      {
        url: "https://images.unsplash.com/photo-1541599468348-e96984315921?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Dog training area"
      },
      {
        url: "https://images.unsplash.com/photo-1444212477490-ca407925329e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Pet photography studio"
      }
    ],
    creative: [
      {
        url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Photography studio"
      },
      {
        url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Design workspace"
      },
      {
        url: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Art gallery space"
      }
    ],
    custom: [
      {
        url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Modern office space"
      },
      {
        url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Conference room"
      },
      {
        url: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        alt: "Waiting area"
      }
    ]
  };

  // Get the gallery images for the selected industry
  const defaultGalleryImages = industryGalleryImages[selectedIndustry.id as keyof typeof industryGalleryImages] || industryGalleryImages.custom;
  
  // Use custom gallery images if available, otherwise fall back to template images
  const galleryImages = customImages.galleryImages.length > 0 
    ? customImages.galleryImages.map((url, index) => ({ url, alt: `Gallery image ${index + 1}` }))
    : defaultGalleryImages;

  const sectionTitles = {
    beauty: "Our Salon",
    wellness: "Our Wellness Center",
    home_services: "Our Projects",
    pet_care: "Our Pet Care Facility",
    creative: "Our Studio",
    custom: "Our Workspace"
  };
  
  // Get the appropriate section title for this industry
  const sectionTitle = sectionTitles[selectedIndustry.id as keyof typeof sectionTitles] || "Our Facility";

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">{sectionTitle}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => setEditingIndex(index)}
            >
              <img 
                src={image.url} 
                alt={image.alt} 
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
              
              {/* Edit Button - appears on hover */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors">
                  <Edit3 className="h-4 w-4 text-white" />
                </div>
              </div>
              
              {/* Subtle edit indicator - always visible */}
              <div className="absolute top-2 left-2 opacity-15 group-hover:opacity-0 transition-opacity duration-200">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-1">
                  <Edit3 className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Image Editor Modal */}
      {editingIndex !== null && (
        <ImageEditor
          isOpen={editingIndex !== null}
          onClose={() => setEditingIndex(null)}
          currentImage={galleryImages[editingIndex].url}
          onSave={(newImageUrl) => {
            const currentGalleryImages = customImages.galleryImages || [];
            const newGalleryImages = [...currentGalleryImages];
            // Ensure array is long enough
            while (newGalleryImages.length <= editingIndex) {
              newGalleryImages.push('');
            }
            newGalleryImages[editingIndex] = newImageUrl;
            updateCustomImages({
              ...customImages,
              galleryImages: newGalleryImages
            });
            setEditingIndex(null);
          }}
          title={`Gallery Image ${editingIndex + 1}`}
        />
      )}
    </section>
  );
}
