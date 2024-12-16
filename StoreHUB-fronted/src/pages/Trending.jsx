import React, { useState, useEffect } from "react";
import TrendingComponentArea from "../components/TrendingComponentArea";
import axios from "axios";
import apiClient from "../utils/apiClient";


const Trending = () => {
  const sampleComponents = [
    {
      image: "",
      title: 'Advanced React Button Component',
      description: 'A comprehensive, highly customizable button component with multiple variants, accessibility features, and seamless integration.',
      framework: 'React',
      componentType: 'UI Element',
      user: { username: 'Elena Rodriguez' },
      likes: 1234,
      dislikes: 56,
      id: 1
    },
    {
      image: "",
      title: 'Responsive Grid Layout System',
      description: 'A flexible, mobile-first grid system that adapts to different screen sizes with easy-to-use configuration options.',
      framework: 'Tailwind CSS',
      componentType: 'Layout',
      user: { username: 'Alex Chen' },
      likes: 987,
      dislikes: 23,
      id: 2
    },
    {
        image: "",
        title: 'Advanced React Button Component',
        description: 'A comprehensive, highly customizable button component with multiple variants, accessibility features, and seamless integration.',
        framework: 'React',
        componentType: 'UI Element',
        user: { username: 'Elena Rodriguez' },
        likes: 1234,
        dislikes: 56,
        id: 1
      },
      {
        image: "",
        title: 'Advanced React Button Component',
        description: 'A comprehensive, highly customizable button component with multiple variants, accessibility features, and seamless integration.',
        framework: 'React',
        componentType: 'UI Element',
        user: { username: 'Elena Rodriguez' },
        likes: 1234,
        dislikes: 56,
        id: 1
      },
      {
        image: "",
        title: 'Advanced React Button Component',
        description: 'A comprehensive, highly customizable button component with multiple variants, accessibility features, and seamless integration.',
        framework: 'React',
        componentType: 'UI Element',
        user: { username: 'Elena Rodriguez' },
        likes: 1234,
        dislikes: 56,
        id: 1
      },
  ];


  const [trendingPosts, setTrendingPosts] = useState([]);


  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const response = await apiClient.get("http://localhost:3000/posts");
        console.log("Fetched trending posts:", response.data);
        setTrendingPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
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


    fetchTrendingPosts();
  }, []);


  return (
    <div className="min-h-screen h-auto bg-white mt-24">
      <div className="container mx-auto w-[100%]">
     
        <TrendingComponentArea components={trendingPosts.length > 0 ? trendingPosts : sampleComponents} />
      </div>
    </div>
  );
};


export default Trending;
