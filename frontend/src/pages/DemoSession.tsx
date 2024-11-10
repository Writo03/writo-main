import React, { useState } from 'react';
import { MessageSquare, Video, Share2 } from 'lucide-react';

const DemoSession = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ text: string; sender: 'user' | 'mentor' }[]>([
    { text: 'Hello! Welcome to the demo session. How can I help you today?', sender: 'mentor' },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setChat(prev => [...prev, { text: message, sender: 'user' }]);

    // Simulate mentor response
    setTimeout(() => {
      setChat(prev => [...prev, {
        text: "Thanks for your message! This is a demo response. In a real session, you'll be connected with our expert mentors.",
        sender: 'mentor'
      }]);
    }, 1000);

    setMessage('');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-6">
            <h1 className="text-2xl font-bold text-white">Demo Doubt Session</h1>
            <p className="text-indigo-100 mt-2">Experience our live doubt-solving platform</p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 p-6 bg-indigo-50">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
              <span className="text-gray-700">Real-time Chat</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Video className="h-6 w-6 text-indigo-600" />
              <span className="text-gray-700">Video Calls</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Share2 className="h-6 w-6 text-indigo-600" />
              <span className="text-gray-700">Screen Sharing</span>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg h-96 overflow-y-auto p-4 mb-4">
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    msg.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send
              </button>
            </form>
          </div>

          {/* Demo Controls */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex justify-center space-x-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Start Video Call
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Share Screen
              </button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Note: This is a demo interface. Video calls and screen sharing are available in the full version.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoSession;