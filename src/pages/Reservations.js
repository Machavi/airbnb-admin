// ===========================================
// Reservations Page - View and manage bookings
// ===========================================
import React, { useState, useEffect } from 'react';
import { getUserReservations, getHostReservations, deleteReservation } from '../services/api';

function Reservations() {
  const [userReservations, setUserReservations] = useState([]);
  const [hostReservations, setHostReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('user');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch reservations on page load
  useEffect(() => {
    fetchReservations();
  }, []);

  // Function to fetch all reservations
  const fetchReservations = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch user reservations
      const userRes = await getUserReservations();
      setUserReservations(userRes.data);
    } catch (err) {
      console.log('No user reservations found');
      setUserReservations([]);
    }

    try {
      // Fetch host reservations
      const hostRes = await getHostReservations();
      setHostReservations(hostRes.data);
    } catch (err) {
      console.log('No host reservations found');
      setHostReservations([]);
    }
    setLoading(false);
  };

  // Handle delete reservation
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this reservation?'
    );

    if (!confirmed) return;

    try {
      await deleteReservation(id);
      setSuccessMsg('Reservation cancelled successfully.');
      // Remove from local state based on active tab
      setUserReservations(userReservations.filter((r) => r._id !== id));
      setHostReservations(hostReservations.filter((r) => r._id !== id));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel reservation.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get current reservations based on active tab
  const currentReservations = activeTab === 'user' ? userReservations : hostReservations;

  // Loading state
  if (loading) {
    return (
      <div className="reservations-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reservations-container">
      {/* Page Header */}
      <div className="reservations-header">
        <h1>Reservations</h1>
        <p>Manage your bookings and guest reservations</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={'tab-btn ' + (activeTab === 'user' ? 'active' : '')}
          onClick={() => setActiveTab('user')}
        >
          My Reservations ({userReservations.length})
        </button>
        <button
          className={'tab-btn ' + (activeTab === 'host' ? 'active' : '')}
          onClick={() => setActiveTab('host')}
        >
          Guest Reservations ({hostReservations.length})
        </button>
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

      {/* Reservations Table */}
      {currentReservations.length === 0 ? (
        <div className="no-reservations">
          <h2>No reservations found</h2>
          <p>
            {activeTab === 'user'
              ? 'You have not made any reservations yet.'
              : 'No guests have booked your properties yet.'}
          </p>
        </div>
      ) : (
        <div className="reservations-table-wrapper">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Guests</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td className="property-cell">
                    {reservation.accommodation?.title || 'N/A'}
                  </td>
                  <td>{reservation.accommodation?.location || 'N/A'}</td>
                  <td>{formatDate(reservation.checkIn)}</td>
                  <td>{formatDate(reservation.checkOut)}</td>
                  <td>{reservation.guests || 'N/A'}</td>
                  <td className="price-cell">
                    ${reservation.totalPrice || reservation.accommodation?.price || 'N/A'}
                  </td>
                  <td>
                    <span className={'status-badge status-' + (reservation.status || 'confirmed')}>
                      {reservation.status || 'Confirmed'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="delete-btn small"
                      onClick={() => handleDelete(reservation._id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reservations;
