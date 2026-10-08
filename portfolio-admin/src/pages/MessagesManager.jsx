import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function MessagesManager() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: 'Admin', email: 'admin@example.com' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setUserInfo({ name: storedUser?.name || 'Admin', email: storedUser?.email || localStorage.getItem('userEmail') || 'admin@example.com' });
    } catch(e) {}

    fetch('http://localhost:5000/api/messages', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setMessages(data); })
      .catch(err => console.error(err));
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/messages/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setMessages(messages.filter(m => m._id !== id && m.id !== id));
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
          <Link to="/testimonials" className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors">Testimonials</Link>
          <Link to="/messages" className="flex items-center px-4 py-3 rounded-lg bg-slate-800 text-white">Messages</Link>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Messages</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            {messages.length === 0 ? <p className="text-sm text-gray-500">No contact messages received.</p> : (
              messages.map(m => (
                <div key={m._id || m.id} className="border-b py-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900">{m.name} &lt;{m.email}&gt;</h4>
                    <p className="text-xs text-gray-600 mt-1">{m.message}</p>
                  </div>
                  <button onClick={() => handleDelete(m._id || m.id)} className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-lg cursor-pointer">Delete</button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}