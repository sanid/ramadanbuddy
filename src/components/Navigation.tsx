import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';

const navItems = [
  { icon: 'home', label: 'Home', path: '/' },
  { icon: 'schedule', label: 'Prayers', path: '/prayers' },
  { icon: 'auto_stories', label: 'Quran', path: '/quran' },
  { icon: 'checklist_rtl', label: 'Tracker', path: '/tracker' },
  { icon: 'volunteer_activism', label: 'Insights', path: '/insights' },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 px-4 pb-8 pt-3 flex justify-between items-center z-50 safe-bottom">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 flex-1 transition-colors",
              isActive ? "text-primary" : "text-slate-500 dark:text-slate-400"
            )
          }
        >
          <span className={cn("material-symbols-outlined", "text-[24px]")}>
            {item.icon}
          </span>
          <span className="text-[10px] font-bold">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
