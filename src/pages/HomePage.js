import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import RateLimitWarning from '../components/RateLimitWarning';
import { useApp } from '../context/AppContext';

const PAGE_SIZE = 24;

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Filter products that have images
const filterProductsWithImages = (products) => {
  return products.filter(product => 
    product.image_front_url && 
    product.image_front_url.trim() !== '' &&
    !product.image_front_url.includes('placeholder')
  );
};

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [allFilteredProducts, setAllFilteredProducts] = useState([]); // Store all filtered products for homepage
  const [currentIndex, setCurrentIndex] = useState(0); // Track current position in filtered products
  const topRef = useRef(null);
  
  // Use global app state
  const { 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory, 
    sortBy, 
    setSortBy 
  } = useApp();

  // Get search term from URL params and sync with global state
  useEffect(() => {
    const search = searchParams.get('search');
    if (search && search !== searchTerm) {
      setSearchTerm(search);
    }
  }, [searchParams, searchTerm, setSearchTerm]);

  // Reset state when search term changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setSelectedCategory('');
    setSortBy('name-asc');
    setError(null);
    setAllFilteredProducts([]);
    setCurrentIndex(0);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchTerm, setSelectedCategory, setSortBy]);

  // Reset state when category changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setAllFilteredProducts([]);
    setCurrentIndex(0);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedCategory]);

  // Load products
  const loadProducts = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (searchTerm) {
        data = await api.searchProducts(searchTerm, pageNum);
      } else if (selectedCategory) {
        data = await api.getProductsByCategory(selectedCategory, pageNum);
      } else {
        data = await api.getRandomProducts(pageNum);
      }

      let newProducts = data.products || [];
      
      // For homepage (no search, no category), handle image filtering and shuffling
      if (!searchTerm && !selectedCategory) {
        if (pageNum === 1) {
          // On first page, collect all products and filter them
          let allProducts = [...newProducts];
          
          // Try to get more pages to have enough products with images
          for (let i = 2; i <= 5; i++) {
            try {
              const moreData = await api.getRandomProducts(i);
              if (moreData.products && moreData.products.length > 0) {
                allProducts = [...allProducts, ...moreData.products];
              }
            } catch (e) {
              break; // Stop if we can't get more products
            }
          }
          
          // Filter and shuffle all products
          const filteredProducts = filterProductsWithImages(allProducts);
          const shuffledProducts = shuffleArray(filteredProducts);
          
          setAllFilteredProducts(shuffledProducts);
          setCurrentIndex(PAGE_SIZE);
          
          // Set initial products
          newProducts = shuffledProducts.slice(0, PAGE_SIZE);
          setHasMore(shuffledProducts.length > PAGE_SIZE);
        } else {
          // For subsequent pages, use the stored filtered products
          const startIndex = (pageNum - 1) * PAGE_SIZE;
          newProducts = allFilteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
          setHasMore(startIndex + PAGE_SIZE < allFilteredProducts.length);
        }
      } else {
        // For search and category, use normal pagination
        if (append) {
          setProducts(prev => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
        }
        
        const hasMoreProducts = newProducts.length === PAGE_SIZE;
        const hasAnyProducts = newProducts.length > 0;
        setHasMore(hasMoreProducts && hasAnyProducts);
        
        if (pageNum === 1 && newProducts.length === 0) {
          setHasMore(false);
        }
        
        return; // Exit early for search/category
      }
      
      // Handle homepage products
      if (append) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }
      
    } catch (error) {
      console.error('Error loading products:', error);
      setError(error.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, allFilteredProducts]);

  // Initial load and when search/category changes
  useEffect(() => {
    loadProducts(1, false);
  }, [loadProducts]);

  // Load more products
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage, true);
    }
  }, [loading, hasMore, page, loadProducts]);

  // Sort products
  const sortProducts = (productsToSort, sortType) => {
    const sorted = [...productsToSort];
    switch (sortType) {
      case 'name-asc':
        return sorted.sort((a, b) => 
          (a.product_name || '').localeCompare(b.product_name || '')
        );
      case 'name-desc':
        return sorted.sort((a, b) => 
          (b.product_name || '').localeCompare(a.product_name || '')
        );
      case 'nutrition-asc':
        return sorted.sort((a, b) => {
          const gradeA = a.nutrition_grade_fr || 'z';
          const gradeB = b.nutrition_grade_fr || 'z';
          return gradeA.localeCompare(gradeB);
        });
      case 'nutrition-desc':
        return sorted.sort((a, b) => {
          const gradeA = a.nutrition_grade_fr || 'z';
          const gradeB = b.nutrition_grade_fr || 'z';
          return gradeB.localeCompare(gradeA);
        });
      default:
        return sorted;
    }
  };

  const sortedProducts = sortProducts(products, sortBy);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
    setSearchParams({}); // Clear URL search params
  };

  // Handle sort change
  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  return (
    <div className="min-h-screen">
      <div ref={topRef}></div>
      
      {/* Rate Limit Warning */}
      <RateLimitWarning />
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Landing Page Hero Section (only show when no search/filter) */}
      {!searchTerm && !selectedCategory && products.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to Food Pharm 🍎
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Discover healthy food choices with detailed nutritional information
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-2xl mb-2">🔍</div>
                <p className="text-sm font-medium">Search Products</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm font-medium">Nutrition Info</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="text-2xl mb-2">🛒</div>
                <p className="text-sm font-medium">Add to Cart</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <Filters
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Products Grid */}
      <ProductGrid
        products={sortedProducts}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default HomePage; 