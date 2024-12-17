import React, { useState, useEffect, useCallback } from 'react';
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
  Smile 
} from 'lucide-react';

const DiscussionApp = () => {
  // Enhanced state management
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  // Predefined channels with more metadata
  const channels = [
    { 
      id: 'react', 
      name: 'React', 
      icon: <Code2 />,
      description: 'Discussions about React ecosystem',
      participants: 1024 
    },
    { 
      id: 'vue', 
      name: 'Vue', 
      icon: <Globe />,
      description: 'Vue.js community chat',
      participants: 756 
    },
    { 
      id: 'angular', 
      name: 'Angular', 
      icon: <Inbox />,
      description: 'Angular framework discussions',
      participants: 512 
    },
    { 
      id: 'general', 
      name: 'General', 
      icon: <MessageSquare />,
      description: 'All-purpose discussion channel',
      participants: 2048 
    }
  ];

  // Backend-friendly message handling
  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() && selectedChannel) {
      const messagePayload = {
        id: Date.now(),
        text: newMessage,
        sender: 'CurrentUser', // Replace with actual user context
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      // Simulate backend communication pattern
      const updatedMessages = {
        ...messages,
        [selectedChannel.id]: [
          ...(messages[selectedChannel.id] || []),
          messagePayload
        ]
      };

      // Potential backend sync point
      // sendMessageToBackend(messagePayload, selectedChannel.id)
      //   .then(() => {
      setMessages(updatedMessages);
      setNewMessage('');
      //   })
      //   .catch(handleError);
    }
  }, [newMessage, selectedChannel, messages]);

  // Filtered messages based on search
  const filteredMessages = selectedChannel 
    ? (messages[selectedChannel.id] || []).filter(msg => 
        msg.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Add emoji to message
  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  // File upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Implement file upload logic
      console.log('File uploaded:', file.name);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Enhanced Sidebar */}
      <div className="w-72 bg-white text-black p-6 border-r border-gray-200 mt-16 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">DevChat</h2>
          <div className="flex space-x-2">
            <Bell className="cursor-pointer hover:text-gray-500" />
            <Settings className="cursor-pointer hover:text-gray-500" />
          </div>
        </div>

        {/* Search Channels */}
        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder="Search channels..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full  p-2 pl-8 bg-white rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2 top-3 text-gray-500" size={18} />
        </div>

        {/* Channels List */}
        <nav className="space-y-2 flex-1 overflow-y-auto">
          {channels
            .filter(channel => 
              channel.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((channel) => (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`
                  flex items-center p-3 cursor-pointer rounded-lg transition-all duration-200
                  ${selectedChannel?.id === channel.id
                    ? 'border-black  text-black border '
                    : 'hover:bg-gray-200 hover:text-black'}
                `}
              >
                {channel.icon}
                <div className="ml-3 flex-1">
                  <div className="font-semibold">{channel.name}</div>
                  <div className="text-xs text-gray-500">{channel.participants} participants</div>
                </div>
              </div>
            ))}
        </nav>

        {/* User Profile Section */}
        <div className="mt-4 pt-4 border-t border-gray-300 flex items-center">
          <User className="border-black  p-1 rounded-full mr-3" />
          <div>
            <div className="font-bold">Current User</div>
            <div className="text-sm text-gray-500">Online</div>
          </div>
        </div>
      </div>

      {/* Discussion Area */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <div className="flex flex-col h-full">
            {/* Enhanced Channel Header */}
            <div className="bg-white border  mt-16 p-4 border-b flex items-center justify-between shadow-sm">
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  {selectedChannel.icon}
                  <span className="ml-2">{selectedChannel.name}</span>
                </h3>
                <p className="text-sm">{selectedChannel.description}</p>
              </div>
            </div>

            {/* Messages Area with Enhanced Styling */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <User className="mr-2 text-blue-500" size={20} />
                      <span className="font-bold">{msg.sender}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Enhanced Message Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Paperclip className="text-gray-500 hover:text-black" />
                </label>
                <div className="relative">
                  <Smile 
                    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                    className="text-gray-500 hover:text-black cursor-pointer" 
                  />
                  {isEmojiPickerOpen && (
                    <div className="absolute bottom-full left-0 bg-white border rounded shadow-lg p-2">
                      {['👍', '❤️', '😂', '🤔', '👀'].map(emoji => (
                        <span 
                          key={emoji} 
                          onClick={() => addEmoji(emoji)}
                          className="cursor-pointer text-2xl mr-2"
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="border-black  border border-1 text-black px-4 py-2 rounded-lg hover:border-black  transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <PlusCircle className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500 text-lg">Select a channel to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionApp;
