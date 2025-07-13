import { useState } from 'react';
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
  AlertCircle,
  Play,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import Professional3DRoomViewer from './Professional3DRoomViewer';

// Material and project interfaces
interface Material {
  id: number;
  name: string;
  category: string;
  pricePerSqFt: number;
  color: string;
  description: string;
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

                    <Professional3DRoomViewer
                      roomType={formData.projectType}
                      dimensions={{
                        length: formData.roomLength,
                        width: formData.roomWidth,
                        height: formData.roomHeight
                      }}
                      materials={materials}
                      selectedMaterials={selectedMaterials}
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
            <Professional3DRoomViewer
              roomType={selectedProject.projectType}
              dimensions={{
                length: selectedProject.roomLength,
                width: selectedProject.roomWidth,
                height: selectedProject.roomHeight
              }}
              materials={materials}
              selectedMaterials={selectedMaterials}
              onMaterialChange={handleMaterialChange}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}