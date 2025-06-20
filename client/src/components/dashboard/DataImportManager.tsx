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
  { id: "vagaro", name: "Vagaro", description: "Export from Vagaro Pro", icon: Calendar },
  { id: "booksy", name: "Booksy", description: "Export your Booksy data", icon: Users },
  { id: "square", name: "Square Appointments", description: "Export from Square", icon: Database },
  { id: "acuity", name: "Acuity Scheduling", description: "CSV export from Acuity", icon: Calendar },
  { id: "mindbody", name: "MindBody", description: "MindBody export files", icon: Database },
  { id: "schedulicity", name: "Schedulicity", description: "Export from Schedulicity", icon: Calendar },
  { id: "fresha", name: "Fresha (Shedul)", description: "Export from Fresha platform", icon: Users },
  { id: "timely", name: "Timely", description: "Export from Timely app", icon: Calendar },
  { id: "salon-iris", name: "Salon Iris", description: "Export from Salon Iris", icon: Database },
  { id: "rosy", name: "Rosy Salon", description: "Export from Rosy platform", icon: Users }
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

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Migrate All Your Appointments</h3>
              <p className="text-muted-foreground">
                Don't lose your future bookings! Import appointments from 12+ popular scheduling platforms.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">2000+</div>
              <div className="text-sm text-muted-foreground">Appointments migrated daily</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Future appointments preserved</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Client contact info included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Complete in under 10 minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  Follow these step-by-step instructions to export your data from {SUPPORTED_PLATFORMS.find(p => p.id === selectedPlatform)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPlatform === "csv" && (
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Most scheduling apps can export CSV files. Look for "Export", "Download", or "Reports" in your current app.
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-3">
                      <h4 className="font-medium">CSV Export Requirements:</h4>
                      <ul className="text-sm space-y-2 text-muted-foreground ml-4">
                        <li>✓ <strong>Required:</strong> Client Name, Service, Date, Time</li>
                        <li>✓ <strong>Recommended:</strong> Client Email, Phone, Price, Status</li>
                        <li>✓ <strong>Date format:</strong> YYYY-MM-DD (e.g., 2024-06-25)</li>
                        <li>✓ <strong>Time format:</strong> HH:MM AM/PM (e.g., 2:30 PM)</li>
                        <li>✓ <strong>File type:</strong> Save as .csv file</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {selectedPlatform === "glossgenius" && (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        GlossGenius supports direct integration - no file export needed!
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-3">
                      <h4 className="font-medium">Connect Your GlossGenius Account:</h4>
                      <ol className="text-sm space-y-2 text-muted-foreground ml-4">
                        <li>1. Log into your GlossGenius account</li>
                        <li>2. Go to Settings → API Access</li>
                        <li>3. Generate an API key</li>
                        <li>4. Copy your Business ID from account settings</li>
                        <li>5. Enter both values below</li>
                      </ol>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label>API Key</Label>
                          <Input placeholder="Paste your GlossGenius API key" />
                        </div>
                        <div>
                          <Label>Business ID</Label>
                          <Input placeholder="Your Business ID from GlossGenius" />
                        </div>
                      </div>
                      <Button className="w-full">Connect to GlossGenius</Button>
                    </div>
                  </div>
                )}

                {selectedPlatform === "vagaro" && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Vagaro Export Instructions:</h4>
                    <ol className="text-sm space-y-2 text-muted-foreground ml-4">
                      <li>1. Log into your Vagaro Pro account</li>
                      <li>2. Click on "Reports" in the main menu</li>
                      <li>3. Select "Appointment Report"</li>
                      <li>4. Choose your date range (recommend exporting all future appointments)</li>
                      <li>5. Click "Generate Report"</li>
                      <li>6. Click "Export to CSV" button</li>
                      <li>7. Save the downloaded file to upload here</li>
                    </ol>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Make sure to include client contact information in your export settings.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {selectedPlatform === "booksy" && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Booksy Export Instructions:</h4>
                    <ol className="text-sm space-y-2 text-muted-foreground ml-4">
                      <li>1. Open Booksy Business app or web dashboard</li>
                      <li>2. Go to "Analytics" or "Reports" section</li>
                      <li>3. Select "Appointments" report</li>
                      <li>4. Set date range to include all future bookings</li>
                      <li>5. Click "Export" or download icon</li>
                      <li>6. Choose CSV format</li>
                      <li>7. Download and save the file</li>
                    </ol>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        If you don't see export options, contact Booksy support - they can provide your data.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {selectedPlatform === "square" && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Square Appointments Export:</h4>
                    <ol className="text-sm space-y-2 text-muted-foreground ml-4">
                      <li>1. Log into your Square Dashboard at squareup.com</li>
                      <li>2. Click on "Appointments" in the left menu</li>
                      <li>3. Go to "Reports" tab</li>
                      <li>4. Select "Appointment Details" report</li>
                      <li>5. Set date range to include future appointments</li>
                      <li>6. Click "Export" button</li>
                      <li>7. Download the CSV file</li>
                    </ol>
                  </div>
                )}

                {selectedPlatform === "acuity" && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Acuity Scheduling Export:</h4>
                    <ol className="text-sm space-y-2 text-muted-foreground ml-4">
                      <li>1. Log into your Acuity Scheduling account</li>
                      <li>2. Go to "Business" → "Export Data"</li>
                      <li>3. Select "Appointments" from the list</li>
                      <li>4. Choose your date range</li>
                      <li>5. Select CSV format</li>
                      <li>6. Click "Export" and download the file</li>
                    </ol>
                  </div>
                )}

                {selectedPlatform === "mindbody" && (
                  <div className="space-y-4">
                    <h4 className="font-medium">MindBody Export Instructions:</h4>
                    <ol className="text-sm space-y-2 text-muted-foreground ml-4">
                      <li>1. Log into MindBody Business</li>
                      <li>2. Go to "Reports" → "Client Reports"</li>
                      <li>3. Select "Appointment Report"</li>
                      <li>4. Set filters for date range and services</li>
                      <li>5. Click "Export to Excel/CSV"</li>
                      <li>6. Download and save the file</li>
                    </ol>
                  </div>
                )}

                {selectedPlatform === "schedulicity" && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Schedulicity Export Instructions:</h4>
                    <ol className="text-sm space-y-2 text-muted-foreground ml-4">
                      <li>1. Log into your Schedulicity account</li>
                      <li>2. Go to "Reports" section</li>
                      <li>3. Select "Appointment Export"</li>
                      <li>4. Choose date range for future appointments</li>
                      <li>5. Click "Generate Report"</li>
                      <li>6. Download the CSV file</li>
                    </ol>
                  </div>
                )}

                {selectedPlatform === "fresha" && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Fresha (Shedul) Export Instructions:</h4>
                    <ol className="text-sm space-y-2 text-muted-foreground ml-4">
                      <li>1. Log into Fresha Connect (connect.fresha.com)</li>
                      <li>2. Go to "Insights" → "Reports"</li>
                      <li>3. Select "Appointments" report</li>
                      <li>4. Set your date range</li>
                      <li>5. Click "Export" and choose CSV</li>
                      <li>6. Download the file</li>
                    </ol>
                  </div>
                )}

                {selectedPlatform === "timely" && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Timely Export Instructions:</h4>
                    <ol className="text-sm space-y-2 text-muted-foreground ml-4">
                      <li>1. Open Timely app or web dashboard</li>
                      <li>2. Go to "Reports" → "Appointments"</li>
                      <li>3. Select date range for export</li>
                      <li>4. Click "Export" button</li>
                      <li>5. Choose CSV format</li>
                      <li>6. Save the downloaded file</li>
                    </ol>
                  </div>
                )}

                {selectedPlatform === "salon-iris" && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Salon Iris Export Instructions:</h4>
                    <ol className="text-sm space-y-2 text-muted-foreground ml-4">
                      <li>1. Open Salon Iris software</li>
                      <li>2. Go to "Reports" → "Appointment Reports"</li>
                      <li>3. Select "Appointment List" report</li>
                      <li>4. Set date range to include future appointments</li>
                      <li>5. Click "Export" and select CSV format</li>
                      <li>6. Save the file to your computer</li>
                    </ol>
                  </div>
                )}

                {selectedPlatform === "rosy" && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Rosy Salon Export Instructions:</h4>
                    <ol className="text-sm space-y-2 text-muted-foreground ml-4">
                      <li>1. Log into your Rosy account</li>
                      <li>2. Navigate to "Reports" section</li>
                      <li>3. Select "Appointment Report"</li>
                      <li>4. Choose your export date range</li>
                      <li>5. Click "Export to CSV"</li>
                      <li>6. Download the generated file</li>
                    </ol>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Can't find the export option in your app? Contact their support team and ask for:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1 ml-4">
                    <li>• "Appointment data export in CSV format"</li>
                    <li>• Include client names, contact info, services, dates, and times</li>
                    <li>• All future appointments from today forward</li>
                  </ul>
                </div>

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