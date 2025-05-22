import React from 'react';

function CabinCategoryRow({ category }) {
  const fullPrice = category.price;
  const discountPrice = category.price.startsWith('$')
    ? `$${(parseFloat(category.price.replace(/[$,]/g, '')) * 0.05).toFixed(0)}`
    : category.price;

  const cabinNumbers = category.cabinNumbers
    ? category.cabinNumbers.split('|').join(', ')
    : '';

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_2fr_auto_auto] gap-x-4 items-center text-sm ml-4 py-0.5 border-b border-gray-200 dark:border-gray-700">
      <span className="font-semibold text-gray-900 dark:text-gray-100">{category.category_name}</span>
      <span className="text-gray-500 dark:text-gray-400 truncate">{category.deck}</span>
      <span className="text-gray-700 dark:text-gray-300">{category.occupancy}</span>
      <span className="text-gray-700 dark:text-gray-300 truncate">{cabinNumbers}</span>
      <span className="text-gray-700 dark:text-gray-300">
        {fullPrice} <span className="text-xs text-gray-400 dark:text-gray-500">({discountPrice})</span>
      </span>
      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs text-center w-fit">
        {category.num_cabins} cabins
      </span>
    </div>
  );
}

export default CabinCategoryRow;
