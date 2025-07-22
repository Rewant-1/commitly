import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className='min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-4'>
      <div className='max-w-2xl w-full'>
        {/* Terminal Window */}
        <div className='border border-green-400 rounded-lg p-6'>
          <div className='flex items-center space-x-2 mb-6 border-b border-green-400 pb-2'>
            <div className='w-3 h-3 rounded-full bg-red-500'></div>
            <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
            <div className='w-3 h-3 rounded-full bg-green-400'></div>
            <span className='text-green-400 ml-4'>error.log</span>
          </div>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <div className='text-green-400'>$ cd /path/you/requested</div>
              <div className='text-red-400'>bash: cd: /path/you/requested: No such file or directory</div>
            </div>

            <div className='text-center space-y-4 py-8'>
              <div className='text-6xl font-bold text-green-400'>404</div>
              <div className='text-xl text-green-300'>File not found</div>
              <div className='text-green-600'>
                The path you're looking for doesn't exist in this repository.
              </div>
            </div>

            <div className='space-y-3'>
              <div className='text-green-400'>$ ls -la available_paths/</div>
              <div className='text-green-600 ml-4'>
                <div>drwxr-xr-x  2 user user  4096 Jul 22 2025 .</div>
                <div>drwxr-xr-x  3 user user  4096 Jul 22 2025 ..</div>
                <div>-rw-r--r--  1 user user   256 Jul 22 2025 home</div>
                <div>-rw-r--r--  1 user user   128 Jul 22 2025 login</div>
                <div>-rw-r--r--  1 user user   192 Jul 22 2025 signup</div>
              </div>
            </div>

            <div className='flex space-x-4 pt-6 border-t border-green-400'>
              <Link 
                to='/' 
                className='border border-green-400 bg-black text-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors'
              >
                $ cd ~/home
              </Link>
              
              <button 
                onClick={() => window.history.back()}
                className='border border-green-600 bg-black text-green-600 px-4 py-2 hover:bg-green-600 hover:text-black transition-colors'
              >
                $ cd ..
              </button>
            </div>

            <div className='text-green-600 text-sm pt-4'>
              tip: use 'git status' to see where you are
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
