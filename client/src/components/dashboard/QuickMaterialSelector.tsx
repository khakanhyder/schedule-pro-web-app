import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

interface Material {
  id: number;
  name: string;
  category: string;
  color: string;
  price: number;
  unit: string;
  description: string;
}

interface QuickMaterialSelectorProps {
  materials: Material[];
  selectedMaterials: Record<string, number>;
  onMaterialChange: (category: string, materialId: number) => void;
  roomDimensions: { length: number; width: number; height: number };
}

export default function QuickMaterialSelector({
  materials,
  selectedMaterials,
  onMaterialChange,
  roomDimensions
}: QuickMaterialSelectorProps) {
  
  // Group materials by category
  const materialsByCategory = materials.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  // Category display info with better organization
  const categoryInfo = {
    flooring: { label: "Flooring", order: 1 },
    paint: { label: "Paint", order: 2 },
    cabinets: { label: "Cabinets", order: 3 },
    tiles: { label: "Countertops", order: 4 },
    backsplash: { label: "Backsplash", order: 5 }
  };

  // Calculate quantity and cost for each category
  const calculateQuantityAndCost = (category: string, materialId: number) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) return { quantity: 0, cost: 0, unit: '' };

    let quantity = 0;
    let unit = material.unit;

    switch (category) {
      case 'flooring':
        quantity = Math.round(roomDimensions.length * roomDimensions.width * 10) / 10;
        unit = 'sq ft';
        break;
      case 'cabinets':
        quantity = Math.round((roomDimensions.length * 0.8 + 6) * 10) / 10;
        unit = 'linear ft';
        break;
      case 'tiles':
        // L-shaped countertops + island
        quantity = Math.round(((roomDimensions.length * 0.8 * 2.2) + (6 * 3.2)) * 10) / 10;
        unit = 'sq ft';
        break;
      case 'backsplash':
        quantity = Math.round((roomDimensions.length * 0.8 * 1.5) * 10) / 10;
        unit = 'sq ft';
        break;
      case 'paint':
        // Wall area minus doors/windows
        const wallArea = 2 * (roomDimensions.length + roomDimensions.width) * roomDimensions.height;
        quantity = Math.ceil(wallArea / 400); // Coverage per gallon
        unit = 'gallons';
        break;
    }

    return {
      quantity: quantity,
      cost: quantity * material.price,
      unit: unit
    };
  };

  // Get sorted categories
  const sortedCategories = Object.keys(materialsByCategory).sort((a, b) => {
    const orderA = categoryInfo[a as keyof typeof categoryInfo]?.order || 999;
    const orderB = categoryInfo[b as keyof typeof categoryInfo]?.order || 999;
    return orderA - orderB;
  });

  return (
    <div className="space-y-4">
      <div className="text-center border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Material Selection</h3>
        <p className="text-sm text-gray-600 mt-1">
          Click materials to apply them instantly to your 3D kitchen
        </p>
      </div>

      {sortedCategories.map((category) => {
        const categoryMaterials = materialsByCategory[category];
        const info = categoryInfo[category as keyof typeof categoryInfo];
        const selectedMaterial = categoryMaterials.find(m => m.id === selectedMaterials[category]);
        const { quantity, cost, unit } = selectedMaterial 
          ? calculateQuantityAndCost(category, selectedMaterial.id)
          : { quantity: 0, cost: 0, unit: '' };

        return (
          <Card key={category} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{info?.label || category}</h4>
                  {selectedMaterial && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">
                        {quantity.toLocaleString()} {unit}
                      </span>
                      <Badge variant="secondary">
                        ${cost.toLocaleString()}
                      </Badge>
                    </div>
                  )}
                </div>
                {selectedMaterial && (
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: selectedMaterial.color }}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {categoryMaterials.map((material) => {
                  const isSelected = selectedMaterials[category] === material.id;
                  
                  return (
                    <Button
                      key={material.id}
                      variant={isSelected ? "default" : "outline"}
                      className={`h-auto p-2 flex flex-col items-center gap-2 transition-all ${
                        isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                      }`}
                      onClick={() => onMaterialChange(category, material.id)}
                    >
                      <div className="relative">
                        <div 
                          className="w-8 h-8 rounded-md border-2 border-white shadow-sm"
                          style={{ backgroundColor: material.color }}
                        />
                        {isSelected && (
                          <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-blue-500 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-xs leading-tight">{material.name}</p>
                        <p className="text-xs text-gray-500">
                          ${material.price}/{material.unit}
                        </p>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {selectedMaterial && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700 font-medium">{selectedMaterial.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedMaterial.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Total Summary */}
      <Card className="bg-slate-900 text-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">Project Total</h4>
              <p className="text-sm text-slate-300">
                {roomDimensions.length}' × {roomDimensions.width}' kitchen
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                ${Object.entries(selectedMaterials).reduce((total, [category, materialId]) => {
                  const { cost } = calculateQuantityAndCost(category, materialId);
                  return total + cost;
                }, 0).toLocaleString()}
              </div>
              <p className="text-sm text-slate-300">Estimated cost</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}