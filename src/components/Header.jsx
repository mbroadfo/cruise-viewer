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
    <header className="sticky top-0 z-10 ag-white border-b px-2 py-2 sm:p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <button
            className="sm:hidden text-gray-700 hover:text-black"
            onClick={toggleFilters}
            aria-label="Toggle filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img
            src="https://da389rkfiajdk.cloudfront.net/favicon.jpg"
            alt="Lindblad logo"
            className="w-6 h-6 rounded sm:w-8 sm:h-8"
          />
          <h1 className="text-base sm:text-xl font-semibold text-gray-800 truncate">
            Lindblad Cruise Finder
          </h1>
        </div>

        <div className="flex flex-wrap justify-start sm:justify-end items-center gap-1 sm:gap-3 text-xs sm:text-sm">
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
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-0.5 rounded disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          )}
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
            {filteredTripsCount} Trips
          </span>
          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
            {totalDepartures} Departures
          </span>
          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">
            {totalCabins} Cabins
          </span>
          <button
            className="bg-black text-white hover:bg-gray-800 px-2 py-0.5 rounded"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
