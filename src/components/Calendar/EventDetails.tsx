import React from 'react';
import { format } from 'date-fns';
import { X, Edit2, Trash2, MapPin, Users, Clock, Download } from 'lucide-react';
import { Event } from '../../types/calendar';
import { useCalendarStore } from '../../store/calendarStore';
import { downloadICS } from '../../utils/icsGenerator';

interface EventDetailsProps {
  event: Event;
  onClose: () => void;
  onEdit: (event: Event) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose, onEdit }) => {
  const { deleteEvent } = useCalendarStore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{event.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Clock className="h-4 w-4" />
            <span>
              {format(event.start, 'MMM d, yyyy h:mm a')} -{' '}
              {format(event.end, 'h:mm a')}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <Users className="h-4 w-4 mt-1" />
              <div className="flex-1">
                {event.attendees.map((attendee) => (
                  <div key={attendee} className="text-sm">
                    {attendee}
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.description && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => downloadICS(event)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
            <button
              onClick={() => {
                deleteEvent(event.id);
                onClose();
              }}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
            <button
              onClick={() => onEdit(event)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};