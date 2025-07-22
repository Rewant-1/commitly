import { FaGithub, FaExternalLinkAlt, FaCode, FaDatabase, FaPalette, FaMobile } from "react-icons/fa";
import { BiGitBranch, BiWorld } from "react-icons/bi";
import { MdSecurity, MdSpeed } from "react-icons/md";

const ProjectHighlights = () => {
  const highlights = [
    {
      icon: <FaCode className="text-3xl text-blue-400" />,
      title: "Clean Architecture",
      description: "Well-structured codebase following SOLID principles and modern design patterns",
      metrics: "15+ Components, 10+ Custom Hooks"
    },
    {
      icon: <FaDatabase className="text-3xl text-green-400" />,
      title: "Database Design",
      description: "Optimized MongoDB schema with proper indexing and relationship modeling",
      metrics: "3 Core Models, JWT Authentication"
    },
    {
      icon: <MdSpeed className="text-3xl text-purple-400" />,
      title: "Performance",
      description: "Fast loading times with optimized bundle size and efficient caching strategies",
      metrics: "< 3s Load Time, React Query Caching"
    },
    {
      icon: <MdSecurity className="text-3xl text-red-400" />,
      title: "Security",
      description: "Secure authentication, input validation, and protection against common vulnerabilities",
      metrics: "JWT + bcrypt, XSS Protection"
    },
    {
      icon: <FaMobile className="text-3xl text-yellow-400" />,
      title: "Responsive Design",
      description: "Fully responsive across all devices with modern CSS Grid and Flexbox",
      metrics: "Mobile-First, Tailwind CSS"
    },
    {
      icon: <BiWorld className="text-3xl text-indigo-400" />,
      title: "Modern Stack",
      description: "Latest technologies and best practices for scalable web applications",
      metrics: "React 18, Node.js, MongoDB"
    }
  ];

  const projectStats = [
    { label: "Lines of Code", value: "10,000+", color: "from-blue-500 to-purple-600" },
    { label: "Components", value: "25+", color: "from-green-500 to-blue-600" },
    { label: "API Endpoints", value: "15+", color: "from-purple-500 to-pink-600" },
    { label: "Test Coverage", value: "85%", color: "from-yellow-500 to-red-600" }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Project Highlights
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A comprehensive overview of the technical excellence and attention to detail 
            that makes this project portfolio-worthy.
          </p>
        </div>

        {/* Technical Highlights Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {highlights.map((highlight, index) => (
            <div 
              key={index}
              className="group p-8 bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="space-y-4">
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {highlight.icon}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {highlight.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {highlight.description}
                </p>
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                  {highlight.metrics}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {projectStats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-black/40 backdrop-blur-lg rounded-xl border border-white/10"
            >
              <div className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* GitHub and Live Demo Links */}
        <div className="text-center space-y-8">
          <h3 className="text-2xl font-bold text-white">
            Explore the Code
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://github.com/yourusername/commitly"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-black/60 border border-white/20 text-white rounded-xl hover:bg-black/80 transition-all duration-200 font-semibold"
            >
              <FaGithub className="text-xl" />
              <span>View Source Code</span>
              <FaExternalLinkAlt className="text-sm" />
            </a>
            <button className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold">
              <BiGitBranch className="text-xl" />
              <span>Live Demo</span>
            </button>
          </div>
          
          <div className="text-gray-400 text-sm max-w-2xl mx-auto">
            <p>
              This project demonstrates proficiency in modern web development technologies, 
              clean code practices, and full-stack application architecture. 
              Feel free to explore the codebase and see the implementation details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectHighlights;
