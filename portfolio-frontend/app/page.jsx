'use client';
import { useState, useEffect } from 'react';

export default function PortfolioPage() {
  const [about, setAbout] = useState({ title: "Loading...", bio: "" });
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  // Fetch dynamic content from the custom CMS backend REST APIs[cite: 22]
  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        const aboutRes = await fetch('http://localhost:5000/about');
        if (aboutRes.ok) setAbout(await aboutRes.json());

        const projRes = await fetch('http://localhost:5000/projects');
        if (projRes.ok) {
          const json = await projRes.json();
          setProjects(json.data || []);
        }

        const skillRes = await fetch('http://localhost:5000/skills');
        if (skillRes.ok) {
          const json = await skillRes.json();
          setSkills(json.data || []);
        }

        const expRes = await fetch('http://localhost:5000/experience');
        if (expRes.ok) {
          const json = await expRes.json();
          setExperience(json.data || []);
        }

        const blogRes = await fetch('http://localhost:5000/blogs');
        if (blogRes.ok) {
          const json = await blogRes.json();
          setBlogs(json.data || []);
        }
      } catch (err) {
        console.error("Error fetching content from backend API:", err);
      }
    }
    fetchPortfolioData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setStatus('Message sent successfully and saved to database!');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (err) {
      setStatus('Error connecting to backend server.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative">
      {/* Navigation Bar matching Admin Dashboard Header Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Portfolio CMS
          </span>
          <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-indigo-400 transition">About</a>
            <a href="#skills" className="hover:text-indigo-400 transition">Skills</a>
            <a href="#projects" className="hover:text-indigo-400 transition">Projects</a>
            <a href="#experience" className="hover:text-indigo-400 transition">Experience</a>
            <a href="#blogs" className="hover:text-indigo-400 transition">Blog</a>
            <a href="#contact" className="hover:text-indigo-400 transition">Contact</a>
          </div>
          <a 
            href="http://localhost:5174/login" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold transition shadow-lg shadow-indigo-600/20"
          >
            Admin Login
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="pt-36 pb-20 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>CMS Connected & Active</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Building digital apps with <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">precision</span>.
          </h1>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            {about.bio || "Full-stack portfolio featuring automated database syncing and an independent admin panel dashboard."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
            <a href="#projects" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/20 text-sm">
              View Projects
            </a>
            <a href="#contact" className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold px-6 py-3 rounded-xl transition border border-slate-800 text-sm">
              Get in Touch
            </a>
          </div>
        </div>

        {/* Admin Card Style Visual Box */}
        <div className="flex-1 w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl shadow-inner">
            ⚡
          </div>
          <h3 className="text-xl font-bold text-white">System Architecture</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Decoupled design[cite: 22]: React frontend connects dynamically to Node.js/Express REST APIs and your custom admin panel[cite: 23].
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-900">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Skills & Tech Stack</h2>
          <p className="text-slate-400 text-sm mt-1">Managed dynamically through your admin panel.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <div key={skill.id || skill._id || `skill-${index}`} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center font-medium text-slate-300 hover:border-indigo-500/50 transition duration-300 shadow-lg">
              {skill.name || skill.title}
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-900">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Featured Projects</h2>
          <p className="text-slate-400 text-sm mt-1">Fetched via REST API endpoints from your database.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div key={project.id || project._id || `project-${index}`} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-indigo-500/40 transition duration-300 shadow-xl">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-white">{project.title}</h3>
                <span className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 font-medium">Project</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-900">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Experience Timeline</h2>
          <p className="text-slate-400 text-sm mt-1">Professional background records stored in the CMS.</p>
        </div>
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div key={exp.id || exp._id || `exp-${index}`} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold text-white">{exp.role || exp.title}</h3>
              <p className="text-indigo-400 text-sm font-medium mt-1">{exp.company} • {exp.period}</p>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blogs" className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-900">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Latest Blog Articles</h2>
          <p className="text-slate-400 text-sm mt-1">Published straight from your admin dashboard.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <div key={blog.id || blog._id || `blog-${index}`} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between shadow-lg">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{blog.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{blog.description || blog.snippet}</p>
              </div>
              <span className="text-xs text-indigo-400 font-semibold mt-4">Read Full Article →</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 max-w-4xl mx-auto border-t border-slate-900">
        <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Get in Touch</h2>
          <p className="text-slate-400 text-center text-sm mb-8">Messages submitted here are saved directly to your database[cite: 24].</p>
          
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                <input 
                  type="text" 
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Email</label>
                <input 
                  type="email" 
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
              <textarea 
                rows="4" 
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition text-sm shadow-lg shadow-indigo-600/20">
              Send Message
            </button>
            {status && <p className="text-center text-sm font-medium text-indigo-400 mt-4">{status}</p>}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 Portfolio CMS Project. Fully integrated with backend API and admin dashboard[cite: 22, 23].</p>
      </footer>
    </div>
  );
}