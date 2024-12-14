import React, { useEffect, useState } from 'react'
import { UserCircle2, Code, ExternalLink, Layers, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import apiClient from '../utils/apiClient'

const SandboxCard = (card) => {
  return (
    <div className="bg-white border group w-full flex flex-row border-black/10 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-72 duration-300 ease-in-out">
      <div className="w-1/2 relative overflow-hidden">
        <iframe
          src={card.Elink}
          title="CodeSandbox Embed"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
      </div>
      
      <div className="w-1/2 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-grow pr-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{card.Title}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{card.Description || 'No description available'}</p>
            </div>
            <a
              href={card.Elink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black/60 hover:text-blue-600 transition-colors"
            >
              <ExternalLink size={20} />
            </a>
          </div>

          <div className="flex space-x-2 mb-4">
            <div className="flex items-center space-x-1 bg-black/5 px-2 py-1 rounded text-xs">
              <Layers size={12} className="text-black/60 mr-1" />
              <span>{card.Framework || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-1 bg-black/5 px-2 py-1 rounded text-xs">
              <Terminal size={12} className="text-black/60 mr-1" />
              <span>{card.ComponentType || 'Component'}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-black/60">
            <UserCircle2 size={16} />
            <span className="text-sm">
              {card.User?.username || 'anonymous'}
            </span>
          </div>
          <div className="text-sm text-black/50">
            {card.CreatedAt ? new Date(card.CreatedAt).toLocaleDateString() : 'Unknown date'}
          </div>
        </div>
      </div>
    </div>
  );
};

const Sandbox = () => {
  const [sandboxData, setSandboxData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/sandbox');
        setSandboxData(response.data?.data || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
        setSandboxData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="ml-64 mt-16 flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <Code className="w-16 h-16 animate-pulse text-black/60 mb-4" />
          <p className="text-black/60">Loading sandbox components...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
          <Code className="mr-3 text-red-600" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-24 mt-16 p-6 flex flex-col gap-8">
      {sandboxData.map((component, idx) => (
        <Link 
          to={`/post/${component.id}`} 
          key={idx} 
          className="block transform transition-transform hover:-translate-y-1"
        >
          <SandboxCard {...component} />
        </Link>
      ))}
      
      {sandboxData.length === 0 && (
        <div className="flex justify-center items-center h-64 bg-black/5 rounded-xl">
          <div className="text-center">
            <Code className="mx-auto mb-4 text-black/60" size={48} />
            <p className="text-black/60 text-lg">No sandbox components available</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sandbox