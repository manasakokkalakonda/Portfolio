import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState({ name: 'Admin', email: 'admin@example.com' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      let emailVal = storedUser?.email || localStorage.getItem('userEmail') || 'admin@example.com';
      let derivedName = storedUser?.name || storedUser?.username;
      if (!derivedName && emailVal) {
        const namePart = emailVal.split('@')[0];
        derivedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }

      setUserInfo({
        name: derivedName || 'Admin',
        email: emailVal
      });
    } catch (e) {
      setUserInfo({ name: 'Admin', email: 'admin@example.com' });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Persistent Left Sidebar Navigation */}
      <aside className={`bg-slate-900 text-slate-300 w-64 flex-shrink-0 transition-all duration-300 flex flex-col ${sidebarOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <span className="text-white font-bold text-lg tracking-wider">CMS</span>
        </div>
        <nav className="p-4 space-y-1 text-sm font-medium flex-1 overflow-y-auto">
          <Link to="/dashboard" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'}`}>Dashboard</Link>
          <Link to="/about" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/about') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'}`}>About</Link>
          <Link to="/skills" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/skills') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'}`}>Skills</Link>
          <Link to="/projects" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/projects') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'}`}>Projects</Link>
          <Link to="/blogs" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/blogs') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'}`}>Blogs</Link>
          <Link to="/experience" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/experience') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'}`}>Experience</Link>
          <Link to="/services" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/services') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'}`}>Services</Link>
          <Link to="/testimonials" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/testimonials') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'}`}>Testimonials</Link>
          <Link to="/messages" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/messages') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'}`}>Messages</Link>
          <Link to="/media" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/media') ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'}`}>Media</Link>
        </nav>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-1 rounded-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <h1 className="text-lg font-bold text-gray-800">Portfolio CMS</h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500 font-medium">{new Date().toLocaleDateString()}</span>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">{userInfo.name}</p>
              <p className="text-[11px] text-gray-500">{userInfo.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg transition-colors shadow-sm cursor-pointer"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dynamic Page Outlet where /about, /skills, /dashboard load */}
        <main className="p-8 max-w-7xl w-full mx-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}