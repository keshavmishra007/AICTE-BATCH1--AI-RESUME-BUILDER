import { Clipboard, Download, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, downloadFile } from '../services/api';

export default function CoverLetter() {
  const [form, setForm] = useState({ companyName: '', jobRole: '', jobDescription: '' });
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const { data } = await api.post('/coverletter/generate', form);
      setLetter(data);
      toast.success('Cover letter generated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <section className="card h-fit space-y-4">
        <h2 className="text-2xl font-black">Cover Letter Generator</h2>
        {['companyName', 'jobRole'].map((key) => (
          <label key={key}>
            <span className="label">{key}</span>
            <input className="input" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </label>
        ))}
        <label>
          <span className="label">Job Description</span>
          <textarea className="input min-h-44" value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })} />
        </label>
        <button className="btn-primary w-full" disabled={loading} onClick={generate}><Send size={18} /> {loading ? 'Writing...' : 'Generate'}</button>
      </section>
      <section className="card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-bold">Preview</h3>
          {letter && (
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(letter.content).then(() => toast.success('Copied'))}><Clipboard size={18} /> Copy</button>
              <button className="btn-secondary" onClick={() => downloadFile(`/coverletter/${letter._id}/download`, 'careerforge-cover-letter.pdf')}><Download size={18} /> PDF</button>
            </div>
          )}
        </div>
        <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-5 text-sm leading-7 text-slate-800 dark:bg-slate-950 dark:text-slate-100">{letter?.content || 'Your generated cover letter will appear here.'}</pre>
      </section>
    </div>
  );
}
