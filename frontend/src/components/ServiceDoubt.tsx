import axiosInstance from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loading from './ui/Loading';
import { useAppDispatch } from '@/redux/hooks';
import { setSubscriptions } from '@/redux/subscriptions';
import { useSelector } from 'react-redux';
import { SubscriptionState } from '@/types/all';

const ServiceDoubt = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const subscriptions = useSelector((state: SubscriptionState) => state.subscriptions);

  const navigate = useNavigate();

  // available services
 //"" Doubt session


  // Fetch user subscriptions
  const fetchSubscriptions = async () => {
    try {
      const response = await axiosInstance.get('/subscription/get-subscriptions?type=active');
      if (response.status === 200) {
        const serviceIds = response.data.data.map((subscription: {service: string }) => subscription.service);
        dispatch(setSubscriptions(serviceIds)); // Store only the IDs
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([ fetchSubscriptions()]);
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      // Check if the user is subscribed to specific services
      const hasMatchingService = subscriptions.subscriptions.some(
        (subscription) =>
          subscription === "" 
         
      );
      console.log(hasMatchingService)
      if (!hasMatchingService) {
        navigate('/');
      }
    }
  }, [isLoading, subscriptions, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  return <Outlet />;
};

export default ServiceDoubt;
