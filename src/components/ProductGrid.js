import React, { useEffect, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, hasMore, onLoadMore }) => {
  const observer = useRef();
  const lastProductRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    }, {
      rootMargin: '100px', // Start loading 100px before the element is visible
      threshold: 0.1
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => {
        if (products.length === index + 1) {
          return (
            <div key={product.code} ref={lastProductRef}>
              <ProductCard product={product} />
            </div>
          );
        } else {
          return <ProductCard key={product.code} product={product} />;
        }
      })}
      
      {loading && (
        <div className="col-span-full flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
      
      {/* Show message when no more products */}
      {!hasMore && products.length > 0 && !loading && (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">No more products to load</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid; 