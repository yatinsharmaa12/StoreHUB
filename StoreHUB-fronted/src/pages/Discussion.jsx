import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MessageSquare,
  Code2,
  Globe,
  Inbox,
  Menu,
  User,
  Bell,
  Settings,
  Paperclip,
  Smile,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; // Make sure to install axios

const DiscussionApp = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const channels = useMemo(
    () => [
      { id: 'react', name: 'React', icon: <Code2 />, description: 'React discussions', participants: 1024 },
      { id: 'vue', name: 'Vue', icon: <Globe />, description: 'Vue.js community chat', participants: 756 },
      { id: 'angular', name: 'Angular', icon: <Inbox />, description: 'Angular discussions', participants: 512 },
      { id: 'general', name: 'General', icon: <MessageSquare />, description: 'General discussions', participants: 2048 }
    ],
    []
  );

  useEffect(() => {
    if (!user || !selectedChannel) return;

    const ws = new WebSocket(`ws://localhost:3000/ws?channel=${selectedChannel.id}&user_id=${user.user.id}`);

    ws.onopen = () => console.log('WebSocket connected');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => {
        const channelMessages = prev[selectedChannel.id] || [];
        return {
          ...prev,
          [selectedChannel.id]: [...channelMessages, data]
        };
      });
    };
    ws.onerror = (error) => console.error('WebSocket error:', error);
    ws.onclose = () => console.log('WebSocket disconnected');

    setSocket(ws);

    return () => ws.close();
  }, [user, selectedChannel]);

  // Function to fetch chat history
  const fetchChatHistory = useCallback(async () => {
    if (!selectedChannel || isLoadingHistory) return;

    try {
      setIsLoadingHistory(true);
      // Replace with your actual API endpoint
      const response = await axios.get(`https://api.example.com/chat-history?channel=${selectedChannel.id}`);
      
      setMessages((prev) => ({
        ...prev,
        [selectedChannel.id]: [
          ...response.data, // Assuming response.data is an array of previous messages
          ...(prev[selectedChannel.id] || [])
        ]
      }));
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [selectedChannel]);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !socket || !selectedChannel) return;
    const message = { content: newMessage, sender: user.id };
    socket.send(JSON.stringify(message));
    setNewMessage('');
  }, [newMessage, socket, selectedChannel, user]);

  const filteredMessages = useMemo(() => {
    const channelMessages = messages[selectedChannel?.id] || [];
    return channelMessages.filter((msg) => msg.content.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [messages, selectedChannel, searchTerm]);

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    fetchChatHistory(); // Fetch history when channel is selected
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) console.log('File selected:', file.name);
  };

  const toggleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`
          ${isSidebarCollapsed ? 'w-20' : 'w-72' } 
          bg-white text-black p-4 border-r 
          transition-all duration-300  z-50
          relative
        `}
      >
        <button 
          onClick={toggleSidebarCollapse} 
          className="absolute top-4 right-4 z-50"
        >
          {isSidebarCollapsed ? <ChevronRight /> : <ArrowLeft />}
        </button>

        {!isSidebarCollapsed && (
          <>
            <h2 className="text-2xl font-bold mb-6">DevChat</h2>
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded-lg border mb-4"
            />
          </>
        )}

        <nav className="mt-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => handleChannelSelect(channel)}
              title={channel.name}
              className={`
                p-3 rounded-lg cursor-pointer 
                flex items-center 
                ${selectedChannel?.id === channel.id ? 'bg-gray-300' : 'hover:bg-gray-200'}
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              {channel.icon}
              {!isSidebarCollapsed && (
                <span className="ml-2 font-medium">{channel.name}</span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <>
            <div className="p-4 border-b flex items-center">
              {isSidebarCollapsed && (
                <button onClick={toggleSidebarCollapse} className="mr-2">
                  <Menu />
                </button>
              )}
              <h3 className="text-lg font-bold">{selectedChannel.name}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 relative">
              {isLoadingHistory && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                  <p>Loading chat history...</p>
                </div>
              )}
              {filteredMessages.map((msg, index) => (
                <div key={index} className="p-2 bg-white rounded-lg shadow mb-2">
                  <p className="text-sm font-medium">{msg.sender}</p>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex items-center">
              <Smile
                onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
                className="cursor-pointer"
              />
              {isEmojiPickerOpen && (
                <div className="absolute bottom-full bg-white shadow-lg p-2">
                  {['👍', '❤️', '😂'].map((emoji) => (
                    <span key={emoji} onClick={() => addEmoji(emoji)} className="cursor-pointer">
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 mx-2 p-2 border rounded"
              />
              <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>Select a channel to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionApp;