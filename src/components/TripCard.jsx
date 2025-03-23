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

  return (
    <details
      ref={detailsRef}
      onToggle={handleToggle}
      className={`rounded border ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} shadow-sm mb-3`}
    >
      <summary className="cursor-pointer p-3 flex items-center justify-between hover:bg-gray-100 transition">
        <div className="flex items-center gap-2">
          <span className="w-4">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <a
            href={trip.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline text-lg font-semibold"
            onClick={(e) => e.stopPropagation()} // Prevent collapse on link click
          >
            {trip.trip_name}
          </a>
        </div>
        <div className="text-sm text-gray-600 text-right">
          {trip.availableDepartureCount} Departure{trip.availableDepartureCount > 1 ? 's' : ''} • Next: {formattedDate}
        </div>
      </summary>

      <div className="mt-2 mb-4">
        {trip.departures.map((departure, i) => (
          <DepartureRow key={i} departure={departure} />
        ))}
      </div>
    </details>
  );
}

export default TripCard;
