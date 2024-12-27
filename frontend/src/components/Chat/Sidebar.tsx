import { useState, useCallback, useMemo, useEffect } from "react";
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
  Clock,
  CornerLeftUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/Context/ChatContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSocket } from "@/Context/SocketContext";
import debounce from "lodash/debounce";
import { ChatListItemInterface } from "@/types/chat";
import { useParams } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { useToast } from "../hooks/use-toast";
import { AxiosError } from "axios";
import { ErrorApiRes } from "@/types/all";
import { Link } from "react-router-dom";

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
  const { chats, currentChat, getMessages, unreadMessages, setMessageHandler } =
    useChat();
  const { socket } = useSocket();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("my");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //broadcasting system
  const [isBroadCastSending, setIsBroadcastingSending] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");

  const { toast } = useToast();

  const [filters, setFilters] = useState({
    subject: "",
    unread: false,
    recent: true,
    onlyActive: true,
  });
  const { chatid } = useParams<{ chatid: string }>();

  // Get the other participant in a chat
  const getOtherParticipant = useCallback(
    (chat: ChatListItemInterface) => {
      const participant = chat.participants.find((p) => p._id !== user.userId);
      return participant || chat.participants[0];
    },
    [user.userId],
  );
  // console.log(unreadMessages)
  // Memoized filtered chats
  const filteredChats = useMemo(() => {
    let filtered = [...(chats || [])];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((chat) => {
        const otherParticipant = getOtherParticipant(chat);
        return (
          otherParticipant?.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          chat.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    // Filter based on tab
    if (activeTab === "my") {
      filtered = filtered.filter((chat) =>
        chat.participants.some((p) => p._id === user.userId),
      );
    } else {
      filtered = filtered.filter(
        (chat) => !chat.participants.some((p) => p._id === user.userId),
      );
    }

    // Apply subject filter
    if (filters.subject) {
      filtered = filtered.filter(
        (chat) => chat.subject.toLowerCase() === filters.subject.toLowerCase(),
      );
    }

    // Filter out inactive participants if onlyActive is true
    if (filters.onlyActive) {
      filtered = filtered.filter(
        (chat) => !chat.participants.some((p) => p.onBreak || p.onLeave),
      );
    }

    // Sort by recent messages
    if (filters.recent) {
      filtered.sort((a, b) => {
        const dateA = a.lastMessage
          ? new Date(a.lastMessage.createdAt)
          : new Date(a.createdAt);
        const dateB = b.lastMessage
          ? new Date(b.lastMessage.createdAt)
          : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    }

    return filtered;
  }, [chats, searchTerm, activeTab, filters, user.userId, getOtherParticipant]);

  // Get unique subjects for filtering
  const subjects = useMemo(() => {
    const uniqueSubjects = new Set(chats.map((chat) => chat.subject));
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
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }, []);

  // Debounced search handler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term: string) => setSearchTerm(term), 300),
    [],
  );

  // Handle chat selection
  const handleChatSelect = useCallback(
    async (chat: ChatListItemInterface) => {
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
        setError("Failed to load chat messages");
        console.error("Chat selection error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [currentChat, socket, setMessageHandler, getMessages],
  );

  //send broadcast message
  const handleBroadcastSend = async () => {
    setIsBroadcastingSending(true);
    try {
      if (!broadcastMessage.trim()) return;
      const res = await axiosInstance.post("/message//broadcast-message", {
        content: broadcastMessage,
      });
      toast({
        title: "Message sent",
        description: res.data.message || "Message sent successfully",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorApiRes>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Something went wrong",
      });
    } finally {
      setIsBroadcastingSending(false);
    }
  };

  useEffect(() => {
    const chat = chats.find((chat) => chat._id === chatid);
    if (chat) {
      handleChatSelect(chat);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatid, chats]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex h-screen w-80 flex-col border-r bg-white shadow-sm"
    >
      {/* Header Section */}
      <div className="border-b p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/">
              <CornerLeftUp />
            </Link>
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100"
            >
              <Bell className="h-5 w-5" />
              {chats?.some((chat) => !chat?.lastMessage?.sender?._id) && (
                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mb-3 flex flex-col gap-2">
          <Input
            placeholder="Type message to broadcast"
            className="pl-2 pr-8 focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setBroadcastMessage(e.target.value)}
          />
          <Button disabled={isBroadCastSending} onClick={handleBroadcastSend}>
            Send
          </Button>
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
                onClick={() => debouncedSearch("")}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tab Section */}
      <div className="flex flex-wrap gap-1 p-2">
        <Button
          variant={activeTab === "my" ? "default" : "outline"}
          className="flex-1 hover:bg-gray-100 hover:text-black"
          onClick={() => setActiveTab("my")}
        >
          <Users className="mr-2 h-4 w-4" />
          My {user.isMentor ? "Students" : "Mentors"}
        </Button>
        <Button
          variant={activeTab === "other" ? "default" : "outline"}
          className="flex-1 hover:bg-gray-100"
          onClick={() => setActiveTab("other")}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Other {user.isMentor ? "Students" : "Mentors"}
        </Button>
      </div>

      {/* Filters Section */}
      <div className="px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="mb-2 w-full hover:bg-gray-100"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          <ChevronDown
            className={`ml-2 h-4 w-4 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
          />
        </Button>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-2 space-y-2"
            >
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <Button
                    key={subject}
                    variant={
                      filters.subject === subject ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        subject: f.subject === subject ? "" : subject,
                      }))
                    }
                    className="flex items-center gap-1"
                  >
                    <BookOpen className="h-3 w-3" />
                    {subject}
                  </Button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  variant={filters.onlyActive ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setFilters((f) => ({ ...f, onlyActive: !f.onlyActive }))
                  }
                >
                  <Clock className="mr-1 h-3 w-3" />
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
          <div className="p-4 text-center text-red-500">
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
              const isParticipantInactive =
                otherParticipant.onBreak || otherParticipant.onLeave;
              const unreadCount = unreadMessages.filter(
                (message) => message.chat === chat._id,
              ).length;

              return (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`relative mb-2 flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors duration-200 ${currentChat.current?._id === chat._id ? "bg-blue-50" : "hover:bg-gray-100"} ${unreadCount > 0 ? "border-blue-500 bg-blue-500/30 font-bold hover:bg-blue-600/20" : "hover:bg-gray-100"} ${isParticipantInactive ? "opacity-50" : ""} `}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {otherParticipant.fullName}
                        </p>
                        {isParticipantInactive && (
                          <Badge variant="secondary" className="text-xs">
                            {otherParticipant.onBreak ? "On Break" : "On Leave"}
                          </Badge>
                        )}
                      </div>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {chat.subject}
                      </Badge>
                      {otherParticipant.isMentor && (
                        <Badge variant="secondary" className="text-xs">
                          Mentor
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-row justify-between">
                      <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                        {chat.lastMessage?.content || "No messages yet"}
                      </p>
                      {/* Unread count will be > 0 when user is on another chat and there is new message in a chat which is not currently active on user's screen */}
                      {unreadCount <= 0 ? null : (
                        <span className="inline-flex aspect-square h-2 w-2 flex-shrink-0 items-center justify-center rounded-full bg-blue-700 p-2 text-xs text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
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
              className="py-8 text-center text-gray-500"
            >
              <MessageSquare className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>No chats found</p>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default Sidebar;
