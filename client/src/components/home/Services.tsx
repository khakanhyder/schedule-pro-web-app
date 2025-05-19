import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { type Service } from "@shared/schema";
import { useIndustry, getTerminology } from "@/lib/industryContext";

// Industry-specific service images
const industryServiceImages = {
  // Beauty Professionals (combined hair, nails, etc.)
  beauty: [
    "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1620331311520-246422fd82f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1610992564677-962b8a3d2b4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1632345031435-8727f6897d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  ],
  
  // Wellness Providers (massage, fitness, etc.)
  wellness: [
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1588680382665-cd934bb0452c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  ],
  
  // Home Services (combining carpenter, plumber, electrician)
  home_services: [
    // Carpentry
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    // Plumbing
    "https://images.unsplash.com/photo-1580398562556-d33864b1ad5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    // Electrical
    "https://images.unsplash.com/photo-1558520871-9c508f147e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    // Carpentry
    "https://images.unsplash.com/photo-1594717527389-a590b56e331d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    // Plumbing
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    // Kitchen remodel
    "https://images.unsplash.com/photo-1556909114-44e3e9699e2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  ],
  
  // Creative Professionals
  creative: [
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1532372576444-dda954194ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1507499739999-097f9693f783?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1489993360877-883320ae5b91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1468956398224-6d6f66e22c35?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  ],
  
  // Influencers
  influencer: [
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1598449356475-b9f71db7d847?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1505421031134-e57263cae120?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1560523159-6b681a1e1852?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1521302200778-33500795e128?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  ],
  
  // Custom Business
  custom: [
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  ]
};

// Fallback to default images if industry not found
const defaultServiceImages = [
  "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  "https://images.unsplash.com/photo-1620331311520-246422fd82f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
];

export default function Services() {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { selectedIndustry } = useIndustry();
  const terms = getTerminology(selectedIndustry);

  // Create industry-specific title based on the current industry
  const sectionTitle = selectedIndustry.id === 'creative' && terms.service === 'service'
    ? 'Premium Creative Services'
    : `Premium ${selectedIndustry.name} ${terms.service.charAt(0).toUpperCase() + terms.service.slice(1)}s`;

  return (
    <section 
      id="services" 
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
      style={{ 
        backgroundImage: `radial-gradient(circle at 80% 50%, ${selectedIndustry.accentColor}10 0%, transparent 25%)` 
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl font-display font-bold mb-4"
            style={{ color: selectedIndustry.primaryColor }}
          >
            {sectionTitle}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Premium {terms.service} options designed to meet your highest expectations. 
            Each {terms.service} includes personalized attention from our experienced {terms.professionals}.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-neutral shadow-md hover:shadow-lg transition rounded-xl overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-8 bg-red-50 rounded-lg">
            <p>Error loading {terms.service} options. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={index}
                industryId={selectedIndustry.id}
                primaryColor={selectedIndustry.primaryColor}
                accentColor={selectedIndustry.accentColor}
                terms={terms}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ 
  service, 
  index = 0, 
  industryId,
  primaryColor,
  accentColor,
  terms
}: { 
  service: Service, 
  index?: number,
  industryId: string,
  primaryColor: string,
  accentColor: string,
  terms: ReturnType<typeof getTerminology>
}) {
  // Get the appropriate service images for this industry - ensure we're using the correct industry
  const currentIndustryId = industryId || 'beauty';
  const serviceImages = industryServiceImages[currentIndustryId as keyof typeof industryServiceImages] || defaultServiceImages;
  const imageIndex = index % serviceImages.length;
  
  // Determine if this is a featured service (usually the middle one)
  const isPopular = index === 1; 
  
  // Format the price with currency symbol
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(Number(service.price));
  
  return (
    <Card 
      className={`
        bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition 
        transform hover:-translate-y-1 border-2 relative
      `}
      style={{ 
        borderColor: isPopular ? primaryColor : 'transparent',
      }}
    >
      {isPopular && (
        <div 
          className="absolute top-0 right-0 left-0 text-center py-1.5 text-sm font-semibold text-white"
          style={{ backgroundColor: primaryColor }}
        >
          Most Popular
        </div>
      )}
      <div className={`${isPopular ? 'pt-7' : ''}`}>
        <img 
          src={serviceImages[imageIndex]} 
          alt={service.name} 
          className="w-full h-48 object-cover"
        />
      </div>
      <CardContent className="p-6">
        <h3 
          className="text-xl font-display font-semibold mb-2"
          style={{ color: isPopular ? primaryColor : 'inherit' }}
        >
          {service.name}
        </h3>
        <p className="text-gray-600 mb-4 min-h-[3rem]">{service.description}</p>
        
        <div className="mb-4">
          <Badge 
            className="rounded-full px-3 py-1 text-xs" 
            style={{ backgroundColor: accentColor, color: '#fff' }}
          >
            {service.durationMinutes} min {terms.service}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <span 
            className="text-xl font-semibold" 
            style={{ color: primaryColor }}
          >
            {formattedPrice}
          </span>
          <Link href="/booking">
            <Button 
              className="rounded-full px-5 transition-all transform hover:scale-105"
              style={{ 
                backgroundColor: primaryColor,
                boxShadow: isPopular ? `0 4px 14px ${primaryColor}50` : 'none'
              }}
            >
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
