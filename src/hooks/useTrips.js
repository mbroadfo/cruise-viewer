import { useEffect, useState } from 'react';
import { fetchAndSortTrips } from '../components/FetchAndSortTrips';

export default function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateBounds, setDateBounds] = useState({ min: '', max: '' });
  const [ships, setShips] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetchAndSortTrips()
      .then((fetchedTrips) => {
        setTrips(fetchedTrips);

        const allDates = fetchedTrips.flatMap(t =>
          t.departures.map(d => new Date(d.start_date))
        );
        const min = allDates.length ? new Date(Math.min(...allDates)) : '';
        const max = allDates.length ? new Date(Math.max(...allDates)) : '';
        const fmt = (d) => d instanceof Date && !isNaN(d) ? d.toISOString().split('T')[0] : '';
        setDateBounds({ min: fmt(min), max: fmt(max) });

        const uniqueShips = [...new Set(fetchedTrips.flatMap(t => t.departures.map(d => d.ship)))].sort();
        setShips(uniqueShips);

        const uniqueDestinations = [...new Set(
          fetchedTrips.flatMap(t => t.destinations?.split('|').map(d => d.trim()) || [])
        )].sort();
        setDestinations(uniqueDestinations);
      })
      .finally(() => setLoading(false));
  }, []);

  return { trips, loading, dateBounds, ships, destinations };
}
