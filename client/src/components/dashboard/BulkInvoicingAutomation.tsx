import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Calendar,
  CreditCard,
  Download,
  Send,
  Filter,
  Users,
  AlertCircle,
  Zap
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  clientName: string;
  petName: string;
  services: {
    date: string;
    serviceName: string;
    duration: number;
    rate: number;
    amount: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  lastSent?: string;
  paymentMethod?: string;
}

const sampleInvoices: InvoiceItem[] = [
  {
    id: 'INV-001',
    clientName: 'Jennifer Smith',
    petName: 'Max',
    services: [
      { date: '2025-07-20', serviceName: 'Dog Walking', duration: 30, rate: 25, amount: 25 },
      { date: '2025-07-22', serviceName: 'Dog Walking', duration: 30, rate: 25, amount: 25 },
      { date: '2025-07-24', serviceName: 'Dog Walking', duration: 30, rate: 25, amount: 25 }
    ],
    totalAmount: 75,
    status: 'pending',
    dueDate: '2025-08-10'
  },
  {
    id: 'INV-002',
    clientName: 'David Chen',
    petName: 'Luna',
    services: [
      { date: '2025-07-21', serviceName: 'Pet Sitting', duration: 120, rate: 40, amount: 80 },
      { date: '2025-07-23', serviceName: 'Pet Sitting', duration: 120, rate: 40, amount: 80 }
    ],
    totalAmount: 160,
    status: 'sent',
    dueDate: '2025-08-12',
    lastSent: '2025-07-25'
  },
  {
    id: 'INV-003',
    clientName: 'Maria Rodriguez',
    petName: 'Bella',
    services: [
      { date: '2025-07-19', serviceName: 'Dog Walking', duration: 45, rate: 35, amount: 35 },
      { date: '2025-07-21', serviceName: 'Pet Boarding', duration: 1440, rate: 65, amount: 65 },
      { date: '2025-07-22', serviceName: 'Pet Boarding', duration: 1440, rate: 65, amount: 65 }
    ],
    totalAmount: 165,
    status: 'paid',
    dueDate: '2025-08-08',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'INV-004',
    clientName: 'Robert Johnson',
    petName: 'Charlie',
    services: [
      { date: '2025-07-15', serviceName: 'Dog Walking', duration: 30, rate: 25, amount: 25 },
      { date: '2025-07-17', serviceName: 'Dog Walking', duration: 30, rate: 25, amount: 25 }
    ],
    totalAmount: 50,
    status: 'overdue',
    dueDate: '2025-07-25',
    lastSent: '2025-07-18'
  }
];

export default function BulkInvoicingAutomation() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(sampleInvoices);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [bulkAction, setBulkAction] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter(invoice => 
    filterStatus === 'all' || invoice.status === filterStatus
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
    }
  };

  const handleBulkAction = () => {
    if (bulkAction && selectedInvoices.length > 0) {
      console.log(`Performing ${bulkAction} on ${selectedInvoices.length} invoices`);
      // Handle bulk actions like send, download, mark as paid, etc.
      
      if (bulkAction === 'send') {
        const updatedInvoices = invoices.map(invoice => 
          selectedInvoices.includes(invoice.id) 
            ? { ...invoice, status: 'sent' as const, lastSent: new Date().toISOString().split('T')[0] }
            : invoice
        );
        setInvoices(updatedInvoices);
      }
      
      setSelectedInvoices([]);
      setBulkAction('');
    }
  };

  const totalPending = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalSent = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalOverdue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bulk Invoicing Automation</h2>
          <p className="text-gray-600">Process multiple invoices in minutes, not hours</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Generate Period Invoices
          </Button>
          <Button className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Auto-Generate All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">${totalPending}</p>
                <p className="text-xs text-gray-500">{invoices.filter(inv => inv.status === 'pending').length} invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Sent</p>
                <p className="text-2xl font-bold">${totalSent}</p>
                <p className="text-xs text-gray-500">{invoices.filter(inv => inv.status === 'sent').length} invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Paid</p>
                <p className="text-2xl font-bold">${totalPaid}</p>
                <p className="text-xs text-gray-500">{invoices.filter(inv => inv.status === 'paid').length} invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Overdue</p>
                <p className="text-2xl font-bold">${totalOverdue}</p>
                <p className="text-xs text-gray-500">{invoices.filter(inv => inv.status === 'overdue').length} invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="select-all"
                  checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="text-sm font-medium">
                  Select All ({selectedInvoices.length} selected)
                </Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Bulk Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send">Send Invoices</SelectItem>
                  <SelectItem value="download">Download PDFs</SelectItem>
                  <SelectItem value="mark-paid">Mark as Paid</SelectItem>
                  <SelectItem value="send-reminder">Send Reminders</SelectItem>

                </SelectContent>
              </Select>
              <Button 
                onClick={handleBulkAction}
                disabled={!bulkAction || selectedInvoices.length === 0}
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Execute ({selectedInvoices.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Invoice Management
          </CardTitle>
          <CardDescription>
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={selectedInvoices.includes(invoice.id)}
                      onCheckedChange={(checked) => handleSelectInvoice(invoice.id, checked as boolean)}
                    />
                    <div>
                      <h3 className="font-medium">{invoice.id} - {invoice.clientName}</h3>
                      <p className="text-sm text-gray-600">{invoice.petName} • Due: {invoice.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-lg">${invoice.totalAmount}</p>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="space-y-2 mb-3">
                  {invoice.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">{service.date}</span>
                        <span>{service.serviceName}</span>
                        <span className="text-gray-500">
                          {service.duration >= 60 ? `${Math.floor(service.duration / 60)}h ${service.duration % 60}m` : `${service.duration}m`}
                        </span>
                      </div>
                      <span className="font-medium">${service.amount}</span>
                    </div>
                  ))}
                </div>

                {/* Status Info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    {invoice.lastSent && (
                      <span>Last sent: {invoice.lastSent}</span>
                    )}
                    {invoice.paymentMethod && (
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        {invoice.paymentMethod}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3 mr-1" />
                      PDF
                    </Button>
                    <Button size="sm" variant="outline">
                      <Send className="w-3 h-3 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automation Tips */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">Invoicing Automation Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-purple-800">Time Savings</h4>
              <ul className="text-sm space-y-1 text-purple-700">
                <li>• Generate weeks of invoices in 5 minutes</li>
                <li>• Bulk send to multiple clients instantly</li>
                <li>• Automatic service tracking and compilation</li>
                <li>• Streamlined PDF generation and delivery</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-800">Accuracy & Consistency</h4>
              <ul className="text-sm space-y-1 text-purple-700">
                <li>• Eliminate manual calculation errors</li>
                <li>• Standardized professional formatting</li>
                <li>• Automatic tax and fee calculations</li>
                <li>• Service duration tracking and verification</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-800">Cash Flow Management</h4>
              <ul className="text-sm space-y-1 text-purple-700">
                <li>• Faster invoice delivery = faster payments</li>
                <li>• Automatic payment reminders</li>
                <li>• Real-time payment status tracking</li>
                <li>• Overdue invoice alerts and follow-ups</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}