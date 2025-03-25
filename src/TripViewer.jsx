import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchAndSortTrips } from './components/FetchAndSortTrips';
import TripCard from './components/TripCard';
import FilterSidebar from './components/FilterSidebar';
import { useEffect, useState } from 'react';

const durationRanges = [
  { label: '1–4 days', min: 1, max: 4 },
  { label: '5–7 days', min: 5, max: 7 },
  { label: '8–14 days', min: 8, max: 14 },
  { label: '15+ days', min: 15, max: Infinity },
];

function TripViewer() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading, user } = useAuth0();
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minCabins: 1,
    ships: [],
    durations: [],
    destinations: [],
  });
  const [dateBounds, setDateBounds] = useState({ min: '', max: '' });

  useEffect(() => {
    console.log("Auth check:", {
      isLoading,
      isAuthenticated,
      user
    });
  
    if (isLoading) return;
  
    if (!isAuthenticated) {
      console.log("🔁 Triggering login redirect...");
      //debugger; // <- Execution will pause here in dev tools
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, user]);  

  useEffect(() => {
    const loadTrips = async () => {
      const trips = await fetchAndSortTrips();
      setAllTrips(trips);

      // Compute min/max dates for bounds
      const allDates = trips.flatMap((t) => t.departures.map((d) => new Date(d.start_date)));
      const min = allDates.length ? new Date(Math.min(...allDates)) : '';
      const max = allDates.length ? new Date(Math.max(...allDates)) : '';
      const fmt = (d) => d.toISOString().split('T')[0];

      setFilters((f) => ({ ...f, startDate: fmt(min), endDate: fmt(max) }));
      setDateBounds({ min: fmt(min), max: fmt(max) });
    };
    loadTrips();
  }, []);

  useEffect(() => {
    if (!allTrips.length) return;

    const filtered = allTrips
      .map((trip) => {
        const matchingDepartures = trip.departures.filter((dep) => {
          const depDate = new Date(dep.start_date);
          const endDate = new Date(dep.end_date);
          const duration = Math.floor((endDate - depDate) / (1000 * 60 * 60 * 24));
          const cabinCount = dep.categories.reduce(
            (sum, c) => (c.status === 'Available' ? sum + c.num_cabins : sum),
            0
          );

          const matchesDuration =
            filters.durations.length === 0 ||
            filters.durations.some((label) => {
              const range = durationRanges.find((r) => r.label === label);
              return range && duration >= range.min && duration <= range.max;
            });

          return (
            (!filters.startDate || depDate >= new Date(filters.startDate)) &&
            (!filters.endDate || depDate <= new Date(filters.endDate)) &&
            cabinCount >= filters.minCabins &&
            (filters.ships.length === 0 || filters.ships.includes(dep.ship)) &&
            matchesDuration
          );
        });

        if (
          !matchingDepartures.length ||
          (filters.destinations.length > 0 &&
            !trip.destinations?.split('|').some((d) => filters.destinations.includes(d.trim())))
        ) {
          return null;
        }

        return { ...trip, departures: matchingDepartures };
      })
      .filter(Boolean);

    setFilteredTrips(filtered);
  }, [allTrips, filters]);

  const ships = [...new Set(allTrips.flatMap((t) => t.departures.map((d) => d.ship)))].sort();
  const destinations = [...new Set(allTrips.flatMap((t) => t.destinations?.split('|').map((d) => d.trim()) || []))].sort();

  // Handle loading state from Auth0
  if (isLoading) return <div className="p-4">Loading authentication...</div>;

  // If not logged in, redirect immediately
  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="https://da389rkfiajdk.cloudfront.net/favicon.jpg"
            alt="Lindblad logo"
            className="w-8 h-8 rounded"
          />
          <h1 className="text-xl font-bold text-gray-800">
            Lindblad Cruise Availability Finder
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
            {filteredTrips.length} Trip{filteredTrips.length !== 1 ? 's' : ''} found
          </span>
          <button
            className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Log out {user?.name && `(${user.name})`}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-[250px_1fr] h-[calc(100vh-56px)] overflow-hidden">
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          ships={ships}
          destinations={destinations}
          dateBounds={dateBounds}
        />
        <div className="p-4 space-y-4 overflow-y-auto">
          {filteredTrips.map((trip, i) => (
            <TripCard key={i} trip={trip} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}

export default TripViewer;
