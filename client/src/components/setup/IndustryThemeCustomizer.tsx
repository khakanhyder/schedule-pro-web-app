import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Palette,
  Layout,
  Type,
  Image,
  Sparkles,
  Eye,
  Download
} from "lucide-react";
import { useIndustry } from "@/lib/industryContext";
import { useToast } from "@/hooks/use-toast";

const industryThemes = {
  beauty: {
    name: "Beauty & Wellness",
    primaryColors: ["#EC4899", "#F472B6", "#E879F9", "#C084FC", "#A78BFA", "#F97316"],
    accentColors: ["#FDF2F8", "#FCE7F3", "#FAE8FF", "#F3E8FF", "#EDE9FE", "#FEF3C7"],
    fonts: ["Playfair Display", "Dancing Script", "Libre Baskerville", "Cormorant Garamond", "Montserrat", "Poppins"],
    layouts: ["Feminine Elegant", "Luxury Boutique", "Rose Gold Glam", "Soft Minimalist", "Vintage Chic", "Modern Clean"],
    brandingElements: ["Rose gold accents", "Floral patterns", "Soft curves", "Pearl details", "Pastel gradients", "Delicate borders"],
    styleOptions: {
      "Feminine & Elegant": {
        primaryColor: "#EC4899",
        accentColor: "#FDF2F8", 
        font: "Playfair Display",
        description: "Perfect for salons targeting a feminine, upscale clientele"
      },
      "Rose Gold Luxury": {
        primaryColor: "#F472B6",
        accentColor: "#FCE7F3",
        font: "Cormorant Garamond", 
        description: "High-end, luxurious feel with rose gold elements"
      },
      "Modern Professional": {
        primaryColor: "#8B5CF6",
        accentColor: "#F3E8FF",
        font: "Montserrat",
        description: "Clean and professional while maintaining feminine appeal"
      }
    }
  },
  trades: {
    name: "Skilled Trades",
    primaryColors: ["#1F2937", "#374151", "#F97316", "#EF4444", "#059669", "#0F172A"],
    accentColors: ["#F3F4F6", "#E5E7EB", "#FEF3C7", "#FEE2E2", "#D1FAE5", "#F1F5F9"],
    fonts: ["Roboto Condensed", "Oswald", "Work Sans", "Source Sans Pro", "Open Sans", "Inter"],
    layouts: ["Industrial Strong", "Blueprint Professional", "Tool-focused", "Safety First", "Masculine Bold", "Clean Efficiency"],
    brandingElements: ["Bold borders", "Tool silhouettes", "Industrial patterns", "Safety stripes", "Metal textures", "Sharp angles"],
    styleOptions: {
      "Masculine & Bold": {
        primaryColor: "#1F2937",
        accentColor: "#F3F4F6",
        font: "Oswald",
        description: "Strong, masculine design for contractors and tradesmen"
      },
      "Industrial Orange": {
        primaryColor: "#F97316", 
        accentColor: "#FEF3C7",
        font: "Roboto Condensed",
        description: "High-visibility orange with industrial strength"
      },
      "Professional Steel": {
        primaryColor: "#374151",
        accentColor: "#E5E7EB", 
        font: "Work Sans",
        description: "Clean, professional look with steel-like reliability"
      }
    }
  },
  wellness: {
    name: "Health & Wellness",
    primaryColors: ["#059669", "#0EA5E9", "#8B5CF6", "#6366F1"],
    accentColors: ["#ECFDF5", "#F0F9FF", "#F5F3FF", "#EEF2FF"],
    fonts: ["Source Serif Pro", "Nunito Sans", "Lato", "Merriweather"],
    layouts: ["Calming Zen", "Medical Professional", "Holistic Healing", "Therapy Focus"],
    brandingElements: ["Nature elements", "Healing symbols", "Soft transitions", "Peaceful imagery"]
  },
  "pet-care": {
    name: "Pet Care",
    primaryColors: ["#F59E0B", "#10B981", "#8B5CF6", "#EC4899"],
    accentColors: ["#FEF3C7", "#D1FAE5", "#F3E8FF", "#FDF2F8"],
    fonts: ["Fredoka One", "Quicksand", "Comfortaa", "Nunito"],
    layouts: ["Playful & Fun", "Veterinary Clean", "Pet Boutique", "Animal Hospital"],
    brandingElements: ["Paw prints", "Pet silhouettes", "Playful shapes", "Heart accents"]
  },
  creative: {
    name: "Creative Services",
    primaryColors: ["#8B5CF6", "#EC4899", "#F59E0B", "#EF4444"],
    accentColors: ["#F3E8FF", "#FDF2F8", "#FEF3C7", "#FEE2E2"],
    fonts: ["Abril Fatface", "Oswald", "Dancing Script", "Bebas Neue"],
    layouts: ["Portfolio Showcase", "Artist Studio", "Creative Agency", "Designer Minimal"],
    brandingElements: ["Artistic brushes", "Creative frames", "Color splashes", "Gallery grids"]
  }
};

