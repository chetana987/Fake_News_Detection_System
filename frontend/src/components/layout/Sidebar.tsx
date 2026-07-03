import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Radio, BarChart3, ScrollText, Settings, Shield,
} from 'lucide-react';
import { useState } from 'react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/live-feed', label: 'Live Feed', icon: Radio },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/history', label: 'Fact Check History', icon: ScrollText },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-800 bg-[#0F172A] transition-all duration-300',
        collapsed ? 'w-16' : 'w-56',
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-gray-800 px-4">
        <Shield className="h-6 w-6 shrink-0 text-violet-500" />
        {!collapsed && <span className="text-sm font-bold tracking-wide">Misinfo Shield</span>}
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-violet-600/20 text-violet-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="border-t border-gray-800 p-3 text-xs text-gray-500 hover:text-gray-300"
      >
        {collapsed ? '>>' : '<< Collapse'}
      </button>
    </aside>
  );
}
