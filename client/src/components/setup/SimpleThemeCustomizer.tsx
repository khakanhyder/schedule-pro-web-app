import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Palette, Eye } from "lucide-react";
import { useIndustry } from "@/lib/industryContext";
import { useTheme } from "@/lib/themeContext";
import { useToast } from "@/hooks/use-toast";

interface SimpleThemeCustomizerProps {
  selectedTheme: string | null;
  onThemeSelect: (theme: string) => void;
}

export default function SimpleThemeCustomizer({ selectedTheme, onThemeSelect }: SimpleThemeCustomizerProps) {
  const { selectedIndustry } = useIndustry();
  const { applyTheme } = useTheme();
  const { toast } = useToast();

  const handleThemeSelect = (themeId: string) => {
    // Apply the theme immediately when selected
    applyTheme(themeId, selectedIndustry.id);
    onThemeSelect(themeId);
    
    toast({
      title: "Theme Applied",
      description: "Your theme has been updated. You can see the changes on your pages."
    });
  };

  const getThemePresets = () => {
    switch (selectedIndustry.id) {
      case 'beauty':
        return [
          {
            id: 'feminine-elegant',
            name: 'Feminine & Elegant',
            description: 'Perfect for upscale salons with pink and rose gold accents',
            primaryColor: '#EC4899',
            accentColor: '#FDF2F8',
            preview: 'Rose gold with soft curves'
          },
          {
            id: 'luxury-spa',
            name: 'Luxury Spa',
            description: 'High-end spa experience with purple tones',
            primaryColor: '#8B5CF6',
            accentColor: '#F3E8FF',
            preview: 'Purple luxury with elegant fonts'
          },
          {
            id: 'modern-clean',
            name: 'Modern Clean',
            description: 'Clean and professional while maintaining appeal',
            primaryColor: '#EC4899',
            accentColor: '#F8FAFC',
            preview: 'Pink with clean minimalist design'
          }
        ];
      case 'trades':
        return [
          {
            id: 'industrial-bold',
            name: 'Industrial Bold',
            description: 'Strong, masculine design for contractors',
            primaryColor: '#1F2937',
            accentColor: '#F3F4F6',
            preview: 'Dark gray with bold typography'
          },
          {
            id: 'safety-orange',
            name: 'Safety Orange',
            description: 'High-visibility orange with industrial strength',
            primaryColor: '#F97316',
            accentColor: '#FEF3C7',
            preview: 'Orange with industrial patterns'
          },
          {
            id: 'professional-steel',
            name: 'Professional Steel',
            description: 'Clean, professional with steel-like reliability',
            primaryColor: '#374151',
            accentColor: '#E5E7EB',
            preview: 'Steel gray with professional layout'
          }
        ];
      case 'wellness':
        return [
          {
            id: 'calming-green',
            name: 'Calming Green',
            description: 'Peaceful green tones for wellness practices',
            primaryColor: '#059669',
            accentColor: '#ECFDF5',
            preview: 'Green with nature elements'
          },
          {
            id: 'healing-blue',
            name: 'Healing Blue',
            description: 'Serene blue for therapeutic environments',
            primaryColor: '#0EA5E9',
            accentColor: '#F0F9FF',
            preview: 'Blue with calming design'
          },
          {
            id: 'holistic-purple',
            name: 'Holistic Purple',
            description: 'Spiritual purple for alternative wellness',
            primaryColor: '#8B5CF6',
            accentColor: '#F3E8FF',
            preview: 'Purple with healing symbols'
          }
        ];
      case 'pet-care':
        return [
          {
            id: 'playful-orange',
            name: 'Playful Orange',
            description: 'Fun and energetic for pet services',
            primaryColor: '#F59E0B',
            accentColor: '#FEF3C7',
            preview: 'Orange with paw print accents'
          },
          {
            id: 'veterinary-clean',
            name: 'Veterinary Clean',
            description: 'Professional medical appearance',
            primaryColor: '#10B981',
            accentColor: '#D1FAE5',
            preview: 'Clean green with medical styling'
          },
          {
            id: 'pet-boutique',
            name: 'Pet Boutique',
            description: 'Upscale boutique feel for premium services',
            primaryColor: '#EC4899',
            accentColor: '#FDF2F8',
            preview: 'Pink with luxury pet elements'
          }
        ];
      case 'creative':
        return [
          {
            id: 'artistic-purple',
            name: 'Artistic Purple',
            description: 'Creative and inspiring for artists',
            primaryColor: '#8B5CF6',
            accentColor: '#F3E8FF',
            preview: 'Purple with artistic brushes'
          },
          {
            id: 'designer-pink',
            name: 'Designer Pink',
            description: 'Modern design aesthetic',
            primaryColor: '#EC4899',
            accentColor: '#FDF2F8',
            preview: 'Pink with creative frames'
          },
          {
            id: 'photographer-black',
            name: 'Photographer Black',
            description: 'Elegant black for photography studios',
            primaryColor: '#1F2937',
            accentColor: '#F9FAFB',
            preview: 'Black with gallery elements'
          }
        ];
      default:
        return [
          {
            id: 'default-blue',
            name: 'Professional Blue',
            description: 'Clean and professional appearance',
            primaryColor: '#3B82F6',
            accentColor: '#EFF6FF',
            preview: 'Blue with professional styling'
          }
        ];
    }
  };

  const presets = getThemePresets();

  // This component is now controlled by the parent, so we don't need the apply handler
  // The parent Setup.tsx handles the completion logic

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold">{selectedIndustry.name} Theme Customizer</h2>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Industry-Specific
        </Badge>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
        <h3 className="font-medium mb-2">Tailored for Your Industry</h3>
        <p className="text-sm text-muted-foreground">
          Choose from themes specifically designed for {selectedIndustry.name} businesses. 
          Each theme is crafted to appeal to your target clientele and reflect your industry's aesthetic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map((preset) => (
          <Card 
            key={preset.id}
            className={`cursor-pointer border-2 transition-all ${
              selectedTheme === preset.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => handleThemeSelect(preset.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: preset.primaryColor }}
                />
                <CardTitle className="text-lg">{preset.name}</CardTitle>
              </div>
              <CardDescription className="text-sm">
                {preset.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div 
                className="w-full h-20 rounded-lg border-2 mb-3 p-3 flex items-center justify-center text-sm font-medium"
                style={{ 
                  backgroundColor: preset.accentColor,
                  borderColor: preset.primaryColor,
                  color: preset.primaryColor
                }}
              >
                {preset.preview}
              </div>
              {selectedTheme === preset.id && (
                <Badge className="w-full justify-center" style={{ backgroundColor: preset.primaryColor }}>
                  Selected
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTheme && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview
            </CardTitle>
            <CardDescription>
              How your dashboard will look with this theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const selected = presets.find(p => p.id === selectedTheme);
              return selected ? (
                <div 
                  className="p-6 rounded-lg border-2"
                  style={{ 
                    backgroundColor: selected.accentColor,
                    borderColor: selected.primaryColor
                  }}
                >
                  <div 
                    className="text-xl font-bold mb-3"
                    style={{ color: selected.primaryColor }}
                  >
                    {selectedIndustry.name} Dashboard
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {selected.name} Theme Applied
                  </div>
                  <div 
                    className="w-full h-8 rounded mb-3"
                    style={{ backgroundColor: selected.primaryColor }}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div 
                      className="h-6 rounded"
                      style={{ backgroundColor: selected.primaryColor, opacity: 0.7 }}
                    />
                    <div 
                      className="h-6 rounded"
                      style={{ backgroundColor: selected.primaryColor, opacity: 0.5 }}
                    />
                    <div 
                      className="h-6 rounded"
                      style={{ backgroundColor: selected.primaryColor, opacity: 0.3 }}
                    />
                  </div>
                </div>
              ) : null;
            })()}
          </CardContent>
        </Card>
      )}


    </div>
  );
}