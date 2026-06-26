import { BarChart3, FileText, Gauge, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    api.get('/profile').then((res) => setData(res.data)).catch(() => setData({}));
  }, []);

  const score = data.recentAts?.overallScore || data.recentResume?.atsScore || 0;
  const cards = [
    { label: 'Resume Status', value: data.recentResume ? 'Generated' : 'Not started', icon: FileText },
    { label: 'ATS Score', value: score ? `${score}%` : 'Pending', icon: Gauge },
    { label: 'Profile Skills', value: data.profile?.skills?.length || 0, icon: Sparkles },
    { label: 'Recent Role', value: data.recentResume?.targetRole || 'Choose one', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-gradient-to-r from-cyan-600 via-slate-900 to-rose-600 p-6 text-white shadow-soft">
        <h2 className="text-3xl font-black">Build once. Generate everywhere.</h2>
        <p className="mt-2 max-w-2xl text-slate-100">Keep your student profile current, then generate a tailored resume, cover letter, ATS analysis, and portfolio from the same source.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div className="card" key={card.label}>
              <Icon className="mb-4 text-cyan-600" />
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-black">{card.value}</p>
            </div>
          );
        })}
      </section>
      <section className="card">
        <h3 className="text-xl font-bold">Quick Actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="btn-primary" to="/profile">Update Profile</Link>
          <Link className="btn-secondary" to="/resume">Generate Resume</Link>
          <Link className="btn-secondary" to="/ats">Analyze ATS</Link>
          <Link className="btn-secondary" to="/portfolio">Preview Portfolio</Link>
        </div>
      </section>
    </div>
  );
}
