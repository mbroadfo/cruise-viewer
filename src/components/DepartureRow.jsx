// src/components/DepartureRow.jsx
import React from 'react';
import CabinCategoryRow from './CabinCategoryRow';

function DepartureRow({ departure }) {
  const availableCats = departure.categories.filter(cat => cat.status === 'Available');
  const totalAvailable = availableCats.reduce((sum, cat) => sum + cat.num_cabins, 0);

  if (availableCats.length === 0) return null;

  return (
    <details className="ml-4 text-sm">
      <summary className="cursor-pointer font-medium">
        {departure.start_date} – {departure.end_date} • {departure.ship} • {totalAvailable} cabins available
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
