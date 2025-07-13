import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Upload, 
  Ruler, 
  Calculator, 
  FileText,
  Plus,
  Trash2,
  Save,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Photo {
  id: string;
  file: File;
  url: string;
  description: string;
  timestamp: Date;
  category: 'before' | 'progress' | 'after' | 'issue';
}

interface Measurement {
  id: string;
  name: string;
  length: number;
  width?: number;
  height?: number;
  unit: 'ft' | 'in' | 'm' | 'cm';
  notes: string;
}

interface MaterialEstimate {
  material: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  total: number;
}

export default function SimpleContractorTools() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [materials, setMaterials] = useState<MaterialEstimate[]>([]);
  const [activeTab, setActiveTab] = useState<'photos' | 'measurements' | 'materials'>('photos');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Photo Management
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        const photo: Photo = {
          id: Date.now().toString() + Math.random(),
          file,
          url,
          description: '',
          timestamp: new Date(),
          category: 'before'
        };
        setPhotos(prev => [...prev, photo]);
      }
    });
  };

  const updatePhotoDescription = (photoId: string, description: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, description } : photo
    ));
  };

  const updatePhotoCategory = (photoId: string, category: Photo['category']) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, category } : photo
    ));
  };

  const deletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  // Measurement Management
  const addMeasurement = () => {
    const measurement: Measurement = {
      id: Date.now().toString(),
      name: '',
      length: 0,
      width: undefined,
      height: undefined,
      unit: 'ft',
      notes: ''
    };
    setMeasurements(prev => [...prev, measurement]);
  };

  const updateMeasurement = (id: string, field: keyof Measurement, value: any) => {
    setMeasurements(prev => prev.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const deleteMeasurement = (id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  // Material Estimation
  const addMaterial = () => {
    const material: MaterialEstimate = {
      material: '',
      quantity: 0,
      unit: 'sqft',
      pricePerUnit: 0,
      total: 0
    };
    setMaterials(prev => [...prev, material]);
  };

  const updateMaterial = (index: number, field: keyof MaterialEstimate, value: any) => {
    setMaterials(prev => prev.map((m, i) => {
      if (i === index) {
        const updated = { ...m, [field]: value };
        if (field === 'quantity' || field === 'pricePerUnit') {
          updated.total = updated.quantity * updated.pricePerUnit;
        }
        return updated;
      }
      return m;
    }));
  };

  const deleteMaterial = (index: number) => {
    setMaterials(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return materials.reduce((total, material) => total + material.total, 0);
  };

  const exportData = () => {
    const data = {
      photos: photos.map(p => ({
        description: p.description,
        category: p.category,
        timestamp: p.timestamp
      })),
      measurements,
      materials,
      total: calculateTotal(),
      exportDate: new Date()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Project data has been downloaded as JSON file"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contractor Tools</h2>
        <Button onClick={exportData} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b">
        <Button 
          variant={activeTab === 'photos' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('photos')}
          className="flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Photos
        </Button>
        <Button 
          variant={activeTab === 'measurements' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('measurements')}
          className="flex items-center gap-2"
        >
          <Ruler className="w-4 h-4" />
          Measurements
        </Button>
        <Button 
          variant={activeTab === 'materials' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('materials')}
          className="flex items-center gap-2"
        >
          <Calculator className="w-4 h-4" />
          Materials
        </Button>
      </div>

      {/* Photo Documentation */}
      {activeTab === 'photos' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Photo Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Add Photos
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <span className="text-sm text-gray-600">
                  {photos.length} photos uploaded
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map(photo => (
                  <Card key={photo.id} className="overflow-hidden">
                    <img 
                      src={photo.url} 
                      alt="Project photo" 
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <select 
                          value={photo.category}
                          onChange={(e) => updatePhotoCategory(photo.id, e.target.value as Photo['category'])}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="before">Before</option>
                          <option value="progress">Progress</option>
                          <option value="after">After</option>
                          <option value="issue">Issue</option>
                        </select>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deletePhoto(photo.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Photo description..."
                        value={photo.description}
                        onChange={(e) => updatePhotoDescription(photo.id, e.target.value)}
                        className="text-sm"
                      />
                      <div className="text-xs text-gray-500">
                        {photo.timestamp.toLocaleDateString()} {photo.timestamp.toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Measurements */}
      {activeTab === 'measurements' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Measurements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={addMeasurement} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Measurement
              </Button>

              <div className="space-y-4">
                {measurements.map(measurement => (
                  <Card key={measurement.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={measurement.name}
                          onChange={(e) => updateMeasurement(measurement.id, 'name', e.target.value)}
                          placeholder="Room name..."
                        />
                      </div>
                      <div>
                        <Label>Length</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={measurement.length || ''}
                            onChange={(e) => updateMeasurement(measurement.id, 'length', parseFloat(e.target.value))}
                          />
                          <select 
                            value={measurement.unit}
                            onChange={(e) => updateMeasurement(measurement.id, 'unit', e.target.value)}
                            className="border rounded px-2"
                          >
                            <option value="ft">ft</option>
                            <option value="in">in</option>
                            <option value="m">m</option>
                            <option value="cm">cm</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label>Width (optional)</Label>
                        <Input
                          type="number"
                          value={measurement.width || ''}
                          onChange={(e) => updateMeasurement(measurement.id, 'width', parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Height (optional)</Label>
                        <Input
                          type="number"
                          value={measurement.height || ''}
                          onChange={(e) => updateMeasurement(measurement.id, 'height', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Notes</Label>
                        <Textarea
                          value={measurement.notes}
                          onChange={(e) => updateMeasurement(measurement.id, 'notes', e.target.value)}
                          placeholder="Additional details..."
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteMeasurement(measurement.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Calculated Area */}
                    {measurement.length && measurement.width && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <span className="font-semibold">
                          Area: {(measurement.length * measurement.width).toFixed(2)} {measurement.unit}²
                        </span>
                        {measurement.height && (
                          <span className="ml-4">
                            Volume: {(measurement.length * measurement.width * measurement.height).toFixed(2)} {measurement.unit}³
                          </span>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Material Estimation */}
      {activeTab === 'materials' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Material Estimation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={addMaterial} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Material
              </Button>

              <div className="space-y-4">
                {materials.map((material, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                      <div>
                        <Label>Material</Label>
                        <Input
                          value={material.material}
                          onChange={(e) => updateMaterial(index, 'material', e.target.value)}
                          placeholder="Material name..."
                        />
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={material.quantity || ''}
                          onChange={(e) => updateMaterial(index, 'quantity', parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Unit</Label>
                        <select 
                          value={material.unit}
                          onChange={(e) => updateMaterial(index, 'unit', e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="sqft">sqft</option>
                          <option value="linft">linft</option>
                          <option value="each">each</option>
                          <option value="box">box</option>
                          <option value="bag">bag</option>
                        </select>
                      </div>
                      <div>
                        <Label>Price per unit</Label>
                        <Input
                          type="number"
                          value={material.pricePerUnit || ''}
                          onChange={(e) => updateMaterial(index, 'pricePerUnit', parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Total</Label>
                        <div className="text-lg font-semibold text-green-600">
                          ${material.total.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteMaterial(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {materials.length > 0 && (
                <Card className="p-4 bg-blue-50">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Estimate:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}