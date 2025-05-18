import { Link } from "wouter";
import { FacebookIcon, InstagramIcon, TwitterIcon, PinterestIcon } from "@/assets/icons";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-display font-semibold mb-4">StrandStudio</h3>
            <p className="mb-4">Professional hair styling services tailored to your unique look. Our expert stylists are dedicated to making you look and feel your best.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <TwitterIcon />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <PinterestIcon />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-display font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#services">
                  <a className="hover:text-accent transition-colors">Services</a>
                </Link>
              </li>
              <li>
                <Link href="/booking">
                  <a className="hover:text-accent transition-colors">Book Appointment</a>
                </Link>
              </li>
              <li>
                <Link href="/#reviews">
                  <a className="hover:text-accent transition-colors">Reviews</a>
                </Link>
              </li>
              <li>
                <Link href="/#contact">
                  <a className="hover:text-accent transition-colors">Contact Us</a>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">Our Stylists</a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">Careers</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-display font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">Subscribe to receive updates, promotions, and styling tips.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-700"
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-accent px-4 py-2 rounded-r-md transition-colors"
                aria-label="Subscribe"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} StrandStudio. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-300 hover:text-white mr-4">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
