import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useViewerAccessToken from "./hooks/useViewerAccessToken";
import { fetchAndSortTrips } from './components/FetchAndSortTrips';
import TripCard from './components/TripCard';
import FilterSidebar from './components/FilterSidebar';
import { toast } from 'react-hot-toast';
import { config } from "./config.js";


const durationRanges = [
  { label: '1–4 days', min: 1, max: 4 },
  { label: '5–7 days', min: 5, max: 7 },
  { label: '8–14 days', min: 8, max: 14 },
  { label: '15+ days', min: 15, max: Infinity },
];

function TripViewer() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading, user } = useAuth0();
  const getViewerToken = useViewerAccessToken();
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minCabins: 1,
    ships: [],
    durations: [],
    destinations: [],
  });
  const [dateBounds, setDateBounds] = useState({ min: '', max: '' });
  const [apiToken, setApiToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getViewerToken();
        setApiToken(token);
      } catch (e) {
        console.error("❌ Failed to fetch token:", e);
      }
    };

    if (isAuthenticated) {
      fetchToken();
    }
  }, [getViewerToken, isAuthenticated]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) loginWithRedirect();
    if (user?.app_metadata?.favorites) {
      setFavorites(user.app_metadata.favorites);
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, user]);

  useEffect(() => {
    const loadTrips = async () => {
      const trips = await fetchAndSortTrips();
      setAllTrips(trips);

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

        return {
          ...trip,
          departures: matchingDepartures.map(dep => ({
            ...dep,
            code: new URL(dep.booking_url).searchParams.get("departure")
          }))
        };
        
      })
      .filter(Boolean);

    setFilteredTrips(filtered);
  }, [allTrips, filters]);

  const handleToggleFavorite = (code) => {
    setFavorites(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code].slice(-20)
    );
    setIsDirty(true);
  };

  const [saving, setSaving] = useState(false);

  const saveFavorites = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/admin-api/user/favorites`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          email: user.email,
          favorites,
        }),
      });

      if (!response.ok) {
        setIsDirty(false);
        toast.error('Failed to save favorites.');
      } else {
        console.log("✅ Favorites saved");
        toast.success('Favorites saved!');
        const refreshedUser = await fetchUserInfo(apiToken);
        if (refreshedUser?.app_metadata?.favorites) {
          setFavorites(refreshedUser.app_metadata.favorites);
        }
      }

      setIsDirty(false);
    } catch (err) {
      console.error("💥 Error saving favorites:", err);
      alert("Failed to save favorites.");
    } finally {
      setSaving(false);
    }
  };

  const ships = [...new Set(allTrips.flatMap((t) => t.departures.map((d) => d.ship)))].sort();
  const destinations = [...new Set(allTrips.flatMap((t) => t.destinations?.split('|').map((d) => d.trim()) || []))].sort();

  if (isLoading) return <div className="p-4">Authenticating...</div>;

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
          {user?.["https://cruise-viewer.app/roles"]?.role === "admin" && (
            <a
              href="/admin"
              className="bg-green-100 hover:bg-green-200 text-green-800 text-sm px-3 py-1 rounded-full font-medium"
            >
              Administer
            </a>
          )}
          {isDirty && (
            <button
              onClick={saveFavorites}
              disabled={saving}
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Favorites"}
            </button>
          )}
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
            <TripCard
              key={i}
              trip={trip}
              index={i}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default TripViewer;

const fetchUserInfo = async (token) => {
  try {
    const response = await fetch("https://cruise-viewer-api/prod/admin-api/user/info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const result = await response.json();
    return result?.data?.user;
  } catch (err) {
    console.error("Failed to fetch updated user info:", err);
    return null;
  }
};
