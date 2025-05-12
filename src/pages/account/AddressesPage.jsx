import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AddressesPage = () => {
  const { user, updateProfile, loading, error } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nepal',
    isDefault: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize addresses from user data
  useEffect(() => {
    if (user && user.address) {
      try {
        // If user.address is a string, try to parse it as JSON
        // If it's already an array, use it directly
        const parsedAddresses = typeof user.address === 'string' 
          ? JSON.parse(user.address) 
          : Array.isArray(user.address) 
            ? user.address 
            : [user.address];
        
        setAddresses(parsedAddresses);
      } catch (err) {
        // If parsing fails, treat the address as a single string address
        setAddresses([{ addressLine1: user.address, isDefault: true }]);
      }
    } else {
      setAddresses([]);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.addressLine1.trim()) errors.addressLine1 = 'Address line 1 is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';
    if (!formData.country.trim()) errors.country = 'Country is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        let updatedAddresses;
        
        if (currentAddress !== null) {
          // Update existing address
          updatedAddresses = [...addresses];
          updatedAddresses[currentAddress] = formData;
          
          // If this address is set as default, update other addresses
          if (formData.isDefault) {
            updatedAddresses = updatedAddresses.map((addr, index) => {
              if (index !== currentAddress) {
                return { ...addr, isDefault: false };
              }
              return addr;
            });
          }
        } else {
          // Add new address
          updatedAddresses = [...addresses, formData];
          
          // If this is the first address or is set as default, update other addresses
          if (formData.isDefault || updatedAddresses.length === 1) {
            updatedAddresses = updatedAddresses.map((addr, index) => {
              if (index !== updatedAddresses.length - 1) {
                return { ...addr, isDefault: false };
              }
              return addr;
            });
          }
        }
        
        // Update user profile with new addresses
        await updateProfile({ address: JSON.stringify(updatedAddresses) });
        
        // Update local state
        setAddresses(updatedAddresses);
        
        // Reset form and state
        setFormData({
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'Nepal',
          isDefault: false
        });
        setCurrentAddress(null);
        setShowAddForm(false);
        
        setSuccessMessage(currentAddress !== null ? 'Address updated successfully!' : 'Address added successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        // Error is handled by the AuthContext
      }
    }
  };

  const handleEdit = (index) => {
    setCurrentAddress(index);
    setFormData(addresses[index]);
    setShowAddForm(true);
  };

  const handleDelete = async (index) => {
    try {
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      
      // If we're deleting the default address, make the first remaining address the default
      if (addresses[index].isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      
      // Update user profile with new addresses
      await updateProfile({ address: JSON.stringify(updatedAddresses) });
      
      // Update local state
      setAddresses(updatedAddresses);
      
      setSuccessMessage('Address deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      // Error is handled by the AuthContext
    }
  };

  const handleCancel = () => {
    setFormData({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Nepal',
      isDefault: false
    });
    setCurrentAddress(null);
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Addresses</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition duration-300"
          >
            <i className="fas fa-plus mr-2"></i> Add New Address
          </button>
        )}
      </div>
      
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
      
      {showAddForm ? (
        <div className="bg-gray-50 p-6 rounded-md mb-6">
          <h3 className="text-lg font-medium mb-4">{currentAddress !== null ? 'Edit Address' : 'Add New Address'}</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="addressLine1" className="block text-gray-700 font-medium mb-2">Address Line 1</label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Street address, P.O. box, etc."
                />
                {formErrors.addressLine1 && <p className="text-red-500 text-sm mt-1">{formErrors.addressLine1}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="addressLine2" className="block text-gray-700 font-medium mb-2">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your city"
                />
                {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
              </div>
              
              <div>
                <label htmlFor="state" className="block text-gray-700 font-medium mb-2">State/Province (Optional)</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your state or province"
                />
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-gray-700 font-medium mb-2">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your postal code"
                />
                {formErrors.postalCode && <p className="text-red-500 text-sm mt-1">{formErrors.postalCode}</p>}
              </div>
              
              <div>
                <label htmlFor="country" className="block text-gray-700 font-medium mb-2">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${formErrors.country ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="Nepal">Nepal</option>
                  <option value="India">India</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                </select>
                {formErrors.country && <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Set as default address</span>
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white px-6 py-2 rounded-md font-medium hover:bg-primary-700 transition duration-300 disabled:bg-primary-400"
              >
                {loading ? (
                  <span className="flex items-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Saving...
                  </span>
                ) : (
                  currentAddress !== null ? 'Update Address' : 'Add Address'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-medium hover:bg-gray-300 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
      
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address, index) => (
            <div key={index} className="border rounded-md p-4 relative">
              {address.isDefault && (
                <span className="absolute top-2 right-2 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  Default
                </span>
              )}
              
              <div className="mt-4">
                <p className="mb-1">{address.addressLine1}</p>
                {address.addressLine2 && <p className="mb-1">{address.addressLine2}</p>}
                <p className="mb-1">
                  {address.city}{address.state ? `, ${address.state}` : ''} {address.postalCode}
                </p>
                <p className="mb-1">{address.country}</p>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  <i className="fas fa-edit mr-1"></i> Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <i className="fas fa-trash-alt mr-1"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showAddForm && (
          <div className="text-center py-10">
            <div className="text-gray-400 mb-4"><i className="fas fa-map-marker-alt text-5xl"></i></div>
            <h3 className="text-xl font-semibold mb-2">No Addresses Found</h3>
            <p className="text-gray-600 mb-6">You haven't added any addresses yet.</p>
          </div>
        )
      )}
    </div>
  );
};

export default AddressesPage;
