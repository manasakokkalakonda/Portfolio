import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    blogsCount: 0,
    projectsCount: 0,
    experienceCount: 0,
    testimonialsCount: 0,
    servicesCount: 0,
    messagesCount: 0
  });
  const [userInfo, setUserInfo] = useState({ name: 'Admin', email: 'admin@example.com' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const hasFetched = useRef(false);

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
      setUserInfo({ name: derivedName || 'Admin', email: emailVal });
    } catch (e) {
      const rawEmail = localStorage.getItem('userEmail') || 'admin@example.com';
      const fallbackName = rawEmail.split('@')[0];
      setUserInfo({ name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1), email: rawEmail });
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDashboardStats = async () => {
      const endpoints = ['blogs', 'projects', 'experience', 'testimonials', 'services', 'messages'];
      const counts = { blogsCount: 0, projectsCount: 0, experienceCount: 0, testimonialsCount: 0, servicesCount: 0, messagesCount: 0 };

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }

          const contentType = res.headers.get("content-type");
          if (res.ok && contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (Array.isArray(data)) {
              counts[`${endpoint}Count`] = data.length;
            }
          }
        } catch (err) {}
      }

      setStats(counts);
    };

    fetchDashboardStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`bg-slate-900 text-slate-300 w-64 flex-shrink-0 transition-all duration-300 flex flex-col ${sidebarOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <span className="text-white font-bold text-lg tracking-wider">CMS</span>
        </div>
        <nav className="p-4 space-y-1 text-sm font-medium flex-1 overflow-y-auto">
          <Link to="/dashboard" className="flex items-center px-4 py-3 rounded-lg bg-slate-800 text-white">Dashboard</Link>
          <Link to="/about" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">About</Link>
          <Link to="/skills" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Skills</Link>
          <Link to="/projects" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Projects</Link>
          <Link to="/blogs" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Blogs</Link>
          <Link to="/experience" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Experience</Link>
          <Link to="/services" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Services</Link>
          <Link to="/testimonials" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Testimonials</Link>
          <Link to="/messages" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Messages</Link>
          <Link to="/media" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Media</Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="upsidebar h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-1 rounded-md cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <h1 className="text-lg font-bold text-gray-800">Portfolio CMS Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
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

        <main className="p-8 max-w-6xl w-full mx-auto flex-1">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {userInfo.name}!</h2>
            <p className="text-sm text-gray-600 mt-1">Here is an overview of your portfolio content and statistics.</p>
          </div>

          {error && (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/blogs" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Blogs</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.blogsCount}</p>
            </Link>

            <Link to="/projects" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Projects</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.projectsCount}</p>
            </Link>

            <Link to="/experience" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Experience</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.experienceCount}</p>
            </Link>

            <Link to="/testimonials" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Testimonials</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.testimonialsCount}</p>
            </Link>

            <Link to="/services" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Services</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.servicesCount}</p>
            </Link>

            <Link to="/messages" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Messages</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.messagesCount}</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}