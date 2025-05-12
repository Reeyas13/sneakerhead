import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../../context/ProductContext';

const ProductList = ({ category, brand, featured, newArrival, search, limit }) => {
  const { 
    products, 
    loading, 
    error, 
    pagination,
    fetchProducts 
  } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: currentPage,
        limit: limit || 12
      };

      if (category) params.category = category;
      if (brand) params.brand = brand;
      if (featured) params.featured = featured;
      if (newArrival) params.newArrival = newArrival;
      if (search) params.search = search;

      await fetchProducts(params);
    };

    fetchData();
  }, [fetchProducts, category, brand, featured, newArrival, search, currentPage, limit]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4"><i className="fas fa-exclamation-circle text-xl"></i></div>
        <h3 className="text-lg font-semibold mb-2">Error Loading Products</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4"><i className="fas fa-search text-5xl"></i></div>
        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-10">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {[...Array(pagination.pages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show limited page numbers with ellipsis
              if (
                pageNumber === 1 ||
                pageNumber === pagination.pages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 rounded ${currentPage === pageNumber ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return <span key={pageNumber}>...</span>;
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.pages}
              className={`px-3 py-1 rounded ${currentPage === pagination.pages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductList;
