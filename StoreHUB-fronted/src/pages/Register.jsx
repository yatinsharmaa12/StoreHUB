import React, { useState } from 'react';
import { Lock, User, Mail, KeyRound, UserPlus } from 'lucide-react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    // Prepare the request body
    const requestBody = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      username: formData.username,
      email: formData.email,
      password: formData.password
    };

    try {
      // Send POST request to backend API
      
      const response = await apiClient.post('/signup', requestBody);

      if (response.status === 200) {
        console.log('User created successfully');
        // Optionally, redirect the user to login or home page
        // e.g., history.push('/login');
        navigate('/login');
        
      }
    } catch (error) {
      if (error.response) {
        // Backend responded with an error
        setErrorMessage(error.response.data.error || "An error occurred. Please try again.");
      } else {
        // Network or other error
        setErrorMessage("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Create Account</h1>
          <p className="text-black/60 mt-2">Create your account to get started.</p>
        </div>

        {/* Display error message if there is one */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full p-3 pl-10 border border-black/20 rounded-lg focus:outline-none focus:border-black"
            />
            <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={20} />
          </div>

          <div className="relative">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full p-3 pl-10 border border-black/20 rounded-lg focus:outline-none focus:border-black"
            />
            
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 pl-10 border border-black/20 rounded-lg focus:outline-none focus:border-black"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={20} />
          </div>

          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-3 pl-10 border border-black/20 rounded-lg focus:outline-none focus:border-black"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={20} />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 pl-10 border border-black/20 rounded-lg focus:outline-none focus:border-black"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={20} />
          </div>

          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-3 pl-10 border border-black/20 rounded-lg focus:outline-none focus:border-black"
            />
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={20} />
          </div>

          <button 
            type="submit" 
            className={`w-full bg-black text-white p-3 rounded-lg hover:opacity-90 transition-opacity ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center mt-4">
            <p className="text-black/60 text-sm">
              Already have an account? 
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="text-black font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
