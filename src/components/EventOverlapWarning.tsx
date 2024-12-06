import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Event } from '../types/calendar';
import { format } from 'date-fns';

interface EventOverlapWarningProps {
  overlappingEvents: Event[];
  onClose: () => void;
  onProceed: () => void;
}

export const EventOverlapWarning: React.FC<EventOverlapWarningProps> = ({
  overlappingEvents,
  onClose,
  onProceed,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-yellow-500">
            <AlertTriangle className="h-6 w-6" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Time Conflict Detected
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            This event overlaps with the following existing events:
          </p>
          <ul className="space-y-2">
            {overlappingEvents.map((event) => (
              <li
                key={event.id}
                className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-md"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {event.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {format(event.start, 'MMM d, yyyy h:mm a')} -{' '}
                  {format(event.end, 'h:mm a')}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-md"
          >
            Schedule Anyway
          </button>
        </div>
      </div>
    </div>
  );
};