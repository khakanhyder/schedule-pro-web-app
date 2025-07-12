import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Home, 
  Square, 
  Wrench, 
  Box,
  Check,
  Eye,
  EyeOff,
  DollarSign,
  Info
} from "lucide-react";

interface Material {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  color: string;
  price: number;
  unit: string;
  brand: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

interface EnhancedMaterialSelectorProps {
  materials: Material[];
  selectedMaterials: Record<string, number>;
  onMaterialChange: (category: string, materialId: number) => void;
  roomDimensions: {
    length: number;
    width: number;
    height: number;
  };
}

export default function EnhancedMaterialSelector({
  materials,
  selectedMaterials,
  onMaterialChange,
  roomDimensions
}: EnhancedMaterialSelectorProps) {
  const [visibleCategories, setVisibleCategories] = useState<Record<string, boolean>>({
    flooring: true,
    paint: true,
    tiles: true,
    fixtures: true,
    cabinets: true
  });

  // Group materials by category
  const materialsByCategory = materials.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  // Calculate costs for each category
  const calculateCategoryCost = (category: string, materialId: number) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) return 0;

    const roomArea = roomDimensions.length * roomDimensions.width;
    const wallArea = 2 * (roomDimensions.length + roomDimensions.width) * roomDimensions.height;

    switch (category) {
      case 'flooring':
        return material.price * roomArea;
      case 'paint':
        const gallonsNeeded = Math.ceil(wallArea / 400);
        return material.price * gallonsNeeded;
      case 'tiles':
        return material.price * (roomArea * 0.3); // Backsplash area
      case 'fixtures':
        return material.price; // Per unit
      case 'cabinets':
        const linearFeet = (roomDimensions.length + roomDimensions.width) * 0.6;
        return material.price * linearFeet;
      default:
        return material.price;
    }
  };

  // Get total project cost
  const getTotalCost = () => {
    return Object.entries(selectedMaterials).reduce((total, [category, materialId]) => {
      return total + calculateCategoryCost(category, materialId);
    }, 0);
  };

  const toggleCategoryVisibility = (category: string) => {
    setVisibleCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'flooring': return <Home className="h-4 w-4" />;
      case 'paint': return <Palette className="h-4 w-4" />;
      case 'tiles': return <Square className="h-4 w-4" />;
      case 'fixtures': return <Wrench className="h-4 w-4" />;
      case 'cabinets': return <Box className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'flooring': return 'Flooring Options';
      case 'paint': return 'Paint Colors';
      case 'tiles': return 'Countertops & Backsplash';
      case 'fixtures': return 'Fixtures & Appliances';
      case 'cabinets': return 'Cabinet Styles';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <Tabs defaultValue="flooring" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          {Object.keys(materialsByCategory).map(category => (
            <TabsTrigger key={category} value={category} className="flex items-center gap-2">
              {getCategoryIcon(category)}
              <span className="hidden sm:inline">{getCategoryTitle(category)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(materialsByCategory).map(([category, categoryMaterials]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getCategoryIcon(category)}
                <h3 className="text-lg font-semibold">{getCategoryTitle(category)}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCategoryVisibility(category)}
                  className="ml-2"
                >
                  {visibleCategories[category] ? 
                    <Eye className="h-4 w-4" /> : 
                    <EyeOff className="h-4 w-4" />
                  }
                </Button>
              </div>
              
              {selectedMaterials[category] && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Selected
                </Badge>
              )}
            </div>

            {/* Material Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryMaterials.map(material => {
                const isSelected = selectedMaterials[category] === material.id;
                const cost = calculateCategoryCost(category, material.id);
                
                return (
                  <Card 
                    key={material.id} 
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => onMaterialChange(category, material.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{material.name}</CardTitle>
                        {isSelected && <Check className="h-4 w-4 text-blue-500" />}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {/* Material Image Preview */}
                      <div className="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3 flex items-center justify-center">
                        <div 
                          className="w-full h-full rounded-lg"
                          style={{ 
                            backgroundColor: material.color.toLowerCase().includes('#') 
                              ? material.color 
                              : getColorFromName(material.color)
                          }}
                        />
                      </div>
                      
                      {/* Material Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {material.brand}
                          </Badge>
                          <span className="text-xs text-gray-500">{material.subcategory}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {material.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              ${material.price}/{material.unit}
                            </span>
                          </div>
                          
                          <Badge variant="secondary" className="text-xs">
                            Total: ${cost.toLocaleString()}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Project Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(selectedMaterials).map(([category, materialId]) => {
              const material = materials.find(m => m.id === materialId);
              if (!material) return null;
              
              const cost = calculateCategoryCost(category, materialId);
              
              return (
                <div key={category} className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <div>
                      <p className="font-medium">{material.name}</p>
                      <p className="text-sm text-gray-500">{material.brand}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${cost.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{material.unit}</p>
                  </div>
                </div>
              );
            })}
            
            <Separator />
            
            <div className="flex items-center justify-between font-semibold text-lg">
              <span>Total Project Cost:</span>
              <span className="text-green-600">${getTotalCost().toLocaleString()}</span>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <Info className="h-4 w-4 inline mr-1" />
                This estimate includes materials only. Labor costs will be calculated separately based on your location and project complexity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to convert color names to hex codes
function getColorFromName(colorName: string): string {
  const colorMap: Record<string, string> = {
    'sage green': '#9CAF88',
    'navy blue': '#1B365D',
    'warm cream': '#F5F5DC',
    'olive green': '#808000',
    'dusty terracotta': '#CC8E70',
    'natural white oak': '#E8D4B0',
    'warm brown': '#8B4513',
    'natural hickory': '#C19A6B',
    'rich walnut': '#5D4037',
    'warm gray': '#8E8E93',
    'calacatta white': '#F8F8FF',
    'carrara white': '#FFFFFF',
    'light veined': '#F0F0F0',
    'marble white': '#FAFAFA',
    'matte black': '#2C2C2C',
    'brushed gold': '#D4AF37',
    'stainless steel': '#C0C0C0',
    'natural oak': '#D2B48C'
  };
  
  return colorMap[colorName.toLowerCase()] || '#CCCCCC';
}