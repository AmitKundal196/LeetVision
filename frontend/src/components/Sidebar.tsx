import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { 
  LayoutDashboard, 
  BarChart3, 
  Trophy, 
  User as UserIcon, 
  Settings, 
  ShieldAlert, 
  LogOut,
  RefreshCw,
  Code2
} from 'lucide-react';

interface SidebarProps {
  width: number;
  onWidthChange: (newWidth: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ width, onWidthChange, isOpen, onClose }) => {
  const { user, logout } = useAuth();
  
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/contests', label: 'Contest Sync', icon: Trophy },
    { to: '/sync', label: 'Sync Center', icon: RefreshCw },
    { to: '/profile', label: 'Developer Card', icon: UserIcon },
    { to: '/about-developer', label: 'About Developer', icon: Code2 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const showAdmin = user && (user.email.includes('admin') || user.email.includes('test'));

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(180, Math.min(400, startWidth + (moveEvent.clientX - startX)));
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <aside 
      style={{ width: `${width}px` }} 
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card/60 glass-panel transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 gap-2 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-extrabold text-lg shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          L
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-wide text-foreground">LeetVision</h1>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-300 ease-out ${
                isActive
                  ? 'bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] before:absolute before:left-0 before:h-6 before:w-1 before:rounded-r-full before:bg-primary before:shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground hover:scale-[1.02] hover:shadow-sm'
              }`
            }
            onClick={() => {
              if (window.innerWidth < 768 && onClose) {
                onClose();
              }
            }}
          >
            <item.icon className="h-4 w-4" />
            {width > 120 && <span>{item.label}</span>}
          </NavLink>
        ))}

        {showAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-300 ease-out mt-6 ${
                isActive
                  ? 'bg-destructive/10 text-destructive before:absolute before:left-0 before:h-6 before:w-1 before:rounded-r-full before:bg-destructive before:shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                  : 'text-muted-foreground hover:bg-destructive/5 hover:text-destructive hover:scale-[1.02]'
              }`
            }
          >
            <ShieldAlert className="h-4 w-4" />
            {width > 120 && <span>Admin Panel</span>}
          </NavLink>
        )}
      </nav>

      <div 
        onMouseDown={handleMouseDown}
        className="hidden md:block absolute top-0 -right-1 bottom-0 w-2 cursor-col-resize hover:bg-primary/30 bg-transparent transition-colors z-30"
      />

      {/* Footer User Info */}
      <div className="border-t border-border p-4 relative z-10">
        <div className="flex items-center gap-3 rounded-xl p-2.5 transition-all duration-300 hover:bg-white/5 hover:shadow-lg hover:scale-[1.02] cursor-pointer group">
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email || 'default'}`}
            alt="User avatar"
            className="h-9 w-9 rounded-full border border-border bg-muted/60 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          />
          {width > 150 && (
            <div className="flex-1 overflow-hidden">
              <h4 className="truncate text-xs font-semibold text-foreground">{user?.name || 'User'}</h4>
              <span className="truncate text-[10px] text-muted-foreground block">{user?.email}</span>
            </div>
          )}
          <button 
            onClick={logout}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
