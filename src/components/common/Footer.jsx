import React from 'react';

const FooterComponent = () => {
    return(
        <footer>
            <span className='my-footer'>
                Hotel Zuniga | All rights reserved &copy; {new Date().getFullYear()}
            </span>
        </footer>
    )
}

export default FooterComponent;