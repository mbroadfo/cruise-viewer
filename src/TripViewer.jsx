// src/TripViewer.jsx
import { useEffect, useState } from 'react';
import { fetchAndSortTrips } from './components/fetchAndSortTrips';
import TripCard from './components/TripCard';

function TripViewer() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      const trips = await fetchAndSortTrips();
      setTrips(trips);
      setLoading(false);
    };
    loadTrips();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      {trips.map((trip, i) => (
        <TripCard key={i} trip={trip} index={i} />
      ))}
    </div>
  );
}

export default TripViewer;
