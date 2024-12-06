import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useCalendarStore } from '../../store/calendarStore';
import { Plus, X, Calendar } from 'lucide-react';
import { Event } from '../../types/calendar';
import DatePicker from 'react-datepicker';
import { findNextAvailableTime } from '../../utils/nextAvailableTime';
import { checkEventOverlap } from '../../utils/eventOverlap';
import { EventOverlapWarning } from '../EventOverlapWarning';
import "react-datepicker/dist/react-datepicker.css";

interface EventFormProps {
  editingEvent?: Event;
  onCancel?: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ editingEvent, onCancel }) => {
  const { selectedDate, setSelectedDate, addEvent, updateEvent, events } = useCalendarStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [attendees, setAttendees] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [showNextDayNotification, setShowNextDayNotification] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const [showOverlapWarning, setShowOverlapWarning] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || '');
      setStartTime(format(editingEvent.start, 'HH:mm'));
      setEndTime(format(editingEvent.end, 'HH:mm'));
      setAttendees(editingEvent.attendees || []);
      setLocation(editingEvent.location || '');
    }
  }, [editingEvent]);

  const handleSubmit = (e: React.FormEvent, ignoreOverlap = false) => {
    e.preventDefault();
    
    const start = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${startTime}:00`);
    const end = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${endTime}:00`);

    const eventData = {
      title,
      description,
      start,
      end,
      attendees,
      location,
    };

    if (!ignoreOverlap) {
      const overlapping = checkEventOverlap(eventData, events);
      if (overlapping.length > 0) {
        setOverlappingEvents(overlapping);
        setShowOverlapWarning(true);
        return;
      }
    }

    if (editingEvent) {
      updateEvent({ ...eventData, id: editingEvent.id });
      onCancel?.();
    } else {
      addEvent(eventData);
    }

    resetForm();
  };

  const handleNextAvailable = () => {
    const { date: nextTime, isNextDay } = findNextAvailableTime(selectedDate, 60, events);
    setStartTime(format(nextTime, 'HH:mm'));
    setEndTime(format(new Date(nextTime.getTime() + 60 * 60 * 1000), 'HH:mm'));
    
    if (isNextDay) {
      setSelectedDate(nextTime);
      setShowNextDayNotification(true);
      setTimeout(() => setShowNextDayNotification(false), 3000);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('09:00');
    setEndTime('10:00');
    setAttendees([]);
    setLocation('');
  };

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <div className="mt-1">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              dateFormat="EEEE, MMMM d, yyyy"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              customInput={
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
                  <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-white">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleNextAvailable}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            Find next available time
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Attendees
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter email and press Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const email = e.currentTarget.value.trim();
                  if (email && !attendees.includes(email)) {
                    setAttendees([...attendees, email]);
                    e.currentTarget.value = '';
                  }
                }
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="button"
              onClick={() => {
                const input = document.querySelector(
                  'input[type="email"]'
                ) as HTMLInputElement;
                const email = input.value.trim();
                if (email && !attendees.includes(email)) {
                  setAttendees([...attendees, email]);
                  input.value = '';
                }
              }}
              className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {attendees.map((email) => (
              <span
                key={email}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {email}
                <button
                  type="button"
                  onClick={() => setAttendees(attendees.filter((e) => e !== email))}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingEvent ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>

      {showNextDayNotification && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in">
          Moved to next available day
        </div>
      )}

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
    </>
  );
};