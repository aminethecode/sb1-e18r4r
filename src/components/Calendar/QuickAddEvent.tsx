import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, X, Clock } from 'lucide-react';
import { useCalendarStore } from '../../store/calendarStore';
import { findNextAvailableTime } from '../../utils/nextAvailableTime';
import { checkEventOverlap } from '../../utils/eventOverlap';
import { EventOverlapWarning } from '../EventOverlapWarning';
import { downloadICS } from '../../utils/icsGenerator';

interface QuickAddEventProps {
  date: Date;
  onClose: () => void;
}

export const QuickAddEvent: React.FC<QuickAddEventProps> = ({ date, onClose }) => {
  const { addEvent, events } = useCalendarStore();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const [showOverlapWarning, setShowOverlapWarning] = useState(false);

  const handleSubmit = async (e: React.FormEvent, ignoreOverlap = false) => {
    e.preventDefault();
    
    const start = new Date(`${format(date, 'yyyy-MM-dd')}T${startTime}:00`);
    const end = new Date(`${format(date, 'yyyy-MM-dd')}T${endTime}:00`);

    const eventData = {
      title,
      start,
      end,
      description: '',
    };

    if (!ignoreOverlap) {
      const overlapping = checkEventOverlap(eventData, events);
      if (overlapping.length > 0) {
        setOverlappingEvents(overlapping);
        setShowOverlapWarning(true);
        return;
      }
    }

    const newEvent = await addEvent(eventData);
    
    if (window.confirm('Event created! Would you like to export it to your calendar?')) {
      downloadICS(newEvent);
    }
    
    onClose();
  };

  const handleNextAvailable = () => {
    const { date: nextTime } = findNextAvailableTime(date, 60, events);
    setStartTime(format(nextTime, 'HH:mm'));
    setEndTime(format(new Date(nextTime.getTime() + 60 * 60 * 1000), 'HH:mm'));
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Add Event</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Time
            </label>
            <div className="relative">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Time
            </label>
            <div className="relative">
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNextAvailable}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500"
        >
          Find next available time
        </button>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </button>
        </div>
      </form>

      {showOverlapWarning && (
        <EventOverlapWarning
          overlappingEvents={overlappingEvents}
          onClose={() => setShowOverlapWarning(false)}
          onProceed={(e) => {
            setShowOverlapWarning(false);
            handleSubmit(e as any, true);
          }}
        />
      )}
    </div>
  );
};