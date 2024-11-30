import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Send,
    Mic,
    MoreVertical,
    Phone,
    Video,
    PaperclipIcon,
    SmileIcon,
  } from "lucide-react";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import Typing from './Typing';
  interface Message {
    id: number;
    content: string;
    timestamp: string;
    sender: 'user' | 'student';
    status: 'sent' | 'delivered' | 'read';
    type: 'text' | 'file' | 'image';
    fileUrl?: string;
  }
export const ChatInterface: React.FC = () => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [messages, setMessages] = useState<Message[]>([
      {
        id: 1,
        content: "Hello! How can I help you today?",
        timestamp: "10:30 AM",
        sender: "student",
        status: "read",
        type: "text"
      },
      {
        id: 2,
        content: "I have a question about the assignment.",
        timestamp: "10:31 AM",
        sender: "user",
        status: "delivered",
        type: "text"
      },
      // Add more messages...
    ]);
  
    const handleSendMessage = () => {
      if (message.trim()) {
        const newMessage: Message = {
          id: messages.length + 1,
          content: message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'user',
          status: 'sent',
          type: 'text'
        };
        setMessages([...messages, newMessage]);
        setMessage('');
      }
    };
  
    return (
      <div className="flex-1 h-full flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback>GY</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">Garima Yadav</h2>
                <p className="text-sm text-gray-500">Active now</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Voice Call</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Video Call</TooltipContent>
                </Tooltip>
              </TooltipProvider>
  
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                  <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
  
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md rounded-lg p-3 ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p>{msg.content}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs opacity-70">{msg.timestamp}</span>
                    {msg.sender === 'user' && (
                      <span className="text-xs opacity-70">
                        {msg.status === 'sent' ? '✓' : msg.status === 'delivered' ? '✓✓' : '✓✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="animate-pulse"><Typing /></div>
              </div>
            )}
          </div>
        </ScrollArea>
  
        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <PaperclipIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Attach File</TooltipContent>
              </Tooltip>
            </TooltipProvider>
  
            <Input
              placeholder="Write Something!"
              className="flex-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
  
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <SmileIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Emoji</TooltipContent>
              </Tooltip>
            </TooltipProvider>
  
            <Button variant="ghost" size="icon">
              <Mic className="h-5 w-5" />
            </Button>
  
            <Button
              size="icon"
              className="bg-purple-600"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  

export default ChatInterface
