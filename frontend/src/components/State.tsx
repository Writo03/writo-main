import App from '@/App';
import { login, setIsAuthenticated } from '@/redux/auth';
import { useAppDispatch } from '@/redux/hooks';
import { AuthState, UserState } from '@/types/user';
import axiosInstance from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react'

const State = () => {

    const [isloading, setisloading] = useState<boolean>(false)
    const dispatch = useAppDispatch()
  
    useEffect(() => {
      const fetechdata = async () => {
        setisloading(true);
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (!accessToken || accessToken.trim() === "") {
          dispatch(setIsAuthenticated(false));
          setisloading(false);
          return;
        }
        try {
          const response = await axiosInstance.get('/user/self')
          if (response.data) {
            const user= response.data?.data;
  
            const userState: UserState = {
                userId: user?._id,
                email: user?.email,
                fullName:user?.fullName,
                accessToken: accessToken,
                refreshToken: refreshToken,
                isLoggedIn: true,
              };
              const loginPayload: AuthState = {
                isAuthenticated: true,
                user: userState,
                error: null,
              };
              dispatch(login(loginPayload));
          } else if (response.error) {
            
            dispatch(setIsAuthenticated(false));
            setisloading(false);
            return;
          }
        } catch (error: unknown) {
          dispatch(setIsAuthenticated(false));
        } finally {
          setisloading(false);
  
        }
      }
      fetechdata()
    }, [dispatch])
  
    if (isloading) {
      return <h1>loading</h1>;
    }
    return <App />
  }

export default State
