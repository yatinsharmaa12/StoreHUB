import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error on new submission

    try {
      // Send login request to backend
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // If successful, store the token (e.g., in localStorage or cookies)
        localStorage.setItem('token', data.token);
        // Optionally, redirect the user after successful login
        navigate("/") // Redirect to a protected page
      } else {
        // If error, set error state to show an error message
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Network error, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Login</h1>
          <p className="text-black/60 mt-2">Welcome back! Please enter your details.</p>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 mb-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 pl-10 border border-black/20 rounded-lg focus:outline-none focus:border-black"
              required
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
              required
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={20} />
          </div>

          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="text-black/60 hover:text-black transition-colors text-sm"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center mt-4">
            <p className="text-black/60 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => console.log('Switch to Signup')}
                className="text-black font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
