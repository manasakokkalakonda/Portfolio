'use client';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeft, Mail, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (err) {
      console.error('Failed to send message', err);
      setStatus({ loading: false, success: false, error: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 flex items-center gap-3">
            <Mail className="text-blue-500 w-10 h-10" /> Get in Touch
          </h1>
          <p className="text-slate-400">
            Have a project in mind, a question, or just want to connect? Drop me a message below.
          </p>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          {status.success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
              <p className="text-slate-400 mb-6">Thank you for reaching out. I will get back to you soon.</p>
              <button
                onClick={() => setStatus({ loading: false, success: false, error: '' })}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl text-sm transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status.error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                  {status.error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Write your message here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {status.loading ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}