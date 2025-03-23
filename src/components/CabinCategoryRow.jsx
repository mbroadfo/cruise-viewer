// src/components/CabinCategoryRow.jsx
import React from 'react';

function CabinCategoryRow({ category }) {
  return (
    <div>
      {category.category_name} ({category.deck}) - {category.occupancy} - {category.cabin_type} • {category.price} • {category.status} • {category.num_cabins} cabins
    </div>
  );
}

export default CabinCategoryRow;
