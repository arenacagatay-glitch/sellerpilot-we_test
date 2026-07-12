import { NavLink, Outlet } from 'react-router-dom';
import { Home, UtensilsCrossed, ClipboardList, User } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Bugün', icon: Home, end: true },
  { to: '/plan', label: 'Program', icon: UtensilsCrossed, end: false },
  { to: '/diary', label: 'Günlük', icon: ClipboardList, end: false },
  { to: '/me', label: 'Profil', icon: User, end: false },
];

export function Layout() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      <main className="flex-1 px-4 pb-24 pt-5">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-stretch justify-around">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                  isActive ? 'text-brand' : 'text-muted'
                }`
              }
            >
              <Icon size={22} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
