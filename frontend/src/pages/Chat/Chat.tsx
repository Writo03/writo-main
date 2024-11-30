import React, { useState } from 'react';
import { Sidebar } from '@/components/Chat/Sidebar';
import ChatInterface from '@/components/Chat/ChatInterface';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Chat = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="lg:pt-16">
    <div className="h-screen flex  flex-col">
      {/* Mobile Header - Only visible on small screens */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b p-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="lg:hidden"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex h-full pt-16 lg:pt-0">
        {/* Sidebar with responsive behavior */}
        <div
          className={`fixed lg:relative inset-y-0 left-0 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-80 bg-white`}
        >
          <Sidebar />
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main chat interface */}
        <div className="flex-1 w-full lg:w-auto">
          <ChatInterface />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Chat;