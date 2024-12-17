import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Send,
  MoreVertical,
  Phone,
  Video,
  PaperclipIcon,
  Badge,
  User2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Typing from './Typing';
// import {  useParams } from 'react-router-dom';
import { useChat } from '@/Context/ChatContext';
import { useSocket } from '@/Context/SocketContext';
import { isImageFile, requestHandler } from '@/utils/helper';
import { sendMessage } from '@/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { toast } from '../hooks/use-toast';
import { ChatListItemInterface } from '@/types/chat';



// interface Chat {
//   _id: string;
//   subject: string;
//   isMentorChat: boolean;
//   isPrimary: boolean;
//   mentor: string;
//   participants: Participant[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   lastMessage?: LastMessage;
// }

// interface Participant {
//   _id: string;
//   email: string;
//   fullName: string;
//   phone: number;
//   profilePic: string;
//   isMentor: boolean;
//   subject?: string; // Optional since not all participants might have a subject
//   onBreak: boolean;
//   onLeave: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface LastMessage {
//   _id: string;
//   sender: Sender;
//   content: string;
//   attachments: string[]; // Assuming attachments are strings (URLs)
//   chat: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface Sender {
//   _id: string;
//   email: string;
//   fullName: string;
//   profilePic: string;
// }


const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";

export const ChatInterface: React.FC = () => {
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [selfTyping, setSelfTyping] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  // const { chatid } = useParams<{ chatid: string }>();

  const {
    currentChat,
    setMessagesHandler,
    messages,
    isTyping,
    message,
    setMessageHandler,
    isConnected,
    updateChatLastMessage,
  } = useChat();
  const { socket } = useSocket();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth', // Smooth scrolling for animation
      });
    }
  }, []);
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Check if the user is scrolled to the bottom
    setIsScrolledToBottom(scrollHeight - scrollTop - clientHeight < 1);
  }, []);
  
  useEffect(() => {
    if (isScrolledToBottom && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isScrolledToBottom, scrollToBottom]);

  const handleFileAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + attachedFiles.length > 5) {
      toast({
        description:"Maximum 5 files can be attached"
      });
      return;
    }
  
    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "spx0jjqq"); // Replace with Cloudinary preset
          const response = await fetch("https://api.cloudinary.com/v1_1/dlsxjstxo/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          if (data.secure_url) {
            return data.secure_url; // Return the Cloudinary URL
          }
          throw new Error("Upload failed");
        })
      );
  
      setAttachedFiles((prev) => [...prev, ...uploadedFiles]);
    } catch (error) {
      console.log(error)
      toast({
        description: "uploading files. Please try again."
      });
    }
  };
  

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const sendChatMessage = async () => {
    // console.log(currentChat)
    if (!currentChat.current?._id || !socket || (!message.trim() && attachedFiles.length === 0)) return;

    socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);

    await requestHandler(
      async () => await sendMessage(currentChat.current?._id || "", message, attachedFiles),
      setSendMessageLoading,
      (res) => {
        setMessageHandler("");
        setAttachedFiles([]);
        setMessagesHandler([res.data, ...messages]);
        updateChatLastMessage(currentChat.current?._id || "", res.data);
        scrollToBottom();
      },
      (error) => console.log(error)
    );
  };


  const handleOnMessageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Update the message state with the current input value
    setMessageHandler(e.target.value);
    // If socket doesn't exist or isn't connected, exit the function
    if (!socket || !isConnected) return;

    // Check if the user isn't already set as typing
    if (!selfTyping) {
      // Set the user as typing
      setSelfTyping(true);

      // Emit a typing event to the server for the current chat
      socket.emit(TYPING_EVENT, currentChat.current?._id);
    }

    // Clear the previous timeout (if exists) to avoid multiple setTimeouts from running
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Define a length of time (in milliseconds) for the typing timeout
    const timerLength = 3000;

    // Set a timeout to stop the typing indication after the timerLength has passed
    typingTimeoutRef.current = setTimeout(() => {
      // Emit a stop typing event to the server for the current chat
      socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);

      // Reset the user's typing state
      setSelfTyping(false);
    }, timerLength);
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getOtherParticipant = useCallback((chat: ChatListItemInterface | null) => {
    if(!chat) return 
    const participant = chat?.participants.find(
      (p) => p._id !== user.userId
    );
    // Return metadata specific to individual chats.
    return participant;
    // return chat.participants.find(p => p._id !== user.userId) || chat.participants[0];
  }, [user.userId]);
  const otherParticipant = getOtherParticipant(currentChat.current);


  // useEffect(() => {
  //   const createNewChat = async () => {
    
      
  //      const res =await createUserChat(subject)
  //      console.log(res)
     
  //   };
  //   createNewChat();
  // }, [])
  

  // useEffect(() => {
  //   const isChatPresent = chats.some((chat) => chat._id === chatid);
  //   if (!isChatPresent) {
  //     toast({
  //       description:"Chat not found."
  //     });
  //   }
  // }, [chats, chatid]);
  
  return (
    <div className="flex-1 h-full flex flex-col bg-gray-50">
   <div className="p-4 border-b bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherParticipant?.profilePic} />
              <AvatarFallback><User2 /></AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium">{otherParticipant?.fullName}</h2>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-sm text-gray-500">Active now</span>
                </span>
                {isTyping && (
                  <Badge  className="text-xs">
                    <Typing />
                  </Badge>
                )}
              </div>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
       

      {/* Messages Area */}
      <div 
          onScroll={handleScroll}
          className="flex-1 p-4 overflow-y-auto"
          ref={scrollAreaRef}
        >
          <div className="space-y-4 flex flex-col-reverse overflow-y-auto" 

          >
            {isTyping && <Typing />}
            {messages.map((msg,index) => (
              <div
                key={msg._id}
                ref={index === 0 ? lastMessageRef : null}
                className={`flex ${msg.sender._id === user.userId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-md rounded-lg p-3 my-1 ${
                    msg.sender._id === currentChat.current?.participants[0]._id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
          <p>{msg.content}</p>
          
          {msg.attachments?.length > 0 && (
            <div className="mt-2 space-y-2">
              {msg.attachments.map((file) => (
                <div
                  key={file._id}
                  className="group relative aspect-square rounded-xl overflow-hidden w-48"
                >
                  {isImageFile(file.url) ? (
                    <>
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={file.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Download
                        </a>
                      </div>
                      <img
                        src={file.url}
                        alt="attachment"
                        className="h-full w-full object-cover"
                      />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-100 text-sm p-4">
                      No preview available
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-end gap-1 mt-2">
            <span className="text-xs opacity-70">
              {formatMessageTime(msg.createdAt)}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        {attachedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-1 bg-gray-100 rounded p-1">
                <span className="text-sm truncate max-w-[150px]">{file}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-center">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileAttachment}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
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
            onChange={handleOnMessageChange}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
          />

          <Button
            size="icon"
            className="bg-purple-600"
            onClick={sendChatMessage}
            disabled={!message.trim() && attachedFiles.length === 0||sendMessageLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

};

export default ChatInterface;