import React, { useEffect, useState, Suspense } from 'react';
import { Outlet } from "react-router-dom";
import { login, setIsAuthenticated } from '@/redux/auth';
import { useAppDispatch } from '@/redux/hooks';
import { AuthState, UserState } from '@/types/user';
import axiosInstance from '@/utils/axiosInstance';
import Navbar from "@/MainLayout/NavBar";
import Footer from "@/MainLayout/Footer";
import Loading from "./components/ui/Loading";

// Memoize stable components
const MemoizedNavbar = React.memo(Navbar);
const MemoizedFooter = React.memo(Footer);

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const checkAuthStatus = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken?.trim()) {
      dispatch(setIsAuthenticated(false));
      return false;
    }

    try {
      const { data: { data: user } } = await axiosInstance.get('/user/self');
      
      if (!user) {
        throw new Error('No user data received');
      }

      const userState: UserState = {
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
        institution: user.institution,
        phone: user.phone,
        target: user.target,
        accessToken,
        refreshToken,
        isAdmin: user.isAdmin,
        isMentor: user.isMentor,
        profilePic: user.profilePic,
        isLoggedIn: true,
        role:user?.role
      };

      const loginPayload: AuthState = {
        isAuthenticated: true,
        user: userState,
        error: null,
      };

      dispatch(login(loginPayload));
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear tokens on auth failure
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(setIsAuthenticated(false));
      return false;
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.error('App initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
    
    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        initializeApp();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <Loading />
      </div>
    );
  }

  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
          <Loading />
        </div>
      }
    >
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white">
        <MemoizedNavbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <MemoizedFooter />
      </div>
    </Suspense>
  );
};

export default App;