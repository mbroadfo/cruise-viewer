import React, { useRef, useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import DepartureRow from './DepartureRow';
import { config } from "../config.js";

function TripCard({ trip, index }) {
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
      <summary className="cursor-pointer p-3 flex justify-between items-start hover:bg-gray-100 transition">
        {/* Left: Chevron + Trip Info */}
        <div className="flex flex-1 items-start gap-2">
          <span className="mt-1">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <div>
            <span className="text-blue-700 hover:underline text-lg font-semibold">
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
          </div>
        </div>

        {/* Middle: Departure Info + See more */}
        <div className="flex flex-col items-end text-sm text-gray-600 mr-4 w-48 shrink-0">
          <div className="text-right">
            {trip.availableDepartureCount} Departure
            {trip.availableDepartureCount > 1 ? 's' : ''} • Next: {formattedDate}
          </div>
          <a
            href={trip.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            See more...
          </a>
        </div>

        {/* Right: Image */}
        {trip.image_url && (
          <img
            src={trip.image_url}
            alt={trip.trip_name}
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = config.fallbackImage;
            }}
            className="w-32 h-20 object-cover rounded shrink-0"
          />
        )}
      </summary>

      <div className="mt-2 mb-4 px-4">
        {trip.departures.map((departure, i) => (
          <DepartureRow key={i} departure={departure} />
        ))}
      </div>
    </details>
  );
}

export default TripCard;
