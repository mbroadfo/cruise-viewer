// src/components/DepartureRow.jsx
import React from 'react';
import CabinCategoryRow from './CabinCategoryRow';

function DepartureRow({ departure }) {
  const availableCats = departure.categories.filter(cat => cat.status === 'Available');

  return (
    <details className="ml-4 text-sm">
      <summary className="cursor-pointer font-medium">
        {departure.start_date} – {departure.end_date} • {departure.ship}
      </summary>
      <div className="ml-4 mt-1 space-y-1">
      {availableCats.map((cat, i) => (
        <CabinCategoryRow key={i} category={cat} />
        ))}
      </div>
    </details>
  );
}

export default DepartureRow;