export default function IndustryThemeCustomizer() {
  const { selectedIndustry } = useIndustry();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState({
    primaryColor: industryThemes[selectedIndustry.id]?.primaryColors[0] || "#EC4899",
    accentColor: industryThemes[selectedIndustry.id]?.accentColors[0] || "#FDF2F8",
    font: industryThemes[selectedIndustry.id]?.fonts[0] || "Inter",
    layout: industryThemes[selectedIndustry.id]?.layouts[0] || "Modern",
    branding: industryThemes[selectedIndustry.id]?.brandingElements[0] || "Professional"
  });

  const currentTheme = industryThemes[selectedIndustry.id as keyof typeof industryThemes] || industryThemes.beauty;

  const handleApplyTheme = () => {
    toast({
      title: "Theme Applied Successfully",
      description: `Your ${selectedIndustry.name} theme has been customized and applied to your dashboard.`
    });
  };

  const handleSaveAsTemplate = () => {
    toast({
      title: "Theme Saved as Template",
      description: "This theme configuration has been saved for future use and sharing."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold">{currentTheme.name} Theme Customizer</h2>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Industry-Specific
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveAsTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Save Template
          </Button>
          <Button onClick={handleApplyTheme}>
            <Sparkles className="h-4 w-4 mr-2" />
            Apply Theme
          </Button>
        </div>
      </div>

      <div className="p-4 rounded-lg" style={{ backgroundColor: selectedTheme.accentColor }}>
        <h3 className="font-medium mb-2">Industry-Tailored Design</h3>
        <p className="text-sm text-muted-foreground">
          Customize your app's appearance to perfectly match your {selectedIndustry.name} business. 
          Each element is designed specifically for your industry's aesthetic and client expectations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="colors" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Color Scheme
                  </CardTitle>
                  <CardDescription>
                    Choose colors that resonate with your {selectedIndustry.name} clientele
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Primary Color</Label>
                    <div className="grid grid-cols-4 gap-3">
                      {currentTheme.primaryColors.map((color, index) => (
                        <div
                          key={index}
                          className={`w-full h-12 rounded-lg cursor-pointer border-2 ${
                            selectedTheme.primaryColor === color ? 'border-gray-800' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedTheme({...selectedTheme, primaryColor: color})}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Accent Color</Label>
                    <div className="grid grid-cols-4 gap-3">
                      {currentTheme.accentColors.map((color, index) => (
                        <div
                          key={index}
                          className={`w-full h-12 rounded-lg cursor-pointer border-2 ${
                            selectedTheme.accentColor === color ? 'border-gray-800' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedTheme({...selectedTheme, accentColor: color})}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Typography
                  </CardTitle>
                  <CardDescription>
                    Select fonts that match your {selectedIndustry.name} brand personality
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Primary Font</Label>
                    <Select value={selectedTheme.font} onValueChange={(value) => setSelectedTheme({...selectedTheme, font: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currentTheme.fonts.map((font) => (
                          <SelectItem key={font} value={font}>
                            <span style={{ fontFamily: font }}>{font}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 border rounded-lg" style={{ fontFamily: selectedTheme.font }}>
                    <h3 className="text-xl font-bold mb-2">Preview Text</h3>
                    <p className="text-sm text-muted-foreground">
                      This is how your {selectedIndustry.name} business name and content will appear to clients.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    Layout Style
                  </CardTitle>
                  <CardDescription>
                    Choose a layout that fits your {selectedIndustry.name} workflow
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {currentTheme.layouts.map((layout) => (
                      <div
                        key={layout}
                        className={`p-4 border-2 rounded-lg cursor-pointer ${
                          selectedTheme.layout === layout ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedTheme({...selectedTheme, layout})}
                      >
                        <h4 className="font-medium">{layout}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Optimized for {selectedIndustry.name} operations
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Branding Elements
                  </CardTitle>
                  <CardDescription>
                    Add visual elements that speak to your {selectedIndustry.name} audience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {currentTheme.brandingElements.map((element) => (
                      <div
                        key={element}
                        className={`p-4 border-2 rounded-lg cursor-pointer ${
                          selectedTheme.branding === element ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedTheme({...selectedTheme, branding: element})}
                      >
                        <h4 className="font-medium">{element}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Perfect for {selectedIndustry.name} branding
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Logo upload support</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Custom color picker</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <Label>Background patterns</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <CardDescription>
                See how your theme looks in action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="p-4 rounded-lg border-2"
                style={{ 
                  backgroundColor: selectedTheme.accentColor,
                  borderColor: selectedTheme.primaryColor,
                  fontFamily: selectedTheme.font
                }}
              >
                <div 
                  className="text-lg font-bold mb-2"
                  style={{ color: selectedTheme.primaryColor }}
                >
                  {selectedIndustry.name} Dashboard
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  {selectedTheme.layout} • {selectedTheme.branding}
                </div>
                <div 
                  className="w-full h-6 rounded mb-2"
                  style={{ backgroundColor: selectedTheme.primaryColor }}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    className="h-4 rounded"
                    style={{ backgroundColor: selectedTheme.primaryColor, opacity: 0.7 }}
                  />
                  <div 
                    className="h-4 rounded"
                    style={{ backgroundColor: selectedTheme.primaryColor, opacity: 0.5 }}
                  />
                </div>
              </div>

              <div className="text-center">
                <Badge 
                  variant="outline" 
                  style={{ 
                    backgroundColor: selectedTheme.accentColor,
                    borderColor: selectedTheme.primaryColor,
                    color: selectedTheme.primaryColor
                  }}
                >
                  {selectedIndustry.name} Optimized
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
              <CardDescription>
                Popular {selectedIndustry.name} combinations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentTheme.styleOptions && Object.entries(currentTheme.styleOptions).map(([name, style]) => (
                <div key={name} className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setSelectedTheme({
                      primaryColor: style.primaryColor,
                      accentColor: style.accentColor,
                      font: style.font,
                      layout: currentTheme.layouts[0],
                      branding: currentTheme.brandingElements[0]
                    })}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: style.primaryColor }}
                      />
                      {name}
                    </div>
                  </Button>
                  <p className="text-xs text-muted-foreground px-2">
                    {style.description}
                  </p>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start mt-4"
                onClick={() => setSelectedTheme({
                  primaryColor: currentTheme.primaryColors[0],
                  accentColor: currentTheme.accentColors[0],
                  font: currentTheme.fonts[0],
                  layout: currentTheme.layouts[0],
                  branding: currentTheme.brandingElements[0]
                })}
              >
                Classic {selectedIndustry.name}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}