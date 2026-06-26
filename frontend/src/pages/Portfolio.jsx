import { ExternalLink, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    api.get('/portfolio').then(({ data }) => setPortfolio(data)).catch(() => setPortfolio(null));
  }, []);

  const projects = portfolio?.projects || [];
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-soft dark:bg-slate-900">
      <section className="bg-gradient-to-r from-slate-950 via-cyan-900 to-rose-700 p-8 text-white md:p-12">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-100">{portfolio?.hero?.headline || 'Student Developer'}</p>
        <h2 className="mt-2 text-4xl font-black">{portfolio?.hero?.name || 'Your Portfolio'}</h2>
        <p className="mt-4 max-w-2xl text-slate-100">{portfolio?.about || 'Complete your profile to generate a portfolio preview.'}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {portfolio?.contact?.github && <a className="btn-secondary border-white/40 text-white hover:bg-white/10" href={portfolio.contact.github}><Github size={18} /> GitHub</a>}
          {portfolio?.contact?.linkedin && <a className="btn-secondary border-white/40 text-white hover:bg-white/10" href={portfolio.contact.linkedin}><Linkedin size={18} /> LinkedIn</a>}
          {portfolio?.contact?.email && <a className="btn-secondary border-white/40 text-white hover:bg-white/10" href={`mailto:${portfolio.contact.email}`}><Mail size={18} /> Contact</a>}
        </div>
      </section>
      <section className="grid gap-6 p-6 md:grid-cols-3 md:p-8">
        <div className="md:col-span-1"><h3 className="text-xl font-black">Skills</h3><div className="mt-3 flex flex-wrap gap-2">{(portfolio?.skills || []).map((skill) => <span className="rounded-md bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-200" key={skill}>{skill}</span>)}</div></div>
        <div className="md:col-span-2"><h3 className="text-xl font-black">Projects</h3><div className="mt-3 grid gap-3">{projects.map((project) => <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800" key={project.title}><div className="flex items-center justify-between gap-3"><h4 className="font-bold">{project.title}</h4>{project.link && <ExternalLink size={16} />}</div><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.description}</p></div>)}</div></div>
      </section>
      <section className="border-t border-slate-200 p-6 dark:border-slate-800 md:p-8">
        <h3 className="text-xl font-black">Education</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">{(portfolio?.education || []).map((item) => <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950" key={item.title}><p className="font-bold">{item.title}</p><p className="text-sm text-slate-500">{item.organization}</p></div>)}</div>
      </section>
    </div>
  );
}
