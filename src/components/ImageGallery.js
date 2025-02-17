export default function ImageGallery() {
    const images = [
      {
        id: 1,
        src: "/images/gallery1.jpg",
        alt: "Distribuição de alimentos 1"
      },
      {
        id: 2,
        src: "/images/gallery2.jpg",
        alt: "Distribuição de alimentos 2"
      },
      {
        id: 3,
        src: "/images/gallery3.jpg",
        alt: "Distribuição de alimentos 3"
      },
      {
        id: 4,
        src: "/images/gallery4.jpg",
        alt: "Distribuição de alimentos 4"
      }
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image) => (
          <div key={image.id} className="rounded-lg overflow-hidden shadow-md">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>
    );
  }
  