import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Palette, 
  Square, 
  DollarSign 
} from "lucide-react";

interface Material {
  id: number;
  name: string;
  category: string;
  color: string;
  price: number;
  unit: string;
  description: string;
}

interface ContractorMaterialSelectorProps {
  materials: Material[];
  selectedMaterials: Record<string, number>;
  onMaterialChange: (category: string, materialId: number) => void;
  roomDimensions: { length: number; width: number; height: number };
}

export default function ContractorMaterialSelector({
  materials,
  selectedMaterials,
  onMaterialChange,
  roomDimensions
}: ContractorMaterialSelectorProps) {
  
  // Simple material categories a contractor cares about
  const categories = [
    { id: 'flooring', name: 'Flooring', icon: Home, color: 'bg-amber-100 text-amber-800' },
    { id: 'paint', name: 'Wall Paint', icon: Palette, color: 'bg-blue-100 text-blue-800' },
    { id: 'cabinets', name: 'Cabinets', icon: Square, color: 'bg-green-100 text-green-800' },
    { id: 'tiles', name: 'Countertops', icon: Square, color: 'bg-purple-100 text-purple-800' }
  ];

  // Get materials for each category
  const getMaterialsForCategory = (category: string) => {
    return materials.filter(m => m.category === category);
  };

  // Calculate cost for a material selection
  const calculateCost = (category: string, materialId: number) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) return 0;

    const roomArea = roomDimensions.length * roomDimensions.width;
    const wallArea = 2 * (roomDimensions.length + roomDimensions.width) * roomDimensions.height;

    switch (category) {
      case 'flooring':
        return material.price * roomArea;
      case 'paint':
        return material.price * Math.ceil(wallArea / 400); // gallons needed
      case 'cabinets':
        return material.price * ((roomDimensions.length + roomDimensions.width) * 0.6); // linear feet
      case 'tiles':
        return material.price * (roomArea * 0.4); // countertop area
      default:
        return material.price;
    }
  };

  // Get total project cost
  const getTotalCost = () => {
    return Object.entries(selectedMaterials).reduce((total, [category, materialId]) => {
      return total + calculateCost(category, materialId);
    }, 0);
  };

  // Get color for material preview
  const getMaterialColor = (materialName: string) => {
    const colorMap: Record<string, string> = {
      'White Oak Engineered': '#E8D4B0',
      'Luxury Vinyl Plank': '#8B4513',
      'Hickory Hardwood': '#C19A6B',
      'Walnut Engineered': '#5D4037',
      'Sage Green Paint': '#9CAF88',
      'Navy Blue Paint': '#1B365D',
      'Warm Cream Paint': '#F5F5DC',
      'Sage Green Shaker': '#9CAF88',
      'Navy Blue Shaker': '#1B365D',
      'Warm White Shaker': '#F5F5DC',
      'Calacatta Quartz': '#F8F8FF',
      'Carrara Marble': '#FFFFFF',
      'Warm Gray Quartz': '#8E8E93'
    };
    return colorMap[materialName] || '#CCCCCC';
  };

  return (
    <div className="space-y-6">
      {/* Instructions for contractor */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">How to Use This System</h3>
        <p className="text-sm text-blue-700">
          Click on any material below to instantly see it applied to your 3D room preview. 
          Your client will see exactly what their finished room will look like.
        </p>
      </div>

      {/* Material Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(category => {
          const categoryMaterials = getMaterialsForCategory(category.id);
          const selectedMaterial = selectedMaterials[category.id] 
            ? materials.find(m => m.id === selectedMaterials[category.id])
            : null;
          
          return (
            <Card key={category.id} className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.name}
                  {selectedMaterial && (
                    <Badge className={category.color}>
                      Selected: {selectedMaterial.name}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryMaterials.map(material => {
                    const isSelected = selectedMaterials[category.id] === material.id;
                    const cost = calculateCost(category.id, material.id);
                    
                    return (
                      <div
                        key={material.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => onMaterialChange(category.id, material.id)}
                      >
                        <div className="flex items-center gap-3">
                          {/* Visual color preview */}
                          <div 
                            className="w-12 h-12 rounded-lg border-2 border-gray-300 flex-shrink-0"
                            style={{ backgroundColor: getMaterialColor(material.name) }}
                          />
                          
                          {/* Material info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900 truncate">
                                {material.name}
                              </h4>
                              <div className="flex items-center gap-1 text-green-600">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-semibold">{cost.toLocaleString()}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {material.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${material.price}/{material.unit}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Total Cost Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Total Project Cost
              </h3>
              <p className="text-sm text-green-700">
                Materials only • {roomDimensions.length}' × {roomDimensions.width}' room
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-900">
                ${getTotalCost().toLocaleString()}
              </div>
              <p className="text-sm text-green-700">
                + Labor (quoted separately)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action reminder */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          💡 <strong>Tip:</strong> Your 3D room preview updates automatically as you select materials. 
          Use this to show clients exactly what their finished room will look like!
        </p>
      </div>
    </div>
  );
}