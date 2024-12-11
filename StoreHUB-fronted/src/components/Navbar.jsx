import React from "react";
import { Home, Flame, Book, Plus, UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Navbar = ({ username }) => {
  const {user}= useAuth();
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-black/10 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-16">
          <Link to="/">
            {" "}
            <h1 className="text-2xl font-bold text-black">StoreHUB</h1>
          </Link>

          <div className="flex space-x-8 ml-16 text-black">
            <Link to="/">
              {" "}
              <NavItem icon={<Home />} label="Explore" />
            </Link>
            <Link to="/trending">
              <NavItem icon={<Flame />} label="Trending" />
            </Link>
            <Link to="/stories">
              <NavItem icon={<Book />} label="Stories" />
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className=" text-black border-black/70 border px-4 py-2 rounded-lg flex items-center">
            Create
          </button>
          <Link to="/profile">
            <div className="flex items-center space-x-2">
              <UserCircle2 className="text-black/70" size={40} />
              <span className="font-medium">
                {user.user.username ? user.user.username : "John"}{" "}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ icon, label }) => (
  <div className="flex items-center space-x-2 text-black/70 hover:text-black transition-colors cursor-pointer">
    {icon}
    <span>{label}</span>
  </div>
);

export default Navbar;
