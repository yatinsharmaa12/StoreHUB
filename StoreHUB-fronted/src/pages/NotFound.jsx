import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="text-center">
        <AlertCircle className="mx-auto mb-4 text-black/60" size={80} />
        <h1 className="text-4xl font-bold text-black mb-4">404 - Page Not Found</h1>
        <p className="text-black/60 mb-6">
          Oops! The page you are looking for seems to have gone missing.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/80 transition duration-300"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;