import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetails from '../components/products/ProductDetails';

const ProductDetailPage = () => {
  const { id } = useParams();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return <ProductDetails />;
};

export default ProductDetailPage;
