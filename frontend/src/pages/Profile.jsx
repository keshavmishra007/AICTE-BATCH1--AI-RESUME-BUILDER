import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

const empty = {
  personal: { fullName: '', headline: '', email: '', phone: '', location: '', summary: '' },
  education: [],
  skills: [],
  projects: [],
  experience: [],
  achievements: [],
  certifications: [],
  languages: [],
  links: { github: '', linkedin: '', portfolio: '' }
};

function splitLines(value) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function joinLines(value) {
  return Array.isArray(value) ? value.join('\n') : '';
}

function parseEntries(value) {
  return splitLines(value).map((line) => {
    const [title, organization = '', description = ''] = line.split('|').map((part) => part.trim());
    return { title, organization, description };
  });
}

function formatEntries(entries) {
  return (entries || []).map((entry) => [entry.title, entry.organization, entry.description].filter(Boolean).join(' | ')).join('\n');
}

export default function Profile() {
  const [profile, setProfile] = useState(empty);
  const [text, setText] = useState({ skills: '', achievements: '', languages: '', education: '', projects: '', experience: '', certifications: '' });

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      const p = data.profile || empty;
      setProfile({ ...empty, ...p, personal: { ...empty.personal, ...p.personal }, links: { ...empty.links, ...p.links } });
      setText({
        skills: joinLines(p.skills),
        achievements: joinLines(p.achievements),
        languages: joinLines(p.languages),
        education: formatEntries(p.education),
        projects: formatEntries(p.projects),
        experience: formatEntries(p.experience),
        certifications: formatEntries(p.certifications)
      });
    });
  }, []);

  async function save() {
    const payload = {
      ...profile,
      skills: splitLines(text.skills),
      achievements: splitLines(text.achievements),
      languages: splitLines(text.languages),
      education: parseEntries(text.education),
      projects: parseEntries(text.projects),
      experience: parseEntries(text.experience),
      certifications: parseEntries(text.certifications)
    };
    const { data } = await api.put('/profile', payload);
    setProfile(data);
    toast.success('Profile saved');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black">Student Profile</h2>
        <button className="btn-primary" onClick={save}><Save size={18} /> Save</button>
      </div>
      <section className="card grid gap-4 md:grid-cols-2">
        {Object.keys(empty.personal).map((key) => (
          <label key={key} className={key === 'summary' ? 'md:col-span-2' : ''}>
            <span className="label">{key}</span>
            {key === 'summary' ? (
              <textarea className="input min-h-28" value={profile.personal[key] || ''} onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, [key]: e.target.value } })} />
            ) : (
              <input className="input" value={profile.personal[key] || ''} onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, [key]: e.target.value } })} />
            )}
          </label>
        ))}
        {Object.keys(empty.links).map((key) => (
          <label key={key}>
            <span className="label">{key}</span>
            <input className="input" value={profile.links[key] || ''} onChange={(e) => setProfile({ ...profile, links: { ...profile.links, [key]: e.target.value } })} />
          </label>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {[
          ['skills', 'One skill per line'],
          ['projects', 'Format: title | organization | description'],
          ['experience', 'Format: role | organization | description'],
          ['education', 'Format: degree | institution | details'],
          ['achievements', 'One achievement per line'],
          ['certifications', 'Format: name | issuer | details'],
          ['languages', 'One language per line']
        ].map(([key, hint]) => (
          <label className="card" key={key}>
            <span className="label">{key}</span>
            <textarea className="input min-h-32" placeholder={hint} value={text[key]} onChange={(e) => setText({ ...text, [key]: e.target.value })} />
          </label>
        ))}
      </section>
    </div>
  );
}
