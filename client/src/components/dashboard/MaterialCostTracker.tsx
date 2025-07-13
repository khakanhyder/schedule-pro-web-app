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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  RefreshCw,
  Send,
  Download,
  FileText,
  ShoppingCart
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
  const [selectedSupplierForOrder, setSelectedSupplierForOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Array<{
    materialId: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>>([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderMode, setOrderMode] = useState<'order' | 'quote'>('order');
  const [userLocation, setUserLocation] = useState('');
  const [preferredStores, setPreferredStores] = useState<string[]>([]);
  const [showLocationSettings, setShowLocationSettings] = useState(false);
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
          <Button onClick={() => setShowLocationSettings(true)} variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            Location Settings
          </Button>
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
          {/* Supplier Search */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search suppliers or materials..."
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

            {/* Quick Material Search Results */}
            {searchTerm && (
              <Card className="p-4">
                <h4 className="font-medium mb-3">Material Search Results</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {materialPrices
                    .filter(material => 
                      material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      material.category.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .slice(0, 10)
                    .map((material) => {
                      const supplier = suppliers.find(s => s.id === material.supplierId);
                      return (
                        <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                          <div className="flex-1">
                            <div className="font-medium">{material.materialName}</div>
                            <div className="text-sm text-muted-foreground">
                              {supplier?.name} • {material.category}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${material.currentPrice.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">per {material.unit}</div>
                          </div>
                          <div className="ml-4 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setBulkCalculator({ materialId: material.id, quantity: 100, result: null });
                                setActiveTab('bulk');
                              }}
                            >
                              <Calculator className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSupplierForOrder(material.supplierId);
                                setOrderMode('quote');
                                setActiveTab('orders');
                                setOrderItems([]);
                                setOrderNotes('');
                              }}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  {materialPrices.filter(material => 
                    material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    material.category.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No materials found matching "{searchTerm}"
                    </p>
                  )}
                </div>
              </Card>
            )}
          </div>

          <div className="grid gap-4">
            {suppliers
              .filter(supplier => {
                const matchesSearch = !searchTerm || 
                  supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  supplier.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
                const matchesCategory = selectedCategory === 'all' || 
                  supplier.category === selectedCategory ||
                  supplier.specialties.includes(selectedCategory);
                return matchesSearch && matchesCategory;
              })
              .sort((a, b) => {
                // Preferred suppliers first
                const aPreferred = preferredStores.includes(a.id);
                const bPreferred = preferredStores.includes(b.id);
                if (aPreferred && !bPreferred) return -1;
                if (!aPreferred && bPreferred) return 1;
                // Then by rating
                return b.rating - a.rating;
              })
              .map((supplier) => (
              <Card key={supplier.id} className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">{supplier.name}</h3>
                      <Badge variant="outline">{supplier.category}</Badge>
                      {preferredStores.includes(supplier.id) && (
                        <Badge variant="default" className="bg-green-500">
                          <Star className="h-3 w-3 mr-1" />
                          Preferred
                        </Badge>
                      )}
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
                            setSelectedCategory('all');
                            toast({
                              title: "Supplier Materials",
                              description: `Showing all materials from ${supplier.name}`
                            });
                          }}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Show Materials ({materialPrices.filter(m => m.supplierId === supplier.id).length})
                        </Button>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedSupplierForOrder(supplier.id);
                            setOrderMode('order');
                            setActiveTab('orders');
                            setOrderItems([]);
                            setOrderNotes('');
                            toast({
                              title: "Quick Order",
                              description: `Creating order for ${supplier.name}`,
                              duration: 3000
                            });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Order
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedSupplierForOrder(supplier.id);
                            setOrderMode('quote');
                            setActiveTab('orders');
                            setOrderItems([]);
                            setOrderNotes('');
                            toast({
                              title: "Create Quote",
                              description: `Creating quote for ${supplier.name}`,
                              duration: 3000
                            });
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Quote
                        </Button>
                      </div>
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
          {selectedSupplierForOrder ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    {orderMode === 'quote' ? 'Create Quote' : 'Create Order'}
                  </h3>
                  <p className="text-muted-foreground">
                    {orderMode === 'quote' ? 'Generate quote from' : 'Order from'} {suppliers.find(s => s.id === selectedSupplierForOrder)?.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="flex bg-muted rounded-lg p-1">
                    <Button
                      variant={orderMode === 'quote' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setOrderMode('quote')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Quote
                    </Button>
                    <Button
                      variant={orderMode === 'order' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setOrderMode('order')}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Order
                    </Button>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedSupplierForOrder(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Add Materials to Order */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium">Add Materials</h4>
                <div className="grid gap-4">
                  {materialPrices
                    .filter(material => material.supplierId === selectedSupplierForOrder)
                    .map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{material.materialName}</div>
                          <div className="text-sm text-muted-foreground">
                            ${material.currentPrice.toFixed(2)} per {material.unit}
                            {material.inStock ? (
                              <Badge variant="default" className="ml-2">In Stock</Badge>
                            ) : (
                              <Badge variant="destructive" className="ml-2">Out of Stock</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Qty"
                            className="w-20"
                            onChange={(e) => {
                              const quantity = parseInt(e.target.value) || 0;
                              if (quantity > 0) {
                                const existingItemIndex = orderItems.findIndex(item => item.materialId === material.id);
                                const unitPrice = material.currentPrice;
                                const total = quantity * unitPrice;
                                
                                if (existingItemIndex >= 0) {
                                  const newItems = [...orderItems];
                                  newItems[existingItemIndex] = {
                                    materialId: material.id,
                                    quantity,
                                    unitPrice,
                                    total
                                  };
                                  setOrderItems(newItems);
                                } else {
                                  setOrderItems([...orderItems, {
                                    materialId: material.id,
                                    quantity,
                                    unitPrice,
                                    total
                                  }]);
                                }
                              } else {
                                setOrderItems(orderItems.filter(item => item.materialId !== material.id));
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setBulkCalculator({ materialId: material.id, quantity: 100, result: null });
                              setActiveTab('bulk');
                            }}
                          >
                            <Calculator className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Order Summary */}
              {orderItems.length > 0 && (
                <div className="border rounded-lg p-4 mb-6">
                  <h4 className="font-medium mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    {orderItems.map((item) => {
                      const material = materialPrices.find(m => m.id === item.materialId);
                      return (
                        <div key={item.materialId} className="flex justify-between text-sm">
                          <span>{material?.materialName} × {item.quantity}</span>
                          <span>${item.total.toFixed(2)}</span>
                        </div>
                      );
                    })}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Subtotal</span>
                      <span>${orderItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax (8.5%)</span>
                      <span>${(orderItems.reduce((sum, item) => sum + item.total, 0) * 0.085).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${(orderItems.reduce((sum, item) => sum + item.total, 0) * 1.085).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Notes */}
              <div className="space-y-2 mb-6">
                <Label htmlFor="order-notes">Order Notes</Label>
                <Textarea
                  id="order-notes"
                  placeholder="Special instructions, delivery preferences, etc."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Order Actions */}
              <div className="flex gap-2">
                <Button
                  disabled={orderItems.length === 0}
                  onClick={() => {
                    const supplier = suppliers.find(s => s.id === selectedSupplierForOrder);
                    const orderTotal = orderItems.reduce((sum, item) => sum + item.total, 0) * 1.085;
                    
                    toast({
                      title: orderMode === 'quote' ? "Quote Generated" : "Order Created",
                      description: `${orderMode === 'quote' ? 'Quote' : 'Order'} for $${orderTotal.toFixed(2)} ${orderMode === 'quote' ? 'generated from' : 'sent to'} ${supplier?.name}`,
                      duration: 5000
                    });
                    
                    // Reset form
                    setOrderItems([]);
                    setOrderNotes('');
                    setSelectedSupplierForOrder(null);
                    setActiveTab('suppliers');
                  }}
                >
                  {orderMode === 'quote' ? (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Quote
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Order
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  disabled={orderItems.length === 0}
                  onClick={() => {
                    const supplier = suppliers.find(s => s.id === selectedSupplierForOrder);
                    const orderData = {
                      type: orderMode,
                      supplier: supplier?.name,
                      items: orderItems.map(item => {
                        const material = materialPrices.find(m => m.id === item.materialId);
                        return {
                          name: material?.materialName,
                          quantity: item.quantity,
                          unitPrice: item.unitPrice,
                          total: item.total
                        };
                      }),
                      subtotal: orderItems.reduce((sum, item) => sum + item.total, 0),
                      tax: orderItems.reduce((sum, item) => sum + item.total, 0) * 0.085,
                      total: orderItems.reduce((sum, item) => sum + item.total, 0) * 1.085,
                      notes: orderNotes,
                      date: new Date().toISOString()
                    };
                    
                    const blob = new Blob([JSON.stringify(orderData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${orderMode}-${supplier?.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    
                    toast({
                      title: `${orderMode === 'quote' ? 'Quote' : 'Order'} Exported`,
                      description: `${orderMode === 'quote' ? 'Quote' : 'Order'} details downloaded as JSON file`
                    });
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export {orderMode === 'quote' ? 'Quote' : 'Order'}
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Order Management</h3>
                <p className="text-muted-foreground mb-4">
                  Create orders by clicking "Create Order" on any supplier card
                </p>
                <Button onClick={() => setActiveTab('suppliers')}>
                  <Truck className="h-4 w-4 mr-2" />
                  View Suppliers
                </Button>
              </div>
            </Card>
          )}
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

      {/* Location Settings Dialog */}
      <Dialog open={showLocationSettings} onOpenChange={setShowLocationSettings}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Location & Preferred Suppliers</DialogTitle>
            <DialogDescription>
              Set your location to find nearby suppliers and manage your preferred stores
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Your Location</Label>
              <Input
                id="location"
                placeholder="Enter city, state or ZIP code"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Used to find nearby suppliers and calculate delivery costs
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Preferred Suppliers</Label>
              <div className="grid grid-cols-2 gap-2">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={supplier.id}
                      checked={preferredStores.includes(supplier.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferredStores([...preferredStores, supplier.id]);
                        } else {
                          setPreferredStores(preferredStores.filter(id => id !== supplier.id));
                        }
                      }}
                    />
                    <Label htmlFor={supplier.id} className="text-sm font-normal">
                      {supplier.name}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Preferred suppliers will be shown first in search results
              </p>
            </div>

            {userLocation && (
              <div className="space-y-2">
                <Label>Nearby Suppliers</Label>
                <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
                  <p className="text-sm text-muted-foreground mb-2">
                    Found suppliers near {userLocation}:
                  </p>
                  {/* Simulated nearby suppliers */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Home Depot #4521</span>
                      <span className="text-muted-foreground">2.3 miles</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Lowe's #1847</span>
                      <span className="text-muted-foreground">3.1 miles</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Menards #3204</span>
                      <span className="text-muted-foreground">4.7 miles</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>84 Lumber</span>
                      <span className="text-muted-foreground">5.2 miles</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLocationSettings(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowLocationSettings(false);
              toast({
                title: "Settings Saved",
                description: `Location set to ${userLocation}. ${preferredStores.length} preferred suppliers selected.`,
                duration: 3000
              });
            }}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}