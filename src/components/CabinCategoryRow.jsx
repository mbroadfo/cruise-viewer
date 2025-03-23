// src/components/CabinCategoryRow.jsx
import React from 'react';

function CabinCategoryRow({ category }) {
  const fullPrice = category.price;
  const discountPrice = category.price.startsWith('$')
    ? `$${(parseFloat(category.price.replace(/[$,]/g, '')) * 0.05).toFixed(0)}`
    : category.price;

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto_auto] gap-x-4 items-center text-sm ml-4 py-0.5 border-b border-gray-200">
      <span className="font-semibold">{category.category_name}</span>
      <span className="text-gray-500 truncate">{category.deck}</span>
      <span className="text-gray-700">{category.occupancy}</span>
      <span className="text-gray-700">{category.cabin_type}</span>
      <span className="text-gray-700">
        {fullPrice} <span className="text-xs text-gray-400">({discountPrice})</span>
      </span>
      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs text-center w-fit">{category.num_cabins} cabins</span>
    </div>
  );
}

export default CabinCategoryRow;
