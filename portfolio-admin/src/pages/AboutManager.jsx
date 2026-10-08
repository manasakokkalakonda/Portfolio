import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AboutManager() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aboutEntries, setAboutEntries] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', year: '' });
  const [userInfo, setUserInfo] = useState({ name: 'Admin', email: 'admin@example.com' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      const rawEmail = localStorage.getItem('userEmail') || 'admin@example.com';
      const fallbackName = rawEmail.split('@')[0];
      setUserInfo({
        name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
        email: rawEmail
      });
    }

    fetchAboutEntries(token);
  }, [navigate]);

  const fetchAboutEntries = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/about', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Backend endpoint returned non-JSON response.");
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setAboutEntries(data);
      } else if (data.about || data.entries) {
        setAboutEntries(data.about || data.entries);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAbout = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/about', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error: Endpoint not found or backend offline.");
      }

      const data = await res.json();
      if (res.ok) {
        setAboutEntries([...aboutEntries, data]);
        setMessage('About history added successfully!');
        setFormData({ title: '', description: '', year: '' });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to add about history.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const res = await fetch(`http://localhost:5000/api/about/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setAboutEntries(aboutEntries.filter(item => item._id !== id && item.id !== id));
        setMessage('About history deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError('Failed to delete about history.');
      }
    } catch (err) {
      setError('Error deleting about history.');
    }
  };

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
          <Link to="/dashboard" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Dashboard</Link>
          <Link to="/aboutmanager" className="flex items-center px-4 py-3 rounded-lg bg-slate-800 text-white">About</Link>
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
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-1 rounded-md cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <h1 className="text-lg font-bold text-gray-800">Portfolio CMS</h1>
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
              title="Logout">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        <main className="p-8 max-w-5xl w-full mx-auto flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage About</h2>

          {message && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-sm font-medium text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAddAbout} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6 mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Add About History</h3>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Title / Milestone</label>
              <input 
                type="text" 
                name="title"
                value={formData.title} 
                onChange={handleChange}
                required
                placeholder="e.g. Graduated University" 
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Year / Period</label>
              <input 
                type="text" 
                name="year"
                value={formData.year} 
                onChange={handleChange}
                placeholder="e.g. 2022 - 2026" 
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Description</label>
              <textarea 
                name="description"
                value={formData.description} 
                onChange={handleChange}
                rows="3"
                placeholder="Brief summary of this milestone or history block..." 
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500" 
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm shadow-md cursor-pointer"
              >
                Add History Entry
              </button>
            </div>
          </form>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Existing About History</h3>
            {aboutEntries.length === 0 ? (
              <p className="text-sm text-gray-500">No about history found.</p>
            ) : (
              <div className="space-y-4">
                {aboutEntries.map((item) => (
                  <div key={item._id || item.id} className="border border-gray-100 p-4 rounded-lg flex items-center justify-between bg-gray-50/50">
                    <div className="pr-4">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        {item.year && <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">{item.year}</span>}
                      </div>
                      {item.description && <p className="text-xs text-gray-600 mt-1">{item.description}</p>}
                    </div>
                    <button 
                      onClick={() => handleDelete(item._id || item.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex-shrink-0">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}