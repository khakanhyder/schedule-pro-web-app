import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Home, 
  Calculator, 
  Palette, 
  Square, 
  Wrench, 
  Box,
  Sun,
  Moon,
  Grid3X3,
  RotateCcw,
  Lightbulb,
  Maximize2,
  AlertCircle,
  Play
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Lightweight 3D Canvas Component
function Professional3DViewer({ 
  roomType, 
  roomLength, 
  roomWidth, 
  roomHeight, 
  selectedMaterials, 
  materials,
  onMaterialChange 
}: {
  roomType: string;
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  selectedMaterials: Record<string, number>;
  materials: any[];
  onMaterialChange?: (category: string, materialId: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDay, setIsDay] = useState(true);
  const [lightIntensity, setLightIntensity] = useState([0.8]);
  const [showGrid, setShowGrid] = useState(true);
  const [viewMode, setViewMode] = useState('normal');

  // Simple 2D representation with professional styling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = isDay ? '#f8f9fa' : '#2d3748';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw room outline
    const scale = Math.min(canvas.width / (roomLength + 4), canvas.height / (roomWidth + 4));
    const roomPixelWidth = roomLength * scale;
    const roomPixelHeight = roomWidth * scale;
    const offsetX = (canvas.width - roomPixelWidth) / 2;
    const offsetY = (canvas.height - roomPixelHeight) / 2;

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = isDay ? '#e2e8f0' : '#4a5568';
      ctx.lineWidth = 1;
      for (let i = 0; i <= roomLength; i++) {
        const x = offsetX + (i * scale);
        ctx.beginPath();
        ctx.moveTo(x, offsetY);
        ctx.lineTo(x, offsetY + roomPixelHeight);
        ctx.stroke();
      }
      for (let i = 0; i <= roomWidth; i++) {
        const y = offsetY + (i * scale);
        ctx.beginPath();
        ctx.moveTo(offsetX, y);
        ctx.lineTo(offsetX + roomPixelWidth, y);
        ctx.stroke();
      }
    }

    // Draw room walls
    ctx.strokeStyle = '#4a5568';
    ctx.lineWidth = 3;
    ctx.strokeRect(offsetX, offsetY, roomPixelWidth, roomPixelHeight);

    // Draw room-specific features
    if (roomType === 'kitchen') {
      // Kitchen island
      const islandWidth = roomPixelWidth * 0.3;
      const islandHeight = roomPixelHeight * 0.15;
      const islandX = offsetX + (roomPixelWidth - islandWidth) / 2;
      const islandY = offsetY + roomPixelHeight * 0.4;
      
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(islandX, islandY, islandWidth, islandHeight);
      
      // L-shaped cabinets
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(offsetX + 10, offsetY + 10, roomPixelWidth * 0.4, 20);
      ctx.fillRect(offsetX + 10, offsetY + 10, 20, roomPixelHeight * 0.5);
      
      // Appliances
      ctx.fillStyle = '#2d3748';
      ctx.fillRect(offsetX + roomPixelWidth * 0.7, offsetY + 10, 30, 25);
      
    } else if (roomType === 'bathroom') {
      // Vanity
      ctx.fillStyle = '#4a5568';
      ctx.fillRect(offsetX + 10, offsetY + 10, roomPixelWidth * 0.4, 25);
      
      // Shower
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(offsetX + roomPixelWidth * 0.6, offsetY + 10, roomPixelWidth * 0.3, roomPixelHeight * 0.4);
      
      // Tub
      ctx.fillStyle = '#f7fafc';
      ctx.fillRect(offsetX + 10, offsetY + roomPixelHeight * 0.6, roomPixelWidth * 0.5, roomPixelHeight * 0.3);
    }

    // Add lighting effect
    const lightAlpha = lightIntensity[0] * (isDay ? 0.1 : 0.3);
    ctx.fillStyle = `rgba(255, 255, 255, ${lightAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add room dimensions
    ctx.fillStyle = isDay ? '#4a5568' : '#e2e8f0';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${roomLength}' × ${roomWidth}' × ${roomHeight}'`, canvas.width / 2, canvas.height - 20);

  }, [roomType, roomLength, roomWidth, roomHeight, isDay, lightIntensity, showGrid]);

  // Get material categories based on room type
  const getMaterialCategories = () => {
    if (roomType === 'kitchen') {
      return ['flooring', 'paint', 'cabinets', 'countertops', 'backsplash'];
    } else if (roomType === 'bathroom') {
      return ['flooring', 'paint', 'tiles', 'fixtures', 'countertops'];
    }
    return ['flooring', 'paint', 'tiles'];
  };

  return (
    <div className="space-y-4">
      {/* Professional Controls */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
        <Button
          variant={viewMode === 'normal' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('normal')}
        >
          <Home className="h-4 w-4 mr-1" />
          Normal
        </Button>
        <Button
          variant={viewMode === 'overview' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('overview')}
        >
          <Maximize2 className="h-4 w-4 mr-1" />
          Overview
        </Button>
        <Button
          variant={isDay ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsDay(!isDay)}
        >
          {isDay ? <Sun className="h-4 w-4 mr-1" /> : <Moon className="h-4 w-4 mr-1" />}
          {isDay ? 'Day' : 'Night'}
        </Button>
        <Button
          variant={showGrid ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
        >
          <Grid3X3 className="h-4 w-4 mr-1" />
          Grid
        </Button>
        <Button variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* 3D Canvas */}
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-80 cursor-move"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        
        {/* Lighting Controls */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="text-sm font-medium">Light</span>
            <Slider
              value={lightIntensity}
              onValueChange={setLightIntensity}
              max={1}
              min={0.1}
              step={0.1}
              className="w-20"
            />
          </div>
        </div>
      </div>

      {/* Material Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Material Selection</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {getMaterialCategories().map((category) => (
            <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm capitalize">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {materials
                    .filter(m => m.category === category)
                    .slice(0, 3)
                    .map((material) => (
                      <div
                        key={material.id}
                        className={`p-2 rounded border cursor-pointer transition-all ${
                          selectedMaterials[category] === material.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => onMaterialChange?.(category, material.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{material.name}</span>
                          <span className="text-xs text-gray-500">${material.pricePerSqFt}/sq ft</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: material.color }}
                          />
                          <span className="text-xs text-gray-600">{material.description}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cost Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-lg">Cost Estimate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Room Size:</span>
              <span>{roomLength}' × {roomWidth}' × {roomHeight}'</span>
            </div>
            <div className="flex justify-between">
              <span>Floor Area:</span>
              <span>{roomLength * roomWidth} sq ft</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Estimated Total:</span>
              <span>$12,500</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Enhanced3DProjectManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, number>>({});
  const [currentTab, setCurrentTab] = useState("details");

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    projectName: '',
    projectType: 'kitchen',
    roomLength: 12,
    roomWidth: 10,
    roomHeight: 9,
    notes: '',
    estimatedCost: 0
  });

  // Mock data for demonstration
  const projects = [
    {
      id: 1,
      projectName: 'Kitchen Remodel - Smith Family',
      projectType: 'kitchen',
      clientName: 'John Smith',
      clientEmail: 'john@smith.com',
      roomLength: 14,
      roomWidth: 12,
      roomHeight: 9,
      status: 'draft',
      estimatedCost: 15000,
      selectedMaterials: JSON.stringify({ flooring: 1, cabinets: 2, countertops: 3 })
    },
    {
      id: 2,
      projectName: 'Bathroom Renovation - Johnson Home',
      projectType: 'bathroom',
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah@johnson.com',
      roomLength: 8,
      roomWidth: 6,
      roomHeight: 9,
      status: 'in-progress',
      estimatedCost: 8500,
      selectedMaterials: JSON.stringify({ flooring: 4, tiles: 5, fixtures: 6 })
    }
  ];

  const materials = [
    { id: 1, name: 'Hardwood Oak', category: 'flooring', pricePerSqFt: 8.50, color: '#D2B48C', description: 'Premium oak flooring' },
    { id: 2, name: 'Shaker White', category: 'cabinets', pricePerSqFt: 45.00, color: '#F5F5DC', description: 'Classic shaker style' },
    { id: 3, name: 'Granite Black', category: 'countertops', pricePerSqFt: 65.00, color: '#2F2F2F', description: 'Premium granite' },
    { id: 4, name: 'Porcelain Tile', category: 'flooring', pricePerSqFt: 6.50, color: '#E5E5E5', description: 'Durable porcelain' },
    { id: 5, name: 'Subway White', category: 'tiles', pricePerSqFt: 12.00, color: '#FFFFFF', description: 'Classic subway tile' },
    { id: 6, name: 'Chrome Modern', category: 'fixtures', pricePerSqFt: 25.00, color: '#C0C0C0', description: 'Modern chrome finish' },
    { id: 7, name: 'Ceramic Beige', category: 'tiles', pricePerSqFt: 8.00, color: '#F5F5DC', description: 'Warm ceramic tile' },
    { id: 8, name: 'Quartz White', category: 'countertops', pricePerSqFt: 55.00, color: '#F8F8FF', description: 'Engineered quartz' },
    { id: 9, name: 'Maple Natural', category: 'cabinets', pricePerSqFt: 42.00, color: '#8B4513', description: 'Natural maple wood' }
  ];

  const handleMaterialChange = (category: string, materialId: number) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [category]: materialId
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Project Created",
      description: "3D room project has been created successfully."
    });
    setIsCreateDialogOpen(false);
    setCurrentTab("details");
  };

  const openViewer = (project: any) => {
    setSelectedProject(project);
    
    // Parse selected materials if available
    if (project.selectedMaterials) {
      try {
        const parsedMaterials = JSON.parse(project.selectedMaterials);
        setSelectedMaterials(parsedMaterials);
      } catch (e) {
        setSelectedMaterials({});
      }
    }
    
    setIsViewerOpen(true);
  };

  const startDemo = (type: string) => {
    const demoProject = {
      id: 999,
      projectName: `${type === 'kitchen' ? 'Kitchen' : 'Bathroom'} Demo`,
      projectType: type,
      clientName: 'Demo Client',
      clientEmail: 'demo@example.com',
      roomLength: type === 'kitchen' ? 14 : 8,
      roomWidth: type === 'kitchen' ? 12 : 6,
      roomHeight: 9,
      status: 'demo',
      estimatedCost: type === 'kitchen' ? 15000 : 8500,
      selectedMaterials: type === 'kitchen' 
        ? JSON.stringify({ flooring: 1, cabinets: 2, countertops: 3, backsplash: 7 })
        : JSON.stringify({ flooring: 4, tiles: 5, fixtures: 6, countertops: 8 })
    };
    
    openViewer(demoProject);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">3D Room Projects</h2>
          <p className="text-muted-foreground">
            Create professional 3D room visualizations for your clients
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => startDemo('kitchen')}>
            <Play className="h-4 w-4 mr-2" />
            Kitchen Demo
          </Button>
          <Button variant="outline" onClick={() => startDemo('bathroom')}>
            <Play className="h-4 w-4 mr-2" />
            Bathroom Demo
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New 3D Room Project</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Project Details</TabsTrigger>
                    <TabsTrigger value="design">3D Design</TabsTrigger>
                    <TabsTrigger value="cost">Cost Estimate</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input
                          id="clientName"
                          value={formData.clientName}
                          onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientEmail">Client Email</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          value={formData.clientEmail}
                          onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                          placeholder="john@smith.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="projectName">Project Name</Label>
                        <Input
                          id="projectName"
                          value={formData.projectName}
                          onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                          placeholder="Kitchen Remodel"
                        />
                      </div>
                      <div>
                        <Label htmlFor="projectType">Room Type</Label>
                        <Select value={formData.projectType} onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}>
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
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Project Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Special requirements, client preferences, etc."
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="design" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="roomLength">Length (ft)</Label>
                        <Input
                          id="roomLength"
                          type="number"
                          value={formData.roomLength}
                          onChange={(e) => setFormData(prev => ({ ...prev, roomLength: Number(e.target.value) }))}
                          min="8"
                          max="30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="roomWidth">Width (ft)</Label>
                        <Input
                          id="roomWidth"
                          type="number"
                          value={formData.roomWidth}
                          onChange={(e) => setFormData(prev => ({ ...prev, roomWidth: Number(e.target.value) }))}
                          min="8"
                          max="30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="roomHeight">Height (ft)</Label>
                        <Input
                          id="roomHeight"
                          type="number"
                          value={formData.roomHeight}
                          onChange={(e) => setFormData(prev => ({ ...prev, roomHeight: Number(e.target.value) }))}
                          min="8"
                          max="12"
                        />
                      </div>
                    </div>

                    <Professional3DViewer
                      roomType={formData.projectType}
                      roomLength={formData.roomLength}
                      roomWidth={formData.roomWidth}
                      roomHeight={formData.roomHeight}
                      selectedMaterials={selectedMaterials}
                      materials={materials}
                      onMaterialChange={handleMaterialChange}
                    />
                  </TabsContent>

                  <TabsContent value="cost" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Project Cost Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Room Size:</span>
                            <span>{formData.roomLength}' × {formData.roomWidth}' × {formData.roomHeight}'</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Floor Area:</span>
                            <span>{formData.roomLength * formData.roomWidth} sq ft</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Wall Area:</span>
                            <span>{2 * (formData.roomLength + formData.roomWidth) * formData.roomHeight} sq ft</span>
                          </div>
                          <div className="border-t pt-3">
                            <div className="flex justify-between font-semibold text-lg">
                              <span>Estimated Total:</span>
                              <span>$12,500</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Project</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.projectName}</CardTitle>
                <Badge variant={project.status === 'draft' ? 'secondary' : 'default'}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Client:</strong> {project.clientName}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Type:</strong> {project.projectType}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Size:</strong> {project.roomLength}' × {project.roomWidth}' × {project.roomHeight}'
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Budget:</strong> ${project.estimatedCost.toLocaleString()}
                </p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => openViewer(project)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View 3D
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3D Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProject?.projectName} - 3D Visualization
            </DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <Professional3DViewer
              roomType={selectedProject.projectType}
              roomLength={selectedProject.roomLength}
              roomWidth={selectedProject.roomWidth}
              roomHeight={selectedProject.roomHeight}
              selectedMaterials={selectedMaterials}
              materials={materials}
              onMaterialChange={handleMaterialChange}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}