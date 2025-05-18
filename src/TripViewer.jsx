import React, { useEffect, useState, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useViewerAccessToken from "./hooks/useViewerAccessToken";
import { fetchAndSortTrips } from './components/FetchAndSortTrips';
import TripCard from './components/TripCard';
import FilterSidebar from './components/FilterSidebar';
import { toast } from 'react-hot-toast';
import { config } from "./config.js";
import { sendDebugLog } from "./utils/debugLogs";


if (typeof window !== "undefined") {
  sendDebugLog({
    type: "tripviewer-enter",
    platform: /iPhone|iPad|iPod/.test(navigator.userAgent) ? "iOS" : "other",
    width: window.innerWidth,
    ua: navigator.userAgent,
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const durationRanges = [
  { label: '1–4 days', min: 1, max: 4 },
  { label: '5–7 days', min: 5, max: 7 },
  { label: '8–14 days', min: 8, max: 14 },
  { label: '15+ days', min: 15, max: Infinity },
];

function TripViewer() {
  const { isAuthenticated, loginWithRedirect, loginWithPopup, logout, isLoading, user } = useAuth0();
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
    showFavoritesOnly: false,
  });
  const [dateBounds, setDateBounds] = useState({ min: '', max: '' });
  const [apiToken, setApiToken] = useState(null);
  const hasLoggedLocalStorage = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasLoggedLocalStorage.current) {
      hasLoggedLocalStorage.current = true;
      // Debug: Log localStorage state
      sendDebugLog({
        type: "localStorage_debug",
        keys: Object.keys(localStorage),
        hasAuth0Token: !!Object.keys(localStorage).find(key => 
          key.includes('auth0spajs') && 
          key.includes(config.auth0.clientId)
        ),
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        timestamp: new Date().toISOString()
      });
  
      if (isAuthenticated) {
        const fetchToken = async () => {
          try {
            const token = await getViewerToken();
            setApiToken(token);
          } catch (e) {
            sendDebugLog({
              type: "token_error",
              error: e.message,
              stack: e.stack,
              action: "redirecting_to_login"
            });
            loginWithRedirect();
          }
        };
      fetchToken();
    }
  }
}, [isAuthenticated, getViewerToken, loginWithRedirect]); 

  useEffect(() => {
    if (isLoading || !isAuthenticated || !apiToken || !user?.email) return;
  
    fetchUserFavorites(apiToken, user.email)
      .then(setFavorites)
      .catch((err) => console.error("❌ Failed to fetch favorites:", err));
  }, [isLoading, isAuthenticated, apiToken, user?.email]);  

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
  }, [allTrips, filters, favorites]);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 500) return;

    sendDebugLog({
      type: "mobile-metrics",
      platform: "iPhone",
      width: window.innerWidth,
      auth: isAuthenticated,
      token: !!apiToken,
      trips: filteredTrips.length,
      ua: navigator.userAgent,
    });
  }, [isAuthenticated, apiToken, filteredTrips.length]);
  
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
        
        // 💤 Wait for Auth0 propagation
        await sleep(1500);

        const refreshedFavorites = await fetchUserFavorites(apiToken, user.email);
        setFavorites(refreshedFavorites);
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

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
    if (!isLoading && !isAuthenticated) {
      if (isIOS) {
        // Special handling for iOS
        loginWithRedirect({
          authorizationParams: {
            prompt: 'login',
            response_mode: 'web_message'
          }
        });
      } else {
        loginWithRedirect();
      }
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 500;
    const triedPopup = sessionStorage.getItem("popupAttempted");
  
    if (!isLoading && !isAuthenticated && isMobile && !triedPopup) {
      console.log("📱 Trying loginWithPopup fallback on mobile");
      sessionStorage.setItem("popupAttempted", "true");
  
      loginWithPopup()
        .then(() => console.log("✅ loginWithPopup success"))
        .catch((err) => {
          console.warn("❌ loginWithPopup failed, falling back to redirect", err);
          loginWithRedirect();
        });
    }
  }, [isLoading, isAuthenticated, loginWithPopup, loginWithRedirect]);  

  useEffect(() => {
    sendDebugLog({
      type: "auth_state_change",
      isAuthenticated,
      isLoading,
      windowLocation: window.location.href,
      localStorage: Object.keys(localStorage)
    });
  }, [isAuthenticated, isLoading]);

  const [authAttempts, setAuthAttempts] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (authAttempts > 2) {
        sendDebugLog({
          type: "redirect_loop_detected",
          action: "clearing_storage_and_restarting"
        });

        // Clear only Auth0-specific keys if you want to be safer
        Object.keys(localStorage).forEach(key => {
          if (key.includes('auth0spajs')) {
            localStorage.removeItem(key);
          }
        });

        loginWithRedirect({
          authorizationParams: {
            prompt: 'login',
            response_mode: 'web_message'
          }
        });
        return;
      }
      setAuthAttempts(a => a + 1);
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, authAttempts, loginWithRedirect]);
  
  if (isLoading || !isAuthenticated || !apiToken) {
    return <div className="p-4">Authenticating...</div>;
  }  

  const totalDepartures = filteredTrips.reduce((sum, trip) => sum + trip.departures.length, 0);
  const totalCabins = filteredTrips.reduce(
    (sum, trip) => sum + trip.departures.reduce(
      (depSum, dep) => depSum + dep.categories.reduce(
        (catSum, cat) => cat.status === "Available" ? catSum + cat.num_cabins : catSum,
        0
      ), 0),
    0
  );

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
            {filteredTrips.length.toLocaleString()} Trip{filteredTrips.length !== 1 ? 's' : ''}
          </span>
          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
            {totalDepartures.toLocaleString()} Departure{totalDepartures !== 1 ? 's' : ''}
          </span>
          <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
            {totalCabins.toLocaleString()} Cabin{totalCabins !== 1 ? 's' : ''}
          </span>
          <button
            className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1 rounded"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Log out {user?.name && `(${user.name})`}
          </button>
        </div>
      </header>
      
      {typeof window !== "undefined" && window.innerWidth < 500 && (
        <div className="bg-black text-green-300 text-xs p-2 whitespace-pre overflow-auto">
          {JSON.stringify({
            isAuthenticated,
            isLoading,
            apiToken: !!apiToken,
            allTrips: allTrips.length,
            filteredTrips: filteredTrips.length,
          }, null, 2)}
        </div>
      )}

      <div className="grid grid-cols-[250px_1fr] h-[calc(100vh-56px)] overflow-hidden">
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          ships={ships}
          destinations={destinations}
          dateBounds={dateBounds}
          favoriteCount={favorites.length}
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

const fetchUserFavorites = async (token, email) => {
  try {
    const res = await fetch(`${config.apiBaseUrl}/admin-api/user?email=${encodeURIComponent(email)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch favorites");
    }

    const { data } = await res.json();
    return data?.user?.app_metadata?.favorites || [];
  } catch (err) {
    console.error("❌ Failed to fetch favorites:", err);
    return [];
  }
};
