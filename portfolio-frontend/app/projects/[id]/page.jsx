'use client';
import { useEffect, useState, use } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, Layers } from 'lucide-react';

export default function ProjectDetailsPage({ params }) {
  // Unwrap Next.js dynamic params using React.use()
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProjectDetail() {
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error('Failed to fetch project details', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectDetail();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading project details...</div>;
  }

  if (error || !project) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-16 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Link href="/projects" className="text-blue-400 hover:underline">Back to Projects</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{project.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies?.map((tech, idx) => (
              <span key={idx} className="text-xs bg-slate-800 text-blue-400 px-3 py-1 rounded-md font-medium">
                {tech}
              </span>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-6 mb-8">
            <h2 className="text-sm uppercase tracking-wider text-slate-400 mb-2 font-semibold">Project Overview</h2>
            <p className="text-slate-300 leading-relaxed text-lg">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 font-semibold rounded-xl flex items-center gap-2 transition-all">
                <Github className="w-5 h-5" /> View Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl flex items-center gap-2 transition-all">
                <ExternalLink className="w-5 h-5" /> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}