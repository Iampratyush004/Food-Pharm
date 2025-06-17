import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { barcode } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getProductByBarcode(barcode);
        if (data.status === 1) {
          setProduct(data.product);
        } else {
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [barcode]);

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

  const formatNutritionValue = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return typeof value === 'number' ? `${value}g` : value;
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/" className="text-primary-600 hover:text-primary-700">
          ← Back to Products
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="relative">
              {product.image_front_url ? (
                <img
                  src={product.image_front_url}
                  alt={product.product_name}
                  className="w-full h-96 object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No Image Available</span>
                </div>
              )}
              
              {/* Nutrition Grade Badge */}
              {product.nutrition_grade_fr && (
                <div className={`absolute top-4 right-4 ${getNutritionGradeColor(product.nutrition_grade_fr)} text-white font-bold text-lg w-12 h-12 rounded-full flex items-center justify-center`}>
                  {product.nutrition_grade_fr.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.product_name || 'Unknown Product'}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {product.brands || 'Unknown Brand'}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                Barcode: {product.code}
              </span>
              <button
                onClick={handleAddToCart}
                className="btn-primary"
              >
                Add to Cart
              </button>
            </div>

            {/* Labels */}
            {product.labels_tags && product.labels_tags.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Labels:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.labels_tags.map((label, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {label.replace('en:', '').replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ingredients */}
          {product.ingredients_text && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Ingredients</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.ingredients_text}
              </p>
            </div>
          )}

          {/* Nutritional Information */}
          {product.nutriments && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Nutritional Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Energy (kcal)</span>
                    <span className="font-medium">
                      {product.nutriments['energy-kcal_100g'] || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fat</span>
                    <span className="font-medium">
                      {formatNutritionValue(product.nutriments.fat_100g)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturated Fat</span>
                    <span className="font-medium">
                      {formatNutritionValue(product.nutriments['saturated-fat_100g'])}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carbohydrates</span>
                    <span className="font-medium">
                      {formatNutritionValue(product.nutriments.carbohydrates_100g)}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sugars</span>
                    <span className="font-medium">
                      {formatNutritionValue(product.nutriments.sugars_100g)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fiber</span>
                    <span className="font-medium">
                      {formatNutritionValue(product.nutriments.fiber_100g)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Proteins</span>
                    <span className="font-medium">
                      {formatNutritionValue(product.nutriments.proteins_100g)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salt</span>
                    <span className="font-medium">
                      {formatNutritionValue(product.nutriments.salt_100g)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
            <div className="space-y-3">
              {product.quantity && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{product.quantity}</span>
                </div>
              )}
              {product.packaging_tags && product.packaging_tags.length > 0 && (
                <div>
                  <span className="text-gray-600">Packaging: </span>
                  <span className="font-medium">
                    {product.packaging_tags.map(tag => tag.replace('en:', '').replace(/_/g, ' ')).join(', ')}
                  </span>
                </div>
              )}
              {product.stores && (
                <div>
                  <span className="text-gray-600">Available at: </span>
                  <span className="font-medium">{product.stores}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 