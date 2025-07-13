import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Play, Zap, X, Plus, Save } from 'lucide-react';
import Professional3DRoomViewer from './Professional3DRoomViewer';

// Mock materials data for demos
const mockMaterials = [
  // Flooring
  { id: 1, name: 'Oak Hardwood', category: 'flooring', pricePerSqFt: 8.50, color: '#8B4513', description: 'Premium oak hardwood flooring' },
  { id: 2, name: 'Ceramic Tile', category: 'flooring', pricePerSqFt: 4.25, color: '#E6E6FA', description: 'Durable ceramic tile' },
  { id: 3, name: 'Luxury Vinyl', category: 'flooring', pricePerSqFt: 6.75, color: '#D2B48C', description: 'Waterproof luxury vinyl' },
  
  // Paint
  { id: 4, name: 'Cloud White', category: 'paint', pricePerSqFt: 0.50, color: '#F8F8FF', description: 'Clean white paint' },
  { id: 5, name: 'Sage Green', category: 'paint', pricePerSqFt: 0.50, color: '#9CAF88', description: 'Calming sage green' },
  { id: 6, name: 'Warm Gray', category: 'paint', pricePerSqFt: 0.50, color: '#8C8C8C', description: 'Modern warm gray' },
  
  // Cabinets
  { id: 7, name: 'Shaker White', category: 'cabinets', pricePerSqFt: 85.00, color: '#FFFFFF', description: 'Classic white shaker cabinets' },
  { id: 8, name: 'Cherry Wood', category: 'cabinets', pricePerSqFt: 120.00, color: '#8B4513', description: 'Rich cherry wood cabinets' },
  { id: 9, name: 'Modern Gray', category: 'cabinets', pricePerSqFt: 95.00, color: '#4A5568', description: 'Contemporary gray cabinets' },
  
  // Countertops
  { id: 10, name: 'Granite Black', category: 'countertops', pricePerSqFt: 65.00, color: '#2F2F2F', description: 'Premium black granite' },
  { id: 11, name: 'Quartz White', category: 'countertops', pricePerSqFt: 75.00, color: '#FFFFFF', description: 'Engineered quartz' },
  { id: 12, name: 'Marble Carrara', category: 'countertops', pricePerSqFt: 85.00, color: '#F0F0F0', description: 'Elegant Carrara marble' },
  
  // Backsplash
  { id: 13, name: 'Subway Tile', category: 'backsplash', pricePerSqFt: 12.50, color: '#E6E6FA', description: 'Classic subway tile' },
  { id: 14, name: 'Mosaic Glass', category: 'backsplash', pricePerSqFt: 18.75, color: '#87CEEB', description: 'Glass mosaic tiles' },
  { id: 15, name: 'Natural Stone', category: 'backsplash', pricePerSqFt: 22.00, color: '#D2B48C', description: 'Natural stone tiles' },
  
  // Bathroom specific
  { id: 16, name: 'Porcelain Tile', category: 'tiles', pricePerSqFt: 8.25, color: '#E6E6FA', description: 'Porcelain wall tiles' },
  { id: 17, name: 'Chrome Fixtures', category: 'fixtures', pricePerSqFt: 45.00, color: '#C0C0C0', description: 'Chrome bathroom fixtures' },
];

export default function Simple3DTest() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, number>>({
    flooring: 1,
    paint: 4,
    cabinets: 7,
    countertops: 10,
    backsplash: 13,
    tiles: 16,
    fixtures: 17
  });
  const [newProjectData, setNewProjectData] = useState({
    projectName: '',
    clientName: '',
    clientEmail: '',
    roomType: 'kitchen',
    roomLength: 12,
    roomWidth: 10,
    roomHeight: 9,
    notes: ''
  });

  const handleDemoClick = (demoType: string) => {
    setSelectedDemo(demoType);
    setIsViewerOpen(true);
  };

  const handleMaterialChange = (category: string, materialId: number) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [category]: materialId
    }));
  };

  const getDemoTitle = () => {
    return selectedDemo === 'kitchen' ? 'Kitchen Demo - Professional Design' : 'Bathroom Demo - Modern Layout';
  };

  const getDemoDimensions = () => {
    if (selectedDemo === 'kitchen') {
      return { length: 14, width: 12, height: 9 };
    } else {
      return { length: 10, width: 8, height: 9 };
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">3D Room Projects</h2>
        <p className="text-gray-600">Create and manage 3D room visualizations for clients</p>
      </div>

      {/* Demo Projects */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Kitchen Demo</CardTitle>
              <Badge variant="secondary">Demo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Professional kitchen design with island, countertops, and premium cabinets
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => handleDemoClick('kitchen')}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                View Demo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Bathroom Demo</CardTitle>
              <Badge variant="secondary">Demo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Modern bathroom with vanity, shower, and premium fixtures
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => handleDemoClick('bathroom')}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                View Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Project */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="text-center py-8">
          <Home className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Create New Project</h3>
          <p className="text-gray-600 mb-4">Start a new 3D room design project</p>
          <Button 
            onClick={() => setIsNewProjectOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </CardContent>
      </Card>

      {/* Test Status */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700">
              3D Projects Tab Loading Successfully
            </span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            This confirms the tab navigation is working. The buttons above should show alerts when clicked.
          </p>
        </CardContent>
      </Card>

      {/* New Project Dialog - Compact Professional */}
      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <DialogContent style={{ width: '320px', maxWidth: '320px', padding: '16px' }}>
          <DialogHeader>
            <DialogTitle className="text-base">New Project</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="projectName" className="text-sm">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Kitchen Remodel"
                value={newProjectData.projectName}
                onChange={(e) => setNewProjectData(prev => ({ ...prev, projectName: e.target.value }))}
                className="h-8 text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="roomType" className="text-sm">Room Type</Label>
              <Select value={newProjectData.roomType} onValueChange={(value) => setNewProjectData(prev => ({ ...prev, roomType: value }))}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="bathroom">Bathroom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setIsNewProjectOpen(false)} size="sm">
                Cancel
              </Button>
              <Button onClick={() => {
                setSelectedDemo(newProjectData.roomType);
                setIsNewProjectOpen(false);
                setIsViewerOpen(true);
              }} size="sm">
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3D Viewer Dialog - Compact Professional */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent style={{ width: '600px', maxWidth: '600px', height: '450px', padding: '12px' }}>
          <DialogHeader>
            <DialogTitle className="text-base">3D Room View</DialogTitle>
          </DialogHeader>
          
          <div className="h-[380px] border rounded overflow-hidden">
            <Professional3DRoomViewer
              roomType={selectedDemo || 'kitchen'}
              dimensions={{
                length: 12,
                width: 10,
                height: 9
              }}
              materials={mockMaterials}
              selectedMaterials={selectedMaterials}
              onMaterialChange={handleMaterialChange}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}