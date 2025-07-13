import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator, 
  FileText, 
  DollarSign, 
  Clock, 
  Plus, 
  Minus,
  Download,
  Send,
  Copy,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobItem {
  id: string;
  category: 'labor' | 'material' | 'equipment' | 'permit' | 'other';
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  total: number;
  notes?: string;
}

interface JobEstimate {
  id: string;
  jobTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  jobAddress: string;
  items: JobItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  markupRate: number;
  markupAmount: number;
  total: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  notes: string;
}

interface QuoteTemplate {
  id: string;
  name: string;
  items: Omit<JobItem, 'id' | 'total'>[];
  description: string;
}

const defaultTemplates: QuoteTemplate[] = [
  {
    id: 'bathroom-remodel',
    name: 'Bathroom Remodel',
    description: 'Standard bathroom renovation template',
    items: [
      { category: 'labor', description: 'Demolition', quantity: 1, unit: 'day', unitCost: 500, notes: 'Remove existing fixtures' },
      { category: 'labor', description: 'Plumbing rough-in', quantity: 8, unit: 'hours', unitCost: 75, notes: 'Licensed plumber' },
      { category: 'labor', description: 'Electrical work', quantity: 6, unit: 'hours', unitCost: 85, notes: 'Licensed electrician' },
      { category: 'labor', description: 'Drywall & painting', quantity: 16, unit: 'hours', unitCost: 45, notes: 'Primer and 2 coats' },
      { category: 'labor', description: 'Tile installation', quantity: 12, unit: 'hours', unitCost: 55, notes: 'Floor and shower' },
      { category: 'material', description: 'Toilet', quantity: 1, unit: 'each', unitCost: 300, notes: 'Mid-range quality' },
      { category: 'material', description: 'Vanity with sink', quantity: 1, unit: 'each', unitCost: 800, notes: '36" vanity' },
      { category: 'material', description: 'Shower fixtures', quantity: 1, unit: 'set', unitCost: 400, notes: 'Faucet, shower head, trim' },
      { category: 'material', description: 'Tile (floor)', quantity: 50, unit: 'sqft', unitCost: 4, notes: 'Ceramic tile' },
      { category: 'material', description: 'Tile (shower)', quantity: 80, unit: 'sqft', unitCost: 6, notes: 'Subway tile' },
      { category: 'permit', description: 'Building permit', quantity: 1, unit: 'each', unitCost: 150, notes: 'City permit' }
    ]
  },
  {
    id: 'kitchen-renovation',
    name: 'Kitchen Renovation',
    description: 'Complete kitchen remodel template',
    items: [
      { category: 'labor', description: 'Demolition', quantity: 2, unit: 'days', unitCost: 500, notes: 'Remove cabinets & appliances' },
      { category: 'labor', description: 'Electrical upgrade', quantity: 16, unit: 'hours', unitCost: 85, notes: 'New outlets & lighting' },
      { category: 'labor', description: 'Plumbing modifications', quantity: 12, unit: 'hours', unitCost: 75, notes: 'Sink & dishwasher lines' },
      { category: 'labor', description: 'Cabinet installation', quantity: 24, unit: 'hours', unitCost: 50, notes: 'Hang & align cabinets' },
      { category: 'labor', description: 'Countertop installation', quantity: 8, unit: 'hours', unitCost: 60, notes: 'Template & install' },
      { category: 'material', description: 'Base cabinets', quantity: 12, unit: 'linft', unitCost: 200, notes: 'Shaker style' },
      { category: 'material', description: 'Upper cabinets', quantity: 8, unit: 'linft', unitCost: 150, notes: 'Shaker style' },
      { category: 'material', description: 'Quartz countertops', quantity: 30, unit: 'sqft', unitCost: 80, notes: 'Fabricated & installed' },
      { category: 'material', description: 'Backsplash tile', quantity: 40, unit: 'sqft', unitCost: 8, notes: 'Subway tile' },
      { category: 'material', description: 'Sink & faucet', quantity: 1, unit: 'set', unitCost: 600, notes: 'Undermount stainless' }
    ]
  },
  {
    id: 'deck-construction',
    name: 'Deck Construction',
    description: 'Outdoor deck building template',
    items: [
      { category: 'labor', description: 'Site preparation', quantity: 4, unit: 'hours', unitCost: 45, notes: 'Level & mark' },
      { category: 'labor', description: 'Foundation/footings', quantity: 8, unit: 'hours', unitCost: 50, notes: 'Concrete footings' },
      { category: 'labor', description: 'Framing', quantity: 16, unit: 'hours', unitCost: 55, notes: 'Joists & beams' },
      { category: 'labor', description: 'Decking installation', quantity: 12, unit: 'hours', unitCost: 45, notes: 'Deck boards' },
      { category: 'labor', description: 'Railing installation', quantity: 8, unit: 'hours', unitCost: 50, notes: 'Safety railings' },
      { category: 'material', description: 'Pressure treated lumber', quantity: 500, unit: 'bf', unitCost: 2.50, notes: 'Framing lumber' },
      { category: 'material', description: 'Composite decking', quantity: 300, unit: 'sqft', unitCost: 8, notes: 'Trex or similar' },
      { category: 'material', description: 'Railing system', quantity: 40, unit: 'linft', unitCost: 25, notes: 'Aluminum railing' },
      { category: 'material', description: 'Hardware & fasteners', quantity: 1, unit: 'lot', unitCost: 200, notes: 'Screws, bolts, brackets' },
      { category: 'permit', description: 'Building permit', quantity: 1, unit: 'each', unitCost: 100, notes: 'Deck permit' }
    ]
  }
];

