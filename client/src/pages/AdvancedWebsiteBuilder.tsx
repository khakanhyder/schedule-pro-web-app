import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, Plus, Trash2, ArrowLeft, Smartphone, Monitor, Tablet, Type, Layout, Palette, Settings } from "lucide-react";
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface WebsiteSection {
  id: string;
  type: 'hero' | 'about' | 'services' | 'contact' | 'testimonials' | 'gallery' | 'text' | 'image';
  title: string;
  content: string;
  settings?: {
    backgroundColor?: string;
    textColor?: string;
    backgroundImage?: string;
    alignment?: 'left' | 'center' | 'right';
    padding?: 'small' | 'medium' | 'large';
    fontSize?: 'small' | 'medium' | 'large';
  };
}

interface WebsiteData {
  title: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  sections: WebsiteSection[];
}

interface ClientData {
  client: {
    id: string;
    businessName: string;
    contactPerson: string;
    email: string;
    phone: string;
    businessAddress: string;
    industry: string;
    status: string;
    planId: string;
  };
}

export default function AdvancedWebsiteBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get clientId from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('clientId');
  
  // Get client data
  const { data: clientData } = useQuery<ClientData>({
    queryKey: [`/api/client/${clientId}/dashboard`],
    enabled: !!clientId
  });

  // Get existing website data
  const { data: existingWebsite } = useQuery<any>({
    queryKey: [`/api/client/${clientId}/website`],
    enabled: !!clientId
  });

  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    title: "My Business Website",
    description: "Professional website for my business",
    primaryColor: "#3B82F6",
    secondaryColor: "#F3F4F6",
    sections: [
      {
        id: "hero",
        type: "hero",
        title: "Welcome to Our Business",
        content: "We provide exceptional service and results for our clients.",
        settings: { backgroundColor: "#3B82F6", textColor: "#FFFFFF", alignment: "center", padding: "large" }
      },
      {
        id: "about",
        type: "about",
        title: "About Us",
        content: "Learn about our story, mission, and what makes us different.",
        settings: { backgroundColor: "#FFFFFF", textColor: "#1F2937", alignment: "left", padding: "medium" }
      }
    ]
  });

  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Initialize with existing website data or client data
  useEffect(() => {
    if (existingWebsite && existingWebsite.sections) {
      // Load existing website data
      try {
        const sections = JSON.parse(existingWebsite.sections);
        setWebsiteData({
          title: existingWebsite.title,
          description: existingWebsite.description || "",
          primaryColor: existingWebsite.primaryColor || "#3B82F6",
          secondaryColor: existingWebsite.secondaryColor || "#F3F4F6",
          sections: sections
        });
      } catch (e) {
        console.error('Error parsing existing website sections:', e);
      }
    } else if (clientData?.client && !existingWebsite) {
      // Initialize with client data for new websites
      setWebsiteData(prev => ({
        ...prev,
        title: `${clientData.client.businessName} - Professional Services`,
        description: `${clientData.client.businessName} - ${clientData.client.industry} services`,
        sections: [
          {
            id: "hero",
            type: "hero",
            title: `Welcome to ${clientData.client.businessName}`,
            content: `Professional ${clientData.client.industry.toLowerCase()} services for all your needs.`,
            settings: { backgroundColor: "#3B82F6", textColor: "#FFFFFF", alignment: "center", padding: "large" }
          },
          {
            id: "about",
            type: "about",
            title: `About ${clientData.client.businessName}`,
            content: `Located at ${clientData.client.businessAddress}, we are dedicated to providing exceptional ${clientData.client.industry.toLowerCase()} services.`,
            settings: { backgroundColor: "#FFFFFF", textColor: "#1F2937", alignment: "left", padding: "medium" }
          }
        ]
      }));
    }
  }, [clientData, existingWebsite]);

  // Section management functions
  const addSection = (type: WebsiteSection['type']) => {
    const sectionTemplates = {
      hero: { title: "Hero Section", content: "Welcome to our amazing business!" },
      about: { title: "About Us", content: "Learn more about our story and mission." },
      services: { title: "Our Services", content: "Discover what we can do for you." },
      contact: { title: "Contact Us", content: "Get in touch with us today!" },
      testimonials: { title: "What Our Clients Say", content: "Read testimonials from our satisfied customers." },
      gallery: { title: "Gallery", content: "View our portfolio and past work." },
      text: { title: "Text Section", content: "Add your custom text content here." },
      image: { title: "Image Section", content: "Add an image with caption." }
    };

    const template = sectionTemplates[type];
    const newSection: WebsiteSection = {
      id: `section_${Date.now()}`,
      type,
      title: template.title,
      content: template.content,
      settings: {
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        alignment: "left",
        padding: "medium",
        fontSize: "medium"
      }
    };

    setWebsiteData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setSelectedSection(newSection.id);
  };

  const updateSection = (id: string, field: keyof WebsiteSection, value: any) => {
    setWebsiteData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    }));
  };

  const updateSectionSettings = (id: string, settings: Partial<WebsiteSection['settings']>) => {
    setWebsiteData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === id 
          ? { ...section, settings: { ...section.settings, ...settings } }
          : section
      )
    }));
  };

  const deleteSection = (id: string) => {
    setWebsiteData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== id)
    }));
    if (selectedSection === id) {
      setSelectedSection(null);
    }
  };

  // Save website mutation
  const saveWebsiteMutation = useMutation({
    mutationFn: async (data: WebsiteData) => {
      const method = existingWebsite ? 'PUT' : 'POST';
      const response = await fetch(`/api/client/${clientId}/website`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          heroImage: '',
          contactInfo: JSON.stringify({ phone: clientData?.client?.phone || '', email: clientData?.client?.email || '' }),
          socialLinks: JSON.stringify({}),
          sections: JSON.stringify(data.sections), // Save sections as JSON
          showPrices: true,
          allowOnlineBooking: true,
          isPublished: true,
          subdomain: clientData?.client?.businessName?.toLowerCase().replace(/\s+/g, '-') || 'business'
        })
      });
      if (!response.ok) throw new Error('Failed to save website');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientId}/website`] });
      toast({
        title: "Website Saved",
        description: "Your website has been successfully saved and published.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save website. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    saveWebsiteMutation.mutate(websiteData);
  };

  const selectedSectionData = websiteData.sections.find(s => s.id === selectedSection);

  const getDeviceIcon = (mode: 'desktop' | 'tablet' | 'mobile') => {
    switch (mode) {
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
    }
  };

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'desktop': return '100%';
      case 'tablet': return '768px';
      case 'mobile': return '375px';
    }
  };

  const getPaddingClass = (padding?: string) => {
    switch (padding) {
      case 'small': return 'p-4';
      case 'large': return 'p-12';
      default: return 'p-8';
    }
  };

  const getAlignmentClass = (alignment?: string) => {
    switch (alignment) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  const getFontSizeClass = (fontSize?: string) => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-xl';
      default: return 'text-base';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Section List & Editor */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => setLocation(`/client-dashboard?clientId=${clientId}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">Website Builder</h2>
          </div>
          <p className="text-sm text-gray-600">Build your professional website</p>
        </div>

        {/* Website Settings */}
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-3">
            <div>
              <Label htmlFor="title">Website Title</Label>
              <Input
                id="title"
                value={websiteData.title}
                onChange={(e) => setWebsiteData({...websiteData, title: e.target.value})}
                placeholder="Enter website title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={websiteData.description}
                onChange={(e) => setWebsiteData({...websiteData, description: e.target.value})}
                placeholder="Enter website description"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={websiteData.primaryColor}
                  onChange={(e) => setWebsiteData({...websiteData, primaryColor: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  id="secondaryColor"
                  type="color"
                  value={websiteData.secondaryColor}
                  onChange={(e) => setWebsiteData({...websiteData, secondaryColor: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add Section */}
        <div className="p-4 border-b border-gray-200">
          <Label className="text-sm font-medium">Add New Section</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => addSection('hero')}>
              <Layout className="h-3 w-3 mr-1" />
              Hero
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('about')}>
              <Type className="h-3 w-3 mr-1" />
              About
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('services')}>
              <Settings className="h-3 w-3 mr-1" />
              Services
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('contact')}>
              <Type className="h-3 w-3 mr-1" />
              Contact
            </Button>
          </div>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Website Sections</h3>
            <div className="space-y-2">
              {websiteData.sections.map((section) => (
                <Card 
                  key={section.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedSection === section.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSection(section.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{section.title}</h4>
                        <p className="text-xs text-gray-500 capitalize">{section.type}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Section Editor */}
        {selectedSectionData && (
          <div className="border-t border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Edit Section</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="sectionTitle">Section Title</Label>
                <Input
                  id="sectionTitle"
                  value={selectedSectionData.title}
                  onChange={(e) => updateSection(selectedSection!, 'title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sectionContent">Content</Label>
                <Textarea
                  id="sectionContent"
                  value={selectedSectionData.content}
                  onChange={(e) => updateSection(selectedSection!, 'content', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Background</Label>
                  <Input
                    type="color"
                    value={selectedSectionData.settings?.backgroundColor || (selectedSectionData.type === 'hero' ? websiteData.primaryColor : '#FFFFFF')}
                    onChange={(e) => updateSectionSettings(selectedSection!, { backgroundColor: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Text Color</Label>
                  <Input
                    type="color"
                    value={selectedSectionData.settings?.textColor || (selectedSectionData.type === 'hero' ? '#FFFFFF' : '#1F2937')}
                    onChange={(e) => updateSectionSettings(selectedSection!, { textColor: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Text Alignment</Label>
                <Select 
                  value={selectedSectionData.settings?.alignment || 'left'} 
                  onValueChange={(value) => updateSectionSettings(selectedSection!, { alignment: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">
                {clientData?.client?.businessName} Website Builder
              </h1>
            </div>
            
            {/* Device Preview Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                >
                  {getDeviceIcon(mode)}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.open(`/client-website/${clientId}`, '_blank')}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSave} disabled={saveWebsiteMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {saveWebsiteMutation.isPending ? 'Saving...' : 'Save & Publish'}
              </Button>
            </div>
          </div>
        </div>

        {/* Website Preview */}
        <div className="flex-1 p-6 overflow-auto">
          <div 
            className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
            style={{ width: getPreviewWidth(), maxWidth: '100%' }}
          >
            {websiteData.sections.map((section) => (
              <div
                key={section.id}
                className={`${getPaddingClass(section.settings?.padding)} ${getAlignmentClass(section.settings?.alignment)} cursor-pointer border-2 border-transparent hover:border-blue-300 transition-colors ${
                  selectedSection === section.id ? 'border-blue-500' : ''
                }`}
                style={{
                  backgroundColor: section.settings?.backgroundColor || (section.type === 'hero' ? websiteData.primaryColor : '#FFFFFF'),
                  color: section.settings?.textColor || (section.type === 'hero' ? '#FFFFFF' : '#1F2937')
                }}
                onClick={() => setSelectedSection(section.id)}
              >
                <h2 className={`font-bold mb-4 ${section.type === 'hero' ? 'text-3xl' : 'text-2xl'} ${getFontSizeClass(section.settings?.fontSize)}`}>
                  {section.title}
                </h2>
                <div className={`${getFontSizeClass(section.settings?.fontSize)} whitespace-pre-wrap`}>
                  {section.content}
                </div>
              </div>
            ))}
            
            {/* Footer */}
            <div 
              className="p-8 text-center"
              style={{ 
                backgroundColor: websiteData.secondaryColor || '#F3F4F6',
                color: '#6B7280'
              }}
            >
              <p>&copy; 2024 {clientData?.client?.businessName}. All rights reserved.</p>
              <p className="text-sm mt-2">
                {clientData?.client?.businessAddress} | {clientData?.client?.phone} | {clientData?.client?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}