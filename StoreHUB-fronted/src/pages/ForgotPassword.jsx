import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulate password reset request
      // Replace with actual password reset API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResetSent(true);
    } catch (err) {
      console.error('Password reset failed:', err);
      setError('Unable to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If reset link has been sent, show success state
  if (resetSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 text-center">
          <CheckCircle className="mx-auto mb-6 text-green-500" size={64} />
          <h1 className="text-3xl font-bold text-black mb-4">Check Your Email</h1>
          <p className="text-black/60 mb-6">
            We've sent a password reset link to {email}. 
            Please check your inbox and follow the instructions.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-black text-white p-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Forgot Password</h1>
          <p className="text-black/60 mt-2">Enter your email to reset your password</p>
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
              value={email}
              onChange={handleInputChange}
              className="w-full p-3 pl-10 border border-black/20 rounded-lg focus:outline-none focus:border-black"
              required
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={20} />
          </div>
          
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? 'Sending Reset Link...' : 'Reset Password'}
          </button>
          
          <div className="text-center mt-4">
            <p className="text-black/60 text-sm">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-black font-semibold hover:underline"
              >
                Back to Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;