// src/components/TripCard.jsx
import React from 'react';
import DepartureRow from './DepartureRow';

function TripCard({ trip, index }) {
  const isEven = index % 2 === 0;
  const hasAvailability = trip.availableDepartureCount > 0;
  const cardStyle = hasAvailability
    ? isEven
      ? 'bg-white'
      : 'bg-gray-100'
    : 'bg-gray-200';

  return (
    <details className={`${cardStyle} shadow rounded p-4`}>
      <summary className="cursor-pointer text-xl font-semibold">
        {trip.trip_name} - {trip.availableDepartureCount} Departures - Next Departure: {trip.earliestDepartureDate ? new Date(trip.earliestDepartureDate).toLocaleDateString() : 'N/A'}
      </summary>
      <div className="mt-4 space-y-2">
      {trip.departures.map((dep, j) => (
        <DepartureRow key={j} departure={dep} />
    ))}
      </div>
    </details>
  );
}

export default TripCard;