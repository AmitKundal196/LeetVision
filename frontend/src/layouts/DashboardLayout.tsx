import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { CommandPalette } from '../components/CommandPalette';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface DashboardLayoutProps {
  isSyncing?: boolean;
  onSyncClick?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ isSyncing = false, onSyncClick }) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const mainRef = React.useRef<HTMLElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    return Number(localStorage.getItem('sidebar_width') || '256');
  });

  const handleSidebarResize = (newWidth: number) => {
    setSidebarWidth(newWidth);
    localStorage.setItem('sidebar_width', String(newWidth));
  };

  const handleExport = async () => {
    if (!mainRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(mainRef.current, { scale: 2, useCORS: true, backgroundColor: document.documentElement.classList.contains('light') ? '#ffffff' : '#000000' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('LeetVision-Analytics.pdf');
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - fixed left with dynamic width */}
      <Sidebar 
        width={sidebarWidth} 
        onWidthChange={handleSidebarResize} 
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main viewport area - dynamic offset by sidebar width on desktop */}
      <div 
        className="flex flex-col min-h-screen transition-[padding] duration-300 ease-out md:pl-[var(--sidebar-width)]"
        style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
      >
        {/* Header - sticky top */}
        <Header 
          onSearchClick={() => setIsCommandOpen(true)} 
          isSyncing={isSyncing}
          onSyncClick={onSyncClick}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          onExport={handleExport}
        />

        {/* Viewport Content */}
        <main ref={mainRef} className="flex-1 p-4 md:p-10 lg:p-12 2xl:p-16 max-w-[1800px] w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
      />
    </div>
  );
};
export default DashboardLayout;
