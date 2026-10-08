import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    resume: '',
    yearsOfExperience: ''
  });
  const [userInfo, setUserInfo] = useState({ name: 'Admin', email: 'admin@example.com' });
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    blogs: 0,
    messages: 0,
    services: 0,
    testimonials: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch counts or summary data from your API endpoints
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [skillsRes, projectsRes, blogsRes, messagesRes] = await Promise.all([
          fetch('http://localhost:5000/api/skills', { headers }).catch(() => null),
          fetch('http://localhost:5000/api/projects', { headers }).catch(() => null),
          fetch('http://localhost:5000/api/blogs', { headers }).catch(() => null),
          fetch('http://localhost:5000/api/experience', { headers }).catch(() => null),
          fetch('http://localhost:5000/api/service', { headers }).catch(() => null),
          fetch('http://localhost:5000/api/testimonials', { headers }).catch(() => null),
          fetch('http://localhost:5000/api/messages', { headers }).catch(() => null),
          fetch('http://localhost:5000/api/media', { headers }).catch(() => null),
        ]);

        
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

    fetch('http://localhost:5000/api/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            image: data.image || '',
            resume: data.resume || '',
            yearsOfExperience: data.yearsOfExperience || ''
          });
        }
      })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/dashboard', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage('About details updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to update about details.');
      }
    } catch (err) {
      setError('Connection refused! Make sure your backend server is running.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

        const getLength = async (res) => {
          if (!res || !res.ok) return 0;
          try {
            const data = await res.json();
            return Array.isArray(data) ? data.length : (data.count || data.total || 0);
          } catch {
            return 0;
          }
        };

        setStats({
          skills: await getLength(skillsRes),
          projects: await getLength(projectsRes),
          blogs: await getLength(blogsRes),
          messages: await getLength(messagesRes)
        });
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here is a summary of your portfolio content.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm font-medium text-center">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Skills</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{loading ? '...' : stats.skills}</p>
          <div className="mt-4">
            <Link to="/skills" className="text-xs font-semibold text-blue-600 hover:text-blue-800">Manage Skills &rarr;</Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Projects</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{loading ? '...' : stats.projects}</p>
          <div className="mt-4">
            <Link to="/projects" className="text-xs font-semibold text-blue-600 hover:text-blue-800">Manage Projects &rarr;</Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Blogs</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{loading ? '...' : stats.blogs}</p>
          <div className="mt-4">
            <Link to="/blogs" className="text-xs font-semibold text-blue-600 hover:text-blue-800">Manage Blogs &rarr;</Link>
          </div>
        </div>

         <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Messages</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{loading ? '...' : stats.messages}</p>
          <div className="mt-4">
            <Link to="/experience" className="text-xs font-semibold text-blue-600 hover:text-blue-800">Manage Experience &rarr;</Link>
          </div>
        </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Messages</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{loading ? '...' : stats.messages}</p>
          <div className="mt-4">
            <Link to="/service" className="text-xs font-semibold text-blue-600 hover:text-blue-800">Manage Services &rarr;</Link>
          </div>
        </div>

         <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Messages</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{loading ? '...' : stats.messages}</p>
          <div className="mt-4">
            <Link to="/testimonials" className="text-xs font-semibold text-blue-600 hover:text-blue-800">Manage Testimonials &rarr;</Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Messages</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{loading ? '...' : stats.messages}</p>
          <div className="mt-4">
            <Link to="/messages" className="text-xs font-semibold text-blue-600 hover:text-blue-800">View Messages &rarr;</Link>
          </div>
        </div>

         <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Messages</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{loading ? '...' : stats.messages}</p>
          <div className="mt-4">
            <Link to="/media" className="text-xs font-semibold text-blue-600 hover:text-blue-800">Manage media &rarr;</Link>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4">Quick Navigation</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link to="/about" className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-center block">
            <span className="text-sm font-semibold text-gray-800">Edit About</span>
          </Link>
          <Link to="/skills" className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-center block">
            <span className="text-sm font-semibold text-gray-800">Manage Skills</span>
          </Link>
          <Link to="/projects" className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-center block">
            <span className="text-sm font-semibold text-gray-800">Manage Projects</span>
          </Link>
          <Link to="/experience" className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-center block">
            <span className="text-sm font-semibold text-gray-800">Experience</span>
          </Link>
        </div>
      </div>
    </div>
  );
}