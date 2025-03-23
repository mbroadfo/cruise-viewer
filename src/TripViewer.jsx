// src/TripViewer.jsx
import { useEffect, useState } from 'react';

function TripViewer() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      const res = await fetch('https://mytripdata8675309.s3.amazonaws.com/trip_list.json');
      const rawTrips = await res.json();

      const enrichedTrips = rawTrips.map((trip, tripIndex) => {
        const availableDepartures = trip.departures.filter(dep =>
          dep.categories.some(cat => cat.status === 'Available')
        );

        const earliestDepartureDate = availableDepartures
          .map(dep => new Date(dep.start_date))
          .sort((a, b) => a - b)[0];

        return {
          ...trip,
          tripIndex,
          availableDepartureCount: availableDepartures.length,
          earliestDepartureDate,
        };
      }).sort((a, b) => {
        const aHasDepartures = a.availableDepartureCount > 0;
        const bHasDepartures = b.availableDepartureCount > 0;

        // Sort fully booked trips to the bottom
        if (aHasDepartures !== bHasDepartures) {
          return aHasDepartures ? -1 : 1;
        }

        if (a.earliestDepartureDate && b.earliestDepartureDate) {
          return new Date(a.earliestDepartureDate) - new Date(b.earliestDepartureDate);
        }
        return 0;
      });

      setTrips(enrichedTrips);
      setLoading(false);
    };

    fetchTrips();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      {trips.map((trip, i) => {
        const isEven = i % 2 === 0;
        const hasAvailability = trip.availableDepartureCount > 0;
        const cardStyle = hasAvailability
          ? isEven
            ? 'bg-white'
            : 'bg-gray-100'
          : 'bg-gray-200';

        return (
          <details key={i} className={`${cardStyle} shadow rounded p-4`}>
            <summary className="cursor-pointer text-xl font-semibold">
              {trip.trip_name} - {trip.availableDepartureCount} Departures - Next Departure: {trip.earliestDepartureDate ? new Date(trip.earliestDepartureDate).toLocaleDateString() : 'N/A'}
            </summary>
            <div className="mt-4 space-y-2">
              {trip.departures.map((dep, j) => {
                const availableCats = dep.categories.filter(cat => cat.status === 'Available');
                return (
                  <details key={j} className="ml-4 text-sm">
                    <summary className="cursor-pointer font-medium">
                      {dep.start_date} – {dep.end_date} • {dep.ship}
                    </summary>
                    <div className="ml-4 mt-1 space-y-1">
                      {availableCats.map((cat, k) => (
                        <div key={k}>
                          {cat.category_name} ({cat.deck}) - {cat.occupancy} - {cat.cabin_type} • {cat.price} • {cat.status} • {cat.num_cabins} cabins
                        </div>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}

export default TripViewer;
