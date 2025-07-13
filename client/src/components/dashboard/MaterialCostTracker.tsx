import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck, 
  DollarSign, 
  Plus, 
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Star,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Supplier {
  id: string;
  name: string;
  category: string;
  phone: string;
  address: string;
  rating: number;
  deliveryTime: string;
  minimumOrder: number;
  paymentTerms: string;
  specialties: string[];
  notes: string;
}

interface MaterialPrice {
  id: string;
  supplierId: string;
  category: string;
  materialName: string;
  unit: string;
  currentPrice: number;
  previousPrice: number;
  priceChange: number;
  lastUpdated: Date;
  inStock: boolean;
  leadTime: string;
  bulkPricing: Array<{
    quantity: number;
    discount: number;
    price: number;
  }>;
}

interface MaterialOrder {
  id: string;
  supplierId: string;
  items: Array<{
    materialId: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'draft' | 'ordered' | 'shipped' | 'delivered';
  orderDate: Date;
  expectedDelivery: Date;
  notes: string;
}

const defaultSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Home Depot Pro',
    category: 'General Building',
    phone: '(555) 123-4567',
    address: '123 Main St, Your City',
    rating: 4.2,
    deliveryTime: '1-2 days',
    minimumOrder: 250,
    paymentTerms: 'Net 30',
    specialties: ['Lumber', 'Hardware', 'Tools', 'Electrical'],
    notes: 'Volume discounts available, early morning delivery'
  },
  {
    id: '2',
    name: 'ABC Plumbing Supply',
    category: 'Plumbing',
    phone: '(555) 987-6543',
    address: '456 Trade Ave, Your City',
    rating: 4.7,
    deliveryTime: 'Same day',
    minimumOrder: 100,
    paymentTerms: 'Net 15',
    specialties: ['Fixtures', 'Pipe', 'Fittings', 'Water Heaters'],
    notes: 'Same-day delivery on orders placed before 2 PM'
  },
  {
    id: '3',
    name: 'Elite Electrical Wholesale',
    category: 'Electrical',
    phone: '(555) 456-7890',
    address: '789 Industrial Blvd, Your City',
    rating: 4.5,
    deliveryTime: '2-3 days',
    minimumOrder: 500,
    paymentTerms: 'Net 45',
    specialties: ['Wire', 'Panels', 'Conduit', 'Lighting'],
    notes: 'Contractor pricing available with license verification'
  }
];

const defaultMaterialPrices: MaterialPrice[] = [
  {
    id: '1',
    supplierId: '1',
    category: 'Lumber',
    materialName: '2x4x8 Stud Grade',
    unit: 'each',
    currentPrice: 3.89,
    previousPrice: 4.12,
    priceChange: -0.23,
    lastUpdated: new Date(),
    inStock: true,
    leadTime: '1-2 days',
    bulkPricing: [
      { quantity: 100, discount: 5, price: 3.70 },
      { quantity: 500, discount: 10, price: 3.50 },
      { quantity: 1000, discount: 15, price: 3.31 }
    ]
  },
  {
    id: '2',
    supplierId: '1',
    category: 'Lumber',
    materialName: 'Plywood 3/4" OSB',
    unit: 'sheet',
    currentPrice: 52.99,
    previousPrice: 48.50,
    priceChange: 4.49,
    lastUpdated: new Date(),
    inStock: true,
    leadTime: '1-2 days',
    bulkPricing: [
      { quantity: 25, discount: 3, price: 51.40 },
      { quantity: 50, discount: 7, price: 49.28 },
      { quantity: 100, discount: 12, price: 46.63 }
    ]
  },
  {
    id: '3',
    supplierId: '2',
    category: 'Plumbing',
    materialName: 'PVC Pipe 3/4" x 10ft',
    unit: 'each',
    currentPrice: 8.75,
    previousPrice: 8.25,
    priceChange: 0.50,
    lastUpdated: new Date(),
    inStock: true,
    leadTime: 'Same day',
    bulkPricing: [
      { quantity: 50, discount: 8, price: 8.05 },
      { quantity: 100, discount: 15, price: 7.44 },
      { quantity: 200, discount: 20, price: 7.00 }
    ]
  },
  {
    id: '4',
    supplierId: '3',
    category: 'Electrical',
    materialName: '12 AWG Romex Wire',
    unit: 'ft',
    currentPrice: 1.25,
    previousPrice: 1.15,
    priceChange: 0.10,
    lastUpdated: new Date(),
    inStock: false,
    leadTime: '5-7 days',
    bulkPricing: [
      { quantity: 250, discount: 5, price: 1.19 },
      { quantity: 500, discount: 10, price: 1.13 },
      { quantity: 1000, discount: 18, price: 1.03 }
    ]
  }
];

