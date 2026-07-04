import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { Bell, Search, Command, RefreshCw, Sun, Moon, Download } from 'lucide-react';

interface HeaderProps {
  onSearchClick: () => void;
  isSyncing?: boolean;
  onSyncClick?: () => void;
  onMenuClick?: () => void;
  onExport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick, isSyncing = false, onSyncClick, onMenuClick, onExport }) => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Welcome back');
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    if (isLightMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isLightMode]);

  const toggleTheme = () => {
    setIsLightMode(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'light' : 'dark');
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/60 px-4 md:px-8 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_-1px_0_rgba(255,255,255,0.03)]">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        )}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">
            {greeting},
          </h2>
          <h1 className="text-base font-bold text-foreground">
            {user?.name || 'Engineer'}
          </h1>
        </div>
      </div>

      {/* Action panel */}
      <div className="flex items-center gap-4">
        {/* Ctrl+K Search button */}
        <button
          onClick={onSearchClick}
          className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-card/50 backdrop-blur-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:border-primary/50 hover:text-foreground transition-all duration-300 shadow-sm"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
          <kbd className="flex items-center gap-0.5 rounded border border-border px-1 text-[10px] bg-muted">
            <Command className="h-2 w-2" />
            <span>K</span>
          </kbd>
        </button>

        {/* Sync trigger in header */}
        {onSyncClick && (
          <button
            onClick={onSyncClick}
            disabled={isSyncing}
            className="group relative flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-all duration-300 disabled:opacity-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#06b6d4] to-[#00d2ff] opacity-90 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-[1px] bg-[#050505] rounded-md z-0 transition-opacity group-hover:opacity-0" />
            <RefreshCw className={`relative z-10 h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="relative z-10">{isSyncing ? 'Syncing...' : 'Sync'}</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors border border-transparent hover:border-border"
          title="Toggle Theme"
        >
          {isLightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Export Dashboard */}
        {onExport && (
          <button 
            onClick={onExport}
            className="hidden md:flex relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors border border-transparent hover:border-border"
            title="Export Dashboard (PNG)"
          >
            <Download className="h-4 w-4" />
          </button>
        )}

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors border border-transparent hover:border-border">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
        </button>
      </div>
    </header>
  );
};
