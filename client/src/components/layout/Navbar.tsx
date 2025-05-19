import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { MenuIcon, XIcon } from "@/assets/icons";
import { useIndustry, getTerminology } from "@/lib/industryContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  
  // Get industry context
  const { selectedIndustry } = useIndustry();
  const terms = getTerminology(selectedIndustry);
  
  // Track scrolling for enhanced mobile UX
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Create dynamic portal name based on industry (e.g., "Carpenter Portal" instead of "Stylist Portal")
  const portalName = `${selectedIndustry.name} Portal`;

  // Generate links with service name based on industry
  const serviceLabel = selectedIndustry.name === "Influencer" ? "Content" : 
                      selectedIndustry.name === "Custom Business" ? "Services" : 
                      `${selectedIndustry.name} Services`;
  
  const links = [
    { name: serviceLabel, href: "/#services" },
    { name: "Book", href: "/booking" },
    { name: "Reviews", href: "/#reviews" },
    { name: portalName, href: "/dashboard" },
    { name: "Setup", href: "/setup" }
  ];

  return (
    <header 
      className={`bg-white/95 backdrop-blur-sm sticky top-0 z-50 safe-top transition-all ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer text-2xl font-bold text-primary">
              <img src="/favicon.svg" alt="Scheduled" className="h-8 w-8 mr-2" />
              <span className="font-display">Scheduled</span>
            </div>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
            >
              <div 
                className={`cursor-pointer text-foreground hover:text-primary transition-colors tap-highlight-none ${
                  location === link.href || (link.href.includes('#') && location === '/' && window.location.hash === link.href.substring(1)) 
                    ? "text-primary font-medium" : ""
                }`}
              >
                {link.name}
              </div>
            </Link>
          ))}
        </nav>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-foreground focus:outline-none tap-highlight-none"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>
      
      {/* Mobile menu with animation */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-white/95 backdrop-blur-sm px-4 py-2 flex flex-col space-y-4 pb-4 shadow-md">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
            >
              <div 
                className={`cursor-pointer text-foreground hover:text-primary transition-colors py-2 ${
                  location === link.href || (link.href.includes('#') && location === '/' && window.location.hash === link.href.substring(1)) 
                    ? "text-primary font-medium" : ""
                }`}
              >
                {link.name}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
