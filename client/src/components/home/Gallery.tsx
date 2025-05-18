export default function Gallery() {
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Modern salon interior"
    },
    {
      url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Salon reception area"
    },
    {
      url: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      alt: "Hair washing station"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">Our Salon</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <img 
              key={index}
              src={image.url} 
              alt={image.alt} 
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
