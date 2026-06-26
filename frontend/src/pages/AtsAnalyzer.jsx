import { UploadCloud } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

function Meter({ label, value }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm font-semibold"><span>{label}</span><span>{value || 0}%</span></div>
      <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-3 rounded-full bg-cyan-600" style={{ width: `${value || 0}%` }} /></div>
    </div>
  );
}

export default function AtsAnalyzer() {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!file) return toast.error('Choose a PDF first');
    setLoading(true);
    const form = new FormData();
    form.append('resume', file);
    try {
      const { data } = await api.post('/ats/analyze', form);
      setReport(data);
      toast.success('ATS analysis complete');
    } catch (error) {
      toast.error(error.response?.data?.message || 'ATS analysis failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <section className="card h-fit">
        <h2 className="text-2xl font-black">ATS Resume Analyzer</h2>
        <label className="mt-5 block rounded-lg border-2 border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
          <UploadCloud className="mx-auto mb-3 text-cyan-600" size={36} />
          <span className="text-sm font-semibold">{file?.name || 'Upload resume PDF'}</span>
          <input className="hidden" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <button className="btn-primary mt-5 w-full" disabled={loading} onClick={analyze}>{loading ? 'Analyzing...' : 'Analyze Resume'}</button>
      </section>
      <section className="card space-y-5">
        <h3 className="text-xl font-bold">Score Report</h3>
        <Meter label="Overall ATS Score" value={report?.overallScore} />
        <Meter label="Keyword Score" value={report?.keywordScore} />
        <Meter label="Formatting Score" value={report?.formattingScore} />
        <div className="grid gap-4 md:grid-cols-2">
          <div><h4 className="font-bold">Suggestions</h4><ul className="mt-2 space-y-2 text-sm">{(report?.suggestions || []).map((item) => <li key={item}>• {item}</li>)}</ul></div>
          <div><h4 className="font-bold">Missing Skills</h4><div className="mt-2 flex flex-wrap gap-2">{(report?.missingSkills || []).map((item) => <span className="rounded-md bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200" key={item}>{item}</span>)}</div></div>
        </div>
      </section>
    </div>
  );
}
