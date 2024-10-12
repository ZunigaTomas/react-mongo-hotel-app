import React, { useState } from 'react';
import ApiService from '../../service/ApiService';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };

    const validateForm = () => {
        const { name, email, password, phoneNumber } = formData;
        if (!name || !email || !password || !phoneNumber) {
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validateForm()) {
            setErrorMessage("Please fill all the fields");
            setTimeout(() => setErrorMessage(''), 5000);
        }
        try {
            const response = await ApiService.registerUser(formData);
            if(response.statusCode === 201) {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phoneNumber: ''
                });
                setSuccessMessage("User registered successfully");
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/login');
                }, 3000);
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || err.message);
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

  return (
    <div className="auth-container">
        { errorMessage && <p className="error-message">{errorMessage}</p> }
        { successMessage && <p className="success-message">{successMessage}</p> }
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="formdata-name">Name: </label>
                <input type="text" name="name" id="formdata-name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="formdata-email">Email: </label>
                <input type="email" name="email" id="formdata-email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="formdata-phone">Phone number: </label>
                <input type="text" name="phoneNumber" id="formdata-phone" value={formData.phoneNumber} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="formdata-password">Password: </label>
                <input type="password" name="password" id="formdata-password" value={formData.password} onChange={handleInputChange} required />
            </div>
            <button type="submit">Register</button>
        </form>
        <p className="register-link">
            Already have an account? <a href="/login">Login</a>
        </p>
    </div>
  );
};

export default RegisterPage