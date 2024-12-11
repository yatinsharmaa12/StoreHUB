import React from "react";
import Navbar from "../components/Navbar";


import MainComponentArea from "../components/MainComponentArea";
import Sidebar from "../components/Sidebar";

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
    },
    {
      image: '/api/placeholder/400/300',
      title: 'Modern Button Component',
      summary: 'A sleek, responsive button with multiple variants',
      framework: 'React',
      type: 'Button',
      author: 'John Doe',
      likes: 234,
      dislikes: 12
    },
    {
      image: '/api/placeholder/400/300',
      title: 'Modern Button Component',
      summary: 'A sleek, responsive button with multiple variants',
      framework: 'React',
      type: 'Button',
      author: 'John Doe',
      likes: 234,
      dislikes: 12
    },
    {
      image: '/api/placeholder/400/300',
      title: 'Modern Button Component',
      summary: 'A sleek, responsive button with multiple variants',
      framework: 'React',
      type: 'Button',
      author: 'John Doe',
      likes: 234,
      dislikes: 12
    },
    {
      image: '/api/placeholder/400/300',
      title: 'Modern Button Component',
      summary: 'A sleek, responsive button with multiple variants',
      framework: 'React',
      type: 'Button',
      author: 'John Doe',
      likes: 234,
      dislikes: 12
    },
    {
      image: '/api/placeholder/400/300',
      title: 'Modern Button Component',
      summary: 'A sleek, responsive button with multiple variants',
      framework: 'React',
      type: 'Button',
      author: 'John Doe',
      likes: 234,
      dislikes: 12
    },
    {
      image: '/api/placeholder/400/300',
      title: 'Modern Button Component',
      summary: 'A sleek, responsive button with multiple variants',
      framework: 'React',
      type: 'Button',
      author: 'John Doe',
      likes: 234,
      dislikes: 12
    },
    {
      image: '/api/placeholder/400/300',
      title: 'Modern Button Component',
      summary: 'A sleek, responsive button with multiple variants',
      framework: 'React',
      type: 'Button',
      author: 'John Doe',
      likes: 234,
      dislikes: 12
    },
    // Add more sample components here
  ];
  return (
    <div className="min-h-screen bg-white">
   
      <Sidebar />
      <MainComponentArea components={sampleComponents} />
    </div>
  );
};

export default Dashboard;
