import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronRight, CalendarDays, Ship } from 'lucide-react';
import CabinCategoryRow from './CabinCategoryRow';
import { Heart, HeartOff } from "lucide-react";

function DepartureRow({ departure, isFavorite, onToggleFavorite }) {
  const detailsRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const availableCats = departure.categories
    .filter(cat => cat.status === 'Available')
    .sort((a, b) => parseFloat(a.price.replace(/[$,]/g, '')) - parseFloat(b.price.replace(/[$,]/g, '')));

  if (availableCats.length === 0) return null;

  const totalAvailable = availableCats.reduce((sum, cat) => sum + cat.num_cabins, 0);

  const departureDate = new Date(departure.start_date);
  const endDate = new Date(departure.end_date);
  const today = new Date();
  const diffDays = Math.floor((departureDate - today) / (1000 * 60 * 60 * 24));
  const cruiseDuration = Math.floor((endDate - departureDate) / (1000 * 60 * 60 * 24));
  const code = new URL(departure.booking_url).searchParams.get("departure");

  const dateDisplay = departureDate.toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });

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
      className="ml-4 mb-2 border border-gray-200 rounded"
    >
      <summary className="cursor-pointer p-2 grid grid-cols-[auto_1fr_auto_auto] items-center text-sm font-semibold border-b border-gray-300 gap-4 bg-gray-50">
        {/* Chevron + Ship name (toggle only) */}
        <div className="flex items-center gap-2">
          <span className="w-4">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <span className="flex items-center gap-1 text-blue-600">
            <Ship size={14} className="text-gray-400" />
            {departure.ship}
          </span>
        </div>

        {/* Date & Countdown */}
        <div className="flex items-center justify-center gap-4 text-gray-700">
          <span className="flex items-center gap-1">
            <CalendarDays size={14} className="text-gray-400" />
            {dateDisplay} ({cruiseDuration} days)
          </span>
          <span className={daysAwayClass} title={`Departs on ${departure.start_date}`}>
            {diffDays} days away
          </span>
        </div>

        {/* See Trip link + Favorite icon (inline) */}
        <div className="flex items-center justify-end gap-2 pr-1">
          <button
            className="text-red-500 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(code);
            }}
            aria-label="Toggle favorite"
          >
            {isFavorite
              ? <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              : <Heart className="w-4 h-4" />
            }
          </button>
          <a
            href={departure.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-blue-600 hover:underline"
          >
            See Trip
          </a>
        </div>

        {/* Cabin count */}
        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs whitespace-nowrap">
          {totalAvailable} cabins available
        </span>

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