export default function MaterialCostTracker() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(defaultSuppliers);
  const [materialPrices, setMaterialPrices] = useState<MaterialPrice[]>(defaultMaterialPrices);
  const [activeTab, setActiveTab] = useState('prices');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({});
  const [newMaterial, setNewMaterial] = useState<Partial<MaterialPrice>>({});
  const [bulkCalculator, setBulkCalculator] = useState<{
    materialId: string;
    quantity: number;
    result: any;
  }>({ materialId: '', quantity: 0, result: null });
  const { toast } = useToast();

  const categories = ['all', 'Lumber', 'Plumbing', 'Electrical', 'Hardware', 'Drywall', 'Flooring', 'Roofing'];

  const filteredMaterials = materialPrices.filter(material => {
    const matchesSearch = material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const calculateBulkPricing = (materialId: string, quantity: number) => {
    const material = materialPrices.find(m => m.id === materialId);
    if (!material) return null;

    let bestPrice = material.currentPrice;
    let bestDiscount = 0;
    let appliedTier = null;

    for (const tier of material.bulkPricing) {
      if (quantity >= tier.quantity) {
        bestPrice = tier.price;
        bestDiscount = tier.discount;
        appliedTier = tier;
      }
    }

    return {
      unitPrice: bestPrice,
      totalPrice: bestPrice * quantity,
      discount: bestDiscount,
      savings: (material.currentPrice - bestPrice) * quantity,
      appliedTier
    };
  };

  const handleBulkCalculation = () => {
    if (bulkCalculator.materialId && bulkCalculator.quantity > 0) {
      const result = calculateBulkPricing(bulkCalculator.materialId, bulkCalculator.quantity);
      setBulkCalculator(prev => ({ ...prev, result }));
    }
  };

  const addSupplier = () => {
    if (newSupplier.name && newSupplier.category) {
      const supplier: Supplier = {
        id: Date.now().toString(),
        name: newSupplier.name,
        category: newSupplier.category,
        phone: newSupplier.phone || '',
        address: newSupplier.address || '',
        rating: newSupplier.rating || 0,
        deliveryTime: newSupplier.deliveryTime || '',
        minimumOrder: newSupplier.minimumOrder || 0,
        paymentTerms: newSupplier.paymentTerms || '',
        specialties: newSupplier.specialties || [],
        notes: newSupplier.notes || ''
      };
      
      setSuppliers([...suppliers, supplier]);
      setNewSupplier({});
      setShowAddSupplier(false);
      toast({
        title: "Supplier Added",
        description: `${supplier.name} has been added to your supplier database`
      });
    }
  };

  const refreshPrices = () => {
    // Simulate price updates
    const updatedPrices = materialPrices.map(material => {
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const newPrice = material.currentPrice * (1 + variation);
      const priceChange = newPrice - material.currentPrice;
      
      return {
        ...material,
        previousPrice: material.currentPrice,
        currentPrice: parseFloat(newPrice.toFixed(2)),
        priceChange: parseFloat(priceChange.toFixed(2)),
        lastUpdated: new Date()
      };
    });
    
    setMaterialPrices(updatedPrices);
    toast({
      title: "Prices Updated",
      description: "Material prices have been refreshed from suppliers"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Material Cost Tracker</h2>
          <p className="text-muted-foreground">
            Track supplier prices, manage bulk orders, and optimize material costs
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshPrices} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Prices
          </Button>
          <Button onClick={() => setShowAddSupplier(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="prices">Price Tracker</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Calculator</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="prices" className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredMaterials.map((material) => {
              const supplier = suppliers.find(s => s.id === material.supplierId);
              const isIncreasing = material.priceChange > 0;
              const isDecreasing = material.priceChange < 0;
              
              return (
                <Card key={material.id} className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold">{material.materialName}</h3>
                        <Badge variant={material.inStock ? "default" : "destructive"}>
                          {material.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Supplier: {supplier?.name}</p>
                        <p>Unit: {material.unit} | Lead Time: {material.leadTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold">${material.currentPrice.toFixed(2)}</div>
                        <div className="flex items-center gap-1 text-sm">
                          {isIncreasing && <TrendingUp className="h-3 w-3 text-red-500" />}
                          {isDecreasing && <TrendingDown className="h-3 w-3 text-green-500" />}
                          <span className={isIncreasing ? "text-red-500" : isDecreasing ? "text-green-500" : "text-muted-foreground"}>
                            {material.priceChange > 0 ? '+' : ''}${material.priceChange.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setBulkCalculator({ materialId: material.id, quantity: 100, result: null })}
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          Bulk Price
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid gap-4">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">{supplier.name}</h3>
                      <Badge variant="outline">{supplier.category}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {supplier.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {supplier.address}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Delivery: {supplier.deliveryTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{supplier.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      <p>Min Order: ${supplier.minimumOrder}</p>
                      <p>Terms: {supplier.paymentTerms}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            window.open(`tel:${supplier.phone}`, '_self');
                          }}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setActiveTab('prices');
                            setSearchTerm(supplier.name);
                            toast({
                              title: "Supplier Materials",
                              description: `Showing all materials from ${supplier.name}`
                            });
                          }}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          View Materials
                        </Button>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setActiveTab('orders');
                          toast({
                            title: "Quick Order",
                            description: `Creating order for ${supplier.name}`,
                            duration: 3000
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Order
                      </Button>
                    </div>
                  </div>
                </div>
                
                {supplier.specialties.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {supplier.specialties.map((specialty) => (
                        <Badge 
                          key={specialty} 
                          variant="secondary" 
                          className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => {
                            setActiveTab('prices');
                            setSelectedCategory(specialty);
                            setSearchTerm('');
                            toast({
                              title: "Filter Applied",
                              description: `Showing ${specialty} materials from ${supplier.name}`
                            });
                          }}
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {supplier.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium mb-2">Notes:</p>
                    <p className="text-sm text-muted-foreground">{supplier.notes}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Bulk Pricing Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="material-select">Select Material</Label>
                <Select value={bulkCalculator.materialId} onValueChange={(value) => setBulkCalculator(prev => ({ ...prev, materialId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose material..." />
                  </SelectTrigger>
                  <SelectContent>
                    {materialPrices
                      .filter(material => 
                        material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        material.category.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((material) => {
                        const supplier = suppliers.find(s => s.id === material.supplierId);
                        return (
                          <SelectItem key={material.id} value={material.id}>
                            {material.materialName} - ${material.currentPrice.toFixed(2)} ({supplier?.name})
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={bulkCalculator.quantity}
                  onChange={(e) => setBulkCalculator(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter quantity"
                />
              </div>
            </div>
            <Button onClick={handleBulkCalculation} className="mb-4">
              Calculate Bulk Pricing
            </Button>

            {bulkCalculator.result && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-semibold mb-3">Bulk Pricing Result</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Unit Price</p>
                    <p className="text-lg font-bold">${bulkCalculator.result.unitPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="text-lg font-bold">${bulkCalculator.result.totalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Discount</p>
                    <p className="text-lg font-bold text-green-600">{bulkCalculator.result.discount}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">You Save</p>
                    <p className="text-lg font-bold text-green-600">${bulkCalculator.result.savings.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card className="p-6">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Order Management</h3>
              <p className="text-muted-foreground mb-4">
                Track material orders and delivery schedules
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Supplier Dialog */}
      {showAddSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Supplier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="supplier-name">Supplier Name</Label>
                <Input
                  id="supplier-name"
                  value={newSupplier.name || ''}
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supplier-category">Category</Label>
                <Select value={newSupplier.category || ''} onValueChange={(value) => setNewSupplier({...newSupplier, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'all').map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="supplier-phone">Phone</Label>
                <Input
                  id="supplier-phone"
                  value={newSupplier.phone || ''}
                  onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supplier-address">Address</Label>
                <Input
                  id="supplier-address"
                  value={newSupplier.address || ''}
                  onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addSupplier} className="flex-1">Add Supplier</Button>
                <Button variant="outline" onClick={() => setShowAddSupplier(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}