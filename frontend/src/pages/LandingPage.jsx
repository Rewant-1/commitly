import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const LandingPage = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const terminalLines = [
    "$ welcome to commitly",
    "$ a terminal-inspired social platform",
    "$ type your thoughts like git commits",
    "$ git commit -m \"your message here\"",
    "$ join the conversation..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLine(prev => (prev + 1) % terminalLines.length);
    }, 2000);

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, [terminalLines.length]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-green-400 font-mono">
      {/* Header */}
      <header className="border-b border-green-400/50 p-6 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-lg">$</span>
            <span className="text-green-400 text-xl font-bold">commitly</span>
          </div>
          <nav className="flex space-x-6">
            <Link 
              to="/login" 
              className="px-6 py-2 border border-green-400/50 rounded-lg hover:bg-green-400/10 hover:border-green-400 transition-all duration-300 font-medium transform hover:scale-105"
            >
              login
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-gray-900 rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all duration-300 font-bold transform hover:scale-105 shadow-lg"
            >
              signup
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-8">
        {/* Terminal Window */}
        <div className="border-2 border-green-400/60 rounded-xl p-8 mb-12 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm shadow-2xl">
          <div className="flex items-center space-x-3 mb-6 border-b border-green-400/30 pb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg"></div>
              <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg"></div>
            </div>
            <span className="text-green-400 ml-4 font-semibold">terminal</span>
          </div>
          
          <div className="space-y-3">
            {terminalLines.map((line, index) => (
              <div 
                key={index} 
                className={`${index <= currentLine ? 'opacity-100' : 'opacity-30'} transition-opacity duration-500 text-lg`}
              >
                {line}
                {index === currentLine && showCursor && <span className="text-green-400 animate-pulse">_</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="border-2 border-green-400/50 rounded-xl p-8 bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm shadow-xl hover:border-green-400/70 transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-2xl mb-6 text-green-400 font-bold">$ git commit tweets</h3>
            <p className="text-green-300/80 mb-6 leading-relaxed">
              Post updates using familiar git syntax:
            </p>
            <div className="bg-gray-900/80 p-4 rounded-lg font-mono text-sm border border-green-400/30">
              <span className="text-red-400">git</span>{" "}
              <span className="text-blue-400">commit</span>{" "}
              <span className="text-yellow-400">-m</span>{" "}
              <span className="text-green-300">"just shipped a new feature"</span>
            </div>
          </div>

          <div className="border-2 border-green-400/50 rounded-xl p-8 bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm shadow-xl hover:border-green-400/70 transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-2xl mb-6 text-green-400 font-bold">$ terminal interface</h3>
            <p className="text-green-300/80 mb-6 leading-relaxed">
              Clean, distraction-free environment for developers who prefer the command line aesthetic.
            </p>
            <ul className="space-y-2 text-sm text-green-300/70">
              <li className="flex items-center gap-2">
                <span className="text-green-400">•</span> monospace fonts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">•</span> keyboard shortcuts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">•</span> minimal design
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">•</span> terminal colors
              </li>
            </ul>
          </div>
        </div>

        {/* Demo Section */}
        <div className="border-2 border-green-400/50 rounded-xl p-8 mb-12 bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm shadow-xl">
          <h3 className="text-2xl mb-6 text-green-400 font-bold">$ demo</h3>
          <div className="bg-gray-900/80 p-6 rounded-lg border border-green-400/30">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-green-400">user@commitly:~$</span> 
                <span className="text-white">git commit -m "working on a new project"</span>
              </div>
              <div className="text-green-300 flex items-center gap-2">
                <span className="text-green-400">✓</span> tweet posted successfully
              </div>
              <div className="mt-6 pl-4 border-l-2 border-green-400/50 bg-gray-800/40 p-4 rounded-r-lg">
                <div className="text-sm text-gray-400">@username • 2m</div>
                <div className="text-green-200 my-2">working on a new project</div>
                <div className="text-sm text-gray-400 flex gap-4">
                  <span className="hover:text-pink-400 cursor-pointer transition-colors">❤️ 5</span>
                  <span className="hover:text-blue-400 cursor-pointer transition-colors">🔄 2</span>
                  <span className="hover:text-green-400 cursor-pointer transition-colors">💬 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-green-300/80 mb-8 text-lg">ready to start tweeting like a developer?</p>
          <div className="flex justify-center gap-6">
            <Link 
              to="/signup" 
              className="px-10 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-gray-900 rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all duration-300 font-bold text-lg transform hover:scale-105 shadow-xl"
            >
              git clone --signup
            </Link>
            <Link 
              to="/login" 
              className="px-10 py-4 border-2 border-green-400/50 rounded-lg text-green-400 hover:bg-green-400/10 hover:border-green-400 transition-all duration-300 font-mono text-lg transform hover:scale-105"
            >
              git pull --login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-green-400/30 p-8 mt-16">
        <div className="max-w-5xl mx-auto text-center text-green-400/60">
          <p className="font-mono">commitly - where developers tweet in their native language</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
