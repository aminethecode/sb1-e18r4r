import React, { useState } from 'react';
import { format, setMonth, setYear } from 'date-fns';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar, Download } from 'lucide-react';
import { useCalendarStore } from '../../store/calendarStore';
import { downloadCalendarICS } from '../../utils/icsGenerator';

export const CalendarHeader: React.FC = () => {
  const { selectedDate, setSelectedDate, events } = useCalendarStore();
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'month' | 'year'>('month');
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const currentYear = selectedDate.getFullYear();
    return Math.floor(currentYear / 20) * 20;
  });

  const handlePrevMonth = () => setSelectedDate(setMonth(selectedDate, selectedDate.getMonth() - 1));
  const handleNextMonth = () => setSelectedDate(setMonth(selectedDate, selectedDate.getMonth() + 1));
  const handlePrevYear = () => setSelectedDate(setYear(selectedDate, selectedDate.getFullYear() - 1));
  const handleNextYear = () => setSelectedDate(setYear(selectedDate, selectedDate.getFullYear() + 1));

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const generateYearRange = (start: number) => {
    return Array.from({ length: 20 }, (_, i) => start + i);
  };

  const years = generateYearRange(yearRangeStart);

  const handleYearRangeChange = (direction: 'prev' | 'next') => {
    setYearRangeStart(prev => direction === 'prev' ? prev - 20 : prev + 20);
  };

  const handleExportCalendar = () => {
    downloadCalendarICS(events);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevYear}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            title="Previous Year"
          >
            <ChevronsLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            title="Previous Month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setShowPicker(!showPicker);
              setPickerMode('month');
            }}
            className="flex items-center gap-2 px-4 py-2 text-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Calendar className="h-5 w-5" />
            {format(selectedDate, 'MMMM yyyy')}
          </button>

          <button
            onClick={handleExportCalendar}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            title="Export Calendar"
          >
            <Download className="h-4 w-4" />
            Export to Outlook
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            title="Next Month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={handleNextYear}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            title="Next Year"
          >
            <ChevronsRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showPicker && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 w-80">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setPickerMode('month')}
              className={`px-3 py-1 rounded-md ${
                pickerMode === 'month' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Months
            </button>
            <button
              onClick={() => setPickerMode('year')}
              className={`px-3 py-1 rounded-md ${
                pickerMode === 'year' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Years
            </button>
          </div>

          {pickerMode === 'month' ? (
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => {
                    setSelectedDate(setMonth(selectedDate, index));
                    setShowPicker(false);
                  }}
                  className={`p-2 text-sm rounded-md transition-colors ${
                    selectedDate.getMonth() === index
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => handleYearRangeChange('prev')}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium">
                  {yearRangeStart} - {yearRangeStart + 19}
                </span>
                <button
                  onClick={() => handleYearRangeChange('next')}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedDate(setYear(selectedDate, year));
                      setShowPicker(false);
                    }}
                    className={`p-2 text-sm rounded-md transition-colors ${
                      selectedDate.getFullYear() === year
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};