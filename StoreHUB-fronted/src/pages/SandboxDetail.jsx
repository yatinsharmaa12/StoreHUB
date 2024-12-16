import { ExternalLink, Layers, Terminal, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../utils/apiClient";

const SandboxDetail = () => {
  const { id } = useParams();
  const [sandData, setSandData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/sandbox/${id}`);
        setSandData(response.data?.data || null);
        setError(null);
      } catch (err) {
        console.error("Error fetching sandbox:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-black text-2xl font-light tracking-wide">
          Loading Sandbox...
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 text-2xl font-light">Error: {error}</p>
        </div>
      </div>
    );
  }

  // No Data State
  if (!sandData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-black text-2xl font-light">No data found for this sandbox.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-white mt-16">
      <div className="w-full max-w-4xl border-2 border-black rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
        {/* Sandbox Embed */}
        <div className="relative w-full aspect-video border-b-2 border-black">
          <iframe
            src={sandData.Elink}
            title="CodeSandbox Embed"
            className="w-full h-full transform transition-transform duration-300 hover:scale-[1.02]"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          ></iframe>
        </div>

        {/* Details Section */}
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="pr-4">
              <h1 className="text-4xl font-bold text-black mb-3 tracking-tight leading-tight">
                {sandData.Title}
              </h1>
              <p className="text-black text-lg opacity-80 max-w-xl">{sandData.Description}</p>
            </div>
            <a
              href={sandData.Elink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:bg-black hover:text-white transition-all duration-300 flex items-center space-x-2 border-2 border-black px-4 py-2 rounded-lg font-medium"
            >
              <span>Open Sandbox</span>
              <ExternalLink size={16} strokeWidth={2.5} />
            </a>
          </div>

          {/* Metadata */}
          <div className="flex space-x-4">
            <div className="flex items-center space-x-3 border border-black px-4 py-2 rounded-lg">
              <Layers size={18} strokeWidth={2} className="text-black" />
              <span className="text-black font-medium">{sandData.Framework}</span>
            </div>
            <div className="flex items-center space-x-3 border border-black px-4 py-2 rounded-lg">
              <Terminal size={18} strokeWidth={2} className="text-black" />
              <span className="text-black font-medium">{sandData.ComponentType}</span>
            </div>
          </div>

          {/* User and Date */}
          <div className="flex justify-between items-center text-sm text-black border-t-2 border-black pt-5 mt-5">
            <div className="flex items-center space-x-3">
              <UserCircle2 size={24} strokeWidth={1.5} className="text-black" />
              <span className="text-black font-medium">
                {sandData.User?.Username || "anonymous"}
              </span>
            </div>
            <span className="text-black opacity-70">
              {sandData.CreatedAt
                ? new Date(sandData.CreatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : "Unknown date"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SandboxDetail;