import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Backend server error or endpoint not found. Make sure your server is running on port 5000.");
      }

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', formData.email);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.message || 'Connection refused! Make sure your backend server is running.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] flex items-center justify-center p-4">
      {/* Background Decorative Glow */}
      <div className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20"></div>

      <div className="relative bg-slate-900/80 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md border border-emerald-500/20 text-slate-100">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-400 via-teal-500 to-green-600 text-slate-950 font-black px-6 py-2.5 rounded-2xl text-lg tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] mb-3">Portfolio CMS</div>
          <p className="text-slate-400 text-sm font-medium tracking-wide">Sign in to your admin account</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-6 text-xs text-center font-medium leading-relaxed tracking-wide shadow-inner">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-emerald-400/80 mb-2">Email Address</label>
            <input 
              type="email" name="email"
              placeholder="admin@example.com" 
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"required/>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-emerald-400/80 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300" 
              required/>
          </div>

          <button 
            type="submit" 
            className="w-full mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-slate-950 font-extrabold py-4 rounded-2xl tracking-wide hover:brightness-110 active:scale-[0.98] transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.3)] text-sm disabled:opacity-50 cursor-pointer">Sign In</button>
        </form>

      </div>
    </div>
  );
}