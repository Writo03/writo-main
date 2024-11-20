import axiosInstance from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loading from './ui/Loading';
import { useAppDispatch } from '@/redux/hooks';
import { setSubscriptions } from '@/redux/subscriptions';
import { useSelector } from 'react-redux';
import { serviceState, SubscriptionState } from '@/types/all';
import { setServices } from '@/redux/services';

const ServiceTest = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const subscriptions = useSelector((state: SubscriptionState) => state.subscriptions);
  const services = useSelector((state: serviceState) => state.services);
  console.log(services)
  const navigate = useNavigate();

  // Fetch available services from the backend
  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get('/service/get-services');
      if (response.status === 200) {
        setAvailableServices(response.data.data.map((service: any) => service.name.toLowerCase()));
        dispatch(setServices(response.data.data))
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Fetch user subscriptions
  const fetchSubscriptions = async () => {
    try {
      const response = await axiosInstance.get('/subscription/get-subscriptions?type=active');
      if (response.status === 200) {
        dispatch(setSubscriptions(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchServices(), fetchSubscriptions()]);
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      // Check if the user is subscribed to any service matching the list of available services
      const hasMatchingService = subscriptions.subscriptions.some((subscription) =>
        availableServices.includes(subscription.name.toLowerCase())
      );
      if (!hasMatchingService) {
        navigate('/');
      }
    }
  }, [isLoading, subscriptions, availableServices, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  return <Outlet />;
};

export default ServiceTest;
