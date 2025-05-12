import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductList from '../components/products/ProductList';

const ProductsPage = () => {
  const location = useLocation();
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });
  const [activeFilters, setActiveFilters] = useState({});

  // Parse query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newFilters = {};
    const newActiveFilters = {};

    // Extract filters from URL
    if (queryParams.has('category')) {
      newFilters.category = queryParams.get('category');
      newActiveFilters.category = queryParams.get('category');
    }
    
    if (queryParams.has('brand')) {
      newFilters.brand = queryParams.get('brand');
      newActiveFilters.brand = queryParams.get('brand');
    }
    
    if (queryParams.has('minPrice')) {
      newFilters.minPrice = queryParams.get('minPrice');
      newActiveFilters.minPrice = queryParams.get('minPrice');
    }
    
    if (queryParams.has('maxPrice')) {
      newFilters.maxPrice = queryParams.get('maxPrice');
      newActiveFilters.maxPrice = queryParams.get('maxPrice');
    }
    
    if (queryParams.has('sort')) {
      newFilters.sort = queryParams.get('sort');
    }
    
    if (queryParams.has('search')) {
      newFilters.search = queryParams.get('search');
      newActiveFilters.search = queryParams.get('search');
    }

    if (queryParams.has('featured') && queryParams.get('featured') === 'true') {
      newFilters.featured = true;
      newActiveFilters.featured = true;
    }

    if (queryParams.has('newArrival') && queryParams.get('newArrival') === 'true') {
      newFilters.newArrival = true;
      newActiveFilters.newArrival = true;
    }

    setFilters(prev => ({ ...prev, ...newFilters }));
    setActiveFilters(newActiveFilters);
  }, [location.search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.set('category', filters.category);
    if (filters.brand) queryParams.set('brand', filters.brand);
    if (filters.minPrice) queryParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice);
    if (filters.sort) queryParams.set('sort', filters.sort);
    if (filters.search) queryParams.set('search', filters.search);
    if (filters.featured) queryParams.set('featured', 'true');
    if (filters.newArrival) queryParams.set('newArrival', 'true');
    
    window.history.pushState({}, '', `${window.location.pathname}?${queryParams.toString()}`);
    
    // Update active filters
    const newActiveFilters = {};
    if (filters.category) newActiveFilters.category = filters.category;
    if (filters.brand) newActiveFilters.brand = filters.brand;
    if (filters.minPrice) newActiveFilters.minPrice = filters.minPrice;
    if (filters.maxPrice) newActiveFilters.maxPrice = filters.maxPrice;
    if (filters.search) newActiveFilters.search = filters.search;
    if (filters.featured) newActiveFilters.featured = true;
    if (filters.newArrival) newActiveFilters.newArrival = true;
    
    setActiveFilters(newActiveFilters);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      search: ''
    });
    
    window.history.pushState({}, '', window.location.pathname);
    setActiveFilters({});
  };

  const removeFilter = (filterName) => {
    const newFilters = { ...filters };
    delete newFilters[filterName];
    setFilters(newFilters);
    
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete(filterName);
    window.history.pushState({}, '', `${window.location.pathname}?${queryParams.toString()}`);
    
    const newActiveFilters = { ...activeFilters };
    delete newActiveFilters[filterName];
    setActiveFilters(newActiveFilters);
  };

  // Determine page title based on filters
  const getPageTitle = () => {
    if (activeFilters.search) {
      return `Search Results for "${activeFilters.search}"`;
    } else if (activeFilters.category) {
      return `${activeFilters.category} Sneakers`;
    } else if (activeFilters.brand) {
      return `${activeFilters.brand} Sneakers`;
    } else if (activeFilters.featured) {
      return 'Featured Sneakers';
    } else if (activeFilters.newArrival) {
      return 'New Arrivals';
    } else {
      return 'All Sneakers';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{getPageTitle()}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Category</h3>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                <option value="Running">Running</option>
                <option value="Basketball">Basketball</option>
                <option value="Casual">Casual</option>
                <option value="Skate">Skate</option>
              </select>
            </div>
            
            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Brand</h3>
              <select
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Brands</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Jordan">Jordan</option>
                <option value="Puma">Puma</option>
                <option value="New Balance">New Balance</option>
                <option value="Vans">Vans</option>
                <option value="Converse">Converse</option>
                <option value="Reebok">Reebok</option>
                <option value="Asics">Asics</option>
                <option value="Under Armour">Under Armour</option>
              </select>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handlePriceChange}
                  className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="0"
                />
                <span>to</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handlePriceChange}
                  className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="0"
                />
              </div>
            </div>
            
            {/* Special Filters */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Special</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={!!filters.featured}
                    onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.checked }))} 
                    className="mr-2"
                  />
                  Featured Products
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="newArrival"
                    checked={!!filters.newArrival}
                    onChange={(e) => setFilters(prev => ({ ...prev, newArrival: e.target.checked }))} 
                    className="mr-2"
                  />
                  New Arrivals
                </label>
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={applyFilters}
                className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition duration-300 flex-grow"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        
        {/* Products Area */}
        <div className="lg:w-3/4">
          {/* Active Filters */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Active Filters:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(activeFilters).map(([key, value]) => (
                  <span 
                    key={key} 
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center"
                  >
                    {key === 'minPrice' ? `Min $${value}` : 
                     key === 'maxPrice' ? `Max $${value}` : 
                     key === 'featured' ? 'Featured' : 
                     key === 'newArrival' ? 'New Arrival' : 
                     `${key}: ${value}`}
                    <button 
                      onClick={() => removeFilter(key)}
                      className="ml-2 text-gray-600 hover:text-gray-900"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))}
                <button 
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium ml-2"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
          
          {/* Sort Options */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-600">
              {/* Product count will be shown by the ProductList component */}
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Sort by:</span>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
          
          {/* Product List */}
          <ProductList 
            category={filters.category} 
            brand={filters.brand} 
            featured={filters.featured} 
            newArrival={filters.newArrival} 
            search={filters.search}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
