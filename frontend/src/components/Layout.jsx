import { BarChart3, BriefcaseBusiness, FileText, Home, LayoutTemplate, LogOut, Sparkles, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/profile', label: 'Profile', icon: UserRound },
  { to: '/resume', label: 'Resume', icon: FileText },
  { to: '/cover-letter', label: 'Cover Letter', icon: BriefcaseBusiness },
  { to: '/ats', label: 'ATS Analyzer', icon: BarChart3 },
  { to: '/portfolio', label: 'Portfolio', icon: LayoutTemplate }
];

export default function Layout({ children, modeButton }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-600 text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-bold">CareerForge AI</p>
            <p className="text-xs text-slate-500">Resume & Portfolio</p>
          </div>
        </div>
        <nav className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-200' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <h1 className="text-lg font-bold">{user?.name || 'Builder'}</h1>
            </div>
            <div className="flex items-center gap-2">
              {modeButton}
              <button className="btn-secondary px-3" onClick={logout} aria-label="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} className="whitespace-nowrap rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-slate-800">
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
