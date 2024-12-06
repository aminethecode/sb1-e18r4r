import { Event } from '../types/calendar';

export function checkEventOverlap(newEvent: Omit<Event, 'id' | 'userId'>, existingEvents: Event[]): Event[] {
  return existingEvents.filter(existingEvent => {
    const newStart = new Date(newEvent.start);
    const newEnd = new Date(newEvent.end);
    const existingStart = new Date(existingEvent.start);
    const existingEnd = new Date(existingEvent.end);

    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
}