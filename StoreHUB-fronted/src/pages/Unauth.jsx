import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="text-center">
        <Lock className="mx-auto mb-4 text-black/60" size={80} />
        <h1 className="text-4xl font-bold text-black mb-4">Unauthorized Access</h1>
        <p className="text-black/60 mb-6">
          You do not have permission to access this page. 
          Please log in with appropriate credentials.
        </p>
        <div className="flex space-x-4 justify-center">
          <Link 
            to="/login" 
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/80 transition duration-300"
          >
            Login
          </Link>
          <Link 
            to="/" 
            className="px-6 py-3 bg-black/10 text-black rounded-lg hover:bg-black/20 transition duration-300"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;