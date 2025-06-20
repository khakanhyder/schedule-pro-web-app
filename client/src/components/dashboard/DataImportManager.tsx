import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileSpreadsheet, 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Download,
  RefreshCw,
  Link,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface AppointmentPreview {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
  price?: string;
}

const SUPPORTED_PLATFORMS = [
  { id: "csv", name: "CSV File", description: "Export from any app as CSV", icon: FileSpreadsheet },
  { id: "glossgenius", name: "GlossGenius", description: "Direct API integration", icon: Link },
  { id: "square", name: "Square Appointments", description: "Export from Square", icon: Database },
  { id: "acuity", name: "Acuity Scheduling", description: "CSV export from Acuity", icon: Calendar },
  { id: "booksy", name: "Booksy", description: "Export your Booksy data", icon: Users },
  { id: "mindbody", name: "MindBody", description: "MindBody export files", icon: Database }
];

const IMPORT_STEPS: ImportStep[] = [
  {
    id: "platform",
    title: "Choose Platform",
    description: "Select your current scheduling app",
    completed: false
  },
  {
    id: "export",
    title: "Export Data",
    description: "Get your data from current app",
    completed: false
  },
  {
    id: "upload",
    title: "Upload File",
    description: "Upload exported data to Scheduled",
    completed: false
  },
  {
    id: "mapping",
    title: "Map Fields",
    description: "Match fields between systems",
    completed: false
  },
  {
    id: "preview",
    title: "Preview Import",
    description: "Review before importing",
    completed: false
  },
  {
    id: "import",
    title: "Import Data",
    description: "Complete the migration",
    completed: false
  }
];

const SAMPLE_PREVIEW: AppointmentPreview[] = [
  {
    clientName: "Sarah Johnson",
    serviceName: "Haircut & Style",
    date: "2024-06-25",
    time: "10:00 AM",
    status: "Confirmed",
    price: "$85"
  },
  {
    clientName: "Mike Chen",
    serviceName: "Hair Color",
    date: "2024-06-25",
    time: "2:00 PM", 
    status: "Confirmed",
    price: "$120"
  },
  {
    clientName: "Emma Davis",
    serviceName: "Highlights",
    date: "2024-06-26",
    time: "11:00 AM",
    status: "Pending",
    price: "$150"
  }
];

