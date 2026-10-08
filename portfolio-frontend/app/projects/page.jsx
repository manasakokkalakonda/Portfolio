'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Github, Linkedin, Mail, ExternalLink, Code2, Send, Sparkles } from 'lucide-react';

export default function PortfolioHome() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(res => setProjects(res.data))
      .catch(() => setProjects([
        { _id: '1', title: 'Cloud DevOps Dashboard', description: 'Real-time server monitoring and metrics viewer.', techStack: ['React', 'Node.js', 'Tailwind'], liveUrl: '#' },
        { _id: '2', title: 'AI Prompt Generator', description: 'Full-stack SaaS app for generating optimized LLM prompts.', techStack: ['Next.js', 'Express', 'MongoDB'], liveUrl: '#' }
      ]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', form);
      setStatus('Message sent successfully!');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('Failed to send message. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-900">
        <div className="flex items-center gap-2 font-bold text-xl tracking-wider text-blue-400">
          <Code2 className="w-6 h-6" /> Portfolio.dev
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a href="#projects" className="text-slate-400 hover:text-white transition-colors">Projects</a>
          <a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a>
          <a href="http://localhost:5174/login" target="_blank" className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-medium">
            Admin Panel
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-6 py-24 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <div className="space-y-6 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Full-Stack Software Engineer
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Building robust apps with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Node & React</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Hi, I'm a passionate developer specializing in scalable backend architectures and gorgeous, high-performance user interfaces.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <a href="#projects" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20">
              View My Work
            </a>
            <a href="#contact" className="px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 font-semibold rounded-xl transition-all">
              Contact Me
            </a>
          </div>
        </div>
      </header>

      {/* Projects Section */}
      <section id="projects" className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-900">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div key={p._id} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-all group">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">{p.title}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {p.techStack?.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg">
                    {t}
                  </span>
                ))}
              </div>
              <a href={p.liveUrl || '#'} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300">
                Live Preview <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-3xl mx-auto px-6 py-16 border-t border-slate-900">
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-2 text-center">Get In Touch</h2>
          <p className="text-slate-400 text-sm text-center mb-8">Have a project in mind? Send me a direct message.</p>

          {status && (
            <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-center text-sm">
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <textarea
              rows={4}
              placeholder="Your Message"
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Full-Stack Developer Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
}