import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  Eye, 
  Monitor, 
  Smartphone, 
  Tablet,
  Type,
  Image,
  Layout,
  Palette,
  Plus,
  Trash2,
  Move,
  Settings
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface WebsiteSection {
  id: string;
  type: 'hero' | 'about' | 'services' | 'contact' | 'gallery' | 'testimonials';
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundImage?: string;
    items?: Array<{
      title: string;
      description: string;
      price?: string;
      image?: string;
    }>;
  };
  styling: {
    backgroundColor: string;
    textColor: string;
    padding: string;
    alignment: 'left' | 'center' | 'right';
  };
  order: number;
}

interface WebsiteData {
  id?: string;
  clientId: string;
  subdomain: string;
  title: string;
  description: string;
  theme: string;
  sections: WebsiteSection[];
  customCSS?: string;
  isPublished: boolean;
}

const defaultSections: WebsiteSection[] = [
  {
    id: 'hero',
    type: 'hero',
    content: {
      title: 'Welcome to Our Business',
      subtitle: 'Professional Services You Can Trust',
      description: 'We provide exceptional service and results for our clients.',
      buttonText: 'Get Started',
      buttonLink: '#contact'
    },
    styling: {
      backgroundColor: '#1F2937',
      textColor: '#FFFFFF',
      padding: '4rem 0',
      alignment: 'center'
    },
    order: 1
  },
  {
    id: 'about',
    type: 'about',
    content: {
      title: 'About Us',
      description: 'Learn about our story, mission, and what makes us different.'
    },
    styling: {
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      padding: '3rem 0',
      alignment: 'center'
    },
    order: 2
  },
  {
    id: 'services',
    type: 'services',
    content: {
      title: 'Our Services',
      items: [
        {
          title: 'Service 1',
          description: 'Description of your first service',
          price: '$99'
        },
        {
          title: 'Service 2', 
          description: 'Description of your second service',
          price: '$149'
        }
      ]
    },
    styling: {
      backgroundColor: '#F9FAFB',
      textColor: '#1F2937',
      padding: '3rem 0',
      alignment: 'center'
    },
    order: 3
  },
  {
    id: 'contact',
    type: 'contact',
    content: {
      title: 'Contact Us',
      description: 'Get in touch with us today to schedule a consultation.'
    },
    styling: {
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      padding: '3rem 0',
      alignment: 'center'
    },
    order: 4
  }
];

