import { useState } from "react";
import Sidebar from "@/components/Chat/Sidebar";
import ChatInterface from "@/components/Chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Chat = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-gray-50">
      <div className="flex h-full flex-col">
        {/* Mobile Header - Only visible on small screens */}
        <div className="fixed left-0 right-0 top-0 z-50 border-b bg-white p-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        <div className="flex h-full pt-16 lg:pt-0">
          {/* Sidebar with responsive behavior */}
          <div
            className={`fixed inset-y-0 left-0 transform lg:relative ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } z-30 w-80 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0`}
          >
            <Sidebar />
          </div>

          {/* Overlay for mobile when sidebar is open */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main chat interface */}
          <div className="w-full flex-1 lg:w-auto">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
