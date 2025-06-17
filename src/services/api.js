const BASE_URL = 'https://world.openfoodfacts.org';

// Rate limiting protection
let requestCounts = {
  search: 0,
  product: 0,
  facet: 0
};

let isRateLimited = false;
let lastResetTime = Date.now();

const resetCounters = () => {
  requestCounts = { search: 0, product: 0, facet: 0 };
  isRateLimited = false;
  lastResetTime = Date.now();
  console.log('Rate limit counters reset');
};

// Reset counters every minute
setInterval(resetCounters, 60000);

const checkRateLimit = (type) => {
  const limits = {
    search: 10,
    product: 100,
    facet: 2
  };
  
  // Check if we're in rate limit mode
  if (isRateLimited) {
    const timeSinceReset = Date.now() - lastResetTime;
    if (timeSinceReset < 60000) {
      throw new Error(`Rate limit active. Please wait ${Math.ceil((60000 - timeSinceReset) / 1000)} seconds before trying again.`);
    } else {
      // Reset if a minute has passed
      resetCounters();
    }
  }
  
  // Check specific limits
  if (type === 'search' && requestCounts.search >= 8) {
    isRateLimited = true;
    throw new Error('Search rate limit reached (8/10). Please wait a minute before trying again.');
  }
  
  if (type === 'product' && requestCounts.product >= 80) {
    isRateLimited = true;
    throw new Error('Product rate limit reached (80/100). Please wait a minute before trying again.');
  }
  
  if (requestCounts[type] >= limits[type]) {
    isRateLimited = true;
    throw new Error(`Rate limit exceeded for ${type} requests. Please wait a minute before trying again.`);
  }
  
  requestCounts[type]++;
};

export const api = {
  // Get products by category
  getProductsByCategory: async (category, page = 1) => {
    try {
      checkRateLimit('search');
      const response = await fetch(`${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(category)}&page_size=24&page=${page}&json=true&sort_by=popularity_key`);
      
      if (!response.ok) {
        if (response.status === 429) {
          isRateLimited = true;
          throw new Error('Rate limit exceeded. Please wait a minute before trying again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      if (error.message.includes('Rate limit')) {
        throw error;
      }
      // Return empty products array instead of throwing
      return { products: [] };
    }
  },

  // Search products by name with safe rate limit fallback
  searchProducts: async (searchTerm, page = 1) => {
    try {
      // Use search API for first 8 requests, then stop
      if (requestCounts.search < 8) {
        checkRateLimit('search');
        const response = await fetch(`${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&page_size=24&page=${page}&json=true&sort_by=popularity_key`);
        
        if (!response.ok) {
          if (response.status === 429) {
            isRateLimited = true;
            throw new Error('Rate limit exceeded. Please wait a minute before trying again.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } else {
        // Stop accepting requests after 8 search requests
        isRateLimited = true;
        throw new Error('Search rate limit reached (8/10). Please wait a minute before trying again.');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      if (error.message.includes('Rate limit')) {
        throw error;
      }
      return { products: [] };
    }
  },

  // Get product details by barcode
  getProductByBarcode: async (barcode) => {
    try {
      checkRateLimit('product');
      const response = await fetch(`${BASE_URL}/api/v0/product/${barcode}.json`);
      
      if (!response.ok) {
        if (response.status === 429) {
          isRateLimited = true;
          throw new Error('Rate limit exceeded. Please wait a minute before trying again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      if (error.message.includes('Rate limit')) {
        throw error;
      }
      throw error;
    }
  },

  // Get random products for homepage - using a more reliable endpoint
  getRandomProducts: async (page = 1) => {
    try {
      checkRateLimit('search');
      
      // Try multiple endpoints to ensure we get products
      const endpoints = [
        `${BASE_URL}/cgi/search.pl?page_size=24&page=${page}&json=true&sort_by=popularity_key`,
        `${BASE_URL}/cgi/search.pl?page_size=24&page=${page}&json=true&sort_by=unique_scans_n`,
        `${BASE_URL}/cgi/search.pl?page_size=24&page=${page}&json=true&search_terms=popular`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (!response.ok) {
            if (response.status === 429) {
              isRateLimited = true;
              throw new Error('Rate limit exceeded. Please wait a minute before trying again.');
            }
            continue;
          }
          
          const data = await response.json();
          if (data.products && data.products.length > 0) {
            return data;
          }
        } catch (e) {
          if (e.message.includes('Rate limit')) {
            throw e;
          }
          console.warn('Failed to fetch from endpoint:', endpoint, e);
          continue;
        }
      }

      // Fallback: return empty products array
      return { products: [] };
    } catch (error) {
      console.error('Error fetching random products:', error);
      if (error.message.includes('Rate limit')) {
        throw error;
      }
      return { products: [] };
    }
  },

  // Get popular categories
  getPopularCategories: () => {
    return [
      'beverages',
      'dairy',
      'snacks',
      'cereals',
      'fruits',
      'vegetables',
      'meat',
      'fish',
      'bread',
      'chocolate',
      'cookies',
      'yogurts'
    ];
  },

  // Get current rate limit status
  getRateLimitStatus: () => {
    const timeSinceReset = Date.now() - lastResetTime;
    const timeRemaining = Math.max(0, 60000 - timeSinceReset);
    
    return {
      search: `${requestCounts.search}/10 per minute`,
      product: `${requestCounts.product}/100 per minute`,
      facet: `${requestCounts.facet}/2 per minute`,
      isRateLimited,
      timeRemaining: Math.ceil(timeRemaining / 1000)
    };
  },

  // Force reset rate limits (for testing)
  forceResetRateLimits: () => {
    resetCounters();
  }
}; 