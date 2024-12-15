import React, { useState } from "react";
import { UserCircle2, Camera, Edit, ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SandboxCard from "../components/SandboxCard";
import { Link } from "react-router-dom";

const ComponentCard = ({ post, user }) => {
  return (
    <div className="bg-white border border-black/10 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden">
        <img
          src={post.Images || "/api/placeholder/400/300"}
          alt={post.Title || "Post image"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            {post.Title || "Untitled Post"}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="text-black/60" size={16} />
              <span>{post.likes || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown className="text-black/60" size={16} />
              <span>{0}</span>
            </div>
          </div>
        </div>
        <p className="text-black/60 mb-2">
          {post.Description || "No description available."}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <span className="bg-black/10 px-2 py-1 rounded text-xs">
              {post.Framework || "Unknown"}
            </span>
            <span className="bg-black/10 px-2 py-1 rounded text-xs">
              {post.ComponentType || "Unknown"}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-black/60">
            <UserCircle2 size={16} />
            <span className="text-sm">{user.user.username || "Anonymous"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { user } = useAuth();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  console.log(user)
  const handleImageUpload = () => {
    alert("Image upload functionality to be implemented");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 fixed left-0 top-0 h-full bg-white border-r border-black/10 p-6 flex flex-col justify-between items-center">
        <div className="relative mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <img
              src={user.user.profilePhoto || "/api/placeholder/100/100"}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <button
              onClick={handleImageUpload}
              className="absolute bottom-0 right-0 bg-white border border-black/10 rounded-full p-2 hover:bg-black/5"
            >
              <Camera size={16} />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold flex items-center justify-center">
              {user.user.firstName} {user.user.lastName}
              <Edit size={16} className="ml-2 text-black/60 cursor-pointer" />
            </h2>
            <p className="text-black/60 flex items-center justify-center">
              {user.user.email}
              <Edit size={16} className="ml-2 text-black/60 cursor-pointer" />
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="border border-black w-full h-8 rounded-md hover:scale-105 ease-in duration-300"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 mt-16 p-6 w-full">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "posts"
                ? "bg-black text-white"
                : "bg-white border border-1 border-black  text-black"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "sandboxes"
                ? "bg-black text-white"
                : "bg-white border border-black/10 text-black"
            }`}
            onClick={() => setActiveTab("sandboxes")}
          >
            Sandboxes
          </button>
        </div>

        {activeTab === "posts" && (
          <div>
            
            <div className="grid grid-cols-3 gap-6">
              {user.user.posts.map((post, idx) => (
                <ComponentCard key={idx} post={post} user={user} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "sandboxes" && (
          <div>
        
            <div className="flex flex-col gap-12">
              {user.user.sandbox.map((sandboxEle, idx) => (
                  <Link
                  to={`/post/${sandboxEle.id}`} 
                  key={idx} 
                  className="block transform transition-transform hover:-translate-y-1"
                >
                  <SandboxCard {...sandboxEle} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
