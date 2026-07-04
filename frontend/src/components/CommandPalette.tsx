import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Search, LayoutDashboard, BarChart3, Trophy, User, Settings, LogOut, Code, RefreshCw, Pin, Terminal
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useLeetCodeProfile } from '../hooks/useLeetCode';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile, sync } = useLeetCodeProfile();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [bookmarks, setBookmarks] = useState<{ title: string; slug: string; difficulty: string }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('leetvision_bookmarks') || '[]');
    } catch { return []; }
  });

  const toggleBookmark = (title: string, slug: string, difficulty: string) => {
    let next;
    if (bookmarks.some(b => b.slug === slug)) {
      next = bookmarks.filter(b => b.slug !== slug);
    } else {
      next = [...bookmarks, { title, slug, difficulty }];
    }
    setBookmarks(next);
    localStorage.setItem('leetvision_bookmarks', JSON.stringify(next));
    window.dispatchEvent(new Event('bookmarks_updated'));
  };

  const commandItems = React.useMemo(() => {
    const items = [
      { icon: LayoutDashboard, label: 'Go to Dashboard', category: 'Navigation', action: () => navigate('/dashboard') },
      { icon: BarChart3, label: 'Go to Analytics', category: 'Navigation', action: () => navigate('/analytics') },
      { icon: Trophy, label: 'Go to Contest Sync', category: 'Navigation', action: () => navigate('/contests') },
      { icon: RefreshCw, label: 'Go to Sync Center', category: 'Navigation', action: () => navigate('/sync') },
      { icon: User, label: 'Go to Developer Card', category: 'Navigation', action: () => navigate('/profile') },
      { icon: Settings, label: 'Go to Settings', category: 'Navigation', action: () => navigate('/settings') },
      { icon: Terminal, label: 'Go to Developer Sandbox', category: 'Navigation', action: () => navigate('/debug') },
    ];

    // Patterns index list
    const patterns = [
      'Two Pointer', 'Sliding Window', 'Binary Search', 'Hashing', 'Prefix Sum',
      'Linked List', 'DFS', 'BFS', 'Trees', 'Graphs', 'Heap', 'Greedy',
      'Backtracking', 'Dynamic Programming', 'Bit Manipulation', 'Math', 'Sorting', 'Recursion'
    ];
    patterns.forEach(p => {
      items.push({
        icon: Code,
        label: `Search Pattern: ${p}`,
        category: 'Patterns',
        action: () => navigate(`/analytics?search=${encodeURIComponent(p)}`)
      });
    });

    // Dynamic Problems from profile
    if (profile && profile.recentSubmissions) {
      profile.recentSubmissions.forEach(sub => {
        items.push({
          icon: Code,
          label: `Solve Problem: ${sub.title}`,
          category: 'Problems',
          action: () => { window.open(`https://leetcode.com/problems/${sub.titleSlug}`, '_blank'); }
        });

        const isPinned = bookmarks.some(b => b.slug === sub.titleSlug);
        items.push({
          icon: Pin,
          label: `${isPinned ? 'Unpin' : 'Pin/Bookmark'} Problem: ${sub.title}`,
          category: 'Bookmarks',
          action: () => toggleBookmark(sub.title, sub.titleSlug, sub.difficulty || 'Medium')
        });
      });
    }

    // Admin Panel
    items.push(
      { icon: RefreshCw, label: 'Force Sync Profile', category: 'System', action: () => { sync({ force: true }); } },
      { icon: LogOut, label: 'Log Out of LeetVision', category: 'System', action: () => { logout(); onClose(); } }
    );

    return items;
  }, [profile, navigate, logout, sync, bookmarks]);

  const filteredItems = commandItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 pt-[15vh] px-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            ref={containerRef}
            className="relative w-full max-w-xl glass-panel glass-panel-hover rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
          >
            <div className="flex items-center px-4 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground mr-3" />
              <input
                type="text"
                placeholder="Search command palette..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-transparent py-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div className="max-h-[320px] overflow-y-auto p-2 divide-y divide-border/20">
              {filteredItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => { item.action(); onClose(); }}
                    className={`w-full flex items-center justify-between text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                      idx === selectedIndex ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-3.5 w-3.5" />
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-bold">{item.category}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default CommandPalette;
