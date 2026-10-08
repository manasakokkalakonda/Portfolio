import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-white mb-2">Page Not Found</h1>
        <p className="text-slate-400 text-sm mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl text-sm transition-all"
        >
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </main>
  );
}