// src/components/Debug/SearchDebug.jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchDebug = () => {
  const [searchParams] = useSearchParams();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50">
      <div>Search Params Debug:</div>
      <div>Search: "{searchParams.get('search')}"</div>
      <div>Category: "{searchParams.get('category')}"</div>
      <div>All Params: {Array.from(searchParams.entries()).map(([key, value]) => 
        `${key}=${value}`
      ).join(', ')}</div>
    </div>
  );
};

export default SearchDebug;