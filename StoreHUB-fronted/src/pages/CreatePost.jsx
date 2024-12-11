import React, { useState } from 'react';
import { ImagePlus, Save, X, Plus } from 'lucide-react';

const PostCreatePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [framework, setFramework] = useState('');
  const [type, setType] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newImages].slice(0, 3));
  };

  const removeImage = (indexToRemove) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      title,
      description,
      framework,
      type,
      codeSnippet,
      images
    };
    console.log('Post submitted:', postData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Create Component Post</h1>
      
      <form onSubmit={handleSubmit} className="bg-white border border-black/10 rounded-lg p-6">
        {/* Title Input */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-black font-bold mb-2">
            Component Title
          </label>
          <input 
            type="text" 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-black/20 rounded-lg focus:outline-none focus:border-black/50"
            placeholder="Enter component title"
            required 
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-black font-bold mb-2">
            Component Description
          </label>
          <textarea 
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-black/20 rounded-lg focus:outline-none focus:border-black/50"
            rows="4"
            placeholder="Describe your component's features and usage"
            required 
          />
        </div>

        {/* Framework and Type */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="framework" className="block text-black font-bold mb-2">
              Framework
            </label>
            <select
              id="framework"
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="w-full px-3 py-2 border border-black/20 rounded-lg focus:outline-none focus:border-black/50"
              required
            >
              <option value="">Select Framework</option>
              <option value="React">React</option>
              <option value="Vue">Vue</option>
              <option value="Angular">Angular</option>
              <option value="Svelte">Svelte</option>
            </select>
          </div>
          <div>
            <label htmlFor="type" className="block text-black font-bold mb-2">
              Component Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-black/20 rounded-lg focus:outline-none focus:border-black/50"
              required
            >
              <option value="">Select Type</option>
              <option value="Button">Button</option>
              <option value="Input">Input</option>
              <option value="Card">Card</option>
              <option value="Modal">Modal</option>
            </select>
          </div>
        </div>

        {/* Code Snippet */}
        <div className="mb-4">
          <label htmlFor="codeSnippet" className="block text-black font-bold mb-2">
            Code Snippet
          </label>
          <textarea 
            id="codeSnippet"
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            className="w-full px-3 py-2 border border-black/20 rounded-lg focus:outline-none focus:border-black/50 font-mono text-sm"
            rows="6"
            placeholder="Paste your component's code snippet"
            required 
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-black font-bold mb-2">
            Component Images
          </label>
          <div className="flex items-center">
            <input 
              type="file" 
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={images.length >= 3}
            />
            <label 
              htmlFor="images" 
              className={`flex items-center px-4 py-2 rounded-lg cursor-pointer ${
                images.length >= 3 
                  ? 'bg-black/20 text-black/50' 
                  : 'bg-black text-white hover:bg-black/80'
              }`}
            >
              <ImagePlus className="mr-2" size={20} />
              Choose Images
            </label>
          </div>

          {/* Image Preview */}
          <div className="flex space-x-2 mt-2">
            {images.map((image, index) => (
              <div key={index} className="relative w-20 h-20">
                <img 
                  src={image} 
                  alt={`Preview ${index + 1}`} 
                  className="w-full h-full object-cover rounded-lg border border-black/10"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 hover:bg-black/80"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < 3 && (
              <div className="w-20 h-20 border border-black/20 rounded-lg flex items-center justify-center text-black/50">
                {3 - images.length} more
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full flex items-center justify-center px-4 py-3 bg-black text-white rounded-lg hover:bg-black/80 transition duration-300"
        >
          <Save className="mr-2" size={20} />
          Publish Component
        </button>
      </form>
    </div>
  );
};

export default PostCreatePage;