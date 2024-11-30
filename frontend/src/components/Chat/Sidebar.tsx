import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Settings,
  Bell,
  Filter,
  ChevronDown,
  Users,
  UserPlus,
  Mail,
  MessageSquare,
  Star,
  Clock,
  X,
} from "lucide-react";

// Enhanced Types
interface Student {
  id: number;
  name: string;
  status: 'online' | 'offline' | 'away';
  avatar: string;
  lastMessage?: string;
  unreadCount?: number;
  lastSeen?: string;
  isStarred?: boolean;
  lastActive?: string;
  email?: string;
}

interface FilterOptions {
  recent: boolean;
  unread: boolean;
  starred: boolean;
}

export const Sidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'my' | 'other'>('my');
  const [filters, setFilters] = useState<FilterOptions>({
    recent: false,
    unread: false,
    starred: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Dipjyoti Raj",
      status: "online",
      avatar: "/api/placeholder/32/32",
      lastMessage: "Sure, I'll submit it today",
      unreadCount: 3,
      lastSeen: "Just now",
      isStarred: true,
      email: "dipjyoti@example.com",
      lastActive: "2 minutes ago"
    },
    {
      id: 2,
      name: "Yaswant Singh Soni",
      status: "away",
      avatar: "/api/placeholder/32/32",
      lastMessage: "Thank you for the help!",
      lastSeen: "2h ago",
      isStarred: false,
      email: "yaswant@example.com",
      lastActive: "1 hour ago"
    },
    // Add more students...
  ]);

  // Clear search with animation
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Toggle star status
  const toggleStar = (studentId: number) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, isStarred: !student.isStarred }
          : student
      )
    );
  };

  // Filter students based on all criteria
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilters = 
      (!filters.recent || student.lastActive?.includes('minutes')) &&
      (!filters.unread || student.unreadCount && student.unreadCount > 0) &&
      (!filters.starred || student.isStarred);
    return matchesSearch && matchesFilters;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-white border-r h-screen flex flex-col shadow-lg"
    >
      {/* Header */}
      <motion.div 
        className="p-4 border-b"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <motion.h2 
            className="font-semibold text-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Messages
          </motion.h2>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search Student"
            className="pl-8 pr-8 transition-all duration-200 focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        className="flex gap-1 p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant={activeTab === 'my' ? 'default' : 'outline'}
          className={`${activeTab === 'my' ? 'bg-purple-600' : ''} transition-all duration-200`}
          onClick={() => setActiveTab('my')}
        >
          <Users className="h-4 w-4 mr-2" />
          My Students
        </Button>
        <Button
          variant={activeTab === 'other' ? 'default' : 'outline'}
          onClick={() => setActiveTab('other')}
          className="transition-all duration-200"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Other Students
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full mb-2"
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
              className="space-y-2 mb-2 overflow-hidden"
            >
              <Button
                variant="outline"
                size="sm"
                className={`w-full ${filters.recent ? 'bg-purple-100' : ''}`}
                onClick={() => setFilters(f => ({ ...f, recent: !f.recent }))}
              >
                <Clock className="h-4 w-4 mr-2" />
                Recent
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`w-full ${filters.unread ? 'bg-purple-100' : ''}`}
                onClick={() => setFilters(f => ({ ...f, unread: !f.unread }))}
              >
                <Mail className="h-4 w-4 mr-2" />
                Unread
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`w-full ${filters.starred ? 'bg-purple-100' : ''}`}
                onClick={() => setFilters(f => ({ ...f, starred: !f.starred }))}
              >
                <Star className="h-4 w-4 mr-2" />
                Starred
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Students List */}
      <ScrollArea className="flex-1 px-4 py-2">
        <AnimatePresence>
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg mb-2 transition-colors duration-200"
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                  </Avatar>
                  <motion.span 
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                      ${student.status === 'online' ? 'bg-green-500' : 
                        student.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium truncate">{student.name}</p>
                    <span className="text-xs text-gray-500">{student.lastSeen}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{student.lastMessage}</p>
                  <p className="text-xs text-gray-400">{student.email}</p>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(student.id);
                    }}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      ${student.isStarred ? 'text-yellow-400' : 'text-gray-400'}`}
                  >
                    <Star className="h-4 w-4" />
                  </motion.button>
                  
                  {student.unreadCount && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center"
                    >
                      <Badge variant="destructive" className="rounded-full">
                        {student.unreadCount}
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredStudents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No students found</p>
          </motion.div>
        )}
      </ScrollArea>
    </motion.div>
  );
};

export default Sidebar;