const templateStyles = {
  modern: 'border-cyan-500',
  professional: 'border-slate-800 dark:border-slate-200',
  classic: 'border-amber-600'
};

export default function ResumePreview({ resume, profile }) {
  const content = resume?.content || {};
  const personal = profile?.personal || {};
  return (
    <article className={`rounded-lg border-t-4 ${templateStyles[resume?.template || 'modern']} bg-white p-6 text-slate-900 shadow-soft dark:bg-slate-950 dark:text-slate-100`}>
      <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <h2 className="text-3xl font-black">{personal.fullName || 'Your Name'}</h2>
        <p className="text-sm text-slate-500">{[personal.email, personal.phone, personal.location].filter(Boolean).join(' | ')}</p>
        <p className="mt-3 text-sm leading-6">{content.professional_summary || personal.summary || 'Generate a resume to see the professional summary.'}</p>
      </header>
      {[
        ['Technical Skills', content.technical_skills || profile?.skills],
        ['Projects', content.project_descriptions],
        ['Experience', content.experience],
        ['Achievements', content.achievements || profile?.achievements]
      ].map(([title, items]) => (
        <section key={title} className="mt-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">{title}</h3>
          <ul className="mt-2 space-y-2 text-sm leading-6">
            {(items || []).map((item, index) => <li key={`${title}-${index}`}>• {typeof item === 'string' ? item : item?.title}</li>)}
          </ul>
        </section>
      ))}
    </article>
  );
}
