import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home,
  Palette,
  Square,
  Layers,
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

interface SimpleMaterialSelectorProps {
  materials: Material[];
  selectedMaterials: Record<string, number>;
  onMaterialChange: (category: string, materialId: number) => void;
  roomDimensions: { length: number; width: number; height: number };
}

export default function SimpleMaterialSelector({
  materials,
  selectedMaterials,
  onMaterialChange,
  roomDimensions
}: SimpleMaterialSelectorProps) {
  
  // Group materials by category
  const materialsByCategory = materials.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  // Category display info
  const categoryInfo = {
    flooring: { icon: Square, label: "Flooring", color: "bg-amber-50 border-amber-200" },
    cabinets: { icon: Home, label: "Cabinets", color: "bg-emerald-50 border-emerald-200" },
    tiles: { icon: Layers, label: "Countertops", color: "bg-blue-50 border-blue-200" },
    backsplash: { icon: Palette, label: "Backsplash", color: "bg-purple-50 border-purple-200" },
    paint: { icon: Palette, label: "Paint", color: "bg-pink-50 border-pink-200" }
  };

  // Calculate estimated cost
  const calculateCost = (category: string, materialId: number) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) return 0;

    let quantity = 0;
    if (category === 'flooring') {
      quantity = roomDimensions.length * roomDimensions.width;
    } else if (category === 'cabinets') {
      quantity = roomDimensions.length * 0.8 + 6; // Linear feet
    } else if (category === 'tiles') {
      quantity = (roomDimensions.length * 0.8 * 2.2) + (6 * 3.2); // Countertops
    } else if (category === 'backsplash') {
      quantity = roomDimensions.length * 0.8 * 1.5;
    } else if (category === 'paint') {
      quantity = Math.ceil((2 * (roomDimensions.length + roomDimensions.width) * roomDimensions.height) / 400);
    }

    return quantity * material.price;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choose Your Materials</h3>
        <p className="text-sm text-gray-600">Select materials for each category to see them in 3D</p>
      </div>

      <div className="grid gap-6">
        {Object.entries(materialsByCategory).map(([category, categoryMaterials]) => {
          const info = categoryInfo[category as keyof typeof categoryInfo];
          const Icon = info?.icon || Square;
          const selectedMaterial = categoryMaterials.find(m => m.id === selectedMaterials[category]);
          
          return (
            <Card key={category} className={`${info?.color || 'bg-gray-50 border-gray-200'}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-5 w-5" />
                  {info?.label || category}
                  {selectedMaterial && (
                    <Badge variant="secondary" className="ml-auto">
                      ${calculateCost(category, selectedMaterial.id).toLocaleString()}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoryMaterials.map((material) => (
                    <Button
                      key={material.id}
                      variant={selectedMaterials[category] === material.id ? "default" : "outline"}
                      className="h-auto p-3 flex items-center gap-3 justify-start"
                      onClick={() => onMaterialChange(category, material.id)}
                    >
                      <div 
                        className="w-6 h-6 rounded border-2 border-white shadow-sm flex-shrink-0"
                        style={{ backgroundColor: material.color }}
                      />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{material.name}</p>
                        <p className="text-xs text-gray-600">
                          ${material.price}/{material.unit}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>

                {selectedMaterial && (
                  <div className="mt-3 p-3 bg-white bg-opacity-60 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedMaterial.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Total estimate */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-slate-600" />
              <span className="font-semibold text-slate-900">Estimated Total</span>
            </div>
            <span className="text-xl font-bold text-slate-900">
              ${Object.entries(selectedMaterials).reduce((total, [category, materialId]) => {
                return total + calculateCost(category, materialId);
              }, 0).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Based on {roomDimensions.length}' × {roomDimensions.width}' kitchen
          </p>
        </CardContent>
      </Card>
    </div>
  );
}