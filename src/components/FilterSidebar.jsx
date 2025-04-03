import React from 'react';

const durationRanges = [
  { label: '1–4 days', min: 1, max: 4 },
  { label: '5–7 days', min: 5, max: 7 },
  { label: '8–14 days', min: 8, max: 14 },
  { label: '15+ days', min: 15, max: Infinity },
];

function FilterSidebar({ filters, onFilterChange, ships, destinations, minStartDate, maxEndDate }) {
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
    <aside className="p-4 border-r border-gray-200 bg-white w-60 text-sm space-y-6 overflow-y-auto">
      <div className="flex justify-between text-blue-600 text-xs font-medium border-b border-gray-200 pb-2">
        <button
          type="button"
          aria-label="Expand all trips and departures"
          className="hover:underline"
          onClick={(e) => {
            e.preventDefault();
            document.querySelectorAll('details').forEach((el) => (el.open = true));
          }}
        >
          Expand All
        </button>

        <button
          type="button"
          aria-label="Collapse all trips and departures"
          className="hover:underline"
          onClick={(e) => {
            e.preventDefault();
            document.querySelectorAll('details').forEach((el) => (el.open = false));
          }}
        >
          Collapse All
        </button>

        <button
          type="button"
          aria-label="Clear all filters"
          className="hover:underline"
          onClick={(e) => {
            e.preventDefault();
            onFilterChange({
              startDate: minStartDate,
              endDate: maxEndDate,
              minCabins: 1,
              ships: [],
              durations: [],
              destinations: [],
            });
          }}
        >
          Clear Filters
        </button>
      </div>

      <div>
        <label className="block font-medium mb-1">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
          min={minStartDate}
          max={maxEndDate}
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">End Date</label>
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
          min={filters.startDate || minStartDate}
          max={maxEndDate}
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Destinations</label>
        <select
          name="destinations"
          multiple
          value={filters.destinations}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-2 py-1 h-28"
        >
          {(destinations || []).map((dest) => (
            <option key={dest} value={dest}>
              {dest}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Min Cabin Availability</label>
        <input
          type="number"
          name="minCabins"
          value={filters.minCabins}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-2 py-1"
          min={0}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Ships</label>
        <select
          name="ships"
          multiple
          value={filters.ships}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-2 py-1 h-28"
        >
          {ships.map((ship) => (
            <option key={ship} value={ship}>
              {ship}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Durations</label>
        <select
          name="durations"
          multiple
          value={filters.durations}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-2 py-1 h-28"
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
