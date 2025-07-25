import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  QrCode, 
  Download, 
  Eye, 
  Trash2, 
  Plus, 
  Copy, 
  Calendar,
  ExternalLink,
  Printer
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const qrCodeFormSchema = z.object({
  businessId: z.number().min(1, "Business ID is required"),
  codeType: z.enum(['general', 'service_specific'], {
    required_error: "Please select a QR code type"
  }),
  serviceId: z.number().optional(),
  displayName: z.string().min(1, "Display name is required"),
});

type QRCodeFormValues = z.infer<typeof qrCodeFormSchema>;

interface QRCodeData {
  id: number;
  businessId: number;
  codeType: 'general' | 'service_specific';
  serviceId?: number;
  qrCodeData: string;
  displayName: string;
  scanCount: number;
  isActive: boolean;
  createdAt: string;
  lastScanned?: string;
}

export default function QRCodeManager() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewQRCode, setPreviewQRCode] = useState<{image: string, url: string} | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<QRCodeFormValues>({
    resolver: zodResolver(qrCodeFormSchema),
    defaultValues: {
      businessId: 1, // Default business ID - you may want to get this from context
      displayName: '',
    },
  });

  // Fetch QR codes
  const { data: qrCodes = [], isLoading } = useQuery({
    queryKey: ['/api/qr-codes'],
  });

  // Fetch services for service-specific QR codes
  const { data: services = [] } = useQuery({
    queryKey: ['/api/services'],
  });

  // Fetch business profiles
  const { data: businesses = [] } = useQuery({
    queryKey: ['/api/business-profiles'],
  });

  // Create QR code mutation
  const createQRCodeMutation = useMutation({
    mutationFn: async (data: QRCodeFormValues) => {
      const response = await fetch('/api/qr-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create QR code');
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/qr-codes'] });
      setDialogOpen(false);
      form.reset();
      toast({
        title: "QR Code Created",
        description: "Your booking QR code has been generated successfully.",
      });
      
      // Show the generated QR code
      setPreviewQRCode({
        image: result.qrCodeImage,
        url: result.bookingUrl
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete QR code mutation
  const deleteQRCodeMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/qr-codes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete QR code');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/qr-codes'] });
      toast({
        title: "QR Code Deleted",
        description: "The QR code has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: QRCodeFormValues) => {
    createQRCodeMutation.mutate(data);
  };

  const getServiceName = (serviceId?: number) => {
    if (!serviceId) return 'All Services';
    const service = (services as any[]).find((s: any) => s.id === serviceId);
    return service?.name || 'Unknown Service';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Booking link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = (qrCode: QRCodeData, imageData: string) => {
    const link = document.createElement('a');
    link.download = `${qrCode.displayName.replace(/\s+/g, '_')}_QR_Code.png`;
    link.href = imageData;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-40 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QR Code Manager</h2>
          <p className="text-gray-600">Create and manage QR codes for easy appointment booking</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create QR Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New QR Code</DialogTitle>
              <DialogDescription>
                Generate a QR code that customers can scan to book appointments directly.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Front Desk QR Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="codeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>QR Code Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select QR code type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General Booking</SelectItem>
                          <SelectItem value="service_specific">Service-Specific</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('codeType') === 'service_specific' && (
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Service *</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(services as any[]).map((service: any) => (
                              <SelectItem key={service.id} value={service.id.toString()}>
                                {service.name} - ${service.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createQRCodeMutation.isPending}>
                    {createQRCodeMutation.isPending ? 'Creating...' : 'Create QR Code'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* QR Code Preview Dialog */}
      {previewQRCode && (
        <Dialog open={!!previewQRCode} onOpenChange={() => setPreviewQRCode(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>QR Code Generated</DialogTitle>
              <DialogDescription>
                Your QR code is ready! Customers can scan this to book appointments.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-center p-4 bg-white border rounded-lg">
                <img 
                  src={previewQRCode.image} 
                  alt="Generated QR Code" 
                  className="w-48 h-48"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Booking URL:</label>
                <div className="flex gap-2">
                  <Input 
                    value={previewQRCode.url} 
                    readOnly 
                    className="text-xs"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(previewQRCode.url)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => downloadQRCode({ displayName: 'New QR Code' } as QRCodeData, previewQRCode.image)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* QR Codes Grid */}
      {(qrCodes as any[]).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No QR Codes Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first QR code to allow customers to book appointments by scanning.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First QR Code
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(qrCodes as any[]).map((qrCode: QRCodeData) => (
            <Card key={qrCode.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{qrCode.displayName}</CardTitle>
                    <CardDescription>
                      {qrCode.codeType === 'general' ? 'General Booking' : getServiceName(qrCode.serviceId)}
                    </CardDescription>
                  </div>
                  <Badge variant={qrCode.isActive ? 'default' : 'secondary'}>
                    {qrCode.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* QR Code Image */}
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-32 h-32 bg-white p-2 rounded border">
                    <img 
                      src={`data:image/png;base64,${btoa(qrCode.qrCodeData)}`}
                      alt={`QR Code for ${qrCode.displayName}`}
                      className="w-full h-full"
                      onError={(e) => {
                        // Fallback: generate QR code on frontend if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{qrCode.scanCount}</div>
                    <div className="text-xs text-gray-500">Scans</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {qrCode.lastScanned 
                        ? new Date(qrCode.lastScanned).toLocaleDateString()
                        : 'Never'
                      }
                    </div>
                    <div className="text-xs text-gray-500">Last Scan</div>
                  </div>
                </div>

                <Separator />

                {/* Booking URL */}
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">
                    Booking URL:
                  </label>
                  <div className="flex gap-1">
                    <Input 
                      value={qrCode.qrCodeData} 
                      readOnly 
                      className="text-xs h-8"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => copyToClipboard(qrCode.qrCodeData)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => window.open(qrCode.qrCodeData, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      // Generate QR code image for download
                      // This would need to be implemented with a QR code library
                      toast({
                        title: "Download",
                        description: "QR code download feature would be implemented here.",
                      });
                    }}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteQRCodeMutation.mutate(qrCode.id)}
                    disabled={deleteQRCodeMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}