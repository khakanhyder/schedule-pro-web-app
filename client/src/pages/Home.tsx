import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Gallery from "@/components/home/Gallery";
import Reviews from "@/components/home/Reviews";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <div>
      <Hero />
      <Services />
      <Gallery />
      <Reviews />
      <Contact />
    </div>
  );
}
