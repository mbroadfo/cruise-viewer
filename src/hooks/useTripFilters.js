import { useEffect, useState, useMemo } from 'react';

const durationRanges = [
  { label: '1–4 days', min: 1, max: 4 },
  { label: '5–7 days', min: 5, max: 7 },
  { label: '8–14 days', min: 8, max: 14 },
  { label: '15+ days', min: 15, max: Infinity },
];

export default function useTripFilters(trips, favorites, dateBounds) {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minCabins: 1,
    ships: [],
    durations: [],
    destinations: [],
    showFavoritesOnly: false,
  });

  useEffect(() => {
    // When dateBounds are known, update the initial filters
    if (dateBounds.min && dateBounds.max) {
      setFilters((f) => ({
        ...f,
        startDate: f.startDate || dateBounds.min,
        endDate: f.endDate || dateBounds.max,
      }));
    }
  }, [dateBounds]);

  const filteredTrips = useMemo(() => {
    return trips
      .map((trip) => {
        const matchingDepartures = trip.departures.filter((dep) => {
          const depDate = new Date(dep.start_date);
          const endDate = new Date(dep.end_date);
          const duration = Math.floor((endDate - depDate) / (1000 * 60 * 60 * 24));
          const cabinCount = dep.categories.reduce(
            (sum, c) => (c.status === 'Available' ? sum + c.num_cabins : sum), 0);
          const matchesDuration =
            filters.durations.length === 0 ||
            filters.durations.some((label) => {
              const range = durationRanges.find((r) => r.label === label);
              return range && duration >= range.min && duration <= range.max;
            });
          const matchesFavorite =
            !filters.showFavoritesOnly || favorites.includes(new URL(dep.booking_url).searchParams.get("departure"));
          return (
            (!filters.startDate || depDate >= new Date(filters.startDate)) &&
            (!filters.endDate || depDate <= new Date(filters.endDate)) &&
            cabinCount >= filters.minCabins &&
            (filters.ships.length === 0 || filters.ships.includes(dep.ship)) &&
            matchesDuration &&
            matchesFavorite
          );
        });

        if (!matchingDepartures.length ||
          (filters.destinations.length > 0 &&
            !trip.destinations?.split('|').some((d) => filters.destinations.includes(d.trim())))) {
          return null;
        }

        return {
          ...trip,
          departures: matchingDepartures.map(dep => ({
            ...dep,
            code: new URL(dep.booking_url).searchParams.get("departure")
          }))
        };
      })
      .filter(Boolean);
  }, [trips, filters, favorites]);

  return { filteredTrips, filters, setFilters };
}
