import React from 'react';
import { api } from '../services/api';

const Filters = ({ 
  selectedCategory, 
  onCategoryChange, 
  sortBy, 
  onSortChange,
  searchTerm,
  onSearchChange 
}) => {
  const popularCategories = api.getPopularCategories();

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      onCategoryChange('');
    } else {
      onCategoryChange(category);
    }
  };

  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Search Term Display */}
      {searchTerm && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Search results for:</span> "{searchTerm}"
          </p>
        </div>
      )}

      {/* Popular Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Popular Categories</h3>
        <div className="flex flex-wrap gap-2">
          {popularCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Sort By</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSortChange('name-asc')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              sortBy === 'name-asc'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Name (A-Z)
          </button>
          <button
            onClick={() => onSortChange('name-desc')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              sortBy === 'name-desc'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Name (Z-A)
          </button>
          <button
            onClick={() => onSortChange('nutrition-asc')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              sortBy === 'nutrition-asc'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Nutrition Grade (A-E)
          </button>
          <button
            onClick={() => onSortChange('nutrition-desc')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              sortBy === 'nutrition-desc'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Nutrition Grade (E-A)
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory || sortBy !== 'name-asc') && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                Category: {selectedCategory}
              </span>
            )}
            {sortBy !== 'name-asc' && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Sort: {sortBy}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters; 