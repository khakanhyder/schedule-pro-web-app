import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { insertStylistSchema, type Stylist } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useIndustry, getTerminology } from "@/lib/industryContext";

const formSchema = insertStylistSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  specialties: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

export default function StaffManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStylist, setEditingStylist] = useState<Stylist | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedIndustry } = useIndustry();
  const terminology = getTerminology(selectedIndustry.id);

  const { data: stylists = [], isLoading } = useQuery<Stylist[]>({
    queryKey: ["/api/stylists"],
    queryFn: () => apiRequest("GET", "/api/stylists").then(res => res.json())
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      specialties: "",
      email: "",
      phone: ""
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => 
      apiRequest("POST", "/api/stylists", {
        ...data,
        specialties: data.specialties ? data.specialties.split(",").map(s => s.trim()) : []
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stylists"] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: `${terminology.professional} Added`,
        description: "Successfully added new team member"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      apiRequest("PUT", `/api/stylists/${id}`, {
        ...data,
        specialties: data.specialties ? data.specialties.split(",").map(s => s.trim()) : []
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stylists"] });
      setEditingStylist(null);
      form.reset();
      toast({
        title: `${terminology.professional} Updated`,
        description: "Successfully updated team member"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/stylists/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stylists"] });
      toast({
        title: `${terminology.professional} Removed`,
        description: "Team member has been removed"
      });
    }
  });

  const onSubmit = (data: FormData) => {
    if (editingStylist) {
      updateMutation.mutate({ id: editingStylist.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (stylist: Stylist) => {
    setEditingStylist(stylist);
    form.reset({
      name: stylist.name,
      bio: stylist.bio,
      specialties: Array.isArray(stylist.specialties) ? stylist.specialties.join(", ") : stylist.specialties || "",
      email: stylist.email || "",
      phone: stylist.phone || ""
    });
  };

  const handleDelete = (id: number) => {
    if (confirm(`Are you sure you want to remove this ${terminology.professional.toLowerCase()}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setEditingStylist(null);
    form.reset();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Management</h2>
          <p className="text-muted-foreground">
            Manage your {terminology.professional.toLowerCase()}s and team members
          </p>
        </div>
        <Dialog open={isAddDialogOpen || !!editingStylist} onOpenChange={closeDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add {terminology.professional}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingStylist ? `Edit ${terminology.professional}` : `Add New ${terminology.professional}`}
              </DialogTitle>
              <DialogDescription>
                {editingStylist ? 'Update team member information' : 'Add a new team member to your business'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={`Tell clients about this ${terminology.professional.toLowerCase()}'s experience and background...`}
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialties"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialties (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter specialties separated by commas (e.g., Hair Color, Cuts, Extensions)"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingStylist ? 'Update' : 'Add'} {terminology.professional}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stylists.map((stylist) => (
          <Card key={stylist.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stylist.name}`} />
                    <AvatarFallback>
                      {stylist.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{stylist.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {stylist.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[120px]">{stylist.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(stylist)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(stylist.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                {stylist.bio}
              </p>
              
              {stylist.specialties && Array.isArray(stylist.specialties) && stylist.specialties.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {stylist.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {stylist.phone && (
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{stylist.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {stylists.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Team Members Yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first {terminology.professional.toLowerCase()} to start managing your team
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add {terminology.professional}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}