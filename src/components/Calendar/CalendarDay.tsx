import React, { useState, useRef, useEffect } from 'react';
import { format, isSameDay, isToday } from 'date-fns';
import { useCalendarStore } from '../../store/calendarStore';
import { EventDetails } from './EventDetails';
import { QuickAddEvent } from './QuickAddEvent';
import { Event } from '../../types/calendar';
import { Plus } from 'lucide-react';

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isQuickAddOpen: boolean;
  onQuickAddToggle: (date: Date, isOpen: boolean) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isCurrentMonth,
  isQuickAddOpen,
  onQuickAddToggle,
}) => {
  const { events, selectedDate, setSelectedDate } = useCalendarStore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const dayRef = useRef<HTMLDivElement>(null);
  
  const dayEvents = events.filter((event) => isSameDay(event.start, date));
  const isSelected = isSameDay(date, selectedDate);
  const isCurrentDay = isToday(date);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dayRef.current && !dayRef.current.contains(event.target as Node)) {
        onQuickAddToggle(date, false);
      }
    };

    if (isQuickAddOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isQuickAddOpen, date, onQuickAddToggle]);

  const handleEventClick = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleDayClick = () => {
    // Always update selected date
    setSelectedDate(date);
    
    // Only show quick add for current month dates
    if (isCurrentMonth) {
      onQuickAddToggle(date, true);
    }
  };

  return (
    <div ref={dayRef} className="relative">
      <div
        onClick={handleDayClick}
        className={`min-h-[100px] p-2 border transition-all duration-200 ${
          isSelected
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-sm'
            : isCurrentMonth
            ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
            : 'opacity-40'
        } ${
          isCurrentDay
            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900'
            : ''
        }`}
      >
        <div className="flex justify-between items-center">
          <span className={`font-medium ${
            isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'
          }`}>
            {format(date, 'd')}
          </span>
          {isCurrentMonth && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAddToggle(date, true);
              }}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              title="Quick add event"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="space-y-1 mt-1">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              onClick={(e) => handleEventClick(e, event)}
              className="text-xs p-1 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 rounded truncate cursor-pointer transition-colors"
              title={event.title}
            >
              {format(event.start, 'HH:mm')} - {event.title}
            </div>
          ))}
        </div>
      </div>

      {isQuickAddOpen && (
        <QuickAddEvent
          date={date}
          onClose={() => onQuickAddToggle(date, false)}
        />
      )}

      {showEventDetails && selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => {
            setShowEventDetails(false);
            setSelectedEvent(null);
          }}
          onEdit={(event) => {
            setShowEventDetails(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};