export default function DataImportManager() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [importSteps, setImportSteps] = useState<ImportStep[]>(IMPORT_STEPS);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<AppointmentPreview[]>([]);
  const { toast } = useToast();

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    const updatedSteps = [...importSteps];
    updatedSteps[0].completed = true;
    setImportSteps(updatedSteps);
    setCurrentStep(1);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Mark upload step as complete
          const updatedSteps = [...importSteps];
          updatedSteps[2].completed = true;
          setImportSteps(updatedSteps);
          setCurrentStep(3);
          
          // Show preview data
          setPreviewData(SAMPLE_PREVIEW);
          
          toast({
            title: "File Uploaded Successfully",
            description: `${file.name} has been processed. Review the preview below.`
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleImport = () => {
    toast({
      title: "Import Started",
      description: "Your appointments are being imported. This may take a few minutes."
    });
    
    // Mark final steps as complete
    const updatedSteps = [...importSteps];
    updatedSteps[4].completed = true;
    updatedSteps[5].completed = true;
    setImportSteps(updatedSteps);
    setCurrentStep(5);
  };

  const getStepIcon = (step: ImportStep, index: number) => {
    if (step.completed) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (index === currentStep) return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
    return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Import Your Data</h2>
        <p className="text-muted-foreground">
          Migrate appointments from your current scheduling app to Scheduled
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Import Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {importSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                {getStepIcon(step, index)}
                <div className="flex-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {step.completed && <Badge variant="secondary">Complete</Badge>}
                {index === currentStep && !step.completed && <Badge>Current</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={currentStep < 1 ? "platform" : currentStep < 3 ? "export" : currentStep < 5 ? "import" : "complete"} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platform">Choose Platform</TabsTrigger>
          <TabsTrigger value="export">Export Guide</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="complete">Complete</TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Your Current Scheduling App</CardTitle>
              <CardDescription>
                Choose the platform you're migrating from for specific import instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SUPPORTED_PLATFORMS.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <Card
                      key={platform.id}
                      className={`cursor-pointer transition-colors hover:bg-accent ${
                        selectedPlatform === platform.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handlePlatformSelect(platform.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Icon className="h-8 w-8 text-primary" />
                          <div>
                            <h4 className="font-medium">{platform.name}</h4>
                            <p className="text-sm text-muted-foreground">{platform.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          {selectedPlatform && (
            <Card>
              <CardHeader>
                <CardTitle>Export Instructions</CardTitle>
                <CardDescription>
                  Follow these steps to export your data from {SUPPORTED_PLATFORMS.find(p => p.id === selectedPlatform)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPlatform === "csv" && (
                  <div className="space-y-3">
                    <h4 className="font-medium">CSV Export Requirements:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                      <li>• Include columns: Client Name, Service, Date, Time, Status</li>
                      <li>• Optional: Client Email, Phone, Price, Notes</li>
                      <li>• Use format: YYYY-MM-DD for dates, HH:MM AM/PM for times</li>
                      <li>• Save as .csv file</li>
                    </ul>
                  </div>
                )}
                
                {selectedPlatform === "glossgenius" && (
                  <div className="space-y-3">
                    <h4 className="font-medium">GlossGenius API Integration:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>API Key</Label>
                        <Input placeholder="Your GlossGenius API key" />
                      </div>
                      <div>
                        <Label>Business ID</Label>
                        <Input placeholder="Your Business ID" />
                      </div>
                    </div>
                    <Button className="w-full">Connect to GlossGenius</Button>
                  </div>
                )}

                {selectedPlatform === "square" && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Square Appointments Export:</h4>
                    <ol className="text-sm space-y-1 text-muted-foreground ml-4">
                      <li>1. Log into your Square Dashboard</li>
                      <li>2. Go to Appointments → Reports</li>
                      <li>3. Select date range and click "Export"</li>
                      <li>4. Download CSV file</li>
                    </ol>
                  </div>
                )}

                <Button 
                  onClick={() => {
                    const updatedSteps = [...importSteps];
                    updatedSteps[1].completed = true;
                    setImportSteps(updatedSteps);
                    setCurrentStep(2);
                  }}
                  className="w-full"
                >
                  I've Exported My Data
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Data</CardTitle>
              <CardDescription>
                Upload the exported file from your previous scheduling app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your file here, or click to browse
                  </p>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="w-full"
                  />
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {previewData.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Preview ({previewData.length} appointments found)</h4>
                    <Badge variant="secondary">{previewData.length} appointments</Badge>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <div className="grid grid-cols-5 gap-4 text-sm font-medium">
                        <span>Client</span>
                        <span>Service</span>
                        <span>Date</span>
                        <span>Time</span>
                        <span>Status</span>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {previewData.map((appointment, index) => (
                        <div key={index} className="px-4 py-3 border-b last:border-b-0">
                          <div className="grid grid-cols-5 gap-4 text-sm">
                            <span>{appointment.clientName}</span>
                            <span>{appointment.serviceName}</span>
                            <span>{appointment.date}</span>
                            <span>{appointment.time}</span>
                            <Badge variant={appointment.status === "Confirmed" ? "default" : "secondary"}>
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Please review this preview carefully. Once imported, these appointments will be added to your Scheduled calendar.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3">
                    <Button onClick={handleImport} className="flex-1">
                      Import {previewData.length} Appointments
                    </Button>
                    <Button variant="outline">
                      Download Template
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complete" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold">Import Completed Successfully!</h3>
                  <p className="text-muted-foreground">
                    Your appointments have been imported to Scheduled
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-sm text-muted-foreground">Appointments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">89</div>
                    <div className="text-sm text-muted-foreground">Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-muted-foreground">Services</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full">View Imported Appointments</Button>
                  <Button variant="outline" className="w-full">Import More Data</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}