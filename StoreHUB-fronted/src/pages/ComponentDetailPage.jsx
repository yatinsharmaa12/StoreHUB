import React, { useState, useEffect } from "react";
import {
  Code,
  Copy,
  Download,
  Star,
  ThumbsUp,
  ThumbsDown,
  Share2,
  GitBranch,
  UserCircle2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import apiClient from "../utils/apiClient";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ComponentDetailPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [componentData, setComponentData] = useState(null);
  const [commentData, setCommentData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  useEffect(() => {
    // Fetch component details
    const fetchComponentData = async () => {
      try {
        const response = await apiClient.get(`/posts/${id}`);
        setComponentData(response.data);
      } catch (error) {
        console.error("Error fetching component data:", error);
      }
    };
    fetchComponentData();
  }, [id]);

  useEffect(() => {
    // Fetch comments
    const fetchComments = async () => {
      try {
        const response = await apiClient.get(`/comments/${id}`);
        setCommentData(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [newComment]);

  if (!componentData) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const handleImageChange = (direction) => {
    if (!componentData?.images?.length) return;
    setCurrentImageIndex((prevIndex) => {
      if (direction === "next") {
        return (prevIndex + 1) % componentData.images.length;
      } else {
        return prevIndex === 0
          ? componentData.images.length - 1
          : prevIndex - 1;
      }
    });
  };

  const handlePostComment = async () => {
    if (newComment.trim()) {
      try {
        await apiClient.post(`/comments/${id}`, { content: newComment });
        setNewComment("");
      } catch (error) {
        console.error("Error posting comment:", error);
        alert("Failed to post comment. Try again.");
      }
    }
  };

  const TabButton = ({ tab, label }) => (
    <button
      className={`px-4 py-2 text-sm md:text-base border-b-2 transition-colors ${
        activeTab === tab
          ? "border-black text-black"
          : "border-transparent text-black/60 hover:text-black"
      }`}
      onClick={() => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
      }}
    >
      {label}
    </button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            <p className="text-sm md:text-base">{componentData.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  icon: <GitBranch className="mr-2" size={20} />, 
                  label: "Framework", 
                  value: componentData.framework 
                },
                { 
                  icon: <Code className="mr-2" size={20} />, 
                  label: "Component Type", 
                  value: componentData.componentType 
                },
                { 
                  icon: <UserCircle2 className="mr-2" size={20} />, 
                  label: "Author", 
                  value: componentData?.user?.username || "Anonymous" 
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold flex items-center text-sm md:text-base">
                    {item.icon} {item.label}
                  </h4>
                  <p className="text-sm md:text-base">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "code":
        return (
          <div className="relative">
            <pre className="bg-gray-100 p-2 md:p-4 rounded-lg overflow-x-auto text-xs md:text-base">
              <code>{componentData.codeSnippet}</code>
            </pre>
            <button
              className="absolute top-2 right-2 bg-gray-200 p-1 md:p-2 rounded hover:bg-gray-300"
              onClick={() => {
                navigator.clipboard.writeText(componentData.codeSnippet);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copied!" : <Copy size={16} md:size={20} />}
            </button>
          </div>
        );
      case "comments":
        return (
          <div className="space-y-4">
            {commentData?.comments?.map((comment, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <UserCircle2 className="mr-2" size={20} />
                  <div>
                    <p className="font-semibold text-sm md:text-base">{comment.User.Username}</p>
                    <p className="text-xs md:text-sm text-gray-500">
                      {new Date(comment.CreatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm md:text-base">{comment.Content}</p>
              </div>
            ))}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-grow border p-2 rounded-lg text-sm"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="bg-black text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm md:text-base"
                onClick={handlePostComment}
              >
                Post
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Mobile Tab Menu Toggle */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{componentData.title}</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Tab Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex justify-between border-b mb-4">
            <TabButton tab="overview" label="Overview" />
            <TabButton tab="code" label="Code" />
            <TabButton tab="comments" label="Comments" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div className="relative order-2 md:order-1">
            {componentData.images?.length > 0 ? (
              <>
                <img
                  src={componentData.images[currentImageIndex]}
                  alt="Preview"
                  className="rounded-lg w-full h-auto object-cover"
                />
                <button
                  onClick={() => handleImageChange("prev")}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-300 p-1 md:p-2 rounded-full"
                >
                  <ChevronLeft size={16} md:size={24} />
                </button>
                <button
                  onClick={() => handleImageChange("next")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 p-1 md:p-2 rounded-full"
                >
                  <ChevronRight size={16} md:size={24} />
                </button>
              </>
            ) : (
              <div className="h-48 md:h-80 bg-gray-200 flex items-center justify-center">
                No images available
              </div>
            )}
          </div>

          {/* Details */}
          <div className="order-1 md:order-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 hidden md:block">
              {componentData.title}
            </h1>
            <div className="flex space-x-4 mb-6 justify-center md:justify-start">
              <div className="flex items-center">
                <ThumbsUp className="mr-1" size={16} /> 
                <span className="text-sm">{componentData.likes}</span>
              </div>
              <div className="flex items-center">
                <ThumbsDown className="mr-1" size={16} /> 
                <span className="text-sm">{componentData.dislikes}</span>
              </div>
            </div>
            <div className="border-b mb-4 hidden md:block">
              <TabButton tab="overview" label="Overview" />
              <TabButton tab="code" label="Code" />
              <TabButton tab="comments" label="Comments" />
            </div>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default ComponentDetailPage;