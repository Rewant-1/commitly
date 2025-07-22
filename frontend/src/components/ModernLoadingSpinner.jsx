import { FaTerminal } from "react-icons/fa";

const ModernLoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono">
      <div className="text-center space-y-8 border border-green-400 p-8 bg-gray-900/20">
        {/* Terminal Header */}
        <div className='flex items-center justify-center space-x-2 mb-6'>
          <div className='w-3 h-3 rounded-full bg-red-500'></div>
          <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
          <div className='w-3 h-3 rounded-full bg-green-400'></div>
          <span className='text-green-400 ml-4'>commitly.sh</span>
        </div>

        {/* Animated Logo */}
        <div className="relative">
          <div className={`${sizeClasses[size]} border-2 border-green-400 rounded-lg flex items-center justify-center mx-auto animate-pulse bg-gray-900/40`}>
            <FaTerminal className="text-green-400 text-2xl" />
          </div>
          
          {/* Rotating Ring */}
          <div className={`absolute inset-0 ${sizeClasses[size]} mx-auto rounded-lg border-2 border-transparent border-t-green-400 border-r-green-600 animate-spin`}></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-green-400">commitly</h2>
          <p className="text-green-600 animate-pulse">$ {message}</p>
        </div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ModernLoadingSpinner;
