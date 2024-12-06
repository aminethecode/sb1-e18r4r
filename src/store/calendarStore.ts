import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalendarState, Event } from '../types/calendar';
import { addMonths, subMonths, addYears, subYears } from 'date-fns';
import { useAuthStore } from './authStore';

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      events: [],
      selectedDate: new Date(),
      setSelectedDate: (date) => set({ selectedDate: date }),
      addEvent: (event) =>
        set((state) => {
          const userId = useAuthStore.getState().user?.id;
          if (!userId) return state;
          
          return {
            events: [
              ...state.events,
              { ...event, id: crypto.randomUUID(), userId },
            ],
          };
        }),
      updateEvent: (updatedEvent) =>
        set((state) => {
          const userId = useAuthStore.getState().user?.id;
          if (!userId) return state;
          
          return {
            events: state.events.map((event) =>
              event.id === updatedEvent.id && event.userId === userId
                ? updatedEvent
                : event
            ),
          };
        }),
      deleteEvent: (id) =>
        set((state) => {
          const userId = useAuthStore.getState().user?.id;
          if (!userId) return state;
          
          return {
            events: state.events.filter(
              (event) => !(event.id === id && event.userId === userId)
            ),
          };
        }),
      navigateMonth: (direction) =>
        set((state) => ({
          selectedDate:
            direction === 'next'
              ? addMonths(state.selectedDate, 1)
              : subMonths(state.selectedDate, 1),
        })),
      navigateYear: (direction) =>
        set((state) => ({
          selectedDate:
            direction === 'next'
              ? addYears(state.selectedDate, 1)
              : subYears(state.selectedDate, 1),
        })),
    }),
    {
      name: 'calendar-storage',
      partialize: (state) => ({
        events: state.events.map(event => ({
          ...event,
          start: event.start.toISOString(),
          end: event.end.toISOString(),
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.events) {
          state.events = state.events.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }));
        }
      },
    }
  )
);