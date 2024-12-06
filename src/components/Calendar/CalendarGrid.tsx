import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { useCalendarStore } from '../../store/calendarStore';
import { CalendarDay } from './CalendarDay';
import { CalendarHeader } from './CalendarHeader';

export const CalendarGrid: React.FC = () => {
  const { selectedDate } = useCalendarStore();
  const [activeQuickAddDate, setActiveQuickAddDate] = useState<Date | null>(null);
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleQuickAddToggle = (date: Date, isOpen: boolean) => {
    // Only allow opening quick add for current month dates
    if (isOpen && format(date, 'M') !== format(selectedDate, 'M')) {
      return;
    }
    setActiveQuickAddDate(isOpen ? date : null);
  };

  return (
    <div>
      <CalendarHeader />
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="p-2 text-center font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
          >
            {day}
          </div>
        ))}
        {days.map((day) => (
          <CalendarDay
            key={format(day, 'yyyy-MM-dd')}
            date={day}
            isCurrentMonth={format(day, 'M') === format(selectedDate, 'M')}
            isQuickAddOpen={activeQuickAddDate?.getTime() === day.getTime()}
            onQuickAddToggle={handleQuickAddToggle}
          />
        ))}
      </div>
    </div>
  );
};