import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import useViewerAccessToken from './hooks/useViewerAccessToken';
import useTrips from './hooks/useTrips';
import { useFavorites } from './hooks/useFavorites';
import useTripFilters from './hooks/useTripFilters';
import TripCard from './components/TripCard';
import FilterSidebar from './components/FilterSidebar';
import Header from './components/Header';

function TripViewer() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout
  } = useAuth();

  const getViewerToken = useViewerAccessToken();
  const [apiToken, setApiToken] = useState(null);
  const hasLoggedLocalStorage = useRef(false);
  const { trips, dateBounds, ships, destinations } = useTrips();
  const { favorites, toggleFavorite, saveFavorites, isDirty, setIsDirty, saving, setFavorites } = useFavorites(user, apiToken);
  const { filteredTrips, filters, setFilters } = useTripFilters(trips, favorites, dateBounds);

  // Mobile state management
  const [showFilters, setShowFilters] = useState(false);

  // Mobile state management
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 640;
      if (!isMobile) {
        setShowFilters(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  useEffect(() => {
    if (isAuthenticated && !hasLoggedLocalStorage.current) {
      hasLoggedLocalStorage.current = true;
      const fetchToken = async () => {
        try {
          const token = await getViewerToken();
          setApiToken(token);
        } catch {
          loginWithRedirect();
        }
      };
      fetchToken();
    }
  }, [isAuthenticated, getViewerToken, loginWithRedirect]);

  const totalDepartures = useMemo(
    () => filteredTrips.reduce((sum, trip) => sum + trip.departures.length, 0),
    [filteredTrips]
  );

  const totalCabins = useMemo(
    () =>
      filteredTrips.reduce(
        (sum, trip) =>
          sum +
          trip.departures.reduce(
            (depSum, dep) =>
              depSum +
              dep.categories.reduce(
                (catSum, cat) => (cat.status === 'Available' ? catSum + cat.num_cabins : catSum),
                0
              ),
            0
          ),
        0
      ),
    [filteredTrips]
  );

  if (isLoading || !isAuthenticated || !apiToken) {
    return <div className="p-4">Authenticating...</div>;
  }

  return (
    <>
      <Header
        user={user}
        isDirty={isDirty}
        saving={saving}
        saveFavorites={() => saveFavorites(apiToken, user.email, favorites, setFavorites, setIsDirty)}
        filteredTripsCount={filteredTrips.length}
        totalDepartures={totalDepartures}
        totalCabins={totalCabins}
        logout={logout}
        toggleFilters={toggleFilters}
      />

      <div
        className="grid h-[calc(100vh-56px)] overflow-hidden"
        style={{ gridTemplateColumns: showFilters ? '250px 1fr' : '1fr' }}
      >
        {showFilters && (
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            ships={ships}
            destinations={destinations}
            dateBounds={dateBounds}
            favoriteCount={favorites.length}
          />
        )}
        <div className="p-2 sm:p-4 space-y-4 overflow-y-auto">
          {filteredTrips.map((trip, i) => (
            <TripCard
              key={i}
              trip={trip}
              index={i}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default TripViewer;
