import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const LandingPage = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const terminalLines = [
    "$ welcome to commitly",
    "$ a terminal-inspired social platform",
    "$ type your thoughts like git commits",
    "$ -git commit -m \"your message here\"",
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
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header */}
      <header className="border-b border-green-400 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-green-400">$</span>
            <span className="text-green-400">commitly</span>
          </div>
          <nav className="flex space-x-6">
            <Link 
              to="/login" 
              className="terminal-button px-4 py-2 rounded hover:bg-green-400 hover:text-black transition-colors"
            >
              login
            </Link>
            <Link 
              to="/signup" 
              className="terminal-button px-4 py-2 rounded hover:bg-green-400 hover:text-black transition-colors"
            >
              signup
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-8">
        {/* Terminal Window */}
        <div className="border border-green-400 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4 border-b border-green-400 pb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-green-400 ml-4">terminal</span>
          </div>
          
          <div className="space-y-2">
            {terminalLines.map((line, index) => (
              <div 
                key={index} 
                className={`${index <= currentLine ? 'opacity-100' : 'opacity-30'} transition-opacity duration-500`}
              >
                {line}
                {index === currentLine && showCursor && <span className="text-green-400">_</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="border border-green-400 rounded p-6">
            <h3 className="text-xl mb-4">$ git commit tweets</h3>
            <p className="text-green-300 mb-4">
              Post updates using familiar git syntax:
            </p>
            <div className="bg-gray-900 p-3 rounded font-mono text-sm">
              <span className="text-red-400">-git</span>{" "}
              <span className="text-blue-400">commit</span>{" "}
              <span className="text-yellow-400">-m</span>{" "}
              <span className="text-green-300">"just shipped a new feature"</span>
            </div>
          </div>

          <div className="border border-green-400 rounded p-6">
            <h3 className="text-xl mb-4">$ terminal interface</h3>
            <p className="text-green-300 mb-4">
              Clean, distraction-free environment for developers who prefer the command line aesthetic.
            </p>
            <ul className="space-y-1 text-sm">
              <li>• monospace fonts</li>
              <li>• keyboard shortcuts</li>
              <li>• minimal design</li>
              <li>• terminal colors</li>
            </ul>
          </div>
        </div>

        {/* Demo Section */}
        <div className="border border-green-400 rounded p-6 mb-8">
          <h3 className="text-xl mb-4">$ demo</h3>
          <div className="bg-gray-900 p-4 rounded">
            <div className="space-y-2">
              <div><span className="text-green-400">user@commitly:~$</span> -git commit -m "working on a new project"</div>
              <div className="text-green-300">✓ tweet posted successfully</div>
              <div className="mt-4 pl-4 border-l-2 border-green-400">
                <div className="text-sm text-gray-400">@username • 2m</div>
                <div>working on a new project</div>
                <div className="text-sm text-gray-400 mt-1">❤️ 5  🔄 2  💬 1</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-green-300 mb-6">ready to start tweeting like a developer?</p>
          <div className="space-x-4">
            <Link 
              to="/signup" 
              className="terminal-button px-8 py-3 rounded hover:bg-green-400 hover:text-black transition-colors"
            >
              git clone --signup
            </Link>
            <Link 
              to="/login" 
              className="terminal-button px-8 py-3 rounded hover:bg-green-400 hover:text-black transition-colors"
            >
              git pull --login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-green-400 p-4 mt-12">
        <div className="max-w-4xl mx-auto text-center text-green-600 text-sm">
          <p>commitly - where developers tweet in their native language</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
