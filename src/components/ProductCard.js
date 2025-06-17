import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const getNutritionGradeColor = (grade) => {
    const colors = {
      'a': 'bg-green-500',
      'b': 'bg-green-400',
      'c': 'bg-yellow-400',
      'd': 'bg-orange-400',
      'e': 'bg-red-400'
    };
    return colors[grade?.toLowerCase()] || 'bg-gray-400';
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.code}`} className="block">
      <div className="card h-full flex flex-col">
        {/* Product Image */}
        <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
          {product.image_front_url ? (
            <img
              src={product.image_front_url}
              alt={product.product_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          
          {/* Nutrition Grade Badge */}
          {product.nutrition_grade_fr && (
            <div className={`absolute top-2 right-2 ${getNutritionGradeColor(product.nutrition_grade_fr)} text-white font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center`}>
              {product.nutrition_grade_fr.toUpperCase()}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.product_name || 'Unknown Product'}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">
            {product.brands || 'Unknown Brand'}
          </p>

          {/* Category */}
          {product.categories_tags && product.categories_tags.length > 0 && (
            <p className="text-xs text-gray-500 mb-3">
              {product.categories_tags[0].replace('en:', '').replace(/_/g, ' ')}
            </p>
          )}

          {/* Ingredients Preview */}
          {product.ingredients_text && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {product.ingredients_text.substring(0, 100)}...
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-auto flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 btn-primary text-sm py-1"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 