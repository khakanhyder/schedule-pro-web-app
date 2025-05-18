import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">Your Perfect Hair Awaits</h1>
        <p className="text-xl text-white mb-8 max-w-2xl">Professional styling services tailored to your unique look</p>
        <Link href="/booking">
          <a className="bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-full transition duration-300 text-lg">
            Book Appointment
          </a>
        </Link>
      </div>
    </section>
  );
}
