import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ApiService from '../../service/ApiService';
import DatePicker from 'react-datepicker';

const RoomDetailsPage = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [roomDetails, setRoomDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [numAdults, setNumAdults] = useState(1);
    const [numChildren, setNumChildren] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalGuests, setTotalGuests] = useState(1);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [userId, setUserId] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await ApiService.getRoomById(roomId);
                setRoomDetails(response.room);
                const userProfile = await ApiService.getUserProfile();
                setUserId(userProfile.user.id);
            } catch(err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [roomId]); //se repite cuando cambia la roomid

    const handleConfirmBooking = async () => {
        if(!checkInDate || !checkOutDate) {
            setErrorMessage('Please select check-in and check-out dates');
            setTimeout(() => setErrorMessage(''), 5000);
        }

        if(isNaN(numAdults) || numAdults < 1 || isNaN(numChildren) || numChildren < 0) {
            setErrorMessage('Please enter valid amounts for adults and children');
            setTimeout(() => setErrorMessage(''), 5000);
        }

        const oneDay = 24 * 60 * 60 * 1000;
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);
        const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

        const totalGuests = numAdults + numChildren;

        const roomPricePerNight = roomDetails.roomPrice;
        const totalPrice = roomPricePerNight * totalDays;

        setTotalPrice(totalPrice);
        setTotalGuests(totalGuests);
    };

    const acceptBooking = async () => {
        try {
            const startDate = new Date(checkInDate);
            const endDate = new Date(checkOutDate);

            const formattedCheckInDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString();
            const formattedCheckOutDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString();

            const booking = {
                checkInDate: formattedCheckInDate,
                checkOutDate: formattedCheckOutDate,
                numOfAdults: numAdults,
                nomOfChildren: numChildren
            };

            const response = await ApiService.bookRoom(roomId, userId, booking);
            if(response.statusCode === 200) {
                setConfirmationCode(response.bookingConfirmationCode);
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                    navigate('/rooms');
                }, 5000);
            }
        } catch(err) {
            setErrorMessage(error.response?.data?.message || err.message);
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    if(isLoading) {
        return <p className="room-detail-loading">Loading room details...</p>;
    }

    if(error) {
        return <p className="room-detail-loading">{error}</p>;
    }

    if(!roomDetails) {
        return <p className="room-detail-loading">Room not found</p>;
    }

    const { roomType, roomPrice, roomPhotoUrl, description, bookings } = roomDetails;

  return (
    <div className="room-details-booking">
        {showMessage && (
            <p className="booking-success-message">
                Booking successful! Confirmation code: {confirmationCode}. An SMS and email of your booking details have been sent!
            </p>
        )}
        {errorMessage && (
            <p className="error-message">
                {errorMessage}
            </p>
        )}
        <h2>Room details</h2>
        <br />
        <img src={roomPhotoUrl} alt={roomType} className="room-details-image" />
        <div className="room-details-info">
            <h3>{roomType}</h3>
            <p>Price: ${roomPrice} / night</p>
            <p>{description}</p>
        </div>
        {bookings && bookings.length > 0 && (
            <div>
                <h3>Existing booking details</h3>
                <ul className="booking-list">
                    {bookings.map((booking, index) => (
                        <li className="booking-item" key={booking.id}>
                            <span className="booking-number">Booking: {index + 1}</span>
                            <span className="booking-text">Check-in: {booking.checkInDate}</span>
                            <span className="booking-text">Check-out: {booking.checkOutDate}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <div className="booking-info">
            <button className="book-now-button" onClick={() => setShowDatePicker(true)}>Book now</button>
            <button className="go-back-button" onClick={() => setShowDatePicker(false)}>Go back</button>
            {showDatePicker && (
                <div className="date-picker-container">
                    <DatePicker
                        className="detail-search-field"
                        selected={checkInDate}
                        onChange={(date) => setCheckInDate(date)}
                        selectsStart
                        startDate={checkInDate}
                        endDate={checkOutDate}
                        placeholderText="Check-in date"
                        dateFormat="dd/MM/yyyy"
                    />
                    <DatePicker
                        className="detail-search-field"
                        selected={checkOutDate}
                        onChange={(date) => setCheckOutDate(date)}
                        selectsEnd
                        startDate={checkInDate}
                        endDate={checkOutDate}
                        minDate={checkInDate}
                        placeholderText="Check-out date"
                        dateFormat="dd/MM/yyyy"
                    />

                    <div className="guest-container">
                        <div className="guest-div">
                            <label htmlFor="number-adults">Adults: </label>
                            <input
                                type="number"
                                id="number-adults"
                                min="1"
                                value={numAdults}
                                onChange={(e) => setNumAdults(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="guest-div">
                            <label htmlFor="number-children">Children: </label>
                            <input
                                type="number"
                                min="0"
                                value={numChildren}
                                onChange={(e) => setNumChildren(parseInt(e.target.value))}
                            />
                        </div>
                        <button className="confirm-booking" onClick={handleConfirmBooking}>Confirm booking</button>
                    </div>
                </div>
            )}
            {totalPrice < 0 && (
                <div className="total-price">
                    <p>Total price: ${totalPrice}</p>
                    <p>Total guests: {totalGuests}</p>
                    <button onClick={acceptBooking} className="accept-booking">Accept booking</button>
                </div>
            )}
        </div>
    </div>
  );
};

export default RoomDetailsPage