import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';
import { AuthState, UserState } from '@/types/user';
import { useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/auth';
import Loading from '@/components/ui/Loading';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [isloading, setisloading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password ) {
      setError('All fields are required');
      return;
    }

    try {
      setisloading(true)
      const response = await axiosInstance.post('/user/login', {
        email,
        password,
      });
      if (response.status === 200) {
        const user= response.data?.data.user;
        const accessToken: string = response.data?.data.accessToken;
        const refreshToken: string = response.data?.data.refreshToken;
        console.log(user)
        await Promise.all([
          localStorage.setItem("accessToken", accessToken),
          localStorage.setItem("refreshToken", refreshToken),
        ]);

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
        navigate('/'); // Redirect on success
        setisloading(false)
      }
    } catch (err: unknown) {
      setisloading(false)

      if (axios.isAxiosError(err)) {
        console.log(err.response)
        setError(err.response?.data?.message || 'Login failed');
      } else {
        setError('An unknown error occurred');
      }
      console.error('Sign in failed:', err);
    }
  };
  if(isloading){
    return <Loading />
  }

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8">
        <h2 className="text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;