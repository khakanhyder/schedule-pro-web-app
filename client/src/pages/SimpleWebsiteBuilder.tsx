import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, Plus, Trash2, Settings } from "lucide-react";

interface WebsiteData {
  title: string;
  description: string;
  sections: {
    id: string;
    type: string;
    title: string;
    content: string;
  }[];
}

export default function SimpleWebsiteBuilder() {
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    title: "My Business Website",
    description: "Professional website for my business",
    sections: [
      {
        id: "hero",
        type: "Hero Section",
        title: "Welcome to Our Business",
        content: "We provide exceptional service and results for our clients."
      },
      {
        id: "about",
        type: "About Section", 
        title: "About Us",
        content: "Learn about our story, mission, and what makes us different."
      }
    ]
  });

  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { toast } = useToast();

  const addSection = () => {
    const newSection = {
      id: `section_${Date.now()}`,
      type: "Content Section",
      title: "New Section",
      content: "Edit this section content"
    };

    setWebsiteData({
      ...websiteData,
      sections: [...websiteData.sections, newSection]
    });
  };

  const updateSection = (id: string, field: string, value: string) => {
    const updatedSections = websiteData.sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    );

    setWebsiteData({
      ...websiteData,
      sections: updatedSections
    });
  };

  const deleteSection = (id: string) => {
    const updatedSections = websiteData.sections.filter(section => section.id !== id);
    setWebsiteData({
      ...websiteData,
      sections: updatedSections
    });

    if (selectedSection === id) {
      setSelectedSection(null);
    }
  };

  const handleSave = () => {
    toast({
      title: "Website saved",
      description: "Your website has been successfully saved.",
    });
  };

  const selectedSectionData = websiteData.sections.find(s => s.id === selectedSection);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Section List & Editor */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Website Builder</h2>
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
          </div>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-900">Sections</h3>
              <Button size="sm" variant="outline" onClick={addSection}>
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {websiteData.sections.map((section) => (
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
                      <h4 className="font-medium text-sm">{section.type}</h4>
                      <p className="text-xs text-gray-600 truncate">
                        {section.title}
                      </p>
                    </div>
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
              ))}
            </div>
          </div>
        </div>

        {/* Section Editor */}
        {selectedSectionData && (
          <div className="border-t border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Edit Section
            </h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="section-title">Title</Label>
                <Input
                  id="section-title"
                  value={selectedSectionData.title}
                  onChange={(e) => updateSection(selectedSection!, 'title', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="section-content">Content</Label>
                <Textarea
                  id="section-content"
                  value={selectedSectionData.content}
                  onChange={(e) => updateSection(selectedSection!, 'content', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Website
          </Button>
          <Button variant="outline" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Preview Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Website Preview</h2>
        </div>

        {/* Preview Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Website Header */}
            <div className="bg-gray-900 text-white p-8 text-center">
              <h1 className="text-3xl font-bold">{websiteData.title}</h1>
              <p className="text-lg mt-2 opacity-90">{websiteData.description}</p>
            </div>

            {/* Website Sections */}
            {websiteData.sections.map((section) => (
              <div
                key={section.id}
                className={`p-8 border-b border-gray-100 relative group ${
                  selectedSection === section.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedSection(section.id)}
              >
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">
                    {section.title}
                  </h2>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </div>
                </div>

                {/* Section Hover Overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSection(section.id);
                    }}
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className="bg-gray-100 p-8 text-center">
              <p className="text-gray-600">
                © 2024 {websiteData.title}. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Powered by ScheduledPros
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}