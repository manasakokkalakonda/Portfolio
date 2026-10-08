import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function TestimonialManager() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({ name: '', feedback: '', designation: '' });
  const [userInfo, setUserInfo] = useState({ name: 'Admin', email: 'admin@example.com' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUserInfo({ name: storedUser?.name || 'Admin', email: storedUser?.email || localStorage.getItem('userEmail') || 'admin@example.com' });
    } catch(e) { setUserInfo({ name: 'Admin', email: 'admin@example.com' }); }

    fetch('http://localhost:5000/api/testimonials', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) throw new Error("Endpoint not found / backend offline.");
        return res.json();
      })
      .then(data => { if (Array.isArray(data)) setTestimonials(data); })
      .catch(err => setError(err.message));
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const data = await res.json();
      setTestimonials([...testimonials, data]);
      setFormData({ name: '', feedback: '', designation: '' });
      setMessage('Testimonial added!');
      setTimeout(() => setMessage(''), 3000);
    } else setError('Failed to add testimonial.');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/testimonials/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setTestimonials(testimonials.filter(t => t._id !== id && t.id !== id));
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
          <Link to="/services" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Services</Link>
          <Link to="/testimonials" className="flex items-center px-4 py-3 rounded-lg bg-slate-800 text-white">Testimonials</Link>
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
            <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
            <div className="text-right"><p className="text-xs font-bold text-gray-900">{userInfo.name}</p></div>
            <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="bg-orange-600 text-white p-2 rounded-lg cursor-pointer">Logout</button>
          </div>
        </header>

        <main className="p-8 max-w-5xl w-full mx-auto flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Testimonials</h2>
          {message && <div className="mb-4 bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm text-center">{message}</div>}
          {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">{error}</div>}

          <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6 mb-8">
            <h3 className="text-lg font-bold text-slate-800">Add Testimonial</h3>
            <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Client Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm"/></div>
            <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Designation</label><input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm"/></div>
            <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Feedback</label><textarea name="feedback" rows="3" value={formData.feedback} onChange={handleChange} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm"/></div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer">Add Testimonial</button>
          </form>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Client Testimonials</h3>
            {testimonials.map(t => (
              <div key={t._id || t.id} className="border-b py-3 flex justify-between items-center">
                <div><h4 className="font-bold">{t.name}</h4><p className="text-xs text-gray-600">{t.feedback}</p></div>
                <button onClick={() => handleDelete(t._id || t.id)} className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-lg cursor-pointer">Delete</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}