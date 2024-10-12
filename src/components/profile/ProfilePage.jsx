import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async() => {
            try {
                const response = await ApiService.getUserProfile();
                const userPlusBookings = await ApiService.getUserBookings(response.user.id);
                setUser(userPlusBookings.user);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        ApiService.logout();
        navigate('/home');
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

  return (
    <div className="profile-page">
        {user && <h2>Welcome, {user.name}</h2> }
        <div className="profile-actions">
            <button className="edit-profile-button" onClick={handleEditProfile}>Edit profile</button>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        { error && <p className="error-message">{error}</p> }
        {user && (
            <div className="profile-details">
                <h3>My profile details</h3>
                <p><strong>Email: </strong>{user.email}</p>
                <p><strong>Phone number: </strong>{user.phoneNumber}</p>
            </div>
        )}
        <div className="bookings-section">
            <h3>My booking history</h3>
            <div className="booking-list">
                {user && user.bookings.length > 0 ? (
                    user.bookings.map((booking) => (
                        <div className="booking-item" key={booking.id}>
                            <p><strong>Booking code:</strong> {booking.bookingConfirmationCode}</p>
                            <p><strong>Check-in date:</strong> {booking.checkInDate}</p>
                            <p><strong>Check-out date:</strong> {booking.checkOutDate}</p>
                            <p><strong>Total guests:</strong> {booking.totalNumOfGuests}</p>
                            <p><strong>Room type:</strong> {booking.room.roomType}</p>
                            <img src={booking.room.roomPhotoUrl} alt="room" className="room-photo" />
                        </div>
                    ))
                ) : (
                    <p>No bookings found</p>
                )}
            </div>
        </div>
    </div>
  )
}

export default ProfilePage