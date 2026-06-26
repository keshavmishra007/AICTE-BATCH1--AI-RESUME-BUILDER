import { Download, Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ResumePreview from '../components/ResumePreview';
import { api, downloadFile } from '../services/api';

const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'AI Engineer'];
const templates = ['modern', 'professional', 'classic'];

export default function ResumeBuilder() {
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [targetRole, setTargetRole] = useState(roles[0]);
  const [template, setTemplate] = useState('modern');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      setProfile(data.profile);
      setResume(data.recentResume);
      if (data.recentResume?.template) setTemplate(data.recentResume.template);
    });
  }, []);

  async function generate() {
    setLoading(true);
    try {
      const { data } = await api.post('/resume/generate', { targetRole, template });
      setResume(data);
      toast.success('Resume generated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Resume generation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <aside className="card h-fit">
        <h2 className="text-2xl font-black">AI Resume Generator</h2>
        <label className="mt-5 block">
          <span className="label">Target Role</span>
          <select className="input" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
            {roles.map((role) => <option key={role}>{role}</option>)}
          </select>
        </label>
        <div className="mt-5">
          <span className="label">Template</span>
          <div className="grid grid-cols-3 gap-2">
            {templates.map((item) => (
              <button key={item} className={item === template ? 'btn-primary px-2' : 'btn-secondary px-2'} onClick={() => setTemplate(item)}>{item}</button>
            ))}
          </div>
        </div>
        <button className="btn-primary mt-5 w-full" disabled={loading} onClick={generate}><Wand2 size={18} /> {loading ? 'Generating...' : 'Generate Resume'}</button>
        {resume && <button className="btn-secondary mt-3 w-full" onClick={() => downloadFile(`/resume/${resume._id}/download`, 'careerforge-resume.pdf')}><Download size={18} /> Download PDF</button>}
      </aside>
      <ResumePreview resume={resume ? { ...resume, template } : null} profile={profile} />
    </div>
  );
}
