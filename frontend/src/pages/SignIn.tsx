import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { AuthState, UserState } from "@/types/user";
import { useAppDispatch } from "@/redux/hooks";
import { login } from "@/redux/auth";
import Loading from "@/components/ui/Loading";
import { useToast } from "@/components/hooks/use-toast";
import { setSubscriptions } from "@/redux/subscriptions";
import { cn } from "@/lib/utils";
import Navbar from "@/MainLayout/NavBar";

const MemoizedNavbar = React.memo(Navbar);

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [passType, setPassType] = useState<string>("password");

  const { toast } = useToast();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [isloading, setisloading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    try {
      setisloading(true);
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });
      if (response.status === 200) {
        // console.log(response)
        const user = response.data?.data.user;
        const accessToken: string = response.data?.data.accessToken;
        const refreshToken: string = response.data?.data.refreshToken;

        await Promise.all([
          localStorage.setItem("accessToken", accessToken),
          localStorage.setItem("refreshToken", refreshToken),
        ]);

        const userState: UserState = {
          userId: user?._id,
          email: user?.email,
          fullName: user?.fullName,
          institution: user?.institution,
          phone: user?.phone,
          target: user?.target,
          isAdmin: user?.isAdmin,
          isMentor: user?.isMentor,
          accessToken: accessToken,
          refreshToken: refreshToken,
          profilePic: user?.profilePic,
          isLoggedIn: true,
          role: user?.role,
        };
        const loginPayload: AuthState = {
          isAuthenticated: true,
          user: userState,
          error: null,
        };
        dispatch(login(loginPayload));
        // Proper navigation logic
        setTimeout(() => {
          const redirectPath =
            localStorage.getItem("redirectPath") ||
            (user.isAdmin ? "/admin" : "/");
          localStorage.removeItem("redirectPath");
          navigate(redirectPath);
        }, 0);

        setisloading(false);
      }
    } catch (err: unknown) {
      setisloading(false);
      if (axios.isAxiosError(err)) {
        console.log(err.response);
        setError(err.response?.data?.message || "Login failed");
        toast({
          title: "Error while Login!",
          description: error,
          variant: "destructive",
        });
      } else {
        setError("An unknown error occurred");
        toast({
          title: "Error while Login!",
          description: error,
          variant: "destructive",
        });
      }
      console.error("Sign in failed:", err);
      toast({
        title: "Error while Login!",
        description: error,
        variant: "destructive",
      });
    }
    try {
      const subscriptionresponse = await axiosInstance.get(
        "/subscription/get-subscriptions?type=active",
      );
      if (subscriptionresponse.status === 200) {
        const serviceIds = subscriptionresponse.data.data.map(
          (subscription: { service: string }) => subscription.service,
        );
        dispatch(setSubscriptions(serviceIds)); // Store only the IDs
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      // if (axios.isAxiosError(err)) {
      //   console.log(err.response)
      //   setError(err.response?.data?.message || '');
      //   toast({
      //     title: 'No subsciptions',
      //     description: error,
      //     variant: 'destructive',
      //   });
      // }
    }
  };
  if (isloading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pb-12 pt-20">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-sm text-red-500">{error}</div>}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="relative mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={passType}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                {passType === "password" ? (
                  <Lock
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                    onClick={() => setPassType("text")}
                  />
                ) : (
                  <LockKeyholeOpen
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                    onClick={() => setPassType("password")}
                  />
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
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

function LockKeyholeOpen({
  className,
  onClick,
}: {
  className?: string;
  onClick?: any;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={cn("lucide lucide-lock-keyhole-open", className)}
      onClick={onClick}
    >
      <circle cx="12" cy="16" r="1" />
      <rect width="18" height="12" x="3" y="10" rx="2" />
      <path d="M7 10V7a5 5 0 0 1 9.33-2.5" />
    </svg>
  );
}

export default function () {
  return (
    <div className="min-h-screen flex-col bg-gray-50">
      <MemoizedNavbar className="absolute" />
      <SignIn />
    </div>
  );
}
