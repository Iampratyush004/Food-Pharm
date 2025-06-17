# Food Pharm - Food Product Explorer

A comprehensive web application that allows users to search, filter, and view detailed information about food products using the OpenFoodFacts API. Built with React, TailwindCSS, and modern web technologies.

## 🍎 Features

### Core Functionality
- **Product Search**: Search products by name or barcode
- **Category Filtering**: Filter products by popular categories (beverages, dairy, snacks, etc.)
- **Sorting Options**: Sort by product name (A-Z, Z-A) and nutrition grade (A-E, E-A)
- **Infinite Scroll**: Smooth pagination for both homepage and search results
- **Product Details**: Comprehensive product information including ingredients and nutritional values
- **Shopping Cart**: Add products to cart with quantity management

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with TailwindCSS styling
- **Loading States**: Smooth loading indicators and error handling
- **State Management**: React Context API for cart functionality
- **Navigation**: React Router for seamless page navigation

### Health & Nutrition
- **Nutrition Grades**: Visual indicators (A-E) for product health ratings
- **Detailed Nutrition Info**: Complete nutritional breakdown per 100g
- **Ingredient Lists**: Full ingredient information when available
- **Health Labels**: Display of dietary labels (vegan, gluten-free, etc.)
- **Health Tips**: Educational content to guide healthy choices

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-pharm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Build for Production

```bash
npm run build
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **API Integration**: OpenFoodFacts API
- **Build Tool**: Create React App

## 📱 API Integration

The application integrates with the OpenFoodFacts API to provide comprehensive food product data:

- **Base URL**: `https://world.openfoodfacts.org/`
- **Search Products**: `/cgi/search.pl?search_terms={name}&json=true`
- **Product Details**: `/api/v0/product/{barcode}.json`
- **Category Products**: `/cgi/search.pl?search_terms={category}&json=true`

## 🎨 Design Features

### Logo & Branding
- **Food Pharm Logo**: Apple emoji with gradient background representing health and nutrition
- **Color Scheme**: Primary blue (#0ea5e9) and green accents for health associations
- **Typography**: Clean, readable fonts with proper hierarchy

### Responsive Layout
- **Mobile First**: Optimized for mobile devices
- **Grid System**: Responsive product grid (1-4 columns based on screen size)
- **Flexible Components**: Adaptable header, filters, and product cards

## 🔧 Key Components

### Pages
- **HomePage**: Landing page with hero section, filters, and product grid
- **ProductDetail**: Comprehensive product information page
- **Cart**: Shopping cart with quantity management

### Components
- **Header**: Navigation with logo, search, and cart icon
- **ProductCard**: Individual product display with add to cart functionality
- **ProductGrid**: Infinite scroll product grid
- **Filters**: Category selection and sorting options

### Context
- **CartContext**: Global state management for shopping cart

## 🎯 User Journey

1. **Landing**: Users see a welcoming homepage with featured products
2. **Search**: Search by product name or scan barcode for specific items
3. **Browse**: Filter by categories or sort by various criteria
4. **Explore**: Click on products to view detailed nutritional information
5. **Shop**: Add items to cart and manage quantities
6. **Learn**: Access health tips and nutrition education

## 🌟 Special Features

### Smart State Management
- **Filter Collapse**: When search is performed, filters automatically collapse
- **Logo Reset**: Clicking logo returns to homepage and resets all states
- **Search Jump**: Search results immediately show without scrolling

### Performance Optimizations
- **Infinite Scroll**: Efficient pagination without page reloads
- **Image Fallbacks**: Graceful handling of missing product images
- **Error Boundaries**: Robust error handling for API failures
- **Loading States**: Smooth user experience during data fetching

## 📊 Data Handling

### Product Information
- Product name, brand, and barcode
- Product images with fallback handling
- Nutrition grades (A-E) with color coding
- Complete ingredient lists
- Detailed nutritional values per 100g
- Dietary labels and certifications

### Cart Functionality
- Add/remove products
- Quantity management
- Cart persistence across sessions
- Total item count display

## 🔒 Error Handling

- **API Failures**: Graceful degradation when OpenFoodFacts API is unavailable
- **Missing Data**: Fallback displays for incomplete product information
- **Network Issues**: User-friendly error messages and retry options
- **Invalid Barcodes**: Clear feedback for non-existent products

## 🚀 Future Enhancements

- **User Accounts**: Personal shopping lists and preferences
- **Barcode Scanner**: Camera integration for mobile barcode scanning
- **Nutrition Tracking**: Daily nutrition goals and tracking
- **Social Features**: Product reviews and ratings
- **Offline Support**: PWA capabilities for offline browsing
- **Advanced Filters**: Allergen filters, price ranges, and more

⏳ Time Taken

This project was completed in approximately **6 hours/day**, including planning, development, styling, and documentation.


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions, please open an issue in the repository.

---

**Food Pharm** - Your Health, Your Choice 🍎 
