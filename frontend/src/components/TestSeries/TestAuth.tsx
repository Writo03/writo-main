import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setSubscriptions } from "@/redux/subscriptions";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import Loading from "../ui/Loading";
import { Outlet } from "react-router-dom";

const TestAuth = () => {
  const isAutheticated = useAppSelector((state) => state.auth.isAuthenticated);
  const subscriptions = useAppSelector(
    (state) => state.subscriptions.subscriptions,
  );

  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const getSubscriptions = async () => {
      if (!isAutheticated) {
        setIsLoading(false);
        return;
      }
      if (subscriptions.length) return;
      try {
        const response = await axiosInstance.get(
          "/subscription/get-subscriptions?type=active",
        );
        const serviceIds = response.data.data.map(
          (sub: { service: string }) => sub.service,
        );
        dispatch(setSubscriptions(serviceIds));
      } catch (error) {
        setIsLoading(false);

        console.error("Error fetching subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getSubscriptions();
  }, [isAutheticated, subscriptions.length, dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default TestAuth;
