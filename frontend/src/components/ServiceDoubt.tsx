import axiosInstance from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loading from './ui/Loading';
import { useAppDispatch,useAppSelector } from '@/redux/hooks';
import { setSubscriptions } from '@/redux/subscriptions';
import { serviceIds } from '@/utils/contants';
import { RootState } from '@/types/state';
import { useSelector } from 'react-redux';

const ServiceDoubt = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const role = useSelector((state: RootState) => state.auth.user.role);
  const ismentoraccess = role.map((role)=>{
    if(role==='CHAT'){
      return true;
    }
  })
  const dispatch = useAppDispatch();
  const subscriptions = useAppSelector((state) => state.subscriptions.subscriptions);
  const navigate = useNavigate();

  // Fetch user subscriptions
  const fetchSubscriptions = async () => {
    try {
      const response = await axiosInstance.get('/subscription/get-subscriptions?type=active');
      if (response.status === 200) {
        const serviceIds = response.data.data.map((subscription: { service: string }) => subscription.service);
        dispatch(setSubscriptions(serviceIds)); // Store only the IDs
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchSubscriptions()]);
      setIsLoading(false);
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); 

  useEffect(() => {
    if (isLoading || ismentoraccess ) return;
    // Check if the user is subscribed to the required service
    const requiredServiceId = serviceIds.doubtSession
    const hasMatchingService = subscriptions.includes(requiredServiceId);

    if (!hasMatchingService) {
      navigate('/'); // Redirect if the user is not subscribed
    }
  }, [isLoading,  subscriptions, navigate,ismentoraccess]);

  if (isLoading) {
    return <Loading />;
  }

  return <Outlet />;
};

export default ServiceDoubt;

