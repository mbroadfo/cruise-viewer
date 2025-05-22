import React from 'react';

function Header({
  user,
  isDirty,
  saving,
  saveFavorites,
  filteredTripsCount,
  totalDepartures,
  totalCabins,
  logout,
  toggleFilters
}) {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-2 py-2 sm:p-4 shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            className="sm:hidden flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white"
            onClick={toggleFilters}
            aria-label="Toggle filters"
          >
            <img
              src="https://da389rkfiajdk.cloudfront.net/favicon.jpg"
              alt="Lindblad Cruise Finder"
              className="w-6 h-6 rounded"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-sm sm:text-xl font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap truncate">
            Lindblad Cruise Finder
          </h1>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2">
              {/* hamburger, logo, title */}
            </div>
            <div className="ml-auto">
              <button
                className="bg-black text-white hover:bg-gray-800 px-2 py-0.5 rounded"
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              >
                Log out
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end items-center gap-1 text-xs sm:text-sm">
          {user?.["https://cruise-viewer.app/roles"]?.role === "admin" && (
            <a
              href="/admin"
              className="bg-green-100 hover:bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-medium"
            >
              Administer
            </a>
          )}
          {isDirty && (
            <button
              onClick={saveFavorites}
              disabled={saving}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-medium"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          )}
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
            {filteredTripsCount.toLocaleString()} Trips
          </span>
          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
            {totalDepartures.toLocaleString()} Departures
          </span>
          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">
            {totalCabins.toLocaleString()} Cabins
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
