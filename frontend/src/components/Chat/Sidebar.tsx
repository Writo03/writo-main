import { useState, useCallback, useMemo } from 'react';
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
  Loader2,
  BookOpen,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from '@/Context/ChatContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useSocket } from '@/Context/SocketContext';
import debounce from 'lodash/debounce';
import { ChatListItemInterface } from '@/types/chat';


// Types for our chat data
// interface Participant {
//   _id: string;
//   email: string;
//   fullName: string;
//   phone: number;
//   profilePic: string;
//   isMentor: boolean;
//   subject?: string;
//   onBreak: boolean;
//   onLeave: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Message {
//   _id: string;
//   sender: {
//     _id: string;
//     email: string;
//     fullName: string;
//     profilePic: string;
//   };
//   content: string;
//   attachments: unknown[];
//   chat: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Chat {
//   _id: string;
//   subject: string;
//   isMentorChat: boolean;
//   isPrimary: string;
//   mentor: string;
//   participants: Participant[];
//   createdAt: string;
//   updatedAt: string;
//   lastMessage?: Message;
// }

const Sidebar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    chats,
    currentChat,
    getMessages,
    unreadMessages,
    setMessageHandler,
  } = useChat();
  const { socket } = useSocket();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('my');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    subject: '',
    unread: false,
    recent: true,
    onlyActive: true
  });

  // Get the other participant in a chat
  const getOtherParticipant = useCallback((chat: ChatListItemInterface) => {
    const participant = chat.participants.find(p => p._id !== user.userId);
    return participant || chat.participants[0];
}, [user.userId]);
  // console.log(unreadMessages)
  // Memoized filtered chats
  const filteredChats = useMemo(() => {
    let filtered = [...(chats || [])];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(chat => {
          const otherParticipant = getOtherParticipant(chat);
          return (
              otherParticipant?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              chat.subject.toLowerCase().includes(searchTerm.toLowerCase())
          );
      });
  }
    // Filter based on tab
    if (activeTab === 'my') {
      filtered = filtered.filter(chat => 
        chat.participants.some(p => p._id === user.userId)
      );
    } else {
      filtered = filtered.filter(chat => 
        !chat.participants.some(p => p._id === user.userId)
      );
    }

    // Apply subject filter
    if (filters.subject) {
      filtered = filtered.filter(chat => 
        chat.subject.toLowerCase() === filters.subject.toLowerCase()
      );
    }

    // Filter out inactive participants if onlyActive is true
    if (filters.onlyActive) {
      filtered = filtered.filter(chat => 
        !chat.participants.some(p => p.onBreak || p.onLeave)
      );
    }

    // Sort by recent messages
    if (filters.recent) {
      filtered.sort((a, b) => {
        const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(a.createdAt);
        const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    }

    return filtered;
  }, [chats, searchTerm, activeTab, filters, user.userId, getOtherParticipant]);

  // Get unique subjects for filtering
  const subjects = useMemo(() => {
    const uniqueSubjects = new Set(chats.map(chat => chat.subject));
    return Array.from(uniqueSubjects);
  }, [chats]);

  // Format timestamp with relative time
  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }, []);

  // Debounced search handler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term: string) => setSearchTerm(term), 300),
    []
  );

  // Handle chat selection
  const handleChatSelect = useCallback(async (chat: ChatListItemInterface) => {
    try {
      if (currentChat.current?._id === chat._id) return;
      setIsLoading(true);
      setError(null);

      localStorage.setItem("currentChat", JSON.stringify(chat));
      currentChat.current = chat;
      socket?.emit("joinChat", chat._id);
      setMessageHandler("");
      await getMessages();
    } catch (err) {
      setError('Failed to load chat messages');
      console.error('Chat selection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentChat, socket, setMessageHandler, getMessages]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-white border-r h-screen flex flex-col shadow-sm"
    >
      {/* Header Section */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-xl">Messages</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              {chats?.some(chat => !chat?.lastMessage?.sender?._id) && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name or subject"
            className="pl-8 pr-8 focus:ring-2 focus:ring-blue-500"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                onClick={() => debouncedSearch('')}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tab Section */}
      <div className="flex gap-1 p-2">
        <Button
          variant={activeTab === 'my' ? 'default' : 'outline'}
          className="flex-1 hover:bg-gray-100"
          onClick={() => setActiveTab('my')}
        >
          <Users className="h-4 w-4 mr-2" />
          My {user.isMentor ? 'Students' : 'Mentors'}
        </Button>
        <Button
          variant={activeTab === 'other' ? 'default' : 'outline'}
          className="flex-1 hover:bg-gray-100"
          onClick={() => setActiveTab('other')}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Other {user.isMentor ? 'Students' : 'Mentors'}
        </Button>
      </div>

      {/* Filters Section */}
      <div className="px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full mb-2 hover:bg-gray-100"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 mb-2"
            >
              <div className="flex flex-wrap gap-2">
                {subjects.map(subject => (
                  <Button
                    key={subject}
                    variant={filters.subject === subject ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters(f => ({ 
                      ...f, 
                      subject: f.subject === subject ? '' : subject 
                    }))}
                    className="flex items-center gap-1"
                  >
                    <BookOpen className="h-3 w-3" />
                    {subject}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={filters.onlyActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters(f => ({ ...f, onlyActive: !f.onlyActive }))}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Active Only
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        {error && (
          <div className="p-4 text-red-500 text-center">
            {error}
            <Button 
              variant="link" 
              onClick={() => setError(null)}
              className="ml-2"
            >
              Dismiss
            </Button>
          </div>
        )}
        
        <div className="p-4">
          <AnimatePresence>
            {filteredChats.map((chat) => {
              const otherParticipant = getOtherParticipant(chat);
              const isParticipantInactive = otherParticipant.onBreak || otherParticipant.onLeave;
              const unreadCount = unreadMessages.filter(
                (message) => message.chat === chat._id
              ).length;

              return (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer
                    transition-colors duration-200 relative
                    ${currentChat.current?._id === chat._id ? 'bg-blue-50' : 'hover:bg-gray-100'}
                    ${unreadCount>0? 'border-blue-500 bg-blue-500/30 font-bold hover:bg-blue-600/20' : 'hover:bg-gray-100'}
                    ${isParticipantInactive ? 'opacity-50' : ''}
                  `}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {otherParticipant.fullName}
                        </p>
                        {isParticipantInactive && (
                          <Badge variant="secondary" className="text-xs">
                            {otherParticipant.onBreak ? 'On Break' : 'On Leave'}
                          </Badge>
                        )}
                      </div>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {chat.subject}
                      </Badge>
                      {otherParticipant.isMentor && (
                        <Badge variant="secondary" className="text-xs">
                          Mentor
                        </Badge>
                      )}
                    </div>
                    <div className=" flex flex-row justify-between">
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                      {chat.lastMessage?.content || "No messages yet"}
                    </p>
                     {/* Unread count will be > 0 when user is on another chat and there is new message in a chat which is not currently active on user's screen */}
                    {unreadCount <= 0 ? null : (
                      <span className="bg-blue-700 h-2 w-2 aspect-square flex-shrink-0 p-2 text-white text-xs rounded-full inline-flex justify-center items-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>  )}
                      </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          )}

          {!isLoading && filteredChats.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No chats found</p>
            </motion.div>
          )}
          </div>
          </ScrollArea>
        </motion.div>
      );
};

export default Sidebar;