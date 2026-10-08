import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ServicesManager() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', icon: '' });
  const [userInfo, setUserInfo] = useState({ name: 'Admin', email: 'admin@example.com' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUserInfo({ name: storedUser?.name || 'Admin', email: storedUser?.email || localStorage.getItem('userEmail') || 'admin@example.com' });
    } catch(e) {}

    fetch('http://localhost:5000/api/services', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setServices(data); })
      .catch(err => console.error(err));
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const data = await res.json();
      setServices([...services, data]);
      setFormData({ title: '', description: '', icon: '' });
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/services/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setServices(services.filter(s => s._id !== id && s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`bg-slate-900 text-slate-300 w-64 flex-shrink-0 transition-all duration-300 flex flex-col ${sidebarOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800"><span className="text-white font-bold text-lg tracking-wider">CMS</span></div>
        <nav className="p-4 space-y-1 text-sm font-medium flex-1 overflow-y-auto">
          <Link to="/dashboard" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Dashboard</Link>
          <Link to="/about" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">About</Link>
          <Link to="/skills" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Skills</Link>
          <Link to="/projects" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Projects</Link>
          <Link to="/blogs" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Blogs</Link>
          <Link to="/experience" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Experience</Link>
          <Link to="/services" className="flex items-center px-4 py-3 rounded-lg bg-slate-800 text-white">Services</Link>
          <Link to="/testimonials" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Testimonials</Link>
          <Link to="/messages" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Messages</Link>
          <Link to="/media" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Media</Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="upsidebar h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none p-1 rounded-md cursor-pointer"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
            <h1 className="text-lg font-bold text-gray-800">Portfolio CMS</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
            <div className="text-right"><p className="text-xs font-bold text-gray-900">{userInfo.name}</p></div>
            <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="bg-orange-600 text-white p-2 rounded-lg cursor-pointer">Logout</button>
          </div>
        </header>

        <main className="p-8 max-w-5xl w-full mx-auto flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Services</h2>
          <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6 mb-8">
            <h3 className="text-lg font-bold text-slate-800">Add Service</h3>
            <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm"/></div>
            <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Description</label><textarea name="description" rows="3" value={formData.description} onChange={handleChange} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm"/></div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer">Add Service</button>
          </form>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Provided Services</h3>
            {services.map(s => (
              <div key={s._id || s.id} className="border-b py-3 flex justify-between items-center">
                <div><h4 className="font-bold">{s.title}</h4><p className="text-xs text-gray-600">{s.description}</p></div>
                <button onClick={() => handleDelete(s._id || s.id)} className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-lg cursor-pointer">Delete</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}