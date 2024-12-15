import React, { useEffect, useState } from 'react'
import { UserCircle2, Code, ExternalLink, Layers, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import apiClient from '../utils/apiClient'
import SandboxCard from '../components/SandboxCard';



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