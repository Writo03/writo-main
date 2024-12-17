import React, { useState } from 'react';
import { createUserChat } from '@/api';
import { useNavigate } from 'react-router-dom';

interface ChatButtonProps {
  buttonText: string;
  subject: string
}

const ChatButton: React.FC<ChatButtonProps> = ({ buttonText,subject }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>('');
    const navigate = useNavigate()
  const handleClick = async () => {
    setIsLoading(true);
    setResponseMessage('');

    try {
        const createNewChat = async () => {
        const res =await createUserChat(subject)
        console.log(res)
        const chatid = res.data.data
        navigate(`/chat/${chatid}`)
    
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
