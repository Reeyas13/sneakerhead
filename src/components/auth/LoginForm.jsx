import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from URL query params (if any)
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await login(formData);
        navigate(redirect);
      } catch (err) {
        // Error is handled by the AuthContext
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Sign in to your SneakerHead account</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your email"
          />
          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-800">Forgot Password?</Link>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your password"
          />
          {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 transition duration-300 disabled:bg-primary-400"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2"></i> Signing In...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-gray-600">
          Don't have an account? 
          <Link 
            to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'} 
            className="text-primary-600 hover:text-primary-800 ml-1"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
