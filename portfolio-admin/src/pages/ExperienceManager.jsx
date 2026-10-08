import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ExperienceManager() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState({ role: '', company: '', duration: '', description: '' });
  const [userInfo, setUserInfo] = useState({ name: 'Admin', email: 'admin@example.com' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

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
      setUserInfo({ name: rawEmail.split('@')[0], email: rawEmail });
    }

    fetch('http://localhost:5000/api/experience', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async res => {
        if (res.status === 401) { localStorage.removeItem('token'); navigate('/login'); return; }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Backend endpoint /api/experience returned 404 or non-JSON response.");
        }
        return res.json();
      })
      .then(data => { if (Array.isArray(data)) setExperiences(data); })
      .catch(err => setError(err.message));
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const res = await fetch('http://localhost:5000/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) throw new Error("Server error or endpoint not found.");
      const data = await res.json();
      if (res.ok) {
        setExperiences([...experiences, data]);
        setFormData({ role: '', company: '', duration: '', description: '' });
        setMessage('Experience added successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to add experience.');
      }
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    try {
      const res = await fetch(`http://localhost:5000/api/experience/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setExperiences(experiences.filter(ex => ex._id !== id && ex.id !== id));
      else setError('Failed to delete experience.');
    } catch (err) { setError('Connection error.'); }
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
          <Link to="/experience" className="flex items-center px-4 py-3 rounded-lg bg-slate-800 text-white">Experience</Link>
          <Link to="/services" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Services</Link>
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
            <span className="text-xs text-gray-500 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
            <div className="text-right"><p className="text-xs font-bold text-gray-900">{userInfo.name}</p><p className="text-[11px] text-gray-500">{userInfo.email}</p></div>
            <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg transition-colors shadow-sm cursor-pointer"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>
          </div>
        </header>

        <main className="p-8 max-w-5xl w-full mx-auto flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Experience</h2>
          {message && <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-sm font-medium text-center">{message}</div>}
          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm font-medium text-center">{error}</div>}

          <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6 mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Add Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Role</label><input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Full Stack Developer" required className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"/></div>
              <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Company</label><input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Tech Corp" required className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"/></div>
            </div>
            <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Duration</label><input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="2023 - Present" required className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"/></div>
            <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Description</label><textarea name="description" rows="3" value={formData.description} onChange={handleChange} placeholder="Developed full-stack web applications..." className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500"/></div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm shadow-md cursor-pointer">Add Experience</button>
          </form>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Work History</h3>
            {experiences.length === 0 ? <p className="text-sm text-gray-500">No experience records found.</p> : (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp._id || exp.id} className="border border-gray-100 p-4 rounded-lg flex items-center justify-between bg-gray-50/50">
                    <div><h4 className="font-bold text-gray-900">{exp.role} at {exp.company}</h4><p className="text-xs text-gray-500">{exp.duration}</p></div>
                    <button onClick={() => handleDelete(exp._id || exp.id)} className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer">Delete</button>
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