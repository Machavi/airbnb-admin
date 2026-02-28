// ===========================================
// Dashboard Page - View all property listings
// ===========================================
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAccommodations, deleteAccommodation } from '../services/api';

function Dashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  // Fetch all listings on page load
  useEffect(() => {
    fetchListings();
  }, []);

  // Function to fetch all accommodations
  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAccommodations();
      setListings(res.data);
    } catch (err) {
      setError('Failed to fetch listings. Please try again.');
      console.error('Error fetching listings:', err);
    }
    setLoading(false);
  };

  // Handle delete listing
  const handleDelete = async (id, title) => {
    // Confirm before deleting
    const confirmed = window.confirm(
      'Are you sure you want to delete "' + title + '"? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      await deleteAccommodation(id);
      setSuccessMsg('"' + title + '" has been deleted successfully.');
      // Remove from local state
      setListings(listings.filter((listing) => listing._id !== id));
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete listing.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Property Listings</h1>
          <p className="listing-count">{listings.length} listing{listings.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link to="/create-listing" className="create-btn">
          + Create New Listing
        </Link>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="success-message">{successMsg}</div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">!</span>
          {error}
        </div>
      )}

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="no-listings">
          <h2>No listings yet</h2>
          <p>Create your first property listing to get started.</p>
          <Link to="/create-listing" className="create-btn">
            + Create New Listing
          </Link>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((listing) => (
            <div key={listing._id} className="listing-card">
              {/* Listing Image */}
              <div className="listing-image">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="no-image">No Image Available</div>
                )}
                <span className="listing-type">{listing.type || 'Property'}</span>
              </div>

              {/* Listing Details */}
              <div className="listing-details">
                <h3 className="listing-title">{listing.title}</h3>
                <p className="listing-location">{listing.location}</p>
                <div className="listing-info">
                  <span>{listing.bedrooms || 0} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
                  <span className="dot">·</span>
                  <span>{listing.bathrooms || 0} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
                  <span className="dot">·</span>
                  <span>{listing.guests || 0} guest{listing.guests !== 1 ? 's' : ''}</span>
                </div>
                <p className="listing-price">
                  <span className="price-amount">${listing.price}</span> / night
                </p>
              </div>

              {/* Action Buttons */}
              <div className="listing-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate('/update-listing/' + listing._id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(listing._id, listing.title)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
