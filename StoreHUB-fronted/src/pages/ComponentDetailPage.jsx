import React, { useState, useEffect, useContext } from "react";
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
} from "lucide-react";
import Navbar from "../components/Navbar";
import apiClient from "../utils/apiClient";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ComponentDetailPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState(""); // Added state for new comment input
  const { id } = useParams();
  const [componentData, setComponentData] = useState(null);
  const { user } = useAuth();
  console.log(user);

  useEffect(() => {
    const fetchComponentData = async () => {
      try {
        const response = await apiClient.get(`/posts/${id}`);
        console.log("response", response);
        setComponentData(response.data);
      } catch (error) {
        console.error("Error fetching component data:", error);
      }
    };
    fetchComponentData();
  }, [id]);

  const [commentData, setCommentData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get(`/comments/${id}`);
      setCommentData(response.data);
      console.log("comments", response.data);
    };
    fetchData();
  }, [newComment]);

  // Show loading state if data is not yet fetched
  if (!componentData) return <div>Loading...</div>;

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
    if (newComment.trim().length > 0) {
      const commentData = {
        content: newComment,
      };

      try {
        // Send the comment to the server
        const response = await apiClient.post(`/comments/${id}`, commentData);

        if (response.status === 200) {
          // Comment successfully posted, no further action needed
          setNewComment(""); // Clear the input
        } else {
          // Handle unsuccessful post request
          alert("Failed to post the comment. Please try again.");
        }
      } catch (error) {
        // Handle error during the request
        console.error("Error posting comment:", error);
        alert(
          "An error occurred while posting your comment. Please try again."
        );
        setComponentData((prevData) => ({
          ...prevData,
          comments: prevData.comments.slice(0, -1), // Remove the optimistic comment
        }));
      }
    } else {
      alert("Please enter a comment.");
    }
  };

  const TabButton = ({ tab, label }) => (
    <button
      className={`px-4 py-2 border-b-2 transition-colors ${
        activeTab === tab
          ? "border-black text-black"
          : "border-transparent text-black/60 hover:text-black"
      }`}
      onClick={() => setActiveTab(tab)}
    >
      {label}
    </button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            <p className="text-black/70">{componentData.description}</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <GitBranch className="mr-2" size={20} />
                  Framework
                </h4>
                <p>{componentData.framework}</p>
              </div>
              <div className="bg-black/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Code className="mr-2" size={20} />
                  Component Type
                </h4>
                <p>{componentData.componentType}</p>
              </div>
              <div className="bg-black/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <UserCircle2 className="mr-2" size={20} />
                  Author
                </h4>
                <p>{componentData?.user?.username}</p>
              </div>
            </div>
          </div>
        );
      case "code":
        return (
          <div className="relative h-96 overflow-y-scroll">
            <pre className="bg-black/5 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{componentData.codeSnippet}</code>
            </pre>
            <button
              className="absolute top-2 right-2 bg-black/10 p-2 rounded hover:bg-black/20 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(componentData.codeSnippet);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copied!" : <Copy size={20} />}
            </button>
          </div>
        );
      case "comments":
        return (
          <div className="space-y-4 h-80 overflow-y-scroll">
            {commentData?.comments?.length ? (
              commentData.comments.map((comment, index) => (
                <div key={index} className="border-b border-black/10 pb-4">
                  <div className="flex items-center mb-2">
                    <UserCircle2 className="mr-2" size={24} />
                    <div>
                      <p className="font-semibold">{comment.User.Username}</p>
                      <p className="text-black/60 text-sm">
                        {new Date(comment.CreatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p>{comment.Content}</p>
                </div>
              ))
            ) : (
              <p>No comments yet...</p>
            )}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-grow p-2 border border-black/20 rounded-lg"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="bg-black text-white px-4 py-2 rounded-lg"
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
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="grid grid-cols-2 gap-8">
          {/* Image Carousel Section */}
          <div className="relative">
            {componentData?.images?.length > 0 ? (
              <>
                <div className="rounded-lg overflow-hidden shadow-lg h-[570px] w-[570px]">
                  <img
                    src={componentData.images[currentImageIndex]}
                    alt={`Component preview ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover"
                  />
                </div>
                {/* Image Navigation */}
                {componentData.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageChange("prev")}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 p-2 rounded-full"
                    >
                      <ChevronLeft className="text-white" />
                    </button>
                    <button
                      onClick={() => handleImageChange("next")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 p-2 rounded-full"
                    >
                      <ChevronRight className="text-white" />
                    </button>
                  </>
                )}
                {/* Image Indicators */}
                <div className="flex justify-center mt-4 space-x-2">
                  {componentData.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? "bg-black" : "bg-black/30"
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[570px] w-[570px] flex items-center justify-center bg-black/10 rounded-lg">
                <p className="text-black/50">No images available</p>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">{componentData.title}</h1>
                <div className="flex items-center space-x-4 mt-2 text-black/60">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp size={16} />
                    <span>{componentData.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsDown size={16} />
                    <span>{componentData.dislikes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={16} />
                    <span>{componentData.stars} Stars</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center">
                  <Download className="mr-2" size={20} />
                  Download
                </button>
                <button className="bg-black/10 px-4 py-2 rounded-lg flex items-center">
                  <Share2 className="mr-2" size={20} />
                  Share
                </button>
              </div>
            </div>

            <div className="border-b border-black/10 mb-6">
              <nav className="flex space-x-4">
                <TabButton tab="overview" label="Overview" />
                <TabButton tab="code" label="Code" />
                <TabButton tab="comments" label="Comments" />
              </nav>
            </div>

            <div>{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComponentDetailPage;
