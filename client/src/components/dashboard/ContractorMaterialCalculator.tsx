import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Palette, 
  Square, 
  DollarSign,
  Home,
  Settings,
  Info
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

interface MaterialQuantity {
  [category: string]: number;
}

interface ContractorMaterialCalculatorProps {
  materials: Material[];
  selectedMaterials: Record<string, number>;
  onMaterialChange: (category: string, materialId: number) => void;
  roomDimensions: { length: number; width: number; height: number };
  projectType: string;
}

export default function ContractorMaterialCalculator({
  materials,
  selectedMaterials,
  onMaterialChange,
  roomDimensions,
  projectType
}: ContractorMaterialCalculatorProps) {
  
  const [customQuantities, setCustomQuantities] = useState<MaterialQuantity>({});
  const [showCalculator, setShowCalculator] = useState(false);

  // Calculate actual quantities based on room type and dimensions
  const calculateQuantities = () => {
    const quantities: MaterialQuantity = {};

    if (projectType === 'kitchen') {
      // Kitchen-specific calculations
      const roomArea = roomDimensions.length * roomDimensions.width;
      const cabinetLinearFeet = roomDimensions.length * 0.8 + 6; // L-shaped kitchen
      const countertopArea = (roomDimensions.length * 0.8 * 2.2) + (6 * 3.2); // Main counter + island
      const backsplashArea = roomDimensions.length * 0.8 * 1.5; // Behind main cabinets
      const floorArea = roomArea - ((roomDimensions.length * 0.8 * 2) + (6 * 3)); // Minus cabinet footprints
      
      quantities.flooring = floorArea;
      quantities.cabinets = cabinetLinearFeet;
      quantities.tiles = countertopArea;
      quantities.backsplash = backsplashArea;
      quantities.paint = Math.ceil((2 * (roomDimensions.length + roomDimensions.width) * roomDimensions.height) / 400); // gallons
    } else if (projectType === 'bathroom') {
      // Bathroom-specific calculations
      const roomArea = roomDimensions.length * roomDimensions.width;
      const wallArea = 2 * (roomDimensions.length + roomDimensions.width) * roomDimensions.height;
      const tileArea = wallArea * 0.6; // 60% of walls typically tiled
      const vanityLinearFeet = Math.min(roomDimensions.length, roomDimensions.width) * 0.6;
      
      quantities.flooring = roomArea;
      quantities.tiles = tileArea;
      quantities.cabinets = vanityLinearFeet;
      quantities.paint = Math.ceil(wallArea * 0.4 / 400); // Only untiled walls
    } else {
      // General room calculations
      const roomArea = roomDimensions.length * roomDimensions.width;
      const wallArea = 2 * (roomDimensions.length + roomDimensions.width) * roomDimensions.height;
      
      quantities.flooring = roomArea;
      quantities.paint = Math.ceil(wallArea / 400);
    }

    return quantities;
  };

  const defaultQuantities = calculateQuantities();

  // Get effective quantity (custom override or calculated)
  const getEffectiveQuantity = (category: string): number => {
    return customQuantities[category] ?? defaultQuantities[category] ?? 0;
  };

  // Simple material categories for contractors
  const categories = [
    { 
      id: 'flooring', 
      name: 'Flooring', 
      icon: Home, 
      color: 'bg-amber-100 text-amber-800',
      unit: 'sq ft',
      description: 'Floor covering materials'
    },
    { 
      id: 'paint', 
      name: 'Paint', 
      icon: Palette, 
      color: 'bg-blue-100 text-blue-800',
      unit: 'gallons',
      description: 'Wall paint coverage'
    },
    { 
      id: 'cabinets', 
      name: 'Cabinets', 
      icon: Square, 
      color: 'bg-green-100 text-green-800',
      unit: 'linear ft',
      description: 'Cabinet installation'
    },
    { 
      id: 'tiles', 
      name: 'Countertops', 
      icon: Square, 
      color: 'bg-purple-100 text-purple-800',
      unit: 'sq ft',
      description: 'Countertop surfaces'
    }
  ];

  // Add backsplash for kitchen projects
  if (projectType === 'kitchen') {
    categories.push({
      id: 'backsplash',
      name: 'Backsplash',
      icon: Square,
      color: 'bg-indigo-100 text-indigo-800',
      unit: 'sq ft',
      description: 'Backsplash tile area'
    });
  }

  // Get materials for each category
  const getMaterialsForCategory = (category: string) => {
    if (category === 'backsplash') {
      // Use tile materials for backsplash
      return materials.filter(m => m.category === 'tiles');
    }
    return materials.filter(m => m.category === category);
  };

  // Calculate cost for a material selection
  const calculateCost = (category: string, materialId: number) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) return 0;

    const quantity = getEffectiveQuantity(category);
    return material.price * quantity;
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

  // Handle custom quantity change
  const handleQuantityChange = (category: string, value: string) => {
    const quantity = parseFloat(value);
    if (!isNaN(quantity) && quantity >= 0) {
      setCustomQuantities(prev => ({
        ...prev,
        [category]: quantity
      }));
    }
  };

  // Reset quantity to calculated default
  const resetQuantity = (category: string) => {
    setCustomQuantities(prev => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      {/* Calculator Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Material Calculator</h3>
          <p className="text-sm text-gray-600">
            Quantities calculated for {roomDimensions.length}' × {roomDimensions.width}' {projectType}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCalculator(!showCalculator)}
          className="flex items-center gap-2"
        >
          <Calculator className="h-4 w-4" />
          {showCalculator ? 'Hide' : 'Show'} Calculator
        </Button>
      </div>

      {/* Quantity Calculator */}
      {showCalculator && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Quantity Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map(category => {
                const defaultQty = defaultQuantities[category.id] || 0;
                const customQty = customQuantities[category.id];
                const effectiveQty = getEffectiveQuantity(category.id);
                
                return (
                  <div key={category.id} className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <category.icon className="h-3 w-3" />
                      {category.name}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        value={customQty !== undefined ? customQty : defaultQty.toFixed(1)}
                        onChange={(e) => handleQuantityChange(category.id, e.target.value)}
                        className="text-sm"
                      />
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {category.unit}
                      </span>
                    </div>
                    {customQty !== undefined && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resetQuantity(category.id)}
                        className="text-xs text-blue-600 h-auto p-0"
                      >
                        Reset to calculated ({defaultQty.toFixed(1)})
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Material Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(category => {
          const categoryMaterials = getMaterialsForCategory(category.id);
          const selectedMaterial = selectedMaterials[category.id] 
            ? materials.find(m => m.id === selectedMaterials[category.id])
            : null;
          const quantity = getEffectiveQuantity(category.id);
          
          return (
            <Card key={category.id} className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5" />
                  {category.name}
                  {selectedMaterial && (
                    <Badge className={category.color}>
                      {selectedMaterial.name}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Info className="h-3 w-3" />
                  <span>{quantity.toFixed(1)} {category.unit} needed</span>
                </div>
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
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-gray-500">
                                ${material.price}/{material.unit}
                              </p>
                              <p className="text-xs text-blue-600">
                                {quantity.toFixed(1)} {category.unit}
                              </p>
                            </div>
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
                Total Material Cost
              </h3>
              <p className="text-sm text-green-700">
                Based on actual measurements • {roomDimensions.length}' × {roomDimensions.width}' {projectType}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-900">
                ${getTotalCost().toLocaleString()}
              </div>
              <p className="text-sm text-green-700">
                Materials only • Labor quoted separately
              </p>
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="mt-4 pt-4 border-t border-green-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(category => {
                const material = selectedMaterials[category.id] 
                  ? materials.find(m => m.id === selectedMaterials[category.id])
                  : null;
                const cost = material ? calculateCost(category.id, material.id) : 0;
                
                if (cost === 0) return null;
                
                return (
                  <div key={category.id} className="text-center">
                    <div className="text-sm font-medium text-green-900">
                      {category.name}
                    </div>
                    <div className="text-lg font-semibold text-green-700">
                      ${cost.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}