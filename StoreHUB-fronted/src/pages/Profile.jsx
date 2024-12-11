import React, { useState } from 'react';
import { UserCircle2, Camera, Edit } from "lucide-react";
import { ThumbsUp } from 'lucide-react';
import { ThumbsDown } from 'lucide-react';
// Reusing the ComponentCard from the provided style
const ComponentCard = ({ 
    image, 
    title, 
    summary, 
    framework, 
    type, 
    author, 
    likes, 
    dislikes 
  }) => {
    return (
      <div className="bg-white border border-black/10 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="h-48 overflow-hidden">
          <img 
            src={image || '/api/placeholder/400/300'} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="text-black/60" size={16} />
                <span>{likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsDown className="text-black/60" size={16} />
                <span>{dislikes}</span>
              </div>
            </div>
          </div>
          <p className="text-black/60 mb-2">{summary}</p>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <span className="bg-black/10 px-2 py-1 rounded text-xs">{framework}</span>
              <span className="bg-black/10 px-2 py-1 rounded text-xs">{type}</span>
            </div>
            <div className="flex items-center space-x-1 text-black/60">
              <UserCircle2 size={16} />
              <span className="text-sm">{author}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState('/api/placeholder/200/200');
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('john.doe@example.com');

  // Sample posts data
  const userPosts = [
    {
      image: '/api/placeholder/400/300',
      title: 'React Dashboard',
      summary: 'A comprehensive dashboard built with React and Tailwind',
      framework: 'React',
      type: 'Frontend',
      author: 'John Doe',
      likes: 42,
      dislikes: 3
    },
    {
      image: '/api/placeholder/400/300',
      title: 'Node.js Backend',
      summary: 'Scalable backend service with Express and MongoDB',
      framework: 'Node.js',
      type: 'Backend',
      author: 'John Doe',
      likes: 35,
      dislikes: 2
    }
  ];

  const handleImageUpload = () => {
    // Placeholder for image upload logic
    alert('Image upload functionality to be implemented');
  };

  return (
    <div className="flex">
      {/* Sidebar (assuming 64px width from original layout) */}
      <div className="w-64 fixed left-0 top-0 h-full bg-white border-r border-black/10 p-6">
        {/* Profile Section */}
        <div className="relative mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <img 
              src={profileImage} 
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
              {firstName} {lastName}
              <Edit size={16} className="ml-2 text-black/60 cursor-pointer" />
            </h2>
            <p className="text-black/60 flex items-center justify-center">
              {email}
              <Edit size={16} className="ml-2 text-black/60 cursor-pointer" />
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-64 mt-16 p-6">
        <h3 className="text-2xl font-semibold mb-6">My Posts</h3>
        <div className="grid grid-cols-3 gap-6">
          {userPosts.map((post, idx) => (
            <ComponentCard key={idx} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;