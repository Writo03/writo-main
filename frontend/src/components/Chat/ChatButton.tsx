import React, { useState } from 'react';
import { createUserChat } from '@/api';
import {  useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { serviceIds } from '@/utils/contants';
import { toast } from '../hooks/use-toast';
import axios from 'axios';

interface ChatButtonProps {
  buttonText: string;
  subject: string
}

const ChatButton: React.FC<ChatButtonProps> = ({ buttonText,subject }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const isAutheticated = useAppSelector((state) => state.auth.isAuthenticated);
  const subscriptions = useAppSelector((state) => state.subscriptions.subscriptions);

    const navigate = useNavigate()
  const handleClick = async () => {
    setIsLoading(true);
    setResponseMessage('');
    if (!isAutheticated) {
      localStorage.setItem("redirectPath", location.pathname); // Save current path
      navigate('/signin')
      return;
    }
    const requiredServiceId = serviceIds.doubtSession
    const hasMatchingService = subscriptions.includes(requiredServiceId);
    if (!hasMatchingService) {
    //  navigate('/');
    console.log("open model")
    setIsLoading(false);
     return;
     // Redirect if the user is not subscribed
    }

    try {
        const createNewChat = async () => {
          try {
            const res =await createUserChat(subject)
            const chatid = res.data.data
            navigate(`/chat/${chatid}`)
          } catch (error:unknown) {
            if (axios.isAxiosError(error)) {

              toast({description:error.response?.data.message}) 
            }
          }

    };
    createNewChat();
    } catch (error) {
      console.error('API call failed:', error);
      setResponseMessage('Error: Failed to fetch data.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
      >
        {isLoading ? 'Loading...' : buttonText}
      </button>
      {responseMessage && <p className="mt-2 text-gray-600">{responseMessage}</p>}
    </div>
  );
};

export default ChatButton;
