import { useState } from 'react';
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
import { Plus, Eye, Edit, Trash2, Home, Calculator, Palette, Square, Wrench, Box } from 'lucide-react';
import SimpleRoom3D from './SimpleRoom3D';
import KitchenRoom3D from './KitchenRoom3D';
import SimpleKitchen3D from './SimpleKitchen3D';
import ProfessionalKitchen3D from './ProfessionalKitchen3D';
import ProfessionalBathroom3D from './ProfessionalBathroom3D';
import ContractorMaterialSelector from './ContractorMaterialSelector';
import ContractorMaterialCalculator from './ContractorMaterialCalculator';
import SimpleMaterialSelector from './SimpleMaterialSelector';
import QuickMaterialSelector from './QuickMaterialSelector';

import { apiRequest } from '@/lib/queryClient';
import type { RoomProject, RoomMaterial, InsertRoomProject } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  clientName: string;
  clientEmail: string;
  projectName: string;
  projectType: string;
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  notes: string;
  estimatedCost: number;
  doorPosition: string;
  doorWidth: number;
}

export default function RoomProjectManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<RoomProject | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, number>>({});

  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    clientEmail: '',
    projectName: '',
    projectType: 'kitchen',
    roomLength: 12,
    roomWidth: 10,
    roomHeight: 9,
    notes: '',
    estimatedCost: 0,
    doorPosition: 'front',
    doorWidth: 3
  });

  // Demo mode removed - no longer needed

  // Fetch room projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/room-projects'],
    queryFn: () => fetch('/api/room-projects').then(res => res.json()) as Promise<RoomProject[]>
  });

  // Fetch room materials
  const { data: materials = [], isLoading: materialsLoading } = useQuery({
    queryKey: ['/api/room-materials'],
    queryFn: () => fetch('/api/room-materials').then(res => res.json()) as Promise<RoomMaterial[]>
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: (data: InsertRoomProject) => 
      apiRequest('POST', '/api/room-projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/room-projects'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Project Created",
        description: "3D room project has been created successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create room project.",
        variant: "destructive"
      });
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/room-projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/room-projects'] });
      toast({
        title: "Project Deleted",
        description: "Room project has been deleted successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete room project.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      projectName: '',
      projectType: 'kitchen',
      roomLength: 12,
      roomWidth: 10,
      roomHeight: 9,
      notes: '',
      estimatedCost: 0,
      doorPosition: 'front',
      doorWidth: 3
    });
    setSelectedMaterials({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData: InsertRoomProject = {
      clientName: formData.clientName || 'New Client',
      clientEmail: formData.clientEmail || 'client@example.com',
      projectName: formData.projectName || 'New Project',
      projectType: formData.projectType,
      roomLength: formData.roomLength,
      roomWidth: formData.roomWidth,
      roomHeight: formData.roomHeight,
      notes: formData.notes || null,
      estimatedCost: formData.estimatedCost > 0 ? formData.estimatedCost : null,
      selectedMaterials: JSON.stringify(selectedMaterials),
      status: 'draft'
    };

    createProjectMutation.mutate(projectData);
  };

  const openViewer = (project: RoomProject) => {
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

  const handleRoomChange = (dimensions: { length: number; width: number; height: number }) => {
    if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        roomLength: dimensions.length,
        roomWidth: dimensions.width,
        roomHeight: dimensions.height
      });
    } else {
      setFormData(prev => ({
        ...prev,
        roomLength: dimensions.length,
        roomWidth: dimensions.width,
        roomHeight: dimensions.height
      }));
    }
  };

  const handleMaterialChange = (category: string, materialId: number) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [category]: materialId
    }));
  };

  // Quick demo handler for different room types
  const handleQuickDemo = (roomType: string) => {
    const demoProjects = {
      kitchen: {
        projectName: "Modern Kitchen Showcase",
        projectType: "kitchen",
        clientName: "Demo Client",
        clientEmail: "demo@example.com",
        roomLength: 14,
        roomWidth: 12,
        roomHeight: 9,
        notes: "Interactive kitchen design with premium materials and professional lighting.",
        materials: {
          flooring: 2,
          cabinets: 4,
          tiles: 6,
          backsplash: 8,
          paint: 1
        }
      },
      bathroom: {
        projectName: "Luxury Bathroom Experience",
        projectType: "bathroom",
        clientName: "Demo Client",
        clientEmail: "demo@example.com",
        roomLength: 10,
        roomWidth: 8,
        roomHeight: 9,
        notes: "Spa-like bathroom with walk-in shower, double vanity, and premium finishes.",
        materials: {
          flooring: 3,
          tiles: 5,
          fixtures: 7,
          paint: 1,
          countertops: 9
        }
      }
    };

    const demo = demoProjects[roomType as keyof typeof demoProjects];
    
    setFormData({
      projectName: demo.projectName,
      projectType: demo.projectType,
      clientName: demo.clientName,
      clientEmail: demo.clientEmail,
      roomLength: demo.roomLength,
      roomWidth: demo.roomWidth,
      roomHeight: demo.roomHeight,
      notes: demo.notes
    });
    
    setSelectedMaterials(demo.materials);
    setCurrentTab("design");
    setIsCreateDialogOpen(true);
  };

  const calculateProjectCost = () => {
    let totalCost = 0;
    const roomArea = formData.roomLength * formData.roomWidth;
    const wallArea = 2 * (formData.roomLength + formData.roomWidth) * formData.roomHeight;

    Object.entries(selectedMaterials).forEach(([category, materialId]) => {
      const material = materials.find(m => m.id === materialId);
      if (material && material.price) {
        if (category === 'flooring') {
          totalCost += material.price * roomArea;
        } else if (category === 'paint') {
          // Paint typically covers 400 sq ft per gallon
          const gallonsNeeded = Math.ceil(wallArea / 400);
          totalCost += material.price * gallonsNeeded;
        } else if (category === 'tiles') {
          // Assume tiles for backsplash or accent wall (20% of wall area)
          totalCost += material.price * (wallArea * 0.2);
        } else if (category === 'fixtures' || category === 'cabinets') {
          // Fixed cost per unit
          totalCost += material.price;
        }
      }
    });

    return Math.round(totalCost);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (projectsLoading || materialsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading room projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Demo Section */}
      {projects.length === 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-blue-900">
                Experience Professional 3D Design
              </h3>
              <p className="text-blue-700">
                Try our advanced 3D room visualization with realistic materials and lighting
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => handleQuickDemo('kitchen')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Kitchen Demo
                </Button>
                <Button 
                  onClick={() => handleQuickDemo('bathroom')}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Bathroom Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">3D Room Projects</h2>
          <p className="text-gray-600">Create virtual walkthroughs for your clients</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Create New 3D Room Project
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Project Details</TabsTrigger>
                  <TabsTrigger value="design">3D Design</TabsTrigger>
                  <TabsTrigger value="cost">Cost Estimate</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">Client Email</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                        placeholder="client@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        value={formData.projectName}
                        onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                        placeholder="Kitchen Renovation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectType">Project Type</Label>
                      <Select
                        value={formData.projectType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                          <SelectItem value="bathroom">Bathroom</SelectItem>
                          <SelectItem value="living_room">Living Room</SelectItem>
                          <SelectItem value="bedroom">Bedroom</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
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
                      placeholder="Additional project details, client preferences, etc."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="room" className="space-y-6">
                  {/* Room Dimensions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Room Dimensions</h3>
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
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
                  </div>

                  {/* 3D Preview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">3D Room Preview</h3>
                    {formData.projectType === 'kitchen' ? (
                      <ProfessionalKitchen3D
                        roomLength={formData.roomLength}
                        roomWidth={formData.roomWidth}
                        roomHeight={formData.roomHeight}
                        selectedMaterials={selectedMaterials}
                        materials={materials}
                        onMaterialChange={handleMaterialChange}
                      />
                    ) : formData.projectType === 'bathroom' ? (
                      <ProfessionalBathroom3D
                        roomLength={formData.roomLength}
                        roomWidth={formData.roomWidth}
                        roomHeight={formData.roomHeight}
                        selectedMaterials={selectedMaterials}
                        materials={materials}
                        onMaterialChange={handleMaterialChange}
                      />
                    ) : (
                      <SimpleRoom3D
                        roomLength={formData.roomLength}
                        roomWidth={formData.roomWidth}
                        roomHeight={formData.roomHeight}
                        selectedMaterials={selectedMaterials}
                        materials={materials}
                      />
                    )}
                  </div>

                  {/* Material Selection - Skip for kitchen/bathroom as it's integrated */}
                  {!['kitchen', 'bathroom'].includes(formData.projectType) && (
                    <div className="space-y-4">
                      <QuickMaterialSelector
                        materials={materials}
                        selectedMaterials={selectedMaterials}
                        onMaterialChange={handleMaterialChange}
                        roomDimensions={{
                          length: formData.roomLength,
                          width: formData.roomWidth,
                          height: formData.roomHeight
                        }}
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="cost" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Cost Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Room Area:</span>
                          <span>{formData.roomLength} × {formData.roomWidth} = {formData.roomLength * formData.roomWidth} sq ft</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Wall Area:</span>
                          <span>{2 * (formData.roomLength + formData.roomWidth) * formData.roomHeight} sq ft</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Estimated Total:</span>
                          <span>${calculateProjectCost().toLocaleString()}</span>
                        </div>
                        <div>
                          <Label htmlFor="customCost">Custom Estimate Override</Label>
                          <Input
                            id="customCost"
                            type="number"
                            value={formData.estimatedCost || ''}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              estimatedCost: Number(e.target.value) 
                            }))}
                            placeholder={calculateProjectCost().toString()}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createProjectMutation.isPending}>
                  {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.projectName}</CardTitle>
                  <p className="text-sm text-gray-600">{project.clientName}</p>
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {project.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Home className="h-4 w-4" />
                  {project.roomLength}' × {project.roomWidth}' × {project.roomHeight}'
                </div>
                <div className="text-sm">
                  <span className="font-medium">Type:</span> {project.projectType.replace('_', ' ')}
                </div>
                {project.estimatedCost && (
                  <div className="text-sm">
                    <span className="font-medium">Estimate:</span> ${project.estimatedCost.toLocaleString()}
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openViewer(project)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    View 3D
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProjectMutation.mutate(project.id)}
                    disabled={deleteProjectMutation.isPending}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3D Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProject?.projectName} - 3D Preview
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Project info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold">{selectedProject?.clientName}</h3>
                <p className="text-sm text-gray-600">{selectedProject?.clientEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Room Size</p>
                <p className="font-semibold">
                  {selectedProject?.roomLength}' × {selectedProject?.roomWidth}' × {selectedProject?.roomHeight}'
                </p>
              </div>
            </div>

            {/* 3D Viewer */}
            {selectedProject && (
              selectedProject.projectType === 'kitchen' ? (
                <ProfessionalKitchen3D
                  roomLength={selectedProject.roomLength}
                  roomWidth={selectedProject.roomWidth}
                  roomHeight={selectedProject.roomHeight}
                  selectedMaterials={selectedMaterials}
                  materials={materials}
                  onMaterialChange={handleMaterialChange}
                />
              ) : selectedProject.projectType === 'bathroom' ? (
                <ProfessionalBathroom3D
                  roomLength={selectedProject.roomLength}
                  roomWidth={selectedProject.roomWidth}
                  roomHeight={selectedProject.roomHeight}
                  selectedMaterials={selectedMaterials}
                  materials={materials}
                  onMaterialChange={handleMaterialChange}
                />
              ) : (
                <SimpleRoom3D
                  roomLength={selectedProject.roomLength}
                  roomWidth={selectedProject.roomWidth}
                  roomHeight={selectedProject.roomHeight}
                  selectedMaterials={selectedMaterials}
                  materials={materials}
                />
              )
            )}

            {/* Material Selection - Skip for kitchen/bathroom as it's integrated */}
            {selectedProject && !['kitchen', 'bathroom'].includes(selectedProject.projectType) && (
              <QuickMaterialSelector
                materials={materials}
                selectedMaterials={selectedMaterials}
                onMaterialChange={handleMaterialChange}
                roomDimensions={{
                  length: selectedProject?.roomLength || 12,
                  width: selectedProject?.roomWidth || 10,
                  height: selectedProject?.roomHeight || 9
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {projects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Room Projects Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first 3D room project to show clients virtual walkthroughs of their renovations.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}