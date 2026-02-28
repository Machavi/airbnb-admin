// ===========================================
// Create Listing Page - Add new property (FIXED)
// ===========================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccommodation } from '../services/api';

function CreateListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageInput, setImageInput] = useState('');

  // Get logged in user data for host name
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Form state with all required fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Entire apartment',
    location: '',
    host: user.username || user.name || 'Host',
    bedrooms: 1,
    bathrooms: 1,
    guests: 1,
    price: 0,
    amenities: [],
    images: [],
    weeklyDiscount: 0,
    cleaningFee: 0,
    serviceFee: 0,
    occupancyTaxes: 0,
  });

  // Available property types
  const propertyTypes = [
    'Entire apartment',
    'Private room',
    'Shared room',
    'Entire house',
    'Hotel room',
    'Unique space',
  ];

  // Available amenities list
  const amenitiesList = [
    'WiFi',
    'Kitchen',
    'Free parking',
    'Air conditioning',
    'Heating',
    'Washer',
    'Dryer',
    'TV',
    'Pool',
    'Hot tub',
    'Gym',
    'Smoke detector',
    'First aid kit',
    'Fire extinguisher',
    'Self check-in',
    'Enhanced cleaning',
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  // Handle amenity checkbox toggle
  const handleAmenityToggle = (amenity) => {
    const current = formData.amenities;
    if (current.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: current.filter((a) => a !== amenity),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...current, amenity],
      });
    }
  };

  // Add image URL to list
  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()],
      });
      setImageInput('');
    }
  };

  // Remove image from list
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  // Validate form before submission
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    if (formData.guests < 1) {
      setError('Must accommodate at least 1 guest');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await createAccommodation(formData);
      alert('Listing created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <div className="form-box">
        {/* Form Header */}
        <div className="form-header">
          <h1>Create New Listing</h1>
          <p>Fill in all the details for your property</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="listing-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>

            <div className="form-group">
              <label htmlFor="title">Property Title *</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Modern Apartment in New York"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Property Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. New York"
                />
              </div>
            </div>
          </div>

          {/* Room Details Section */}
          <div className="form-section">
            <h2 className="section-title">Room Details</h2>
            <div className="form-row three-col">
              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                  id="bedrooms"
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleNumberChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                  id="bathrooms"
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleNumberChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="guests">Guests</label>
                <input
                  id="guests"
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleNumberChange}
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="form-section">
            <h2 className="section-title">Pricing</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price per Night ($) *</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleNumberChange}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label htmlFor="weeklyDiscount">Weekly Discount (%)</label>
                <input
                  id="weeklyDiscount"
                  type="number"
                  name="weeklyDiscount"
                  value={formData.weeklyDiscount}
                  onChange={handleNumberChange}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="form-row three-col">
              <div className="form-group">
                <label htmlFor="cleaningFee">Cleaning Fee ($)</label>
                <input
                  id="cleaningFee"
                  type="number"
                  name="cleaningFee"
                  value={formData.cleaningFee}
                  onChange={handleNumberChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="serviceFee">Service Fee ($)</label>
                <input
                  id="serviceFee"
                  type="number"
                  name="serviceFee"
                  value={formData.serviceFee}
                  onChange={handleNumberChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="occupancyTaxes">Occupancy Taxes ($)</label>
                <input
                  id="occupancyTaxes"
                  type="number"
                  name="occupancyTaxes"
                  value={formData.occupancyTaxes}
                  onChange={handleNumberChange}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="form-section">
            <h2 className="section-title">Images</h2>
            <div className="image-input-row">
              <input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Paste image URL here"
                className="image-url-input"
              />
              <button type="button" onClick={handleAddImage} className="add-image-btn">
                Add Image
              </button>
            </div>
            {formData.images.length > 0 && (
              <div className="image-preview-list">
                {formData.images.map((img, index) => (
                  <div key={index} className="image-preview-item">
                    <img
                      src={img}
                      alt={'Preview ' + (index + 1)}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x80?text=Invalid';
                      }}
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => handleRemoveImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amenities Section */}
          <div className="form-section">
            <h2 className="section-title">Amenities</h2>
            <div className="amenities-grid">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;
