import React, { useState } from 'react'; 
import { Lock, User, Mail, KeyRound, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
    setFormErrors((prevState) => ({
      ...prevState,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Required field validations
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.username.trim()) errors.username = 'Username is required';
    else if (formData.username.length < 3) errors.username = 'Username must be at least 3 characters long';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) errors.email = 'Enter a valid email address';

    // Password validations
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters long';

    if (!formData.confirmPassword) errors.confirmPassword = 'Confirm your password';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setErrorMessage('');
    setIsLoading(true);

    const requestBody = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      username: formData.username,
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await apiClient.post('/signup', requestBody);

      if (response.status === 200) {
        console.log('User created successfully');
        navigate('/login');
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error || 'An error occurred. Please try again.');
      } else {
        setErrorMessage('Network error. Please try again later.');
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
              className={`w-full p-3 pl-10 border ${formErrors.firstName ? 'border-red-500' : 'border-black/20'} rounded-lg focus:outline-none focus:border-black`}
            />
            <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={20} />
            {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
          </div>

          <div className="relative">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full p-3 pl-10 border ${formErrors.lastName ? 'border-red-500' : 'border-black/20'} rounded-lg focus:outline-none focus:border-black`}
            />
            {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 pl-10 border ${formErrors.email ? 'border-red-500' : 'border-black/20'} rounded-lg focus:outline-none focus:border-black`}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={20} />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>

          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full p-3 pl-10 border ${formErrors.username ? 'border-red-500' : 'border-black/20'} rounded-lg focus:outline-none focus:border-black`}
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={20} />
            {formErrors.username && <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>}
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full p-3 pl-10 border ${formErrors.password ? 'border-red-500' : 'border-black/20'} rounded-lg focus:outline-none focus:border-black`}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={20} />
            {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
          </div>

          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full p-3 pl-10 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-black/20'} rounded-lg focus:outline-none focus:border-black`}
            />
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={20} />
            {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>}
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
