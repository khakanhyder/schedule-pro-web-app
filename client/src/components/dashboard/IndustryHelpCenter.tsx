import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIndustry } from "@/lib/industryContext";
import { 
  Search, Book, Video, MessageSquare, Star,
  Scissors, Wrench, Heart, PawPrint, Palette,
  ChevronDown, ChevronRight, ExternalLink, Play
} from "lucide-react";

export default function IndustryHelpCenter() {
  const { selectedIndustry } = useIndustry();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const getIndustryContent = () => {
    switch (selectedIndustry.id) {
      case 'beauty':
        return {
          quickStart: [
            {
              title: "Setting Up Your Salon Profile",
              description: "Create an attractive profile that showcases your specialties",
              steps: [
                "Upload professional photos of your work",
                "List your specialties (color, cuts, extensions, etc.)",
                "Set your availability and booking preferences",
                "Configure pricing for different hair lengths"
              ]
            },
            {
              title: "Managing Color Services",
              description: "Best practices for scheduling and pricing color work",
              steps: [
                "Set longer time blocks for color services",
                "Require consultations for first-time color clients",
                "Use hair length multipliers for accurate pricing",
                "Track color formulas for consistent results"
              ]
            },
            {
              title: "Building Client Loyalty",
              description: "Strategies to increase rebooking rates",
              steps: [
                "Send personalized aftercare instructions",
                "Schedule follow-up appointments before clients leave",
                "Offer package deals for regular maintenance",
                "Create a referral program with incentives"
              ]
            }
          ],
          businessTips: [
            {
              category: "Pricing Strategy",
              tips: [
                "Price by hair length and thickness, not just service type",
                "Charge consultation fees for complex color corrections",
                "Offer package deals for bridal parties and events",
                "Include product costs in service pricing"
              ]
            },
            {
              category: "Client Communication",
              tips: [
                "Send inspiration photos before appointments",
                "Use beauty terminology clients understand",
                "Share aftercare tips via automated messages",
                "Request photos for your portfolio (with permission)"
              ]
            },
            {
              category: "Seasonal Trends",
              tips: [
                "Promote summer highlights and beach waves",
                "Offer deep conditioning packages in winter",
                "Create holiday party updo packages",
                "Track trending colors and techniques"
              ]
            }
          ],
          faq: [
            {
              question: "How do I handle clients who are always late?",
              answer: "Set clear policies about late arrivals. Consider charging a fee for appointments that start more than 15 minutes late, or automatically shorten the service time. Communicate this policy upfront and include it in confirmation messages."
            },
            {
              question: "What's the best way to price color corrections?",
              answer: "Color corrections require expertise and time. Charge 2-3x your normal color service rate, always require a consultation first, and be transparent about the process taking multiple sessions. Set realistic expectations about results."
            },
            {
              question: "How can I reduce no-shows for appointments?",
              answer: "Send reminder texts 24 hours and 2 hours before appointments. Require a deposit for new clients or expensive services. Use automated rebooking suggestions to keep your schedule full."
            }
          ],
          tutorials: [
            {
              title: "Color Formula Tracking System",
              description: "Learn to document and organize color formulas for consistent results",
              duration: "8 minutes",
              difficulty: "Beginner"
            },
            {
              title: "Maximizing Your Booking Efficiency",
              description: "Strategies to reduce gaps in your schedule and increase daily revenue",
              duration: "12 minutes",
              difficulty: "Intermediate"
            },
            {
              title: "Building a Referral Program That Works",
              description: "Create incentives that encourage clients to refer friends and family",
              duration: "15 minutes",
              difficulty: "Advanced"
            }
          ]
        };

      case 'trades':
        return {
          quickStart: [
            {
              title: "Setting Up Your Contractor Profile",
              description: "Establish credibility and showcase your expertise",
              steps: [
                "Upload photos of completed projects",
                "List all licenses and certifications",
                "Define your service area and travel fees",
                "Set up emergency service availability"
              ]
            },
            {
              title: "Estimating and Quoting Jobs",
              description: "Create accurate estimates that win jobs and maintain margins",
              steps: [
                "Calculate material costs with markup",
                "Factor in permit and inspection fees",
                "Include travel time and setup costs",
                "Build in contingency for unexpected issues"
              ]
            },
            {
              title: "Managing Project Timelines",
              description: "Keep jobs on schedule and clients informed",
              steps: [
                "Break large projects into phases",
                "Account for material delivery delays",
                "Communicate progress updates regularly",
                "Plan for weather-dependent work"
              ]
            }
          ],
          businessTips: [
            {
              category: "Pricing Strategy",
              tips: [
                "Charge premium rates for emergency calls",
                "Include material markup in your pricing",
                "Factor in dump fees and cleanup costs",
                "Charge extra for difficult access situations"
              ]
            },
            {
              category: "Client Relations",
              tips: [
                "Document everything with photos",
                "Explain the work process to homeowners",
                "Provide realistic timelines with buffers",
                "Follow up after job completion"
              ]
            },
            {
              category: "Business Growth",
              tips: [
                "Build relationships with suppliers for better pricing",
                "Network with real estate agents and property managers",
                "Offer maintenance contracts for recurring revenue",
                "Specialize in high-demand services"
              ]
            }
          ],
          faq: [
            {
              question: "How do I handle clients who want to change the scope mid-project?",
              answer: "Always document scope changes in writing with new cost estimates. Explain how changes affect timeline and pricing. Use change orders to protect yourself and maintain clear communication."
            },
            {
              question: "What should I do when material costs increase during a project?",
              answer: "Include price escalation clauses in contracts for long projects. For unexpected increases, communicate immediately with clients and provide options: absorb the cost, pass it through, or find alternatives."
            },
            {
              question: "How can I reduce no-shows for estimates?",
              answer: "Confirm estimate appointments 24 hours in advance. Charge a small fee for estimates that can be credited toward the job. Provide specific time windows and call when you're on your way."
            }
          ],
          tutorials: [
            {
              title: "Accurate Job Estimating Techniques",
              description: "Calculate costs that protect your margins while winning bids",
              duration: "18 minutes",
              difficulty: "Intermediate"
            },
            {
              title: "Emergency Service Premium Pricing",
              description: "Structure after-hours and emergency calls for maximum profitability",
              duration: "10 minutes",
              difficulty: "Beginner"
            },
            {
              title: "Building Long-term Client Relationships",
              description: "Turn one-time jobs into ongoing maintenance contracts",
              duration: "14 minutes",
              difficulty: "Advanced"
            }
          ]
        };

      case 'wellness':
        return {
          quickStart: [
            {
              title: "Creating Your Wellness Practice Profile",
              description: "Build trust and communicate your healing approach",
              steps: [
                "Describe your wellness philosophy clearly",
                "List certifications and training background",
                "Explain your approach to client care",
                "Set boundaries for your practice"
              ]
            },
            {
              title: "Client Intake and Assessment",
              description: "Gather necessary information while building rapport",
              steps: [
                "Create comprehensive health history forms",
                "Discuss client goals and expectations",
                "Explain your treatment approach",
                "Establish consent and boundaries"
              ]
            },
            {
              title: "Session and Progress Tracking",
              description: "Monitor client progress and adjust treatments",
              steps: [
                "Document session notes consistently",
                "Track client goals and milestones",
                "Regular check-ins on progress",
                "Adjust treatment plans as needed"
              ]
            }
          ],
          businessTips: [
            {
              category: "Pricing Strategy",
              tips: [
                "Offer package deals for multiple sessions",
                "Charge premium for specialized techniques",
                "Consider sliding scale for accessibility",
                "Include intake time in session pricing"
              ]
            },
            {
              category: "Client Care",
              tips: [
                "Send gentle reminder messages using wellness language",
                "Provide aftercare instructions for each modality",
                "Check in between sessions for support",
                "Respect client healing processes and timing"
              ]
            },
            {
              category: "Practice Growth",
              tips: [
                "Collaborate with other wellness practitioners",
                "Offer workshops and educational content",
                "Build community through wellness challenges",
                "Focus on client transformations over transactions"
              ]
            }
          ],
          faq: [
            {
              question: "How do I handle clients who cancel frequently?",
              answer: "Address this with compassion while maintaining boundaries. Understand that wellness journeys have ups and downs. Consider offering more flexible scheduling or discussing what support they need to maintain consistency."
            },
            {
              question: "What's the best way to track client progress?",
              answer: "Use both objective measures (pain scales, mobility tests) and subjective feedback (energy levels, mood). Regular check-ins help adjust treatment plans and show clients their progress over time."
            },
            {
              question: "How can I maintain professional boundaries while being caring?",
              answer: "Be warm and supportive within your professional role. Set clear policies about communication, cancellations, and scope of practice. Refer clients to other professionals when needs are outside your expertise."
            }
          ],
          tutorials: [
            {
              title: "Effective Client Intake Processes",
              description: "Gather essential information while building therapeutic rapport",
              duration: "16 minutes",
              difficulty: "Beginner"
            },
            {
              title: "Creating Wellness Package Programs",
              description: "Design packages that support client goals and practice sustainability",
              duration: "12 minutes",
              difficulty: "Intermediate"
            },
            {
              title: "Building a Referral Network",
              description: "Connect with other practitioners for comprehensive client care",
              duration: "20 minutes",
              difficulty: "Advanced"
            }
          ]
        };

      case 'pet-care':
        return {
          quickStart: [
            {
              title: "Setting Up Your Pet Care Profile",
              description: "Build trust with pet parents and showcase your expertise",
              steps: [
                "Upload photos of happy, well-groomed pets",
                "List your experience with different breeds",
                "Describe your approach to anxious pets",
                "Show your certifications and training"
              ]
            },
            {
              title: "Pet Intake and Safety Protocols",
              description: "Ensure safety and comfort for every pet",
              steps: [
                "Require vaccination records",
                "Assess pet temperament and special needs",
                "Document behavioral notes and preferences",
                "Establish emergency contact procedures"
              ]
            },
            {
              title: "Pricing by Pet Size and Coat Type",
              description: "Fair pricing that reflects time and effort required",
              steps: [
                "Create size-based pricing tiers",
                "Charge extra for matted coats",
                "Factor in special handling needs",
                "Include add-on services in estimates"
              ]
            }
          ],
          businessTips: [
            {
              category: "Pricing Strategy",
              tips: [
                "Charge based on size, coat type, and temperament",
                "Add fees for matted fur or difficult behavior",
                "Offer package deals for regular clients",
                "Charge premium for mobile services"
              ]
            },
            {
              category: "Pet Safety",
              tips: [
                "Always check vaccination status",
                "Watch for signs of stress or illness",
                "Use appropriate restraints for safety",
                "Have emergency vet contact ready"
              ]
            },
            {
              category: "Client Communication",
              tips: [
                "Send photos during the grooming process",
                "Use pet-focused language in messages",
                "Provide aftercare instructions",
                "Follow up on pet's comfort post-grooming"
              ]
            }
          ],
          faq: [
            {
              question: "How do I handle aggressive or fearful pets?",
              answer: "Safety first - never force a stressed pet. Use calming techniques, take breaks, and consider muzzles if necessary. Some pets may need shorter sessions or referral to specialized handlers. Always document behavioral notes."
            },
            {
              question: "What should I do if I discover health issues during grooming?",
              answer: "Document findings with photos and notify the owner immediately. Recommend they contact their veterinarian. Don't attempt to diagnose, but do point out concerns like skin issues, lumps, or infections you notice."
            },
            {
              question: "How can I build trust with new pet clients?",
              answer: "Start with shorter introductory sessions. Let pets acclimate to your space and tools. Communicate frequently with owners about their pet's behavior and comfort level. Patience builds long-term relationships."
            }
          ],
          tutorials: [
            {
              title: "Handling Anxious Pets with Care",
              description: "Techniques to calm stressed pets and ensure safe grooming",
              duration: "14 minutes",
              difficulty: "Intermediate"
            },
            {
              title: "Breed-Specific Grooming Standards",
              description: "Learn proper cuts and care for different dog and cat breeds",
              duration: "22 minutes",
              difficulty: "Advanced"
            },
            {
              title: "Building Client Loyalty in Pet Care",
              description: "Strategies to become the go-to groomer for pet families",
              duration: "11 minutes",
              difficulty: "Beginner"
            }
          ]
        };

      case 'creative':
        return {
          quickStart: [
            {
              title: "Building Your Creative Portfolio",
              description: "Showcase your style and attract ideal clients",
              steps: [
                "Curate your best work by category",
                "Write compelling project descriptions",
                "Include client testimonials and results",
                "Update portfolio regularly with new work"
              ]
            },
            {
              title: "Project Scoping and Contracts",
              description: "Set clear expectations and protect your work",
              steps: [
                "Define project scope in detail",
                "Specify number of revisions included",
                "Clarify usage rights and licensing",
                "Include payment terms and milestones"
              ]
            },
            {
              title: "Creative Workflow Management",
              description: "Deliver projects on time while maintaining quality",
              steps: [
                "Break projects into phases with deadlines",
                "Build in time for client feedback and revisions",
                "Use project management tools for tracking",
                "Communicate progress regularly"
              ]
            }
          ],
          businessTips: [
            {
              category: "Pricing Strategy",
              tips: [
                "Price by project value, not just hours",
                "Charge rush fees for tight deadlines",
                "Include usage rights in your pricing",
                "Offer package deals for ongoing work"
              ]
            },
            {
              category: "Client Management",
              tips: [
                "Set clear revision limits upfront",
                "Educate clients on the creative process",
                "Present concepts with rationale",
                "Manage scope creep professionally"
              ]
            },
            {
              category: "Creative Process",
              tips: [
                "Start with thorough creative briefs",
                "Present multiple concept directions",
                "Explain design decisions to build trust",
                "Document inspiration and references"
              ]
            }
          ],
          faq: [
            {
              question: "How do I handle clients who want unlimited revisions?",
              answer: "Set revision limits in your contract (typically 3 rounds). Explain that focused feedback leads to better results. Charge for additional revisions beyond the limit. This protects your time and encourages decisive feedback."
            },
            {
              question: "What should I do when a client doesn't like any concepts?",
              answer: "Step back and revisit the creative brief. Often this means the brief wasn't clear enough. Ask specific questions about what they do/don't like. Sometimes starting fresh with new direction is better than forcing existing concepts."
            },
            {
              question: "How can I justify my rates to price-sensitive clients?",
              answer: "Focus on value delivered, not just time spent. Show how good design impacts their business goals. Present case studies with measurable results. Remember, clients who only care about price may not value your expertise."
            }
          ],
          tutorials: [
            {
              title: "Creating Effective Creative Briefs",
              description: "Get clear project direction from clients before starting work",
              duration: "13 minutes",
              difficulty: "Beginner"
            },
            {
              title: "Value-Based Pricing for Creatives",
              description: "Price your work based on client value, not just your time",
              duration: "19 minutes",
              difficulty: "Advanced"
            },
            {
              title: "Managing Client Expectations",
              description: "Set boundaries while maintaining positive relationships",
              duration: "16 minutes",
              difficulty: "Intermediate"
            }
          ]
        };

      default:
        return {
          quickStart: [],
          businessTips: [],
          faq: [],
          tutorials: []
        };
    }
  };

  const content = getIndustryContent();

  const getIndustryIcon = () => {
    switch (selectedIndustry.id) {
      case 'beauty': return <Scissors className="h-5 w-5 text-pink-600" />;
      case 'trades': return <Wrench className="h-5 w-5 text-orange-600" />;
      case 'wellness': return <Heart className="h-5 w-5 text-green-600" />;
      case 'pet-care': return <PawPrint className="h-5 w-5 text-amber-600" />;
      case 'creative': return <Palette className="h-5 w-5 text-purple-600" />;
      default: return <Book className="h-5 w-5" />;
    }
  };

  const getIndustryColor = () => {
    switch (selectedIndustry.id) {
      case 'beauty': return 'border-pink-200 bg-pink-50';
      case 'trades': return 'border-orange-200 bg-orange-50';
      case 'wellness': return 'border-green-200 bg-green-50';
      case 'pet-care': return 'border-amber-200 bg-amber-50';
      case 'creative': return 'border-purple-200 bg-purple-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const filteredContent = (items: any[]) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getIndustryIcon()}
          <div>
            <h2 className="text-2xl font-bold">{selectedIndustry.name} Help Center</h2>
            <p className="text-muted-foreground">
              Expert guidance tailored for your industry
            </p>
          </div>
        </div>
        <Badge variant="outline" className="capitalize">
          {selectedIndustry.name}
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${selectedIndustry.name} help topics...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="business-tips">Business Tips</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Video Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-4">
          <div className="grid gap-4">
            {filteredContent(content.quickStart).map((guide, index) => (
              <Card key={index} className={getIndustryColor()}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                      {index + 1}
                    </span>
                    {guide.title}
                  </CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {guide.steps.map((step: string, stepIndex: number) => (
                      <div key={stepIndex} className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs mt-0.5">
                          {stepIndex + 1}
                        </div>
                        <p className="text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="business-tips" className="space-y-4">
          <div className="space-y-6">
            {content.businessTips.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.tips.map((tip: string, tipIndex: number) => (
                      <div key={tipIndex} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <p className="text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <div className="space-y-2">
            {filteredContent(content.faq).map((item, index) => (
              <Collapsible
                key={index}
                open={openFAQ === `faq-${index}`}
                onOpenChange={(open) => setOpenFAQ(open ? `faq-${index}` : null)}
              >
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-left">{item.question}</h4>
                        {openFAQ === `faq-${index}` ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4">
          <div className="grid gap-4">
            {filteredContent(content.tutorials).map((tutorial, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <Play className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{tutorial.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{tutorial.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {tutorial.duration}
                        </Badge>
                        <Badge 
                          variant={tutorial.difficulty === 'Beginner' ? 'default' : 
                                 tutorial.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {tutorial.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" className="flex items-center gap-2">
                      <Video className="h-3 w-3" />
                      Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Need More Help?</h3>
              <p className="text-sm text-muted-foreground">
                Connect with our {selectedIndustry.name} success team for personalized guidance
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Live Chat
              </Button>
              <Button className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Book Consultation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}