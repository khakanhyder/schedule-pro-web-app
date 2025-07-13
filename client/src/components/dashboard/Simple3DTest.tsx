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

      {/* New Project Dialog */}
      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New 3D Project</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Project Details</TabsTrigger>
              <TabsTrigger value="design">3D Design</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., Kitchen Remodel - Smith Family"
                    value={newProjectData.projectName}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, projectName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="roomType">Room Type</Label>
                  <Select value={newProjectData.roomType} onValueChange={(value) => setNewProjectData(prev => ({ ...prev, roomType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="bathroom">Bathroom</SelectItem>
                      <SelectItem value="living">Living Room</SelectItem>
                      <SelectItem value="bedroom">Bedroom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="Client full name"
                    value={newProjectData.clientName}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, clientName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@email.com"
                    value={newProjectData.clientEmail}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="roomLength">Length (ft)</Label>
                  <Input
                    id="roomLength"
                    type="number"
                    value={newProjectData.roomLength}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, roomLength: Number(e.target.value) }))}
                    min="6"
                    max="40"
                  />
                </div>
                <div>
                  <Label htmlFor="roomWidth">Width (ft)</Label>
                  <Input
                    id="roomWidth"
                    type="number"
                    value={newProjectData.roomWidth}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, roomWidth: Number(e.target.value) }))}
                    min="6"
                    max="40"
                  />
                </div>
                <div>
                  <Label htmlFor="roomHeight">Height (ft)</Label>
                  <Input
                    id="roomHeight"
                    type="number"
                    value={newProjectData.roomHeight}
                    onChange={(e) => setNewProjectData(prev => ({ ...prev, roomHeight: Number(e.target.value) }))}
                    min="7"
                    max="12"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Project Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional project requirements, preferences, or notes..."
                  value={newProjectData.notes}
                  onChange={(e) => setNewProjectData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsNewProjectOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setSelectedDemo(newProjectData.roomType);
                  setIsNewProjectOpen(false);
                  setIsViewerOpen(true);
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  Create & Open 3D
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="design" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  Live preview of your {newProjectData.roomType} design with current dimensions: {newProjectData.roomLength}' × {newProjectData.roomWidth}' × {newProjectData.roomHeight}'
                </p>
              </div>
              
              <Professional3DRoomViewer
                roomType={newProjectData.roomType}
                dimensions={{
                  length: newProjectData.roomLength,
                  width: newProjectData.roomWidth,
                  height: newProjectData.roomHeight
                }}
                materials={mockMaterials}
                selectedMaterials={selectedMaterials}
                onMaterialChange={handleMaterialChange}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* 3D Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">
                {getDemoTitle()}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsViewerOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedDemo && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Interactive 3D Demo</span>
                </div>
                <p className="text-sm text-blue-700">
                  Click on any surface in the 3D room to cycle through different materials. 
                  Use the lighting controls and camera navigation to explore the space.
                </p>
              </div>
              
              <Professional3DRoomViewer
                roomType={selectedDemo}
                dimensions={getDemoDimensions()}
                materials={mockMaterials}
                selectedMaterials={selectedMaterials}
                onMaterialChange={handleMaterialChange}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}