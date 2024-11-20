import axiosInstance from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loading from './ui/Loading';
import { useAppDispatch } from '@/redux/hooks';
import { setSubscriptions } from '@/redux/service';
import { useSelector } from 'react-redux';
import { SubscriptionState } from '@/types/all';

const ServiceTest = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const services = useSelector((state: SubscriptionState) => state.subscriptions);
  const navigate = useNavigate();

  // Fetch available services from the backend
  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get('/service/get-services');
      if (response.status === 200) {
        setAvailableServices(response.data.data.map((service: any) => service.name.toLowerCase()));
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
      const hasMatchingService = services.subscriptions.some((subscription) =>
        availableServices.includes(subscription.name.toLowerCase())
      );
      if (!hasMatchingService) {
        navigate('/');
      }
    }
  }, [isLoading, services, availableServices, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  return <Outlet />;
};

export default ServiceTest;
