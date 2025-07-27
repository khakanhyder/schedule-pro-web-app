import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2, User, Mail, Phone, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Stylist, Service } from "@shared/schema";
import { useIndustry, getTerminology } from "@/lib/industryContext";

export default function StaffManager() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Stylist | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    email: "",
    phone: "",
    specialties: [] as string[]
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedIndustry } = useIndustry();
  const terminology = getTerminology(selectedIndustry);

  // Fetch staff and services
  const { data: staff = [], isLoading } = useQuery<Stylist[]>({
    queryKey: ['/api/stylists']
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['/api/services']
  });

  // Create staff mutation
  const createStaffMutation = useMutation({
    mutationFn: (staffData: any) => apiRequest('/api/stylists', {
      method: 'POST',
      body: JSON.stringify(staffData)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stylists'] });
      resetForm();
      setIsAddOpen(false);
      toast({
        title: `${terminology.professional} Added`,
        description: `New team member has been added successfully.`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Team Member",
        description: error.message || "Failed to add team member. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update staff mutation
  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => 
      apiRequest(`/api/stylists/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stylists'] });
      resetForm();
      setEditingStaff(null);
      toast({
        title: "Team Member Updated",
        description: "Staff details have been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Team Member",
        description: error.message || "Failed to update team member. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete staff mutation
  const deleteStaffMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/stylists/${id}`, {
      method: 'DELETE'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stylists'] });
      toast({
        title: "Team Member Removed",
        description: "The team member has been removed from your staff."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Removing Team Member",
        description: error.message || "Failed to remove team member. Please try again.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      bio: "",
      email: "",
      phone: "",
      specialties: []
    });
  };

  const handleEdit = (staffMember: Stylist) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      bio: staffMember.bio || "",
      email: staffMember.email || "",
      phone: staffMember.phone || "",
      specialties: staffMember.specialties || []
    });
  };

  const handleSpecialtyChange = (serviceName: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, serviceName]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specialties: prev.specialties.filter(s => s !== serviceName)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Name Required",
        description: "Please enter the team member's name.",
        variant: "destructive"
      });
      return;
    }

    if (editingStaff) {
      updateStaffMutation.mutate({ id: editingStaff.id, data: formData });
    } else {
      createStaffMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading team members...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-muted-foreground">Manage your {terminology.professionals} and their specialties</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingStaff(null); }}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStaff ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio / Experience</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe their experience, specialties, and background"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              
              {services.length > 0 && (
                <div>
                  <Label>Service Specialties</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select which services this team member can provide
                  </p>
                  <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border rounded p-3">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={formData.specialties.includes(service.name)}
                          onCheckedChange={(checked) => 
                            handleSpecialtyChange(service.name, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={`service-${service.id}`}
                          className="text-sm font-normal flex-1 cursor-pointer"
                        >
                          {service.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setIsAddOpen(false);
                  setEditingStaff(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createStaffMutation.isPending || updateStaffMutation.isPending}>
                  {editingStaff ? 'Update Team Member' : 'Add Team Member'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {staff.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                  </div>
                  
                  {member.bio && (
                    <p className="text-muted-foreground mb-3">{member.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    {member.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {member.specialties && member.specialties.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(member)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteStaffMutation.mutate(member.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {staff.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No team members added yet. Add your first team member to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingStaff} onOpenChange={(open) => !open && setEditingStaff(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-bio">Bio / Experience</Label>
              <Textarea
                id="edit-bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Describe their experience, specialties, and background"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            
            {services.length > 0 && (
              <div>
                <Label>Service Specialties</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select which services this team member can provide
                </p>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border rounded p-3">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-service-${service.id}`}
                        checked={formData.specialties.includes(service.name)}
                        onCheckedChange={(checked) => 
                          handleSpecialtyChange(service.name, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`edit-service-${service.id}`}
                        className="text-sm font-normal flex-1 cursor-pointer"
                      >
                        {service.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingStaff(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateStaffMutation.isPending}>
                Update Team Member
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}