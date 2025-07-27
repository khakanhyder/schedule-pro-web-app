import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2, DollarSign, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Service } from "@shared/schema";

export default function ServiceManager() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: 60,
    category: "standard"
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch services
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services']
  });

  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: (serviceData: any) => apiRequest('POST', '/api/services', serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      resetForm();
      setIsAddOpen(false);
      toast({
        title: "Service Added",
        description: "Your new service has been created successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Service",
        description: error.message || "Failed to create service. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => 
      apiRequest('PUT', `/api/services/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      resetForm();
      setEditingService(null);
      toast({
        title: "Service Updated",
        description: "Service details have been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Service",
        description: error.message || "Failed to update service. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/services/${id}`, {
      method: 'DELETE'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: "Service Deleted",
        description: "The service has been removed from your offerings."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting Service",
        description: error.message || "Failed to delete service. Please try again.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      durationMinutes: 60,
      category: "standard"
    });
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      durationMinutes: service.durationMinutes,
      category: service.category || "standard"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.id, data: formData });
    } else {
      createServiceMutation.mutate(formData);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  if (isLoading) {
    return <div className="p-4">Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Management</h2>
          <p className="text-muted-foreground">Customize your services, pricing, and duration</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingService(null); }}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Haircut & Styling"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what's included in this service"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="$150"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select 
                    value={formData.durationMinutes.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, durationMinutes: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="300">5 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setIsAddOpen(false);
                  setEditingService(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createServiceMutation.isPending || updateServiceMutation.isPending}>
                  {editingService ? 'Update Service' : 'Add Service'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <Badge variant="secondary">{service.category}</Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{service.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium text-foreground">{service.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(service.durationMinutes)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteServiceMutation.mutate(service.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {services.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No services added yet. Create your first service to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingService} onOpenChange={(open) => !open && setEditingService(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Service Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Haircut & Styling"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what's included in this service"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Price *</Label>
                <Input
                  id="edit-price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="$150"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-duration">Duration (minutes)</Label>
                <Select 
                  value={formData.durationMinutes.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, durationMinutes: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                    <SelectItem value="300">5 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingService(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateServiceMutation.isPending}>
                Update Service
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}