import React, { useState } from 'react'
import ApiService from '../../service/ApiService';

const FindBookingPage = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if(!confirmationCode.trim()) {
            setError("Please enter a booking confirmation code");
            setTimeout(() => setError(''), 5000);
        }
        try {
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
            setBookingDetails(response.booking);
            setError(null);
        } catch(err) {
            setError(err.response?.data?.message || err.message);
            setTimeout(() => setError(''), 5000);
        }
    };
    
  return (
    <div className="find-booking-page">
        <h2>Find booking</h2>
        <div className="search-container">
            <input
                type="text"
                required
                placeholder="Enter your booking confirmation code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
            />
            <button onClick={handleSearch}>Find</button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {bookingDetails && (
            <div className="booking-details">
                <h3>Booking details</h3>
                <p>Confirmation code: {bookingDetails.bookingConfirmationCode}</p>
                <p>Check-in date: {bookingDetails.checkInDate}</p>
                <p>Check-out date: {bookingDetails.checkOutDate}</p>
                <p>Num of adults: {bookingDetails.numOfAdults}</p>
                <p>Num of children: {bookingDetails.numOfChildren}</p>

                <br />
                <hr />
                <br />

                <h3>Booker details</h3>
                <div>
                    <p>Name: {bookingDetails.user.name}</p>
                    <p>Email: {bookingDetails.user.email}</p>
                    <p>Phone number: {bookingDetails.user.phoneNumber}</p>
                </div>

                <br />
                <hr />
                <br />

                <h3>Room details</h3>
                <div>
                    <p>Room type: {bookingDetails.room.roomType}</p>
                    <img src={bookingDetails.room.roomPhotoUrl} alt={bookingDetails.room.roomType} />
                </div>
            </div>
        )}
    </div>
  )
}

export default FindBookingPage