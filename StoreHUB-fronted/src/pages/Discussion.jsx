import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  MessageSquare, 
  Code2, 
  Globe, 
  Inbox, 
  Search, 
  PlusCircle, 
  User, 
  Bell, 
  Settings, 
  Paperclip,
  Smile,
  ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext' ; // Assume this provides user details
import apiClient from '../utils/apiClient';

const DiscussionApp = () => {
  const { user } = useAuth(); // Current user details
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const socketRef = useRef(null);

  const channels = [
    { id: 'react', name: 'React', icon: <Code2 />, description: 'Discussions about React ecosystem', participants: 1024 },
    { id: 'vue', name: 'Vue', icon: <Globe />, description: 'Vue.js community chat', participants: 756 },
    { id: 'angular', name: 'Angular', icon: <Inbox />, description: 'Angular framework discussions', participants: 512 },
    { id: 'general', name: 'General', icon: <MessageSquare />, description: 'All-purpose discussion channel', participants: 2048 }
  ];

  const previousChannelRef = useRef(null);
  
  useEffect(() => {
    // Only reconnect if the channel has changed
    if (!selectedChannel || 
        (previousChannelRef.current && previousChannelRef.current.id === selectedChannel.id)) 
      return;

    // Close existing socket
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Establish new WebSocket connection
    const socket = new WebSocket(
      `ws://localhost:3000/ws?channel=${selectedChannel.id}&user_id=${user.user.id}`
    );

    socket.onopen = () => {
      console.log('WebSocket connected to channel:', selectedChannel.id);
      // Fetch initial chat history
      fetchChatHistory();
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => ({
        ...prev,
        [selectedChannel.id]: [...(prev[selectedChannel.id] || []), message],
      }));
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Implement reconnection logic
      setTimeout(() => {
        // Attempt to reconnect
        socket.close();
      }, 5000);
    };

    socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event);
      if (!event.wasClean) {
        // Unexpected close, try to reconnect
        setTimeout(() => {
          // Attempt to reconnect
          connectWebSocket();
        }, 5000);
      }
    };

    socketRef.current = socket;
    previousChannelRef.current = selectedChannel;

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [selectedChannel, user.user.id]);

  const fetchChatHistory = useCallback(async () => {
    if (!selectedChannel) return;

    try {
      const res = await apiClient.get(`/chats?channel=${selectedChannel.id}`);
      setMessages(prev => ({
        ...prev,
        [selectedChannel.id]: res.data.chats || [],
      }));
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }, [selectedChannel]);

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() && selectedChannel && socketRef.current) {
      const messagePayload = {
        Content: newMessage,  // Use 'Content' instead of 'text'
        sender: user.name,
        timestamp: new Date().toISOString(),
        type: 'text',
      };

      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(messagePayload));
        
        // Optimistically update the messages state
        const localMessage = {
          id: Date.now(),
          sender: user.name,
          Content: newMessage,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => ({
          ...prev,
          [selectedChannel.id]: [...(prev[selectedChannel.id] || []), localMessage],
        }));
        
        setNewMessage('');
      } else {
        console.error('WebSocket is not open. Unable to send message.');
      }
    }
  }, [newMessage, selectedChannel, user.name]);

  const filteredMessages = selectedChannel
    ? (messages[selectedChannel.id] || []).filter(msg =>
        msg?.Content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChannelSelect = channel => {
    setSelectedChannel(channel);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      <div className="md:hidden mt-16 bg-white border-b p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">DevChat</h2>
        <div className="flex items-center space-x-4">
          <Bell className="cursor-pointer" />
          <button onClick={toggleSidebar} className="focus:outline-none">
            <Search className="cursor-pointer" />
          </button>
        </div>
      </div>

      <div className={`
        md:w-72 bg-white text-black p-6 border-r border-gray-200 
        fixed inset-y-0 left-0 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 
        transition-transform duration-300 ease-in-out 
        z-50 md:static md:block 
        overflow-y-auto
      `}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold hidden md:block">DevChat</h2>
          <div className="flex space-x-2 hidden md:flex">
            <Bell className="cursor-pointer hover:text-gray-500" />
            <Settings className="cursor-pointer hover:text-gray-500" />
          </div>
          <button onClick={toggleSidebar} className="md:hidden focus:outline-none">
            <ArrowLeft />
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search channels..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 bg-white rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2 top-3 text-gray-500" size={18} />
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto">
          {channels
            .filter(channel => 
              channel.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(channel => (
              <div
                key={channel.id}
                onClick={() => handleChannelSelect(channel)}
                className={`flex items-center p-3 cursor-pointer rounded-lg transition-all duration-200 ${
                  selectedChannel?.id === channel.id ? 'border-black text-black border' : 'hover:bg-gray-200 hover:text-black'
                }`}
              >
                {channel.icon}
                <div className="ml-3 flex-1">
                  <div className="font-semibold">{channel.name}</div>
                  <div className="text-xs text-gray-500">{channel.participants} participants</div>
                </div>
              </div>
            ))}
        </nav>

        <div className="mt-4 pt-4 border-t border-gray-300 flex items-center">
          <User className="border-black p-1 rounded-full mr-3" />
          <div>
            <div className="font-bold">{user.name}</div>
            <div className="text-sm text-gray-500">Online</div>
          </div>
        </div>
      </div>

      <div className={`flex-1 flex flex-col ${selectedChannel ? 'block' : 'hidden md:block'}`}>
        {selectedChannel ? (
          <div className="flex flex-col h-full">
            <div className="bg-white border p-4 border-b flex items-center justify-between shadow-sm">
              <div className="flex items-center">
                <button onClick={() => setSelectedChannel(null)} className="md:hidden mr-3 focus:outline-none">
                  <ArrowLeft />
                </button>
                <div>
                  <h3 className="text-xl font-semibold flex items-center">
                    {selectedChannel.icon}
                    <span className="ml-2">{selectedChannel.name}</span>
                  </h3>
                  <p className="text-sm hidden md:block">{selectedChannel.description}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {filteredMessages.map(msg => (
                <div key={msg.id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <User className="mr-2 text-blue-500" size={20} />
                      <span className="font-bold">{msg.sender}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{msg.Content}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t">
              <div className="flex items-center space-x-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Paperclip className="text-gray-500 hover:text-black" />
                </label>
                <div className="relative">
                  <Smile onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)} className="text-gray-500 hover:text-black cursor-pointer" />
                  {isEmojiPickerOpen && (
                    <div className="absolute bottom-full left-0 bg-white border rounded shadow-lg p-2"></div>
                  )}
                </div>
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => {setNewMessage(e.target.value)
                    console.log(newMessage)
                  }}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleSendMessage} className="border-black border text-black px-4 py-2 rounded-lg hover:border-black transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50"></div>
        )}
      </div>
    </div>
  );
};

export default DiscussionApp;
