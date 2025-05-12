import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const PasswordPage = () => {
  const { updateProfile, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

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
    
    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Send only password data
        await updateProfile({
          password: formData.newPassword,
          currentPassword: formData.currentPassword
        });
        
        // Clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setSuccessMessage('Password updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        // Error is handled by the AuthContext
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{successMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your current password"
            />
            {formErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{formErrors.currentPassword}</p>}
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your new password"
            />
            {formErrors.newPassword && <p className="text-red-500 text-sm mt-1">{formErrors.newPassword}</p>}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Confirm your new password"
            />
            {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>}
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded-md font-medium hover:bg-primary-700 transition duration-300 disabled:bg-primary-400"
          >
            {loading ? (
              <span className="flex items-center">
                <i className="fas fa-spinner fa-spin mr-2"></i> Updating...
              </span>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordPage;
