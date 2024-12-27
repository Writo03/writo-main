import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import Loading from "@/components/ui/Loading";
import { useToast } from "@/components/hooks/use-toast";
import { cn } from "@/lib/utils";
import Navbar from "@/MainLayout/NavBar";

const MemoizedNavbar = React.memo(Navbar);

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isloading, setisloading] = useState<boolean>(false);
  const [passType, setPassType] = useState<string>("password");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !name || !phone || !target) {
      setError("All fields are required");
      return;
    }

    try {
      setisloading(true);
      const response = await axiosInstance.post("/user/register", {
        email,
        password,
        fullName: name,
        phone,
        target,
      });
      if (response.status === 200) {
        navigate("/"); // Redirect on success
        setisloading(false);
      }
    } catch (err: unknown) {
      setisloading(false);

      if (axios.isAxiosError(err)) {
        console.log(err.response);
        setError(err.response?.data?.message || "Registration failed");
        toast({
          title: "Error while signup!",
          description: error,
          variant: "destructive",
        });
      } else {
        setError("An unknown error occurred");
        toast({
          title: "Error while signup!",
          description: error,
          variant: "destructive",
        });
      }
      console.error("Sign up failed:", err);
      toast({
        title: "Error while signup!",
        description: error,
        variant: "destructive",
      });
    }
  };
  if (isloading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pb-12 pt-20">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-sm text-red-500">{error}</div>}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="relative mt-1">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

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
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="target"
                className="block text-sm font-medium text-gray-700"
              >
                Target
              </label>
              <div className="mt-1">
                <input
                  id="target"
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign up
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
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
      <SignUp />
    </div>
  );
}
