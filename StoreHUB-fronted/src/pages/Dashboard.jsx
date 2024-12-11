import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MainComponentArea from "../components/MainComponentArea";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const Dashboard = () => {
  const sampleComponents = [
    {
      image: "",
      title: 'Modern Button Component',
      summary: 'A sleek, responsive button with multiple variants',
      framework: 'React',
      type: 'Button',
      author: 'John Doe',
      likes: 234,
      dislikes: 12
    }
  ];

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/posts", { withCredentials: true });
        console.log("Fetched posts:", response.data);
        setPosts(response.data.posts); // Assuming the backend returns an object with a 'posts' key
      } catch (error) {
        console.error("Error fetching posts:", error);
        if (error.response) {
          console.error("Server error details:", error.response.data);
          console.error("Status code:", error.response.status);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <MainComponentArea components={posts.length > 0 ? posts : sampleComponents} />
    </div>
  );
};

export default Dashboard;