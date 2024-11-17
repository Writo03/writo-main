import React from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedProps {
  children: React.ReactNode;
  authentication: boolean;
  redirectTo?: string; // Customizable redirect path
  fallback?: React.ReactNode; // Optional fallback UI
}

const Protected: React.FC<ProtectedProps> = ({
  children,
  authentication,
  redirectTo = "/signin",
  fallback = null,
}) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!authentication) {
      const timer = setTimeout(() => {
        navigate(redirectTo);
      }, 2000); // Delay navigation for user feedback
      return () => clearTimeout(timer);
    }
  }, [authentication, navigate, redirectTo]);

  if (!authentication) {
    return (
      <div className="flex justify-center items-center h-screen">
        {fallback || (
          <p className="text-gray-500 text-center">
            You are not authorized to view this page. Redirecting...
          </p>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default Protected;
