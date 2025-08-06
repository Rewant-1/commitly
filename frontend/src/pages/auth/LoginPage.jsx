import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      window.location.href = "/";
    },
    onError: (error) => {
      // Log error or handle globally if needed
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-green-400 font-mono flex items-center justify-center">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
        {/* Terminal Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-xl border-2 border-green-400/60 p-4 shadow-xl w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
              </div>
              <span className="text-green-400 text-sm font-semibold">commitly@terminal</span>
            </div>
            <span className="text-green-400/80 text-sm">~/login</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border-x-2 border-b-2 border-green-400/60 rounded-b-xl p-8 shadow-2xl w-full">
          {/* Welcome Message */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center space-x-2 text-green-400">
              <span className="text-green-500">$</span>
              <span className="font-semibold">Welcome back, developer</span>
            </div>
            <div className="text-green-300/70 text-sm pl-6">
              Access your commit history and collaborate
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-green-400">
                <span className="text-green-500">$</span>
                <label htmlFor="username" className="text-sm font-medium">git config user.name</label>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                className="w-full bg-gray-800/80 border-2 border-green-400/50 rounded-lg px-4 py-3 text-green-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 font-mono placeholder-green-400/50 transition-all duration-300 backdrop-blur-sm shadow-inner"
                placeholder="enter your username"
                onChange={handleInputChange}
                value={formData.username}
                autoFocus
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-green-400">
                <span className="text-green-500">$</span>
                <label htmlFor="password" className="text-sm font-medium">git config user.password</label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full bg-gray-800/80 border-2 border-green-400/50 rounded-lg px-4 py-3 text-green-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 font-mono placeholder-green-400/50 transition-all duration-300 backdrop-blur-sm shadow-inner"
                placeholder="enter your password"
                onChange={handleInputChange}
                value={formData.password}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-gray-900 font-bold py-3 rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-green-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                  git fetch --authenticating...
                </span>
              ) : (
                "git push --login"
              )}
            </button>

            {isError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center space-x-2 text-red-400">
                  <span className="text-red-500">$</span>
                  <span className="text-sm font-medium">Error:</span>
                </div>
                <p className="text-red-300 text-sm pl-6 mt-1">{error.message}</p>
              </div>
            )}
          </form>

          {/* Signup Link */}
          <div className="mt-8 pt-6 border-t border-green-400/30">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-green-300/80">
                <span className="text-green-500">$</span>
                <span className="text-sm">New to the repository?</span>
              </div>
              <Link
                to="/signup"
                className="inline-block px-8 py-3 border-2 border-green-400/50 rounded-lg text-green-400 hover:bg-green-400/10 hover:border-green-400 transition-all duration-300 font-mono text-sm transform hover:scale-[1.02] shadow-md hover:shadow-green-400/20"
              >
                git clone --create-account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;