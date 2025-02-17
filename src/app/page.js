import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TestimonialCard from '@/components/TestimonialCard'
import ImageGallery from '@/components/ImageGallery'

export default function Home() {
  const testimonials = [
    {
      id: 1,
      quote: "Hoje nos temos a esperança que alguém irá nos ajudar",
      author: "João",
      image: "/images/avatar1.png"
    },
    {
      id: 2,
      quote: "Não nos sentimos mais só",
      author: "Leia",
      image: "/images/avatar2.png"
    },
    {
      id: 3,
      quote: "Estamos sendo alimentado, grato por essa atitude.",
      author: "Leia",
      image: "/images/avatar3.png"
    },
    {
      id: 4,
      quote: "Já tínhamos desistido, mas hoje conseguimos ver a vida diferente..",
      author: "João",
      image: "/images/avatar4.png"
    },
    {
      id: 5,
      quote: "Esse alimento tem me ajudado muito.",
      author: "Leandro",
      image: "/images/avatar5.png"
    },
    {
      id: 6,
      quote: "Somos muito grato por essa atitude.",
      author: "Lurdes",
      image: "/images/avatar6.png"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Banner */}
      <main className="flex-grow">
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-8">
                Nutrindo vidas, alimentando esperança,
                <br />
                Seja um voluntário!
              </h1>

              <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <h2 className="text-xl font-semibold mb-4 text-gray-600">Faça a diferença!</h2>
                  <p className="text-gray-600">
                    "Um prato de comida pode significar esperança e dignidade para aqueles que enfrentam a fome diariamente. Juntos, podemos fazer a diferença alimentando não apenas seus corpos, mas também suas almas."
                  </p>
                </div>
                <div className="md:w-1/2">
                  <img 
                    src="/images/volunteer.jpg"
                    alt="Voluntário servindo comida"
                    className="rounded-lg w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sessão Depoimentos */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8 px-4 text-gray-600">Feedback - Moradores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard 
                  key={testimonial.id}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  // image={testimonial.image}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Impactos */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Redução da Fome e Desnutrição</h2>
              <p className="text-gray-700 mb-8">
                Ao fornecer alimentos aos moradores de rua, estamos diretamente combatendo a fome e ajudando a garantir que essas pessoas tenham acesso a uma nutrição adequada.
              </p>
              <ImageGallery />
            </div>
          </div>
        </section>

        {/* Relatorio Mensal */}
  {/*       <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8">Relatório do mês, na luta diária</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-lg overflow-hidden shadow-md">
                  <img
                    src="/images/report-image.jpg"
                    alt={`Relatório ${item}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section> */}
      </main>

      <Footer />
    </div>
  );
}
