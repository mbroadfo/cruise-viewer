import React, { useRef, useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import DepartureRow from './DepartureRow';
import { config } from "../config.js";

function TripCard({ trip, index, favorites, onToggleFavorite }) {
  const detailsRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = new Date(trip.earliestDepartureDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleToggle = () => {
    setIsOpen(detailsRef.current?.open);
  };

  const tags = [...new Set(trip.destinations?.split('|').filter(Boolean))];

  return (
    <details
      ref={detailsRef}
      onToggle={handleToggle}
      className={`rounded border ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} shadow-sm mb-3`}
    >
      <summary className="cursor-pointer pt-2 pb-2 px-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 hover:bg-gray-100 transition">
        {/* Chevron */}
        <span className="mt-1 sm:mt-0" aria-hidden="true">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>

        {/* Trip Info */}
        <div className="flex-1">
          <span className="text-blue-700 hover:underline text-base sm:text-lg font-medium block">
            {trip.trip_name}
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-1 text-sm text-gray-600">
            {trip.availableDepartureCount} Departure
            {trip.availableDepartureCount > 1 ? 's' : ''} • Next: {formattedDate}
          </div>
          <a
            href={trip.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline mt-1 block"
            onClick={(e) => e.stopPropagation()}
          >
            See more...
          </a>
        </div>

        {/* Image */}
        {trip.image_url && (
          <img
            src={trip.image_url}
            alt={trip.trip_name}
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = config.fallbackImage;
            }}
            className="w-full sm:w-32 h-28 sm:h-20 object-cover rounded mt-2 sm:mt-0"
          />
        )}
      </summary>

      <div className="mt-2 mb-4 px-4">
        {trip.departures.map((departure, i) => (
          <DepartureRow
            key={i}
            departure={departure}
            isFavorite={favorites.includes(departure.code)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </details>
  );
}

export default TripCard;
