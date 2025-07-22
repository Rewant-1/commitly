import { FaLinkedin, FaGithub, FaEnvelope, FaDownload } from "react-icons/fa";
import { BiWorld } from "react-icons/bi";

const RecruitmentBanner = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to Build Amazing Things Together?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              This project showcases my passion for creating high-quality, scalable web applications. 
              I'm actively seeking opportunities to contribute to innovative teams and exciting projects.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                3+
              </div>
              <div className="text-gray-300 font-medium">Years Experience</div>
            </div>
            <div className="p-6 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
                15+
              </div>
              <div className="text-gray-300 font-medium">Projects Completed</div>
            </div>
            <div className="p-6 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                100%
              </div>
              <div className="text-gray-300 font-medium">Commitment Level</div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">
              Let's Connect
            </h3>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <FaLinkedin />
                <span>LinkedIn</span>
              </a>
              
              <a 
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <FaGithub />
                <span>GitHub</span>
              </a>
              
              <a 
                href="mailto:your.email@example.com"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <FaEnvelope />
                <span>Email</span>
              </a>
              
              <a 
                href="https://yourportfolio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <BiWorld />
                <span>Portfolio</span>
              </a>
            </div>

            <div className="pt-4">
              <a 
                href="/resume.pdf"
                download
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-full hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <FaDownload />
                <span>Download Resume</span>
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              <strong>Available for:</strong> Full-time positions, contract work, 
              freelance projects, and consulting opportunities. 
              Remote-friendly and open to relocation for the right opportunity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecruitmentBanner;
