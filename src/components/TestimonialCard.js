export default function TestimonialCard({ quote, author, image }) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <p className="text-gray-700 mb-4">{quote}</p>
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt={author}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">Name</p>
            <p className="text-gray-600 text-sm">{author}</p>
          </div>
        </div>
      </div>
    );
  }
  