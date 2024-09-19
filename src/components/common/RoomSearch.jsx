import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.module.css';
import ApiService from '../../service/ApiService';

const RoomSearch = ({handleSearchResult}) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [roomType, setRoomType] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();                
                setRoomTypes(types);
            } catch(err) {
                console.log(err.message);
            }
        }
        fetchRoomTypes();
    }, []);

    const showError = (message, timeout = 5000) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, timeout)
    }

    const handleInternalSearch = async () => {
        if(!startDate || !endDate || !roomType) {
            showError("Please select all fields");
            return false;
        }

    try {
        const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
        const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;

        const response = await ApiService.getAvailableRoomsByDateAndType(formattedStartDate, formattedEndDate, roomType);
        if(response.statusCode === 200) {
            if(response.roomList.length === 0) {
                showError("No rooms available currently for that room type and selected dates range")
                return;
            }

            handleSearchResult(response.roomList);
            setError('');
        }
    } catch (err) {
        showError(err.response.data.message);
    }
}
  return (
    <section>
        <div className="search-container">
            <div className="search-field">
                <label htmlFor='check-in'>Check-in date</label>
                <DatePicker
                    id='check-in'
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select check-in date"
                />
            </div>
            <div className="search-field">
                <label htmlFor='check-out'>Check-out date</label>
                <DatePicker
                    id='check-out'
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select check-out date"
                />
            </div>
            <div className="search-field">
                <label htmlFor='room-type'>Room type</label>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)} id="room-type">
                    <option disabled value="">
                        Select room type
                    </option>
                    {roomTypes.map((roomType) => (
                        <option value={roomType} key={roomType}>
                            {roomType}
                        </option>
                    ))}
                </select>
            </div>
            <button className="home-search-button" onClick={handleInternalSearch}>
                Search rooms
            </button>
        </div>
        {error && <p className='error-message'>{error}</p>}
    </section>
  )
}

export default RoomSearch