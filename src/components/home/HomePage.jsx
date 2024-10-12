import React, { useState } from 'react';
import RoomSearch from '../common/RoomSearch';
import RoomResult from '../common/RoomResult';

const HomePage = () => {
    const [roomSearchResults, setRoomSearchResults] = useState([]);

    const handleSearchResult = (results) => {
        setRoomSearchResults(results);
    }

  return (
    <div className="home">
        {/* SECCION HEADER, BANNER */}
        <section>
            <header className="header-banner">
                <img src="./assets/images/hotel.webp" alt="Hotel Zuniga" className="header-image" />
                <div className="overlay"></div>
                <div className="animated-texts overlay-content">
                    <h1>
                        Welcome to <span className='zuniga-color'>Zuniga Hotel</span>
                    </h1><br />
                    <h3>Step into heaven of confort and care</h3>
                </div>
            </header>
        </section>

        {/* SERVICIOS / BUSCADOR */}

        <RoomSearch handleSearchResult={handleSearchResult} />
        <RoomResult roomSearchResults={roomSearchResults} />

        <h4><a href="/rooms" className="view-rooms-home">All rooms</a></h4>

        <h2 className="home-services">Services at <span className="zuniga-color">Zuniga Hotel</span></h2>

        <section className="service-section">
            <div className="service-card">
                <img src="./assets/images/ac.png" alt="Air conditioning" />
                <div className="service-details">
                    <h3 className="service-title">Air Conditioning</h3>
                    <p className="service-description">Stay cool and comfortable throughout your stay with our individually controlled in-room air conditioning.</p>
                </div>
            </div>
            <div className="service-card">
                <img src="./assets/images/mini-bar.png" alt="Mini bar" />
                <div className="service-details">
                    <h3 className="service-title">Mini bar</h3>
                    <p className="service-description">Enjoy a convenient selection of beverages and snacks stocked in your room's mini bar with no additional cost.</p>
                </div>
            </div>
            <div className="service-card">
                <img src="./assets/images/parking.png" alt="Parking" />
                <div className="service-details">
                    <h3 className="service-title">Parking</h3>
                    <p className="service-description">We offer on-site parking for your convenience . Please inquire about valet parking options if available.</p>
                </div>
            </div>
            <div className="service-card">
                <img src="./assets/images/wifi.png" alt="WiFi" />
                <div className="service-details">
                    <h3 className="service-title">WiFi</h3>
                    <p className="service-description">Stay connected throughout your stay with complimentary high-speed Wi-Fi access available in all guest rooms and public areas.</p>
                </div>
            </div>
            
        </section>
    </div>
  );
}

export default HomePage;