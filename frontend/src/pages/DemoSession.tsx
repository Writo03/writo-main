import React, { useState } from "react";
import { MessageSquare, Video, Share2 } from "lucide-react";

const DemoSession = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<
    { text: string; sender: "user" | "mentor" }[]
  >([
    {
      text: "Hello! Welcome to the demo session. How can I help you today?",
      sender: "mentor",
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setChat((prev) => [...prev, { text: message, sender: "user" }]);

    // Simulate mentor response
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          text: "Thanks for your message! This is a demo response. In a real session, you'll be connected with our expert mentors.",
          sender: "mentor",
        },
      ]);
    }, 1000);

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="bg-indigo-600 p-6">
            <h1 className="text-2xl font-bold text-white">
              Demo Doubt Session
            </h1>
            <p className="mt-2 text-indigo-100">
              Experience our live Doubt Solving platform
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-6 bg-indigo-50 p-6 md:grid-cols-3">
            <div className="flex items-center space-x-3 rounded-lg bg-white p-4 shadow-sm">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
              <span className="text-gray-700">Real-time Chat</span>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-white p-4 shadow-sm">
              <Video className="h-6 w-6 text-indigo-600" />
              <span className="text-gray-700">Video Calls</span>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-white p-4 shadow-sm">
              <Share2 className="h-6 w-6 text-indigo-600" />
              <span className="text-gray-700">Screen Sharing</span>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="p-6">
            <div className="mb-4 h-96 overflow-y-auto rounded-lg bg-gray-50 p-4">
              {chat.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block rounded-lg p-3 ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-800"
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
                className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Send
              </button>
            </form>
          </div>

          {/* Demo Controls */}
          <div className="border-t bg-gray-50 p-6">
            <div className="flex justify-center space-x-4">
              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Start Video Call
              </button>
              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Share Screen
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              Note: This is a demo interface. Video calls and screen sharing are
              available in the full version.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoSession;
