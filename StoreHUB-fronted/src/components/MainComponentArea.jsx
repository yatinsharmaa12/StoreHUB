import React from "react";
import { ThumbsUp, ThumbsDown, UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
const ComponentCard = (card) => {
  console.log(card);
  return (
    <div className=" bg-white border border-black/10 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden">
        <img
          src={card.image || "/api/placeholder/400/300"}
          alt={card.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2 min-h-16">
          <div className="flex flex-row justify-between items-center  w-full b">
            <h3 className="text-lg font-semibold w-5/6">{card.title}</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="text-black/60" size={16} />
                <span>{card? card.likes:0}</span>
              </div>

            </div>
          </div>
        </div>
        {/* <p className="text-black/60 mb-2">{card.description}</p> */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <span className="bg-black/10 px-2 py-1 rounded text-xs">
              {card.framework}
            </span>
            <span className="bg-black/10 px-2 py-1 rounded text-xs">
              {card.componentType}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-black/60">
            <UserCircle2 size={16} />
            <span className="text-sm">
              {card.user ? card.user.username : "anonymous"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainComponentArea = ({ components }) => {
  return (
    <div className="ml-64 mt-16 p-6 grid grid-cols-3 gap-6 ">
      {components.map((component, idx) => (
        <Link to={`/post/${component.id}`}>
          <ComponentCard key={idx} {...component} />
        </Link>
      ))}
    </div>
  );
};

export default MainComponentArea;
