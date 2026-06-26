import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Auth({ modeButton }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { authenticate } = useAuth();

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await authenticate(mode, form);
      toast.success('You are in. Time to build.');
    } catch (error) {
      const fieldError = error.response?.data?.errors?.[0]?.message;
      toast.error(fieldError || error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(8,145,178,.35),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(244,63,94,.24),transparent_26%)] px-4 py-8">
        <div className="mx-auto flex max-w-6xl justify-end">{modeButton}</div>
        <div className="mx-auto grid min-h-[78vh] max-w-6xl items-center gap-8 md:grid-cols-[1.1fr_.9fr]">
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-cyan-500">
                <Sparkles />
              </div>
              <span className="text-xl font-bold">CareerForge AI</span>
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-tight md:text-6xl">AI Resume & Portfolio Builder</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Generate role-specific resumes, cover letters, ATS reports, and a portfolio from one structured student profile.
            </p>
          </section>
          <form onSubmit={submit} className="card bg-white text-slate-950 dark:bg-slate-900 dark:text-slate-100">
            <h2 className="text-2xl font-bold">{mode === 'login' ? 'Login' : 'Create account'}</h2>
            <p className="mb-5 mt-1 text-sm text-slate-500">Use any local account once the backend is running.</p>
            {mode === 'register' && (
              <label className="mb-4 block">
                <span className="label">Name</span>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
            )}
            <label className="mb-4 block">
              <span className="label">Email</span>
              <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="mb-5 block">
              <span className="label">Password</span>
              <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </label>
            <button className="btn-primary w-full" disabled={loading}>{loading ? 'Working...' : mode === 'login' ? 'Login' : 'Register'}</button>
            <button type="button" className="mt-4 w-full text-sm font-semibold text-cyan-600" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Need an account? Register' : 'Already registered? Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
