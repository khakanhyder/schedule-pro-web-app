import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MenuIcon, XIcon } from "@/assets/icons";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { name: "Services", href: "/#services" },
    { name: "Book Now", href: "/booking" },
    { name: "Reviews", href: "/#reviews" },
    { name: "Contact", href: "/#contact" }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-2xl font-display font-bold text-primary">
              StrandStudio
            </a>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          {links.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
            >
              <a 
                className={`text-foreground hover:text-primary transition-colors ${
                  location === link.href ? "text-primary" : ""
                }`}
              >
                {link.name}
              </a>
            </Link>
          ))}
        </nav>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-foreground focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-2 shadow-md">
          <nav className="flex flex-col space-y-3 pb-3">
            {links.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
              >
                <a 
                  className={`text-foreground hover:text-primary transition-colors ${
                    location === link.href ? "text-primary" : ""
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
