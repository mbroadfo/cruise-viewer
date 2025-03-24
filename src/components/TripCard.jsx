import React, { useRef, useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import DepartureRow from './DepartureRow';

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
      <summary className="cursor-pointer p-3 flex items-center justify-between hover:bg-gray-100 transition">
        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
          <div className="flex items-center gap-2 flex-1">
            <span className="w-4">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
            <div className="flex flex-col">
              <a
                href={trip.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline text-lg font-semibold"
                onClick={(e) => e.stopPropagation()}
              >
                {trip.trip_name}
              </a>
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

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 text-right">
              {trip.availableDepartureCount} Departure
              {trip.availableDepartureCount > 1 ? 's' : ''} • Next: {formattedDate}
            </div>
            {trip.image_url && (
              <img
                src={trip.image_url}
                alt={trip.trip_name}
                className="w-32 h-20 object-cover rounded hidden md:block"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
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
