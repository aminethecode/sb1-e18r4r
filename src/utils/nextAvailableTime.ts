import { Event } from '../types/calendar';
import { addMinutes, addDays, isSameDay, setHours, setMinutes, startOfDay, isAfter } from 'date-fns';

interface AvailableSlot {
  date: Date;
  isNextDay: boolean;
}

export function findNextAvailableTime(
  date: Date,
  duration: number,
  events: Event[],
  startHour = 9,
  endHour = 17,
  maxDays = 7
): AvailableSlot {
  let currentDate = date;
  let daysChecked = 0;

  while (daysChecked < maxDays) {
    // Get events for the current day, sorted by start time
    const dayEvents = events
      .filter(event => isSameDay(event.start, currentDate))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    // Start with the default start time for the day
    let candidateTime = setMinutes(setHours(startOfDay(currentDate), startHour), 0);

    // If it's today and already past the start time, start from the current time
    const now = new Date();
    if (isSameDay(currentDate, now) && isAfter(now, candidateTime)) {
      const minutes = now.getMinutes();
      const roundedMinutes = Math.ceil(minutes / 30) * 30;
      candidateTime = setMinutes(setHours(currentDate, now.getHours()), roundedMinutes);
    }

    // Check each possible time slot during the day
    while (candidateTime.getHours() < endHour) {
      const candidateEnd = addMinutes(candidateTime, duration);
      let isSlotAvailable = true;

      // Check if this slot overlaps with any existing events
      for (const event of dayEvents) {
        if (
          (candidateTime >= event.start && candidateTime < event.end) ||
          (candidateEnd > event.start && candidateEnd <= event.end) ||
          (candidateTime <= event.start && candidateEnd >= event.end)
        ) {
          // If there's an overlap, jump to the end of this event
          candidateTime = new Date(event.end);
          isSlotAvailable = false;
          break;
        }
      }

      // If we found an available slot, return it
      if (isSlotAvailable && candidateTime.getHours() < endHour) {
        return {
          date: candidateTime,
          isNextDay: daysChecked > 0
        };
      }

      // If no slot was found, try the next 30-minute interval
      if (isSlotAvailable) {
        candidateTime = addMinutes(candidateTime, 30);
      }
    }

    // Move to the next day
    currentDate = addDays(currentDate, 1);
    daysChecked++;
  }

  // If no time found within maxDays, return the start of the next available day
  return {
    date: setHours(addDays(startOfDay(date), 1), startHour),
    isNextDay: true
  };
}