export default function WebsiteBuilder() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [clientId, setClientId] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get client ID from session or context
  useEffect(() => {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      setClientId(session.user?.id || 'client_1');
    } else {
      setClientId('client_1'); // Fallback for demo
    }
  }, []);

  // Fetch existing website data
  const { data: existingWebsite, isLoading } = useQuery({
    queryKey: [`/api/client/${clientId}/website`],
    enabled: !!clientId
  });

  // Initialize website data
  useEffect(() => {
    if (existingWebsite) {
      setWebsiteData(existingWebsite);
    } else if (clientId) {
      const newWebsiteData: WebsiteData = {
        clientId,
        subdomain: '',
        title: 'My Business Website',
        description: 'Professional website for my business',
        theme: 'default',
        sections: defaultSections,
        isPublished: false
      };
      setWebsiteData(newWebsiteData);
    }
  }, [existingWebsite, clientId]);

  // Save website mutation
  const saveMutation = useMutation({
    mutationFn: async (data: WebsiteData) => {
      if (data.id) {
        return await apiRequest(`/api/client/${clientId}/website`, "PUT", data);
      } else {
        return await apiRequest(`/api/client/${clientId}/website`, "POST", data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Website saved",
        description: "Your website has been successfully saved.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/client/${clientId}/website`] });
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Failed to save your website. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateSection = (sectionId: string, updates: Partial<WebsiteSection>) => {
    if (!websiteData) return;
    
    const updatedSections = websiteData.sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    );
    
    setWebsiteData({
      ...websiteData,
      sections: updatedSections
    });
  };

  const addSection = (type: WebsiteSection['type']) => {
    if (!websiteData) return;
    
    const newSection: WebsiteSection = {
      id: `section_${Date.now()}`,
      type,
      content: {
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
        description: 'Edit this section content'
      },
      styling: {
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        padding: '3rem 0',
        alignment: 'center'
      },
      order: websiteData.sections.length + 1
    };
    
    setWebsiteData({
      ...websiteData,
      sections: [...websiteData.sections, newSection]
    });
  };

  const deleteSection = (sectionId: string) => {
    if (!websiteData) return;
    
    const updatedSections = websiteData.sections.filter(section => section.id !== sectionId);
    setWebsiteData({
      ...websiteData,
      sections: updatedSections
    });
    
    if (selectedSection === sectionId) {
      setSelectedSection(null);
    }
  };

  const handleSave = () => {
    if (websiteData) {
      saveMutation.mutate(websiteData);
    }
  };

  const handlePublish = () => {
    if (websiteData) {
      saveMutation.mutate({
        ...websiteData,
        isPublished: true
      });
    }
  };

  if (isLoading || !websiteData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading website builder...</p>
        </div>
      </div>
    );
  }

  const selectedSectionData = websiteData.sections.find(s => s.id === selectedSection);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Section List & Editor */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Website Builder</h2>
          <p className="text-sm text-gray-600">Drag and drop to build your site</p>
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
              <Label htmlFor="subdomain">Subdomain</Label>
              <Input
                id="subdomain"
                value={websiteData.subdomain}
                onChange={(e) => setWebsiteData({...websiteData, subdomain: e.target.value})}
                placeholder="your-business"
              />
              <p className="text-xs text-gray-500 mt-1">your-business.scheduledpros.com</p>
            </div>
          </div>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-900">Sections</h3>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => addSection('hero')}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {websiteData.sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                <div
                  key={section.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSection === section.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSection(section.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm capitalize">{section.type}</h4>
                      <p className="text-xs text-gray-600 truncate">
                        {section.content.title}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Section Buttons */}
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Add Section</p>
              <div className="grid grid-cols-2 gap-2">
                {['hero', 'about', 'services', 'contact', 'gallery', 'testimonials'].map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant="outline"
                    onClick={() => addSection(type as WebsiteSection['type'])}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section Editor */}
        {selectedSectionData && (
          <div className="border-t border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3 capitalize">
              Edit {selectedSectionData.type}
            </h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="section-title">Title</Label>
                <Input
                  id="section-title"
                  value={selectedSectionData.content.title || ''}
                  onChange={(e) => updateSection(selectedSection!, {
                    content: { ...selectedSectionData.content, title: e.target.value }
                  })}
                />
              </div>
              
              {selectedSectionData.content.subtitle !== undefined && (
                <div>
                  <Label htmlFor="section-subtitle">Subtitle</Label>
                  <Input
                    id="section-subtitle"
                    value={selectedSectionData.content.subtitle || ''}
                    onChange={(e) => updateSection(selectedSection!, {
                      content: { ...selectedSectionData.content, subtitle: e.target.value }
                    })}
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="section-description">Description</Label>
                <Textarea
                  id="section-description"
                  value={selectedSectionData.content.description || ''}
                  onChange={(e) => updateSection(selectedSection!, {
                    content: { ...selectedSectionData.content, description: e.target.value }
                  })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="bg-color">Background Color</Label>
                <Input
                  id="bg-color"
                  type="color"
                  value={selectedSectionData.styling.backgroundColor}
                  onChange={(e) => updateSection(selectedSection!, {
                    styling: { ...selectedSectionData.styling, backgroundColor: e.target.value }
                  })}
                />
              </div>

              <div>
                <Label htmlFor="text-color">Text Color</Label>
                <Input
                  id="text-color"
                  type="color"
                  value={selectedSectionData.styling.textColor}
                  onChange={(e) => updateSection(selectedSection!, {
                    styling: { ...selectedSectionData.styling, textColor: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button 
            onClick={handleSave} 
            disabled={saveMutation.isPending}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={saveMutation.isPending}
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            Publish Website
          </Button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Preview Controls */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="h-4 w-4 mr-1" />
                Desktop
              </Button>
              <Button
                size="sm"
                variant={previewMode === 'tablet' ? 'default' : 'outline'}
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="h-4 w-4 mr-1" />
                Tablet
              </Button>
              <Button
                size="sm"
                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-4 w-4 mr-1" />
                Mobile
              </Button>
            </div>
            
            <Badge variant={websiteData.isPublished ? 'default' : 'secondary'}>
              {websiteData.isPublished ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className={`mx-auto bg-white shadow-lg transition-all duration-300 ${
            previewMode === 'desktop' ? 'max-w-none' :
            previewMode === 'tablet' ? 'max-w-2xl' : 'max-w-sm'
          }`}>
            {websiteData.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <div
                  key={section.id}
                  className={`relative group transition-colors ${
                    selectedSection === section.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{
                    backgroundColor: section.styling.backgroundColor,
                    color: section.styling.textColor,
                    padding: section.styling.padding
                  }}
                  onClick={() => setSelectedSection(section.id)}
                >
                  {/* Section Content */}
                  <div className={`container mx-auto px-4 text-${section.styling.alignment}`}>
                    {section.type === 'hero' && (
                      <div className="py-12 text-center">
                        <h1 className="text-4xl font-bold mb-4">{section.content.title}</h1>
                        {section.content.subtitle && (
                          <p className="text-xl mb-6 opacity-90">{section.content.subtitle}</p>
                        )}
                        {section.content.description && (
                          <p className="text-lg mb-8 opacity-75">{section.content.description}</p>
                        )}
                        {section.content.buttonText && (
                          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                            {section.content.buttonText}
                          </button>
                        )}
                      </div>
                    )}

                    {section.type === 'about' && (
                      <div className="py-12">
                        <h2 className="text-3xl font-bold mb-6 text-center">{section.content.title}</h2>
                        <div className="max-w-3xl mx-auto">
                          <p className="text-lg leading-relaxed">{section.content.description}</p>
                        </div>
                      </div>
                    )}

                    {section.type === 'services' && (
                      <div className="py-12">
                        <h2 className="text-3xl font-bold mb-12 text-center">{section.content.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {section.content.items?.map((item, index) => (
                            <div key={index} className="bg-white bg-opacity-10 p-6 rounded-lg">
                              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                              <p className="mb-4 opacity-75">{item.description}</p>
                              {item.price && (
                                <p className="text-2xl font-bold">{item.price}</p>
                              )}
                            </div>
                          )) || []}
                        </div>
                      </div>
                    )}

                    {section.type === 'contact' && (
                      <div className="py-12">
                        <h2 className="text-3xl font-bold mb-6 text-center">{section.content.title}</h2>
                        <div className="max-w-2xl mx-auto">
                          <p className="text-lg mb-8 text-center">{section.content.description}</p>
                          <div className="bg-white bg-opacity-10 p-8 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input className="w-full p-3 rounded bg-white bg-opacity-20 placeholder-gray-300" placeholder="Your name" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input className="w-full p-3 rounded bg-white bg-opacity-20 placeholder-gray-300" placeholder="your@email.com" />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">Message</label>
                                <textarea className="w-full p-3 rounded bg-white bg-opacity-20 placeholder-gray-300" rows={4} placeholder="Your message"></textarea>
                              </div>
                              <div className="md:col-span-2">
                                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                  Send Message
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section Hover Overlay */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSection(section.id);
                    }}>
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}