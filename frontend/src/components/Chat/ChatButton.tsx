import React, { useState } from 'react';
import { createUserChat } from '@/api';
import {  useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { serviceIds } from '@/utils/contants';
import { toast } from '../hooks/use-toast';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

interface ChatButtonProps {
  buttonText: string;
  subject: string
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unlock Doubt Sessions</DialogTitle>
          <DialogDescription>
            To access this feature, you need to subscribe to one of our plans. Click below to explore available options.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button className="ml-2" onClick={onSubscribe}>
            Subscribe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};




const ChatButton: React.FC<ChatButtonProps> = ({ buttonText,subject }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    setIsModalOpen(true); // Open subscription modal
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
  const handleSubscribe = () => {
    setIsModalOpen(false);
    // navigate('#paymentsection'); // Redirect to subscription page
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
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
};

export default ChatButton;







