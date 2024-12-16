import React, { useEffect, useState } from 'react'
import { UserCircle2, Code, ExternalLink, Layers, Terminal, PlusCircle } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import apiClient from '../utils/apiClient'
import SandboxCard from '../components/SandboxCard';
import Loading from '../components/Loading';



const Sandbox = () => {
  const [sandboxData, setSandboxData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        <Loading />
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
          to={`/sandbox/${component.ID}`} 
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
      <button 
      onClick={()=>{navigate('/sandbox-create')}}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center 
        bg-black text-white rounded-full 
        px-6 py-3 shadow-lg 
        hover:bg-black/90 transition-all duration-300 
        group"
    >
      <PlusCircle
        className="mr-2 group-hover:rotate-90 transition-transform duration-300" 
        size={24} 
        strokeWidth={1.5}
      />
      Create Sandbox
    </button>
    </div>
  )
}

export default Sandbox