import { Link } from "wouter";
import { useIndustry, getTerminology } from "@/lib/industryContext";
import { useCustomImages } from "@/hooks/useCustomImages";
import { ImageEditor } from "@/components/ui/image-editor";
import { useState } from "react";
import { Edit3 } from "lucide-react";

// Define hero data for each industry (mapped to industryContext IDs)
const heroContent = {
  beauty: {
    background: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    heading: "Your Perfect Hair Awaits",
    subheading: "Professional styling services tailored to your unique look",
    buttonText: "Book Appointment"
  },
  wellness: {
    background: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    heading: "Relaxation & Rejuvenation",
    subheading: "Therapeutic wellness treatments to restore balance to your body and mind",
    buttonText: "Book a Session"
  },
  home_services: {
    background: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    heading: "Craftsmanship That Lasts",
    subheading: "Professional skilled-trades services with guaranteed quality and expertise",
    buttonText: "Request a Job"
  },
  pet_care: {
    background: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    heading: "Loving Care for Your Pets",
    subheading: "Professional pet services with the attention and love your furry friends deserve",
    buttonText: "Book Pet Care"
  },
  creative: {
    background: "https://images.unsplash.com/photo-1496347646636-ea47f7d6b37b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    heading: "Elevate Your Creative Vision",
    subheading: "Professional creative services and artistic collaboration for modern creators",
    buttonText: "Book a Session"
  },
  custom: {
    background: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    heading: "Excellence in Every Detail",
    subheading: "Premium professional services customized to your specific requirements",
    buttonText: "Book Now"
  }
};

export default function Hero() {
  const { selectedIndustry } = useIndustry();
  const { customImages, updateCustomImages } = useCustomImages();
  const [isEditing, setIsEditing] = useState(false);
  const terms = getTerminology(selectedIndustry);
  
  // Get the content for the selected industry
  const content = heroContent[selectedIndustry.id as keyof typeof heroContent] || heroContent.custom;
  
  // Use custom hero image if available, otherwise fall back to template
  const backgroundImage = customImages.heroImage || content.background;

  const handleImageSave = (newImageUrl: string) => {
    updateCustomImages({
      ...customImages,
      heroImage: newImageUrl
    });
  };
  
  // Create a button text based on terminology
  const buttonText = terms.appointment === "appointment" ? "Book Appointment" :
                     terms.appointment === "job" ? "Schedule a Job" :
                     terms.appointment === "session" ? "Book a Session" :
                     `Book ${terms.appointment.charAt(0).toUpperCase() + terms.appointment.slice(1)}`;
  
  return (
    <section 
      className="relative h-[500px] bg-cover bg-center group cursor-pointer" 
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      onClick={() => setIsEditing(true)}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Edit Button - appears on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 flex items-center gap-2 text-white">
          <Edit3 className="h-4 w-4" />
          <span className="text-sm font-medium">Edit Image</span>
        </div>
      </div>
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4"
          style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.5)" }}
        >
          {content.heading}
        </h1>
        <p 
          className="text-xl text-white mb-8 max-w-2xl"
          style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.5)" }}
        >
          {content.subheading}
        </p>
        <Link href="/booking">
          <div 
            className="bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-full transition duration-300 text-lg cursor-pointer shadow-lg hover:scale-105"
            style={{ 
              backgroundColor: selectedIndustry.primaryColor, 
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)" 
            }}
          >
            {buttonText}
          </div>
        </Link>
      </div>
      
      {/* Image Editor Modal */}
      <ImageEditor
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        currentImage={backgroundImage}
        onSave={handleImageSave}
        title="Hero Image"
      />
    </section>
  );
}
