import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';

const Header = () => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localBarcode, setLocalBarcode] = useState('');
  const [searchType, setSearchType] = useState('name'); // 'name' or 'barcode'
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getCartTotal } = useCart();
  const { resetAppState } = useApp();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchType === 'name' && localSearchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(localSearchTerm.trim())}`);
    } else if (searchType === 'barcode' && localBarcode.trim()) {
      navigate(`/product/${localBarcode.trim()}`);
    }
  };

  const handleLogoClick = () => {
    // Reset all global app state
    resetAppState();
    
    // Clear URL search params
    setSearchParams({});
    
    // Clear local search inputs
    setLocalSearchTerm('');
    setLocalBarcode('');
    
    // Navigate to homepage
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo */}
          <button onClick={handleLogoClick} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🍎</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Food Pharm</h1>
              <p className="text-sm text-gray-600">Your Health, Your Choice</p>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={searchType === 'name' ? "Search products by name..." : "Enter barcode..."}
                  value={searchType === 'name' ? localSearchTerm : localBarcode}
                  onChange={(e) => searchType === 'name' ? setLocalSearchTerm(e.target.value) : setLocalBarcode(e.target.value)}
                  className="input-field pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => setSearchType('name')}
                    className={`px-2 py-1 text-xs rounded ${
                      searchType === 'name' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    Name
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType('barcode')}
                    className={`px-2 py-1 text-xs rounded ${
                      searchType === 'barcode' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    Barcode
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-primary">
                Search
              </button>
            </form>
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            {getCartTotal() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartTotal()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 