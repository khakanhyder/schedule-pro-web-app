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
import { Plus, Eye, Edit, Trash2, Home, Calculator } from 'lucide-react';
import Room3DVisualizer from './Room3DVisualizer';
import MaterialSelectionDemo from './MaterialSelectionDemo';
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
    estimatedCost: 0
  });

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
      apiRequest('/api/room-projects', { method: 'POST', body: data }),
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
      apiRequest(`/api/room-projects/${id}`, { method: 'DELETE' }),
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
      estimatedCost: 0
    });
    setSelectedMaterials({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData: InsertRoomProject = {
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      projectName: formData.projectName,
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
              <DialogTitle>Create New 3D Room Project</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Project Details</TabsTrigger>
                  <TabsTrigger value="room">Room Design</TabsTrigger>
                  <TabsTrigger value="demo">How It Works</TabsTrigger>
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
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">Client Email</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        value={formData.projectName}
                        onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                        placeholder="Kitchen Renovation"
                        required
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

                <TabsContent value="room">
                  <Room3DVisualizer
                    roomLength={formData.roomLength}
                    roomWidth={formData.roomWidth}
                    roomHeight={formData.roomHeight}
                    onRoomChange={handleRoomChange}
                    selectedMaterials={selectedMaterials}
                    onMaterialChange={handleMaterialChange}
                    materials={materials}
                  />
                </TabsContent>

                <TabsContent value="demo" className="space-y-4">
                  <MaterialSelectionDemo />
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProject?.projectName} - 3D Preview
            </DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <Room3DVisualizer
              roomLength={selectedProject.roomLength}
              roomWidth={selectedProject.roomWidth}
              roomHeight={selectedProject.roomHeight}
              onRoomChange={handleRoomChange}
              selectedMaterials={selectedMaterials}
              onMaterialChange={handleMaterialChange}
              materials={materials}
            />
          )}
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