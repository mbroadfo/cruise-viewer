import React from 'react';
import { Heart } from "lucide-react";

const durationRanges = [
  { label: '1–4 days', min: 1, max: 4 },
  { label: '5–7 days', min: 5, max: 7 },
  { label: '8–14 days', min: 8, max: 14 },
  { label: '15+ days', min: 15, max: Infinity },
];

function FilterSidebar({ filters, onFilterChange, ships, destinations, minStartDate, maxEndDate, favoriteCount }) {
  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === 'select-multiple') {
      const values = Array.from(selectedOptions).map((o) => o.value);
      onFilterChange({ ...filters, [name]: values });
    } else {
      onFilterChange({ ...filters, [name]: value });
    }
  };

  return (
    <aside className="p-4 w-60 text-xs space-y-2 overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between text-blue-600 border-b border-gray-200 pb-2 text-center">
        <button
          type="button"
          aria-label="Expand all trips and departures"
          className="w-1/3 hover:underline flex flex-col items-center"
          onClick={(e) => {
            e.preventDefault();
            document.querySelectorAll('details').forEach((el) => (el.open = true));
          }}
        >
          <span>Expand</span>
          <span>All</span>
        </button>

        <button
          type="button"
          aria-label="Collapse all trips and departures"
          className="w-1/3 hover:underline flex flex-col items-center"
          onClick={(e) => {
            e.preventDefault();
            document.querySelectorAll('details').forEach((el) => (el.open = false));
          }}
        >
          <span>Collapse</span>
          <span>All</span>
        </button>

        <button
          type="button"
          aria-label="Clear all filters"
          className="w-1/3 hover:underline flex flex-col items-center"
          onClick={(e) => {
            e.preventDefault();
            onFilterChange({
              startDate: minStartDate,
              endDate: maxEndDate,
              minCabins: 1,
              ships: [],
              durations: [],
              destinations: [],
              showFavoritesOnly: false,
            });
          }}
        >
          <span>Clear</span>
          <span>Filters</span>
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm px-2 py-1">
        <input
          type="checkbox"
          id="showFavoritesOnly"
          checked={filters.showFavoritesOnly}
          onChange={(e) =>
            onFilterChange({ ...filters, showFavoritesOnly: e.target.checked })
          }
          className="accent-red-600"
        />
        <label htmlFor="showFavoritesOnly" className="flex items-center gap-1">
          <Heart className="w-4 h-4 fill-red-600 text-red-600" />
          Show Favorites Only ({favoriteCount})
        </label>
      </div>

      <div className="space-y-0.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm px-2 py-2">
        <label className="text-xs font-medium">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
          min={minStartDate}
          max={maxEndDate}
          className="w-full border border-gray-300 rounded px-2 py-0.5 text-xs"
        />
      </div>

      <div className="space-y-0.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm px-2 py-2">
        <label className="text-xs font-medium">End Date</label>
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
          min={filters.startDate || minStartDate}
          max={maxEndDate}
          className="w-full border border-gray-300 rounded px-2 py-0.5 text-xs"
        />
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm px-2 py-2">
        <label className="block text-xs font-medium mb-1">Min Cabin Availability</label>
        <input
          type="number"
          name="minCabins"
          value={filters.minCabins}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
          min={0}
        />
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm px-2 py-2">
        <label className="block text-xs font-medium mb-1">Destinations</label>
        <select
          name="destinations"
          multiple
          value={filters.destinations}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-2 py-1 h-28 text-xs"
        >
          {(destinations || []).map((dest) => (
            <option key={dest} value={dest}>
              {dest}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm px-2 py-2">
        <label className="block text-xs font-medium mb-1">Ships</label>
        <select
          name="ships"
          multiple
          value={filters.ships}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-2 py-1 h-28 text-xs"
        >
          {(ships || []).map((ship) => (
            <option key={ship} value={ship}>
              {ship}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm px-2 py-2">
        <label className="block text-xs font-medium mb-1">Durations</label>
        <select
          name="durations"
          multiple
          value={filters.durations}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-2 py-1 h-28 text-xs"
        >
          {durationRanges.map((range) => (
            <option key={range.label} value={range.label}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}

export default FilterSidebar;
