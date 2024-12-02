import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useNavigate } from "react-router-dom";
import Loading from "./ui/Loading";

const Protected = ({
  children,
  authentication = true,
}: {
  children: React.ReactNode;
  authentication: boolean;
}) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authentication && !isAuthenticated) {
      navigate("/signin");
    } else if (!authentication && isAuthenticated) {
      navigate("/");
    }
    setLoader(false);
  }, [isAuthenticated, authentication, navigate]);

  return loader ? <Loading /> : <>{children}</>;
};

export default Protected;
