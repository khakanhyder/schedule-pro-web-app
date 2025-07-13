import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Square, 
  Ruler, 
  Palette, 
  Save, 
  Eye,
  Grid3X3,
  RotateCcw
} from 'lucide-react';

interface Material {
  id: number;
  name: string;
  category: string;
  pricePerSqFt: number;
  color: string;
  description: string;
}

interface RoomDimensions {
  length: number;
  width: number;
  height: number;
}

interface Simple2DRoomPlannerProps {
  roomType: string;
  dimensions: RoomDimensions;
  materials: Material[];
  selectedMaterials: Record<string, number>;
  onMaterialChange: (category: string, materialId: number) => void;
}

export default function Simple2DRoomPlanner({
  roomType,
  dimensions,
  materials,
  selectedMaterials,
  onMaterialChange
}: Simple2DRoomPlannerProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  // Calculate scale for drawing
  const maxSize = 300;
  const scale = Math.min(maxSize / dimensions.length, maxSize / dimensions.width);
  const roomWidth = dimensions.length * scale;
  const roomHeight = dimensions.width * scale;

  const getMaterialColor = (category: string) => {
    const materialId = selectedMaterials[category];
    const material = materials.find(m => m.id === materialId);
    return material ? material.color : '#cccccc';
  };

  const handleElementClick = (category: string, name: string) => {
    setSelectedElement(name);
    const categoryMaterials = materials.filter(m => m.category === category);
    if (categoryMaterials.length > 0) {
      const currentMaterialId = selectedMaterials[category];
      const currentIndex = categoryMaterials.findIndex(m => m.id === currentMaterialId);
      const nextIndex = (currentIndex + 1) % categoryMaterials.length;
      const nextMaterial = categoryMaterials[nextIndex];
      onMaterialChange(category, nextMaterial.id);
    }
  };

  const renderKitchenElements = () => (
    <g>
      {/* Kitchen Island */}
      <rect
        x={roomWidth / 2 - 60}
        y={roomHeight / 2 - 30}
        width={120}
        height={60}
        fill={getMaterialColor('cabinets')}
        stroke="#333"
        strokeWidth="2"
        className="cursor-pointer hover:opacity-80"
        onClick={() => handleElementClick('cabinets', 'Kitchen Island')}
      />
      <text
        x={roomWidth / 2}
        y={roomHeight / 2 + 5}
        textAnchor="middle"
        fontSize="12"
        fill="#333"
      >
        Island
      </text>
      
      {/* Counter along back wall */}
      <rect
        x={20}
        y={10}
        width={roomWidth - 40}
        height={25}
        fill={getMaterialColor('countertops')}
        stroke="#333"
        strokeWidth="1"
        className="cursor-pointer hover:opacity-80"
        onClick={() => handleElementClick('countertops', 'Counter')}
      />
      <text
        x={roomWidth / 2}
        y={27}
        textAnchor="middle"
        fontSize="10"
        fill="#333"
      >
        Counter
      </text>
    </g>
  );

  const renderBathroomElements = () => (
    <g>
      {/* Vanity */}
      <rect
        x={20}
        y={10}
        width={80}
        height={30}
        fill={getMaterialColor('cabinets')}
        stroke="#333"
        strokeWidth="2"
        className="cursor-pointer hover:opacity-80"
        onClick={() => handleElementClick('cabinets', 'Vanity')}
      />
      <text
        x={60}
        y={30}
        textAnchor="middle"
        fontSize="10"
        fill="#333"
      >
        Vanity
      </text>
      
      {/* Shower */}
      <rect
        x={roomWidth - 80}
        y={10}
        width={60}
        height={60}
        fill={getMaterialColor('tiles')}
        stroke="#333"
        strokeWidth="2"
        className="cursor-pointer hover:opacity-80"
        onClick={() => handleElementClick('tiles', 'Shower')}
      />
      <text
        x={roomWidth - 50}
        y={45}
        textAnchor="middle"
        fontSize="10"
        fill="#333"
      >
        Shower
      </text>
    </g>
  );

  return (
    <div className="space-y-3">
      {/* Simple Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={showGrid ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3X3 className="h-4 w-4 mr-1" />
            Grid
          </Button>
          {selectedElement && (
            <Badge variant="secondary">
              <Eye className="h-3 w-3 mr-1" />
              {selectedElement}
            </Badge>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          {dimensions.length}' × {dimensions.width}' × {dimensions.height}'
        </div>
      </div>

      {/* 2D Room Plan */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-center">
            <svg width={roomWidth + 40} height={roomHeight + 40} className="border border-gray-300 rounded">
              {/* Grid */}
              {showGrid && (
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                  </pattern>
                </defs>
              )}
              {showGrid && (
                <rect width="100%" height="100%" fill="url(#grid)" />
              )}
              
              {/* Room outline */}
              <rect
                x={20}
                y={20}
                width={roomWidth}
                height={roomHeight}
                fill={getMaterialColor('flooring')}
                stroke="#333"
                strokeWidth="3"
                className="cursor-pointer hover:opacity-80"
                onClick={() => handleElementClick('flooring', 'Floor')}
              />
              
              {/* Room elements */}
              <g transform={`translate(20, 20)`}>
                {roomType === 'kitchen' && renderKitchenElements()}
                {roomType === 'bathroom' && renderBathroomElements()}
              </g>
              
              {/* Dimensions */}
              <text x={roomWidth / 2 + 20} y={15} textAnchor="middle" fontSize="12" fill="#666">
                {dimensions.length}'
              </text>
              <text x={10} y={roomHeight / 2 + 25} textAnchor="middle" fontSize="12" fill="#666" transform={`rotate(-90, 10, ${roomHeight / 2 + 25})`}>
                {dimensions.width}'
              </text>
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Material Selection */}
      <div className="grid grid-cols-2 gap-2">
        {['flooring', 'cabinets', 'countertops', roomType === 'kitchen' ? 'backsplash' : 'tiles'].map(category => {
          const materialId = selectedMaterials[category];
          const material = materials.find(m => m.id === materialId);
          return (
            <Card key={category} className="p-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: material?.color || '#cccccc' }}
                />
                <div>
                  <div className="text-sm font-medium capitalize">{category}</div>
                  <div className="text-xs text-gray-600">{material?.name || 'Default'}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-xs text-gray-500 text-center">
        Click on room elements to change materials
      </div>
    </div>
  );
}