export default function JobEstimationQuoting() {
  const [estimates, setEstimates] = useState<JobEstimate[]>([]);
  const [currentEstimate, setCurrentEstimate] = useState<JobEstimate | null>(null);
  const [templates] = useState<QuoteTemplate[]>(defaultTemplates);
  const [activeTab, setActiveTab] = useState<'create' | 'templates' | 'estimates'>('create');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Initialize new estimate
  const initializeEstimate = (): JobEstimate => ({
    id: Date.now().toString(),
    jobTitle: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    jobAddress: '',
    items: [],
    subtotal: 0,
    taxRate: 8.25,
    taxAmount: 0,
    markupRate: 20,
    markupAmount: 0,
    total: 0,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    createdAt: new Date(),
    notes: ''
  });

  // Load estimate from template
  const loadTemplate = (template: QuoteTemplate) => {
    const newEstimate = initializeEstimate();
    newEstimate.jobTitle = template.name;
    newEstimate.items = template.items.map(item => ({
      ...item,
      id: Date.now().toString() + Math.random(),
      total: item.quantity * item.unitCost
    }));
    
    setCurrentEstimate(newEstimate);
    setActiveTab('create');
    setIsEditing(true);
    
    toast({
      title: "Template Loaded",
      description: `${template.name} template loaded successfully`
    });
  };

  // Add new item to estimate
  const addItem = () => {
    if (!currentEstimate) return;
    
    const newItem: JobItem = {
      id: Date.now().toString(),
      category: 'labor',
      description: '',
      quantity: 1,
      unit: 'each',
      unitCost: 0,
      total: 0,
      notes: ''
    };
    
    setCurrentEstimate({
      ...currentEstimate,
      items: [...currentEstimate.items, newItem]
    });
  };

  // Update item
  const updateItem = (itemId: string, field: keyof JobItem, value: any) => {
    if (!currentEstimate) return;
    
    setCurrentEstimate({
      ...currentEstimate,
      items: currentEstimate.items.map(item => {
        if (item.id === itemId) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitCost') {
            updated.total = updated.quantity * updated.unitCost;
          }
          return updated;
        }
        return item;
      })
    });
  };

  // Delete item
  const deleteItem = (itemId: string) => {
    if (!currentEstimate) return;
    
    setCurrentEstimate({
      ...currentEstimate,
      items: currentEstimate.items.filter(item => item.id !== itemId)
    });
  };

  // Calculate totals
  useEffect(() => {
    if (!currentEstimate) return;
    
    const subtotal = currentEstimate.items.reduce((sum, item) => sum + item.total, 0);
    const markupAmount = subtotal * (currentEstimate.markupRate / 100);
    const taxAmount = (subtotal + markupAmount) * (currentEstimate.taxRate / 100);
    const total = subtotal + markupAmount + taxAmount;
    
    setCurrentEstimate(prev => prev ? {
      ...prev,
      subtotal,
      markupAmount,
      taxAmount,
      total
    } : null);
  }, [currentEstimate?.items, currentEstimate?.markupRate, currentEstimate?.taxRate]);

  // Save estimate
  const saveEstimate = () => {
    if (!currentEstimate) return;
    
    const existingIndex = estimates.findIndex(e => e.id === currentEstimate.id);
    if (existingIndex >= 0) {
      const updated = [...estimates];
      updated[existingIndex] = currentEstimate;
      setEstimates(updated);
    } else {
      setEstimates([...estimates, currentEstimate]);
    }
    
    setIsEditing(false);
    toast({
      title: "Estimate Saved",
      description: "Your estimate has been saved successfully"
    });
  };

  // Generate quote document
  const generateQuoteDocument = () => {
    if (!currentEstimate) return;
    
    const doc = {
      quote: {
        id: currentEstimate.id,
        jobTitle: currentEstimate.jobTitle,
        client: {
          name: currentEstimate.clientName,
          email: currentEstimate.clientEmail,
          phone: currentEstimate.clientPhone,
          address: currentEstimate.jobAddress
        },
        items: currentEstimate.items.map(item => ({
          description: item.description,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          unitCost: item.unitCost,
          total: item.total,
          notes: item.notes
        })),
        pricing: {
          subtotal: currentEstimate.subtotal,
          markupRate: currentEstimate.markupRate,
          markupAmount: currentEstimate.markupAmount,
          taxRate: currentEstimate.taxRate,
          taxAmount: currentEstimate.taxAmount,
          total: currentEstimate.total
        },
        validUntil: currentEstimate.validUntil,
        notes: currentEstimate.notes,
        createdAt: currentEstimate.createdAt
      }
    };
    
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${currentEstimate.jobTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Quote Downloaded",
      description: "Professional quote document has been generated"
    });
  };

  // Start new estimate
  const startNewEstimate = () => {
    setCurrentEstimate(initializeEstimate());
    setIsEditing(true);
    setActiveTab('create');
  };

  // Category colors
  const getCategoryColor = (category: JobItem['category']) => {
    switch (category) {
      case 'labor': return 'bg-blue-100 text-blue-800';
      case 'material': return 'bg-green-100 text-green-800';
      case 'equipment': return 'bg-yellow-100 text-yellow-800';
      case 'permit': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Estimation & Quoting</h2>
        <Button onClick={startNewEstimate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Estimate
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b">
        <Button 
          variant={activeTab === 'create' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('create')}
        >
          <Calculator className="w-4 h-4 mr-2" />
          Create Estimate
        </Button>
        <Button 
          variant={activeTab === 'templates' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('templates')}
        >
          <FileText className="w-4 h-4 mr-2" />
          Templates
        </Button>
        <Button 
          variant={activeTab === 'estimates' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('estimates')}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Saved Estimates
        </Button>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <p className="text-sm text-gray-600">{template.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Items included:</div>
                  <div className="text-sm text-gray-600">
                    {template.items.slice(0, 3).map((item, index) => (
                      <div key={index}>• {item.description}</div>
                    ))}
                    {template.items.length > 3 && (
                      <div className="text-gray-500">... and {template.items.length - 3} more</div>
                    )}
                  </div>
                  <Button 
                    onClick={() => loadTemplate(template)}
                    className="w-full mt-4"
                  >
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Estimate Tab */}
      {activeTab === 'create' && currentEstimate && (
        <div className="space-y-6">
          {/* Job Information */}
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Job Title</Label>
                  <Input
                    value={currentEstimate.jobTitle}
                    onChange={(e) => setCurrentEstimate({ ...currentEstimate, jobTitle: e.target.value })}
                    placeholder="e.g., Bathroom Remodel"
                  />
                </div>
                <div>
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    value={currentEstimate.validUntil}
                    onChange={(e) => setCurrentEstimate({ ...currentEstimate, validUntil: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Client Name</Label>
                  <Input
                    value={currentEstimate.clientName}
                    onChange={(e) => setCurrentEstimate({ ...currentEstimate, clientName: e.target.value })}
                    placeholder="Client full name"
                  />
                </div>
                <div>
                  <Label>Client Email</Label>
                  <Input
                    type="email"
                    value={currentEstimate.clientEmail}
                    onChange={(e) => setCurrentEstimate({ ...currentEstimate, clientEmail: e.target.value })}
                    placeholder="client@email.com"
                  />
                </div>
                <div>
                  <Label>Client Phone</Label>
                  <Input
                    value={currentEstimate.clientPhone}
                    onChange={(e) => setCurrentEstimate({ ...currentEstimate, clientPhone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label>Job Address</Label>
                  <Input
                    value={currentEstimate.jobAddress}
                    onChange={(e) => setCurrentEstimate({ ...currentEstimate, jobAddress: e.target.value })}
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Line Items</CardTitle>
                <Button onClick={addItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentEstimate.items.map(item => (
                  <Card key={item.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                      <div>
                        <Label>Category</Label>
                        <select 
                          value={item.category}
                          onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="labor">Labor</option>
                          <option value="material">Material</option>
                          <option value="equipment">Equipment</option>
                          <option value="permit">Permit</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Unit</Label>
                        <select 
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="each">each</option>
                          <option value="sqft">sqft</option>
                          <option value="linft">linft</option>
                          <option value="hours">hours</option>
                          <option value="days">days</option>
                          <option value="bf">bf</option>
                          <option value="lot">lot</option>
                        </select>
                      </div>
                      <div>
                        <Label>Unit Cost</Label>
                        <Input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => updateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Total</Label>
                        <div className="text-lg font-semibold text-green-600">
                          ${item.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mt-2">
                      <Label>Notes</Label>
                      <Input
                        value={item.notes || ''}
                        onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                        placeholder="Additional notes..."
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Markup Rate (%)</Label>
                    <Input
                      type="number"
                      value={currentEstimate.markupRate}
                      onChange={(e) => setCurrentEstimate({ ...currentEstimate, markupRate: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Tax Rate (%)</Label>
                    <Input
                      type="number"
                      value={currentEstimate.taxRate}
                      onChange={(e) => setCurrentEstimate({ ...currentEstimate, taxRate: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${currentEstimate.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Markup ({currentEstimate.markupRate}%):</span>
                    <span className="font-semibold">${currentEstimate.markupAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({currentEstimate.taxRate}%):</span>
                    <span className="font-semibold">${currentEstimate.taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-green-600">${currentEstimate.total.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <Label>Additional Notes</Label>
                  <Textarea
                    value={currentEstimate.notes}
                    onChange={(e) => setCurrentEstimate({ ...currentEstimate, notes: e.target.value })}
                    placeholder="Terms, conditions, or additional notes..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveEstimate} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Estimate
                  </Button>
                  <Button onClick={generateQuoteDocument} variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Generate Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Saved Estimates Tab */}
      {activeTab === 'estimates' && (
        <div className="space-y-4">
          {estimates.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p>No saved estimates yet</p>
                <p className="text-sm">Create your first estimate to get started</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {estimates.map(estimate => (
                <Card key={estimate.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{estimate.jobTitle}</CardTitle>
                      <Badge variant={estimate.status === 'draft' ? 'outline' : 'default'}>
                        {estimate.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{estimate.clientName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total:</span>
                        <span className="font-semibold text-green-600">${estimate.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Items:</span>
                        <span className="text-sm">{estimate.items.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Valid until:</span>
                        <span className="text-sm">{new Date(estimate.validUntil).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setCurrentEstimate(estimate);
                            setActiveTab('create');
                            setIsEditing(true);
                          }}
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setCurrentEstimate(estimate);
                            generateQuoteDocument();
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}