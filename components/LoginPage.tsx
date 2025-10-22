import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (success: boolean) => void;
  users: User[];
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminUser = users.find(
      (u) => u.username === username && u.password === password && u.role === 'admin'
    );

    if (adminUser) {
      onLogin(true);
    } else {
      setError('Invalid credentials or not an admin user');
      onLogin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-800 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 shadow-lg shadow-slate-200/80">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">Admin Login</h1>
            <p className="text-slate-500 mt-2">Access the Question Management Panel</p>
        </div>
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
              placeholder="admin"
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
              placeholder="dqadm"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-500/30"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;