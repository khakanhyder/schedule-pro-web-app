import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Gallery from "@/components/home/Gallery";
import Reviews from "@/components/home/Reviews";
import Contact from "@/components/home/Contact";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Hero />
      <Services />
      <Gallery />
      <Reviews />
      <Contact />
      
      {/* Quick Actions */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        <Link href="/booking">
          <Button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-full shadow-lg w-full">
            Book Now
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="bg-white hover:bg-gray-50 border-2 border-primary text-primary font-bold py-2 px-4 rounded-full shadow-lg text-sm w-full">
            Business Portal
          </Button>
        </Link>
      </div>
    </div>
  );
}
