import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeatmapProps {
  submissionCalendar: string; // JSON string "{"1624500000": 3, ...}"
}

export const Heatmap: React.FC<HeatmapProps> = ({ submissionCalendar }) => {
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number; x: number; y: number } | null>(null);
  const [selectedDate, setSelectedDate] = useState<{ date: string; count: number } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const calendarData = useMemo(() => {
    try {
      return JSON.parse(submissionCalendar || '{}');
    } catch {
      return {};
    }
  }, [submissionCalendar]);

  // Compute stats for selected year
  const yearData = useMemo(() => {
    // Generate dates for the selected year
    const startDate = new Date(selectedYear, 0, 1);
    // Adjust start date to previous Sunday to align with rows
    const startOffset = startDate.getDay();
    const daysToShow = [];
    
    const cursor = new Date(startDate);
    cursor.setDate(cursor.getDate() - startOffset);
    
    // We want 53 weeks (53 * 7 = 371 cells)
    for (let i = 0; i < 371; i++) {
      
      // Let's find matches in the calendarData.
      // LeetCode stores timestamp entries. Since timestamps can be at any time during the day,
      // we check for timestamp matching that YYYY-MM-DD date range.
      const dayStart = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()).getTime() / 1000;
      const dayEnd = dayStart + 86400;
      
      let count = 0;
      // Search calendar for matching timestamps
      Object.entries(calendarData).forEach(([timestamp, value]) => {
        const itemTs = parseInt(timestamp);
        if (itemTs >= dayStart && itemTs < dayEnd) {
          count += Number(value);
        }
      });
      
      daysToShow.push({
        date: new Date(cursor),
        dateString: cursor.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        count,
        isCurrentYear: cursor.getFullYear() === selectedYear
      });
      
      cursor.setDate(cursor.getDate() + 1);
    }
    
    return daysToShow;
  }, [calendarData, selectedYear]);

  // Group columns (weeks)
  const weeks = useMemo(() => {
    const grid = [];
    for (let i = 0; i < yearData.length; i += 7) {
      grid.push(yearData.slice(i, i + 7));
    }
    return grid;
  }, [yearData]);

  // Months label positions
  const monthLabels = useMemo(() => {
    const labels: { label: string; index: number }[] = [];
    let currentMonth = -1;
    
    weeks.forEach((week, weekIdx) => {
      // Check the Wednesday of each week to avoid boundary overflows
      const midWeekDate = week[3]?.date;
      if (midWeekDate && midWeekDate.getFullYear() === selectedYear) {
        const month = midWeekDate.getMonth();
        if (month !== currentMonth) {
          currentMonth = month;
          labels.push({
            label: midWeekDate.toLocaleString('default', { month: 'short' }),
            index: weekIdx
          });
        }
      }
    });
    
    return labels;
  }, [weeks, selectedYear]);

  // Color intensities
  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-[#161b22] border-transparent';
    if (count === 1) return 'bg-[#0e4429] border-transparent';
    if (count === 2) return 'bg-[#006d32] border-transparent';
    if (count === 3) return 'bg-[#26a641] border-transparent';
    return 'bg-[#39d353] border-transparent';
  };

  // Get active years from calendarData
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    years.add(new Date().getFullYear()); // always include current year
    
    Object.keys(calendarData).forEach(ts => {
      const yr = new Date(parseInt(ts) * 1000).getFullYear();
      if (!isNaN(yr)) years.add(yr);
    });
    
    return Array.from(years).sort((a, b) => b - a);
  }, [calendarData]);

  // Total submissions in selected year
  const totalYearSubmissions = useMemo(() => {
    return yearData
      .filter(d => d.isCurrentYear)
      .reduce((sum, d) => sum + d.count, 0);
  }, [yearData]);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Submission Heatmap</h3>
          <p className="text-xs text-muted-foreground">
            {totalYearSubmissions} submissions in {selectedYear}
          </p>
        </div>
        
        {/* Year Select Selector */}
        <div className="flex items-center gap-2 border border-border bg-background rounded-lg p-1">
          {availableYears.map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all duration-150 ${
                selectedYear === yr
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative overflow-x-auto pb-2">
        <div className="min-w-[700px] flex flex-col">
          {/* Months Headers Row */}
          <div className="flex pl-8 text-[10px] text-muted-foreground h-5 font-semibold">
            {monthLabels.map((lbl, idx) => (
              <span
                key={idx}
                className="absolute"
                style={{ left: `${lbl.index * 13 + 32}px` }}
              >
                {lbl.label}
              </span>
            ))}
          </div>

          <div className="flex gap-2 relative">
            {/* Days Column Labels */}
            <div className="flex flex-col justify-between text-[10px] text-muted-foreground w-6 h-[85px] py-1 font-semibold">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Submissions Calendar Grid */}
            <motion.div 
              key={selectedYear}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex-1 flex gap-[3px]"
            >
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIdx) => (
                    <motion.div
                      key={dayIdx}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const container = e.currentTarget.closest('.relative')?.getBoundingClientRect();
                        if (rect && container) {
                          setHoveredCell({
                            date: day.dateString,
                            count: day.count,
                            x: rect.left - container.left + 5,
                            y: rect.top - container.top - 42
                          });
                        }
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                      onClick={() => setSelectedDate({ date: day.dateString, count: day.count })}
                      whileHover={{ scale: 1.3, zIndex: 10 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className={`h-[10px] w-[10px] rounded-[1.5px] border cursor-pointer transition-colors duration-150 ${
                        day.isCurrentYear ? getColorClass(day.count) : 'bg-transparent border-transparent'
                      }`}
                    />
                  ))}
                </div>
              ))}
            </motion.div>

            {/* Hover Tooltip Overlay */}
            <AnimatePresence>
              {hoveredCell && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute z-30 pointer-events-none rounded bg-popover border border-border px-2 py-1 text-[10px] text-foreground font-semibold shadow-lg whitespace-nowrap"
                  style={{ left: hoveredCell.x, top: hoveredCell.y }}
                >
                  {hoveredCell.count === 0 ? 'No' : hoveredCell.count} submission{hoveredCell.count !== 1 ? 's' : ''} on {hoveredCell.date}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Grid Legend & Selected Date Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
        {selectedDate ? (
          <div className="text-xs text-foreground bg-accent/50 px-3 py-1.5 rounded-md border border-border animate-fade-in">
            <span className="font-semibold text-primary">{selectedDate.count}</span> submissions on <span className="font-semibold">{selectedDate.date}</span>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            Click a day to view activity
          </div>
        )}
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
          <span>Less</span>
          <div className="h-2 w-2 rounded-[1px] bg-[#161b22]" />
          <div className="h-2 w-2 rounded-[1px] bg-[#0e4429]" />
          <div className="h-2 w-2 rounded-[1px] bg-[#006d32]" />
          <div className="h-2 w-2 rounded-[1px] bg-[#26a641]" />
          <div className="h-2 w-2 rounded-[1px] bg-[#39d353]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
export default Heatmap;
