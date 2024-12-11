import React from "react";
import { ThumbsUp, ThumbsDown, UserCircle2 } from "lucide-react";
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
  

  const MainComponentArea = ({ components }) => {
    return (
      <div className="ml-64 mt-16 p-6 grid grid-cols-3 gap-6">
        {components.map((component, idx) => (
          <ComponentCard key={idx} {...component} />
          
        ))}
      </div>
    );
  };
  

  export default MainComponentArea;