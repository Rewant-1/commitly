import { FaQuoteLeft, FaStar } from "react-icons/fa";

const TestimonialCard = ({ name, role, quote, rating = 5 }) => {
  return (
    <div className="group p-8 bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
      <div className="space-y-6">
        <div className="flex items-center space-x-1">
          {[...Array(rating)].map((_, i) => (
            <FaStar key={i} className="text-yellow-400 text-sm" />
          ))}
        </div>
        
        <div className="relative">
          <FaQuoteLeft className="text-blue-400 text-2xl opacity-50 absolute -top-2 -left-2" />
          <p className="text-gray-300 leading-relaxed pl-6">
            {quote}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="font-semibold text-white">{name}</div>
            <div className="text-gray-400 text-sm">{role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Frontend Developer",
      quote: "The real-time features and modern design make this platform incredibly engaging. The code quality and architecture are impressive!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Full-Stack Engineer",
      quote: "Built with the latest technologies and best practices. The attention to detail in both functionality and user experience is outstanding.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "UI/UX Designer",
      quote: "The interface is clean, intuitive, and visually stunning. The glass morphism effects and animations create a delightful user experience.",
      rating: 5
    },
    {
      name: "David Park",
      role: "Tech Lead",
      quote: "Excellent demonstration of full-stack capabilities. The code is well-structured, scalable, and follows modern development patterns.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "Product Manager",
      quote: "This platform showcases advanced features like real-time updates, secure authentication, and responsive design. Truly impressive work!",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Senior Developer",
      quote: "The technical implementation is solid, from the React frontend to the Node.js backend. A great example of modern web development.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            What Developers Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See what fellow developers and tech professionals think about this project's 
            implementation, design, and technical excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              quote={testimonial.quote}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
