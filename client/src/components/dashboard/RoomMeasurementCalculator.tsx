import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Upload, 
  Ruler, 
  Package, 
  DollarSign,
  Plus,
  Minus,
  Save,
  FileText
} from 'lucide-react';

interface RoomDimensions {
  length: number;
  width: number;
  height: number;
  doorWidth: number;
  windowCount: number;
  windowWidth: number;
}

interface MaterialType {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  category: string;
  description: string;
}

interface MaterialCalculation {
  material: MaterialType;
  quantity: number;
  totalCost: number;
  coverage: string;
}

const materialTypes: MaterialType[] = [
  {
    id: 'baseboard',
    name: 'Baseboard Trim',
    unit: 'linear ft',
    pricePerUnit: 3.50,
    category: 'Trim',
    description: 'Standard 3.5" baseboard trim'
  },
  {
    id: 'crown-molding',
    name: 'Crown Molding',
    unit: 'linear ft',
    pricePerUnit: 4.25,
    category: 'Trim',
    description: '3.5" crown molding'
  },
  {
    id: 'flooring',
    name: 'Laminate Flooring',
    unit: 'sq ft',
    pricePerUnit: 2.85,
    category: 'Flooring',
    description: 'Premium laminate flooring'
  },
  {
    id: 'paint',
    name: 'Interior Paint',
    unit: 'gallon',
    pricePerUnit: 45.00,
    category: 'Paint',
    description: 'Premium interior paint (covers ~350 sq ft)'
  },
  {
    id: 'drywall',
    name: 'Drywall',
    unit: 'sq ft',
    pricePerUnit: 1.20,
    category: 'Drywall',
    description: '1/2" drywall sheets'
  }
];

export default function RoomMeasurementCalculator() {
  const [dimensions, setDimensions] = useState<RoomDimensions>({
    length: 0,
    width: 0,
    height: 8,
    doorWidth: 3,
    windowCount: 2,
    windowWidth: 4
  });

  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['baseboard']);
  const [calculations, setCalculations] = useState<MaterialCalculation[]>([]);

  const calculateMaterials = () => {
    const { length, width, height, doorWidth, windowCount, windowWidth } = dimensions;
    
    if (length <= 0 || width <= 0 || height <= 0) {
      alert('Please enter valid room dimensions');
      return;
    }

    const newCalculations: MaterialCalculation[] = [];

    selectedMaterials.forEach(materialId => {
      const material = materialTypes.find(m => m.id === materialId);
      if (!material) return;

      let quantity = 0;
      let coverage = '';

      switch (materialId) {
        case 'baseboard':
          // Perimeter minus doors
          quantity = (2 * length + 2 * width) - doorWidth;
          coverage = `${(2 * length + 2 * width).toFixed(1)} ft perimeter - ${doorWidth} ft door = ${quantity.toFixed(1)} linear ft`;
          break;
          
        case 'crown-molding':
          // Full perimeter
          quantity = 2 * length + 2 * width;
          coverage = `${quantity.toFixed(1)} ft perimeter`;
          break;
          
        case 'flooring':
          // Floor area
          quantity = length * width;
          coverage = `${length} × ${width} = ${quantity.toFixed(1)} sq ft`;
          break;
          
        case 'paint':
          // Wall area minus windows and doors
          const wallArea = 2 * (length * height) + 2 * (width * height);
          const windowArea = windowCount * windowWidth * 3; // Assume 3ft window height
          const doorArea = doorWidth * 7; // Assume 7ft door height
          const paintableArea = wallArea - windowArea - doorArea;
          quantity = Math.ceil(paintableArea / 350); // 350 sq ft per gallon
          coverage = `${wallArea.toFixed(1)} sq ft walls - ${(windowArea + doorArea).toFixed(1)} sq ft openings = ${paintableArea.toFixed(1)} sq ft (${quantity} gallons)`;
          break;
          
        case 'drywall':
          // Wall area
          quantity = 2 * (length * height) + 2 * (width * height);
          coverage = `${quantity.toFixed(1)} sq ft wall area`;
          break;
      }

      newCalculations.push({
        material,
        quantity,
        totalCost: quantity * material.pricePerUnit,
        coverage
      });
    });

    setCalculations(newCalculations);
  };

  const totalCost = calculations.reduce((sum, calc) => sum + calc.totalCost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Room Measurement Calculator</h2>
          <p className="text-gray-600">Calculate materials needed for your room project</p>
        </div>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload Floor Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Room Dimensions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="length">Length (ft)</Label>
                <Input
                  id="length"
                  type="number"
                  value={dimensions.length || ''}
                  onChange={(e) => setDimensions({...dimensions, length: parseFloat(e.target.value) || 0})}
                  placeholder="12"
                />
              </div>
              <div>
                <Label htmlFor="width">Width (ft)</Label>
                <Input
                  id="width"
                  type="number"
                  value={dimensions.width || ''}
                  onChange={(e) => setDimensions({...dimensions, width: parseFloat(e.target.value) || 0})}
                  placeholder="10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (ft)</Label>
                <Input
                  id="height"
                  type="number"
                  value={dimensions.height || ''}
                  onChange={(e) => setDimensions({...dimensions, height: parseFloat(e.target.value) || 0})}
                  placeholder="8"
                />
              </div>
              <div>
                <Label htmlFor="doorWidth">Door Width (ft)</Label>
                <Input
                  id="doorWidth"
                  type="number"
                  value={dimensions.doorWidth || ''}
                  onChange={(e) => setDimensions({...dimensions, doorWidth: parseFloat(e.target.value) || 0})}
                  placeholder="3"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="windowCount">Number of Windows</Label>
                <Input
                  id="windowCount"
                  type="number"
                  value={dimensions.windowCount || ''}
                  onChange={(e) => setDimensions({...dimensions, windowCount: parseFloat(e.target.value) || 0})}
                  placeholder="2"
                />
              </div>
              <div>
                <Label htmlFor="windowWidth">Window Width (ft)</Label>
                <Input
                  id="windowWidth"
                  type="number"
                  value={dimensions.windowWidth || ''}
                  onChange={(e) => setDimensions({...dimensions, windowWidth: parseFloat(e.target.value) || 0})}
                  placeholder="4"
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
              <strong>Room Area:</strong> {(dimensions.length * dimensions.width).toFixed(1)} sq ft<br />
              <strong>Wall Perimeter:</strong> {(2 * dimensions.length + 2 * dimensions.width).toFixed(1)} linear ft
            </div>
          </CardContent>
        </Card>

        {/* Material Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Materials Needed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {materialTypes.map(material => (
                <div key={material.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={material.id}
                    checked={selectedMaterials.includes(material.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMaterials([...selectedMaterials, material.id]);
                      } else {
                        setSelectedMaterials(selectedMaterials.filter(id => id !== material.id));
                      }
                    }}
                    className="rounded"
                  />
                  <label htmlFor={material.id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{material.name}</span>
                      <Badge variant="outline">${material.pricePerUnit}/{material.unit}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{material.description}</p>
                  </label>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <Button 
              onClick={calculateMaterials}
              className="w-full"
              disabled={selectedMaterials.length === 0}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Materials
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {calculations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Material Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calculations.map((calc, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{calc.material.name}</h4>
                      <p className="text-sm text-gray-600">{calc.coverage}</p>
                    </div>
                    <Badge variant="secondary">{calc.material.category}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">
                      {calc.quantity.toFixed(1)} {calc.material.unit}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      ${calc.totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Project Cost:</span>
                <span className="text-green-600">${totalCost.toFixed(2)}</span>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Quote
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}