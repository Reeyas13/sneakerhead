import { createContext, useState, useContext, useCallback } from 'react';
import { productsAPI } from '../services/api';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  // Fetch products with filters
  const fetchProducts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productsAPI.getProducts(filters);
      setProducts(data.products);
      setPagination({
        page: data.page,
        pages: data.pages,
        total: data.total,
      });
      return data.products;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch featured products
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productsAPI.getProducts({ featured: true, limit: 8 });
      setFeaturedProducts(data.products);
      return data.products;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch featured products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch new arrivals
  const fetchNewArrivals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productsAPI.getProducts({ newArrival: true, limit: 8 });
      setNewArrivals(data.products);
      return data.products;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch new arrivals');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch product by ID
  const fetchProductById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productsAPI.getProductById(id);
      setProduct(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch product recommendations
  const fetchRecommendations = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productsAPI.getRecommendations(id);
      setRecommendations(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recommendations');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search products
  const searchProducts = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productsAPI.getProducts({ search: query });
      return data.products;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search products');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Create product
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productsAPI.createProduct(productData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Update product
  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await productsAPI.updateProduct(id, productData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Delete product
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await productsAPI.deleteProduct(id);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    products,
    featuredProducts,
    newArrivals,
    product,
    recommendations,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchFeaturedProducts,
    fetchNewArrivals,
    fetchProductById,
    fetchRecommendations,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
