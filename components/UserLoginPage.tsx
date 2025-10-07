import React, { useState } from 'react';
import { User } from '../types';

interface UserLoginPageProps {
  users: User[];
  onLogin: (user: User | null) => void;
}

const UserLoginPage: React.FC<UserLoginPageProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid username or password');
      onLogin(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-800 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/80 grid lg:grid-cols-2 overflow-hidden">
        {/* Left Panel: Security Message */}
        <div className="p-8 md:p-12 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
          <div className="bg-indigo-100 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Security First</h1>
          <p className="mt-2 text-slate-500">
            Your commitment to security is crucial. This assessment ensures we maintain the highest standards of data protection.
          </p>
        </div>

        {/* Right Panel: Login Form */}
        <div className="p-8 md:p-12 bg-white/50 border-t lg:border-t-0 lg:border-l border-slate-200/80">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">User Login</h2>
          <p className="text-slate-500 mb-6">Access your training dashboard</p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-slate-600 mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="demo"
              />
            </div>
            <div className="mb-6">
              <label className="block text-slate-600 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/50 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="demo"
              />
            </div>
            {error && <p className="text-rose-500 text-sm mb-4 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/30"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
