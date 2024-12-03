import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Settings,
  Bell,
  Filter,
  ChevronDown,
  Users,
  UserPlus,
  MessageSquare,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from '@/Context/ChatContext';
import { LocalStorage } from '@/utils/helper';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const Sidebar = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    chats,
    isLoadingChats,
    currentChat,
    getMessages,
    unreadMessages,
    setChatsHandler,
    setMessageHandler,
    getChat
    
  } = useChat();
  console.log(chats)
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('my');
  const [showFilters, setShowFilters] = useState(false);
  const [sidechats, setsidechats] = useState(chats || []);

  // Synchronize sidechats with chats from context
  useEffect(() => {
    setsidechats(chats || []);
  }, [chats]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredsidechats = sidechats.filter(chat => 
    chat.participants[0].fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-white border-r h-screen flex flex-col"
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-xl">Messages</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search Student"
            className="pl-8 pr-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-1 p-2">
        <Button
          variant={activeTab === 'my' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setActiveTab('my')}
        >
          <Users className="h-4 w-4 mr-2" />
          My Students
        </Button>
        <Button
          variant={activeTab === 'other' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => setActiveTab('other')}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Other Students
        </Button>
      </div>

      <div className="px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full mb-2"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
        <AnimatePresence>
      {filteredsidechats.map((chat) => (
        <motion.div
          key={chat._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg mb-2 cursor-pointer"
        >
          {/* Chat Item */}
          <div
            role="button"
            onClick={() => {
              if (currentChat.current?._id === chat._id) return;
              LocalStorage.set("currentChat", chat); // Update local storage
              currentChat.current = chat; // Update context
              setMessageHandler(""); // Reset message input
              getMessages(); // Fetch messages for the selected chat
            }}
            className="flex-1"
          >
            <div className="flex justify-between items-start">
              <p className="font-medium">
                {user.fullName===chat.participants?.[0]?.fullName ? chat.participants?.[1]?.fullName :chat.participants?.[0]?.fullName }
                {/* {chat.participants?.[1]?.fullName || "Unknown User"} */}
              </p>
              {chat.lastMessage && (
                <span className="text-xs text-gray-500">
                  {formatTime(chat.lastMessage.createdAt)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {chat.lastMessage?.content || "No messages yet"}
            </p>
            <p className="text-xs text-gray-400">{chat.subject || "No Subject"}</p>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>

          {filteredsidechats.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No sidechats found</p>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default Sidebar;