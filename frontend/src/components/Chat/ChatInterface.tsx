import React, { useEffect, useRef, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/Context/ChatContext';
import { useSocket } from '@/Context/SocketContext';
import { requestHandler } from '@/utils/helper';
import { sendMessage, deleteMessage, createUserChat } from '@/api';

interface UserInterface {
  _id: string;
  avatar: string;
  email: string;
  username: string;
}

interface ChatMessageInterface {
  _id: string;
  sender: Pick<UserInterface, "_id" | "avatar" | "email" | "username">;
  content: string;
  chat: string;
  attachments: {
    url: string;
    localPath: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";

export const ChatInterface: React.FC = () => {
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selfTyping, setSelfTyping] = useState(false);

  const navigate = useNavigate();

  const {
    currentChat,
    chats,
    isLoadingMessages,
    setMessagesHandler,
    messages,
    updateChatLastMessageOnDeletion,
    isTyping,
    message,
    setMessageHandler,
    isConnected,
    updateChatLastMessage,
  } = useChat();
  const { socket } = useSocket();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + attachedFiles.length > 5) {
      // toast.error("Maximum 5 files can be attached");
      return;
    }
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };
  console.log(messages)

  const sendChatMessage = async () => {
    console.log(currentChat)
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
      },
      (error) => console.log(error)
    );
  };

  // const handleMessageDelete = async (messageToDelete: ChatMessageInterface) => {
  //   await requestHandler(
  //     async () => await deleteMessage(messageToDelete.chat, messageToDelete._id),
  //     null,
  //     (res) => {
  //       setMessagesHandler(messages.filter(msg => msg._id !== res.data._id));
  //       updateChatLastMessageOnDeletion(messageToDelete.chat, messageToDelete);
  //     },
  //     (error) => toast.error(error.message)
  //   );
  // };
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


  // useEffect(() => {
  //   const createNewChat = async () => {
  //     // If no user is selected, show an alert
  //     const selectedsubject="Mathematics"
  //      const res =await createUserChat(selectedsubject)
  //       // currentChat.current = chats[0];
  //       // console.log(currentChat.current._id)

  //     // Handle the request to create a chat
     
  //   };
  //   createNewChat();
  // }, [])
  

  return (
    <div className="flex-1 h-full flex flex-col bg-gray-50">
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
              key={msg._id}
              className={`flex ${msg.sender._id === currentChat.current?.participants[0]._id ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-md rounded-lg p-3 ${
                msg.sender._id === currentChat.current?.participants[0]._id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}>
                <p>{msg.content}</p>
                {msg.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.attachments.map(attachment => (
                      <div key={attachment._id} className="flex items-center gap-2">
                        <a 
                          href={attachment.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm underline"
                        >
                          {attachment.url.split('/').pop()}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-xs opacity-70">
                    {formatMessageTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isTyping && <Typing />}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        {attachedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-1 bg-gray-100 rounded p-1">
                <span className="text-sm truncate max-w-[150px]">{file.name}</span>
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
            disabled={!message.trim() && attachedFiles.length === 0}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;