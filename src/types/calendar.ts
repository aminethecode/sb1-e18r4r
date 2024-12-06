export interface Event {
  id: string;
  userId: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  attendees?: string[];
  location?: string;
}

export interface CalendarState {
  events: Event[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  addEvent: (event: Omit<Event, 'id' | 'userId'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  navigateMonth: (direction: 'prev' | 'next') => void;
  navigateYear: (direction: 'prev' | 'next') => void;
}