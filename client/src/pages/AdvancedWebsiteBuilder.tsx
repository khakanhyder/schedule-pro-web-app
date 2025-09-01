import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, Plus, Trash2, ArrowLeft, Smartphone, Monitor, Tablet, Type, Layout, Palette, Settings, Phone, Mail, Star, GripVertical, Image, Columns, Square, MousePointer } from "lucide-react";
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface WebsiteElement {
  id: string;
  type: 'text' | 'button' | 'image' | 'spacer';
  content?: string;
  settings?: {
    fontSize?: string;
    fontWeight?: 'normal' | 'bold';
    textColor?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    alignment?: 'left' | 'center' | 'right';
    width?: string;
    height?: string;
    link?: string;
    imageUrl?: string;
    alt?: string;
  };
}

interface WebsiteColumn {
  id: string;
  width: 'auto' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | 'custom';
  customWidth?: string;
  elements: WebsiteElement[];
  settings?: {
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    verticalAlign?: 'top' | 'center' | 'bottom';
  };
}

interface WebsiteSection {
  id: string;
  type: 'hero' | 'about' | 'services' | 'contact-info' | 'contact-form' | 'testimonials' | 'gallery' | 'text' | 'image' | 'columns' | 'spacer';
  title?: string;
  content?: string;
  columns?: WebsiteColumn[];
  settings?: {
    backgroundColor?: string;
    textColor?: string;
    backgroundImage?: string;
    backgroundType?: 'color' | 'gradient' | 'image';
    gradientType?: 'linear' | 'radial';
    gradientDirection?: string;
    gradientColors?: string[];
    alignment?: 'left' | 'center' | 'right';
    padding?: 'small' | 'medium' | 'large' | 'custom';
    customPadding?: string;
    fontSize?: 'small' | 'medium' | 'large';
    width?: 'full' | 'container' | 'custom';
    customWidth?: string;
    height?: 'auto' | 'screen' | 'custom';
    customHeight?: string;
    marginTop?: string;
    marginBottom?: string;
    responsive?: {
      mobile?: {
        padding?: string;
        fontSize?: string;
        alignment?: string;
      };
      tablet?: {
        padding?: string;
        fontSize?: string;
        alignment?: string;
      };
    };
  };
  data?: {
    phone?: string;
    email?: string;
    address?: string;
    buttonText?: string;
    buttonLink?: string;
    items?: Array<{
      title: string;
      description: string;
      price?: string;
    }>;
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
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<'section' | 'column' | 'element'>('section');
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Initialize with existing website data or create full default structure
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
      // Initialize with complete website structure including all sections
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
            settings: { backgroundColor: "#3B82F6", textColor: "#FFFFFF", alignment: "center", padding: "large" },
            data: {
              buttonText: "Book Appointment",
              buttonLink: "/booking"
            }
          },
          {
            id: "contact-info",
            type: "contact-info",
            title: "Contact Information",
            content: "Get in touch with us through multiple channels",
            settings: { backgroundColor: "#FFFFFF", textColor: "#1F2937", alignment: "center", padding: "medium" },
            data: {
              phone: clientData.client.phone || "555-0101",
              email: clientData.client.email || "info@business.com",
              address: clientData.client.businessAddress || "Business Address"
            }
          },
          {
            id: "services",
            type: "services",
            title: "Our Services",
            content: "Choose from our professional services",
            settings: { backgroundColor: "#FFFFFF", textColor: "#1F2937", alignment: "center", padding: "medium" }
          },
          {
            id: "about",
            type: "about",
            title: `About ${clientData.client.businessName}`,
            content: `Welcome to ${clientData.client.businessName}, your trusted partner for professional ${clientData.client.industry.toLowerCase()} services. Led by ${clientData.client.contactPerson}, we are committed to providing exceptional service and ensuring your complete satisfaction.`,
            settings: { backgroundColor: "#FFFFFF", textColor: "#1F2937", alignment: "left", padding: "medium" }
          },
          {
            id: "contact-form",
            type: "contact-form",
            title: "Get In Touch",
            content: "Send us a message and we'll get back to you soon",
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
      'contact-info': { title: "Contact Information", content: "Get in touch with us through multiple channels." },
      'contact-form': { title: "Contact Form", content: "Send us a message and we'll get back to you soon." },
      testimonials: { title: "What Our Clients Say", content: "Read testimonials from our satisfied customers." },
      gallery: { title: "Gallery", content: "View our portfolio and past work." },
      text: { title: "Text Section", content: "Add your custom text content here." },
      image: { title: "Image Section", content: "Add an image with caption." },
      columns: { title: "Column Layout", content: "" },
      spacer: { title: "Spacer", content: "" }
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
        backgroundType: "color",
        alignment: "left",
        padding: "medium",
        fontSize: "medium",
        width: "container",
        height: "auto",
        responsive: {
          mobile: { padding: "small", fontSize: "small", alignment: "center" },
          tablet: { padding: "medium", fontSize: "medium", alignment: "left" }
        }
      },
      columns: type === 'columns' ? [
        {
          id: `column_${Date.now()}_1`,
          width: '1/2',
          elements: [{
            id: `element_${Date.now()}_1`,
            type: 'text',
            content: 'Column 1 content',
            settings: { fontSize: '16px', textColor: '#1F2937' }
          }]
        },
        {
          id: `column_${Date.now()}_2`,
          width: '1/2',
          elements: [{
            id: `element_${Date.now()}_2`,
            type: 'text',
            content: 'Column 2 content',
            settings: { fontSize: '16px', textColor: '#1F2937' }
          }]
        }
      ] : undefined,
      data: type === 'contact-info' ? {
        phone: clientData?.client?.phone || "555-0101",
        email: clientData?.client?.email || "info@business.com", 
        address: clientData?.client?.businessAddress || "Business Address"
      } : type === 'hero' ? {
        buttonText: "Book Appointment",
        buttonLink: "/booking"
      } : undefined
    };

    setWebsiteData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setSelectedSection(newSection.id);
    setEditMode('section');
  };

  const addColumn = (sectionId: string) => {
    const newColumn: WebsiteColumn = {
      id: `column_${Date.now()}`,
      width: 'auto',
      elements: [{
        id: `element_${Date.now()}`,
        type: 'text',
        content: 'New column content',
        settings: { fontSize: '16px', textColor: '#1F2937' }
      }]
    };

    setWebsiteData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId 
          ? { ...section, columns: [...(section.columns || []), newColumn] }
          : section
      )
    }));
  };

  const addElement = (columnId: string, type: WebsiteElement['type']) => {
    const elementTemplates = {
      text: { content: 'Your text content here' },
      button: { content: 'Button Text' },
      image: { content: '' },
      spacer: { content: '' }
    };

    const template = elementTemplates[type];
    const newElement: WebsiteElement = {
      id: `element_${Date.now()}`,
      type,
      content: template.content,
      settings: {
        fontSize: type === 'text' ? '16px' : undefined,
        textColor: '#1F2937',
        backgroundColor: type === 'button' ? '#3B82F6' : undefined,
        padding: type === 'button' ? '12px 24px' : undefined,
        borderRadius: type === 'button' ? '6px' : undefined,
        height: type === 'spacer' ? '40px' : undefined
      }
    };

    setWebsiteData(prev => ({
      ...prev,
      sections: prev.sections.map(section => ({
        ...section,
        columns: section.columns?.map(column =>
          column.id === columnId 
            ? { ...column, elements: [...column.elements, newElement] }
            : column
        )
      }))
    }));
    
    setSelectedElement(newElement.id);
    setEditMode('element');
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

  const updateSectionData = (id: string, data: Partial<WebsiteSection['data']>) => {
    setWebsiteData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === id 
          ? { ...section, data: { ...section.data, ...data } }
          : section
      )
    }));
  };

  const updateColumn = (sectionId: string, columnId: string, updates: Partial<WebsiteColumn>) => {
    setWebsiteData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId 
          ? {
              ...section,
              columns: section.columns?.map(column =>
                column.id === columnId 
                  ? { ...column, ...updates }
                  : column
              )
            }
          : section
      )
    }));
  };

  const updateElement = (sectionId: string, columnId: string, elementId: string, updates: Partial<WebsiteElement>) => {
    setWebsiteData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId 
          ? {
              ...section,
              columns: section.columns?.map(column =>
                column.id === columnId
                  ? {
                      ...column,
                      elements: column.elements.map(element =>
                        element.id === elementId
                          ? { ...element, ...updates }
                          : element
                      )
                    }
                  : column
              )
            }
          : section
      )
    }));
  };

  // Helper functions to get selected items
  const getSelectedSection = () => {
    return websiteData.sections.find(section => section.id === selectedSection);
  };

  const getSelectedColumn = () => {
    const section = getSelectedSection();
    return section?.columns?.find(column => column.id === selectedColumn);
  };

  const getSelectedElement = () => {
    const column = getSelectedColumn();
    return column?.elements.find(element => element.id === selectedElement);
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

  const moveSection = (fromIndex: number, toIndex: number) => {
    setWebsiteData(prev => {
      const newSections = [...prev.sections];
      const [movedSection] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, movedSection);
      return { ...prev, sections: newSections };
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (dragIndex !== dropIndex) {
      moveSection(dragIndex, dropIndex);
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
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getWidthClass = (width?: string) => {
    switch (width) {
      case 'full': return 'w-full';
      case 'container': return 'max-w-6xl mx-auto';
      case 'custom': return '';
      default: return 'max-w-6xl mx-auto';
    }
  };

  const getHeightClass = (height?: string) => {
    switch (height) {
      case 'screen': return 'min-h-screen';
      case 'custom': return '';
      default: return '';
    }
  };

  const getBackgroundStyle = (settings?: WebsiteSection['settings']) => {
    if (!settings) return {};
    
    const style: React.CSSProperties = {};
    
    if (settings.backgroundType === 'gradient') {
      const colors = settings.gradientColors || ['#3B82F6', '#1E40AF'];
      if (settings.gradientType === 'radial') {
        style.background = `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 100%)`;
      } else {
        const direction = settings.gradientDirection || 'to right';
        style.background = `linear-gradient(${direction}, ${colors[0]} 0%, ${colors[1]} 100%)`;
      }
    } else if (settings.backgroundType === 'image' && settings.backgroundImage) {
      style.backgroundImage = `url(${settings.backgroundImage})`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = 'center';
      style.backgroundRepeat = 'no-repeat';
    } else {
      style.backgroundColor = settings.backgroundColor || '#FFFFFF';
    }
    
    if (settings.width === 'custom' && settings.customWidth) {
      style.width = settings.customWidth;
    }
    
    if (settings.height === 'custom' && settings.customHeight) {
      style.height = settings.customHeight;
    }
    
    style.color = settings.textColor || '#1F2937';
    
    return style;
  };

  const getSectionContainerClass = (settings?: WebsiteSection['settings']) => {
    const classes = [];
    classes.push(getWidthClass(settings?.width));
    classes.push(getHeightClass(settings?.height));
    classes.push(getPaddingClass(settings?.padding));
    classes.push(getAlignmentClass(settings?.alignment));
    return classes.filter(Boolean).join(' ');
  };

  const getColumnWidthClass = (width: WebsiteColumn['width']) => {
    // Mobile-first responsive classes
    switch (width) {
      case '1/2': return 'w-full md:w-1/2';
      case '1/3': return 'w-full md:w-1/3';
      case '2/3': return 'w-full md:w-2/3';
      case '1/4': return 'w-full sm:w-1/2 lg:w-1/4';
      case '3/4': return 'w-full md:w-3/4';
      case 'auto': return 'w-full md:flex-1';
      default: return 'w-full md:flex-1';
    }
  };

  const getResponsiveGridClass = (columnCount: number) => {
    // Responsive grid classes based on column count
    if (columnCount === 1) return 'grid-cols-1';
    if (columnCount === 2) return 'grid-cols-1 md:grid-cols-2';
    if (columnCount === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    if (columnCount >= 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    return 'grid-cols-1 md:grid-cols-2';
  };

  const renderElement = (element: WebsiteElement) => {
    const style: React.CSSProperties = {
      fontSize: element.settings?.fontSize,
      color: element.settings?.textColor,
      backgroundColor: element.settings?.backgroundColor,
      padding: element.settings?.padding,
      margin: element.settings?.margin,
      borderRadius: element.settings?.borderRadius,
      textAlign: element.settings?.alignment as any,
      width: element.settings?.width,
      height: element.settings?.height,
      fontWeight: element.settings?.fontWeight
    };

    switch (element.type) {
      case 'text':
        return (
          <div style={style} className="whitespace-pre-wrap">
            {element.content || 'Text element'}
          </div>
        );
      case 'button':
        return (
          <button 
            style={style} 
            className="inline-block cursor-pointer transition-opacity hover:opacity-80"
          >
            {element.content || 'Button'}
          </button>
        );
      case 'image':
        return element.settings?.imageUrl ? (
          <img 
            src={element.settings.imageUrl} 
            alt={element.settings?.alt || ''}
            style={style}
            className="max-w-full h-auto"
          />
        ) : (
          <div style={style} className="bg-gray-200 rounded flex items-center justify-center min-h-[100px]">
            <div className="text-center text-gray-500">
              <Image className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Image</p>
            </div>
          </div>
        );
      case 'spacer':
        return (
          <div 
            style={{ 
              ...style, 
              backgroundColor: style.backgroundColor || 'transparent'
            }} 
            className="w-full"
          />
        );
      default:
        return <div style={style}>Unknown element</div>;
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
              <Type className="h-3 w-3 mr-1" />
              Hero
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('about')}>
              <Layout className="h-3 w-3 mr-1" />
              About
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('columns')}>
              <Columns className="h-3 w-3 mr-1" />
              Columns
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('text')}>
              <Type className="h-3 w-3 mr-1" />
              Text
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('services')}>
              <Settings className="h-3 w-3 mr-1" />
              Services
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('contact-info')}>
              <Phone className="h-3 w-3 mr-1" />
              Contact
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('image')}>
              <Image className="h-3 w-3 mr-1" />
              Image
            </Button>
            <Button variant="outline" size="sm" onClick={() => addSection('spacer')}>
              <Square className="h-3 w-3 mr-1" />
              Spacer
            </Button>
          </div>
        </div>

        {/* Dynamic Editor Controls */}
        {selectedSection && (
          <div className="border-b border-gray-200 max-h-64 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Button 
                  variant={editMode === 'section' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setEditMode('section')}
                  className="text-xs flex-1"
                >
                  Section
                </Button>
                {selectedColumn && (
                  <Button 
                    variant={editMode === 'column' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setEditMode('column')}
                    className="text-xs flex-1"
                  >
                    Column
                  </Button>
                )}
                {selectedElement && (
                  <Button 
                    variant={editMode === 'element' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setEditMode('element')}
                    className="text-xs flex-1"
                  >
                    Element
                  </Button>
                )}
              </div>

              {/* Section Controls */}
              {editMode === 'section' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="sectionTitle">Title</Label>
                    <Input
                      id="sectionTitle"
                      value={getSelectedSection()?.title || ''}
                      onChange={(e) => updateSection(selectedSection, { title: e.target.value })}
                      placeholder="Section title"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label>Background</Label>
                    <Input
                      type="color"
                      value={getSelectedSection()?.settings?.backgroundColor || '#FFFFFF'}
                      onChange={(e) => updateSection(selectedSection, {
                        settings: {
                          ...getSelectedSection()?.settings,
                          backgroundColor: e.target.value
                        }
                      })}
                      className="h-8"
                    />
                  </div>
                </div>
              )}

              {/* Column Controls */}
              {editMode === 'column' && selectedColumn && (
                <div className="space-y-3">
                  <div>
                    <Label>Width</Label>
                    <Select
                      value={getSelectedColumn()?.width || 'auto'}
                      onValueChange={(value) => updateColumn(selectedSection, selectedColumn, { width: value as WebsiteColumn['width'] })}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="1/2">Half Width</SelectItem>
                        <SelectItem value="1/3">One Third</SelectItem>
                        <SelectItem value="2/3">Two Thirds</SelectItem>
                        <SelectItem value="1/4">Quarter</SelectItem>
                        <SelectItem value="3/4">Three Quarters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Element Controls */}
              {editMode === 'element' && selectedElement && (
                <div className="space-y-3">
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={getSelectedElement()?.content || ''}
                      onChange={(e) => updateElement(selectedSection, selectedColumn!, selectedElement, { content: e.target.value })}
                      placeholder="Element content"
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Font Size</Label>
                      <Input
                        value={getSelectedElement()?.settings?.fontSize || '16px'}
                        onChange={(e) => updateElement(selectedSection, selectedColumn!, selectedElement, {
                          settings: { ...getSelectedElement()?.settings, fontSize: e.target.value }
                        })}
                        placeholder="16px"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label>Color</Label>
                      <Input
                        type="color"
                        value={getSelectedElement()?.settings?.textColor || '#1F2937'}
                        onChange={(e) => updateElement(selectedSection, selectedColumn!, selectedElement, {
                          settings: { ...getSelectedElement()?.settings, textColor: e.target.value }
                        })}
                        className="h-8"
                      />
                    </div>
                  </div>

                  {getSelectedElement()?.type === 'button' && (
                    <div>
                      <Label>Button Color</Label>
                      <Input
                        type="color"
                        value={getSelectedElement()?.settings?.backgroundColor || '#3B82F6'}
                        onChange={(e) => updateElement(selectedSection, selectedColumn!, selectedElement, {
                          settings: { ...getSelectedElement()?.settings, backgroundColor: e.target.value }
                        })}
                        className="h-8"
                      />
                    </div>
                  )}

                  {getSelectedElement()?.type === 'image' && (
                    <div>
                      <Label>Image URL</Label>
                      <Input
                        value={getSelectedElement()?.settings?.imageUrl || ''}
                        onChange={(e) => updateElement(selectedSection, selectedColumn!, selectedElement, {
                          settings: { ...getSelectedElement()?.settings, imageUrl: e.target.value }
                        })}
                        placeholder="https://example.com/image.jpg"
                        className="text-sm"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Website Sections</h3>
            <div className="space-y-2">
              {websiteData.sections.map((section, index) => (
                <Card 
                  key={section.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedSection === section.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => {
                    setSelectedSection(section.id);
                    setEditMode('section');
                    setSelectedColumn(null);
                    setSelectedElement(null);
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                      <span className="text-sm font-medium truncate">{section.title || section.type}</span>
                      <span className="text-xs text-gray-500 capitalize ml-auto">{section.type}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Edit Section</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteSection(selectedSection!)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-4">
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

              {/* Section-specific data fields */}
              {selectedSectionData.type === 'contact-info' && (
                <div className="space-y-3 p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-sm">Contact Details</h4>
                  <div>
                    <Label htmlFor="contact-phone">Phone Number</Label>
                    <Input
                      id="contact-phone"
                      value={selectedSectionData.data?.phone || ""}
                      onChange={(e) => updateSectionData(selectedSection!, { phone: e.target.value })}
                      placeholder="555-0101"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email Address</Label>
                    <Input
                      id="contact-email"
                      value={selectedSectionData.data?.email || ""}
                      onChange={(e) => updateSectionData(selectedSection!, { email: e.target.value })}
                      placeholder="info@business.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-address">Address</Label>
                    <Textarea
                      id="contact-address"
                      value={selectedSectionData.data?.address || ""}
                      onChange={(e) => updateSectionData(selectedSection!, { address: e.target.value })}
                      placeholder="123 Main St, City, State"
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {selectedSectionData.type === 'hero' && (
                <div className="space-y-3 p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-sm">Call-to-Action Button</h4>
                  <div>
                    <Label htmlFor="hero-button-text">Button Text</Label>
                    <Input
                      id="hero-button-text"
                      value={selectedSectionData.data?.buttonText || ""}
                      onChange={(e) => updateSectionData(selectedSection!, { buttonText: e.target.value })}
                      placeholder="Book Appointment"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-button-link">Button Link</Label>
                    <Input
                      id="hero-button-link"
                      value={selectedSectionData.data?.buttonLink || ""}
                      onChange={(e) => updateSectionData(selectedSection!, { buttonLink: e.target.value })}
                      placeholder="/booking"
                    />
                  </div>
                </div>
              )}

              {/* Advanced Styling Options */}
              <div className="space-y-4 p-3 bg-gray-50 rounded">
                <h4 className="font-medium text-sm">Advanced Styling</h4>
                
                {/* Background Options */}
                <div className="space-y-3">
                  <Label>Background Type</Label>
                  <Select
                    value={selectedSectionData.settings?.backgroundType || 'color'}
                    onValueChange={(value) => updateSectionSettings(selectedSection!, { backgroundType: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">Solid Color</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="image">Background Image</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedSectionData.settings?.backgroundType === 'color' && (
                    <div>
                      <Label>Background Color</Label>
                      <Input
                        type="color"
                        value={selectedSectionData.settings?.backgroundColor || '#FFFFFF'}
                        onChange={(e) => updateSectionSettings(selectedSection!, { backgroundColor: e.target.value })}
                      />
                    </div>
                  )}

                  {selectedSectionData.settings?.backgroundType === 'gradient' && (
                    <div className="space-y-2">
                      <div>
                        <Label>Gradient Type</Label>
                        <Select
                          value={selectedSectionData.settings?.gradientType || 'linear'}
                          onValueChange={(value) => updateSectionSettings(selectedSection!, { gradientType: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linear">Linear</SelectItem>
                            <SelectItem value="radial">Radial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedSectionData.settings?.gradientType === 'linear' && (
                        <div>
                          <Label>Direction</Label>
                          <Select
                            value={selectedSectionData.settings?.gradientDirection || 'to right'}
                            onValueChange={(value) => updateSectionSettings(selectedSection!, { gradientDirection: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="to right">Left to Right</SelectItem>
                              <SelectItem value="to left">Right to Left</SelectItem>
                              <SelectItem value="to bottom">Top to Bottom</SelectItem>
                              <SelectItem value="to top">Bottom to Top</SelectItem>
                              <SelectItem value="to bottom right">Top-Left to Bottom-Right</SelectItem>
                              <SelectItem value="to bottom left">Top-Right to Bottom-Left</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Start Color</Label>
                          <Input
                            type="color"
                            value={selectedSectionData.settings?.gradientColors?.[0] || '#3B82F6'}
                            onChange={(e) => {
                              const colors = selectedSectionData.settings?.gradientColors || ['#3B82F6', '#1E40AF'];
                              colors[0] = e.target.value;
                              updateSectionSettings(selectedSection!, { gradientColors: colors });
                            }}
                          />
                        </div>
                        <div>
                          <Label>End Color</Label>
                          <Input
                            type="color"
                            value={selectedSectionData.settings?.gradientColors?.[1] || '#1E40AF'}
                            onChange={(e) => {
                              const colors = selectedSectionData.settings?.gradientColors || ['#3B82F6', '#1E40AF'];
                              colors[1] = e.target.value;
                              updateSectionSettings(selectedSection!, { gradientColors: colors });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedSectionData.settings?.backgroundType === 'image' && (
                    <div>
                      <Label>Background Image URL</Label>
                      <Input
                        value={selectedSectionData.settings?.backgroundImage || ''}
                        onChange={(e) => updateSectionSettings(selectedSection!, { backgroundImage: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label>Text Color</Label>
                  <Input
                    type="color"
                    value={selectedSectionData.settings?.textColor || '#1F2937'}
                    onChange={(e) => updateSectionSettings(selectedSection!, { textColor: e.target.value })}
                  />
                </div>
                
                {/* Layout Options */}
                <div className="space-y-3">
                  <h5 className="font-medium text-xs text-gray-600">LAYOUT</h5>
                  
                  <div>
                    <Label>Width</Label>
                    <Select
                      value={selectedSectionData.settings?.width || 'container'}
                      onValueChange={(value) => updateSectionSettings(selectedSection!, { width: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Width</SelectItem>
                        <SelectItem value="container">Container (1200px max)</SelectItem>
                        <SelectItem value="custom">Custom Width</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {selectedSectionData.settings?.width === 'custom' && (
                      <Input
                        className="mt-2"
                        value={selectedSectionData.settings?.customWidth || ''}
                        onChange={(e) => updateSectionSettings(selectedSection!, { customWidth: e.target.value })}
                        placeholder="e.g., 800px, 80%, 50rem"
                      />
                    )}
                  </div>

                  <div>
                    <Label>Height</Label>
                    <Select
                      value={selectedSectionData.settings?.height || 'auto'}
                      onValueChange={(value) => updateSectionSettings(selectedSection!, { height: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto Height</SelectItem>
                        <SelectItem value="screen">Full Screen</SelectItem>
                        <SelectItem value="custom">Custom Height</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {selectedSectionData.settings?.height === 'custom' && (
                      <Input
                        className="mt-2"
                        value={selectedSectionData.settings?.customHeight || ''}
                        onChange={(e) => updateSectionSettings(selectedSection!, { customHeight: e.target.value })}
                        placeholder="e.g., 400px, 50vh, 20rem"
                      />
                    )}
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

                  <div>
                    <Label>Padding</Label>
                    <Select 
                      value={selectedSectionData.settings?.padding || 'medium'} 
                      onValueChange={(value) => updateSectionSettings(selectedSection!, { padding: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (1rem)</SelectItem>
                        <SelectItem value="medium">Medium (2rem)</SelectItem>
                        <SelectItem value="large">Large (4rem)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
                className={`${getSectionContainerClass(section.settings)} cursor-pointer border-2 border-transparent hover:border-blue-300 transition-colors ${
                  selectedSection === section.id ? 'border-blue-500' : ''
                }`}
                style={getBackgroundStyle(section.settings)}
                onClick={() => setSelectedSection(section.id)}
              >
                {/* Section-specific rendering */}
                {section.type === 'contact-info' ? (
                  <div>
                    <h2 className={`font-bold mb-4 text-2xl ${getFontSizeClass(section.settings?.fontSize)}`}>
                      {section.title}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-white bg-opacity-10 rounded">
                        <Phone className="h-8 w-8 mx-auto mb-2" />
                        <h3 className="font-semibold">Call Us</h3>
                        <p>{section.data?.phone || clientData?.client?.phone || '555-0101'}</p>
                      </div>
                      <div className="text-center p-4 bg-white bg-opacity-10 rounded">
                        <Mail className="h-8 w-8 mx-auto mb-2" />
                        <h3 className="font-semibold">Email Us</h3>
                        <p>{section.data?.email || clientData?.client?.email || 'info@business.com'}</p>
                      </div>
                      <div className="text-center p-4 bg-white bg-opacity-10 rounded">
                        <Layout className="h-8 w-8 mx-auto mb-2" />
                        <h3 className="font-semibold">Visit Us</h3>
                        <p>{section.data?.address || clientData?.client?.businessAddress || 'Business Address'}</p>
                      </div>
                    </div>
                  </div>
                ) : section.type === 'services' ? (
                  <div>
                    <h2 className={`font-bold mb-4 text-2xl ${getFontSizeClass(section.settings?.fontSize)}`}>
                      {section.title}
                    </h2>
                    <p className="mb-4">{section.content}</p>
                    <div className="text-center py-8 bg-white bg-opacity-10 rounded">
                      <p className="text-sm opacity-75">Services from your admin panel will display here</p>
                      <p className="text-xs opacity-50 mt-2">Add services in your dashboard to see them on the live website</p>
                    </div>
                  </div>
                ) : section.type === 'contact-form' ? (
                  <div>
                    <h2 className={`font-bold mb-4 text-2xl ${getFontSizeClass(section.settings?.fontSize)}`}>
                      {section.title}
                    </h2>
                    <p className="mb-4">{section.content}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input className="p-2 rounded border" placeholder="Your Name" />
                      <input className="p-2 rounded border" placeholder="Your Email" />
                      <input className="p-2 rounded border" placeholder="Phone Number" />
                      <textarea className="p-2 rounded border sm:col-span-2" placeholder="Your Message" rows={3}></textarea>
                      <button className="p-2 bg-blue-600 text-white rounded sm:col-span-2">Send Message</button>
                    </div>
                  </div>
                ) : section.type === 'testimonials' ? (
                  <div>
                    <h2 className={`font-bold mb-4 text-2xl ${getFontSizeClass(section.settings?.fontSize)}`}>
                      {section.title}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-white bg-opacity-10 rounded">
                        <div className="flex mb-2">
                          {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                        </div>
                        <p className="italic">"Great service and professional team!"</p>
                        <p className="font-semibold mt-2">- Client Name</p>
                      </div>
                      <div className="p-4 bg-white bg-opacity-10 rounded">
                        <div className="flex mb-2">
                          {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                        </div>
                        <p className="italic">"Highly recommend their services!"</p>
                        <p className="font-semibold mt-2">- Another Client</p>
                      </div>
                    </div>
                  </div>
                ) : section.type === 'columns' ? (
                  <div>
                    {section.title && (
                      <h2 className={`font-bold mb-4 text-2xl ${getFontSizeClass(section.settings?.fontSize)}`}>
                        {section.title}
                      </h2>
                    )}
                    <div className={`grid gap-4 ${getResponsiveGridClass(section.columns?.length || 2)}`}>
                      {section.columns?.map((column, columnIndex) => (
                        <div
                          key={column.id}
                          className={`${getColumnWidthClass(column.width)} cursor-pointer border border-dashed border-transparent hover:border-gray-300 p-2 rounded transition-colors ${
                            selectedColumn === column.id ? 'border-green-400 bg-green-50' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedColumn(column.id);
                            setSelectedSection(section.id);
                            setEditMode('column');
                          }}
                          style={{ 
                            backgroundColor: column.settings?.backgroundColor,
                            padding: column.settings?.padding 
                          }}
                        >
                          {column.elements.map((element, elementIndex) => (
                            <div
                              key={element.id}
                              className={`cursor-pointer border border-dashed border-transparent hover:border-blue-300 p-1 rounded transition-colors ${
                                selectedElement === element.id ? 'border-blue-400 bg-blue-50' : ''
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedElement(element.id);
                                setSelectedColumn(column.id);
                                setSelectedSection(section.id);
                                setEditMode('element');
                              }}
                            >
                              {renderElement(element)}
                            </div>
                          ))}
                          
                          {/* Add Element Button */}
                          <div className="mt-2 grid grid-cols-2 gap-1">
                            <Button size="sm" variant="outline" onClick={(e) => {
                              e.stopPropagation();
                              addElement(column.id, 'text');
                            }}>
                              <Type className="h-3 w-3 mr-1" />
                              Text
                            </Button>
                            <Button size="sm" variant="outline" onClick={(e) => {
                              e.stopPropagation();
                              addElement(column.id, 'button');
                            }}>
                              <MousePointer className="h-3 w-3 mr-1" />
                              Button
                            </Button>
                            <Button size="sm" variant="outline" onClick={(e) => {
                              e.stopPropagation();
                              addElement(column.id, 'image');
                            }}>
                              <Image className="h-3 w-3 mr-1" />
                              Image
                            </Button>
                            <Button size="sm" variant="outline" onClick={(e) => {
                              e.stopPropagation();
                              addElement(column.id, 'spacer');
                            }}>
                              <Square className="h-3 w-3 mr-1" />
                              Space
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add Column Button */}
                    <div className="mt-4">
                      <Button variant="outline" onClick={() => addColumn(section.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Column
                      </Button>
                    </div>
                  </div>
                ) : section.type === 'spacer' ? (
                  <div 
                    className="w-full bg-gray-100" 
                    style={{ 
                      height: section.settings?.customHeight || '40px',
                      backgroundColor: section.settings?.backgroundColor || 'transparent'
                    }}
                  />
                ) : section.type === 'image' ? (
                  <div className="text-center">
                    {section.title && (
                      <h2 className={`font-bold mb-4 text-2xl ${getFontSizeClass(section.settings?.fontSize)}`}>
                        {section.title}
                      </h2>
                    )}
                    <div className="bg-gray-200 rounded-lg p-8 text-gray-500">
                      <Image className="h-16 w-16 mx-auto mb-2" />
                      <p>Image placeholder</p>
                      <p className="text-sm">Add image URL in settings</p>
                    </div>
                  </div>
                ) : (
                  // Default rendering for other section types
                  <div>
                    {section.title && (
                      <h2 className={`font-bold mb-4 ${section.type === 'hero' ? 'text-3xl' : 'text-2xl'} ${getFontSizeClass(section.settings?.fontSize)}`}>
                        {section.title}
                      </h2>
                    )}
                    {section.content && (
                      <div className={`${getFontSizeClass(section.settings?.fontSize)} whitespace-pre-wrap`}>
                        {section.content}
                      </div>
                    )}
                    {section.type === 'hero' && section.data?.buttonText && (
                      <div className="mt-6">
                        <button className="px-6 py-3 bg-white bg-opacity-20 rounded-lg font-semibold hover:bg-opacity-30 transition-colors">
                          {section.data.buttonText}
                        </button>
                      </div>
                    )}
                  </div>
                )}
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