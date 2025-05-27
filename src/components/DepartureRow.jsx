import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronRight, CalendarDays, Ship, Heart } from 'lucide-react';
import CabinCategoryRow from './CabinCategoryRow';
import { parseShortMonthDate } from '../utils/dateUtils.js';

function DepartureRow({ departure, isFavorite, onToggleFavorite }) {
  const detailsRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const availableCats = departure.categories
    .filter(cat => cat.status === 'Available')
    .sort((a, b) => parseFloat(a.price.replace(/[$,]/g, '')) - parseFloat(b.price.replace(/[$,]/g, '')));

  if (availableCats.length === 0) return null;

  const totalAvailable = availableCats.reduce((sum, cat) => sum + cat.num_cabins, 0);

  const departureDate = parseShortMonthDate(departure.start_date);
  const endDate = parseShortMonthDate(departure.end_date);

  const today = new Date();
  const code = new URL(departure.booking_url).searchParams.get("departure");

  const diffDays = (departureDate)
    ? Math.floor((departureDate - today) / (1000 * 60 * 60 * 24))
    : '—';

  const cruiseDuration = (departureDate && endDate)
    ? Math.floor((endDate - departureDate) / (1000 * 60 * 60 * 24))
    : '—';

  const dateDisplay = departureDate
    ? departureDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Invalid date';

  const daysAwayClass = diffDays <= 30
    ? 'text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-xs'
    : 'text-gray-500';

  const handleToggle = () => {
    setIsOpen(detailsRef.current?.open);
  };

  return (
    <details
      ref={detailsRef}
      onToggle={handleToggle}
      className="ml-4 mb-2 border border-gray-200 dark:border-gray-700 rounded"
    >
      <summary className="cursor-pointer p-2 flex flex-col gap-1 text-sm font-semibold border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
        {/* Row 1: Chevron, Ship name, Heart icon, Cabins */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <span className="w-4">{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
            <Ship size={14} className="text-gray-400 dark:text-gray-300" />
            <span>{departure.ship}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs whitespace-nowrap">
              {totalAvailable} cabins available
            </span>
            <button
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 bg-transparent p-1 rounded"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(code);
              }}
              aria-label="Toggle favorite"
            >
              {isFavorite
                ? <Heart className="w-4 h-4 fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400" />
                : <Heart className="w-4 h-4 dark:text-gray-300" />}
            </button>
          </div>
        </div>

        {/* Row 2: Date, duration, days away, See Trip */}
        <div className="flex flex-wrap justify-between items-center text-gray-700 dark:text-gray-200 gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-gray-400 dark:text-gray-300" />
            <span>{dateDisplay} ({cruiseDuration} days)</span>
            <span className={daysAwayClass + " dark:bg-green-900 dark:text-green-300"} title={`Departs on ${departure.start_date}`}>
              {diffDays} days away
            </span>
          </div>
          <a
            href={departure.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            See Trip
          </a>
        </div>
      </summary>

      <div className="px-2 pb-2 space-y-1 transition-all duration-300 ease-in-out">
        {availableCats.map((cat, i) => (
          <CabinCategoryRow key={i} category={cat} />
        ))}
      </div>
    </details>
  );
}

export default DepartureRow;
