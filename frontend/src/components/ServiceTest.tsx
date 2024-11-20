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
  const dispatch = useAppDispatch();
  const services = useSelector((state: SubscriptionState) => state.subscriptions);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/subscription/get-subscriptions?type=active');
        if (response.status === 200) {
          dispatch(setSubscriptions(response.data.data));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      // Check if any subscription has the name "Neet Test Series" or "JEE Test Series"
      const hasTestService = services.subscriptions.some(
        (subscription) =>
          subscription.name.toLowerCase() === 'neet test series' ||
          subscription.name.toLowerCase() === 'jee test series'
      );
      if (!hasTestService) {
        navigate('/');
      }
    }
  }, [isLoading, services, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  return <Outlet />;
};

export default ServiceTest;
