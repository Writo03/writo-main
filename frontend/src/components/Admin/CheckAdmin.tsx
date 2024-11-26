import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../ui/Loading";

const CheckAdmin = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(true)

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // navigate("/login");
    }

    if (!user.isAdmin || !user.isMentor) {
      // navigate("/");
    }
    setLoading(false)
  }, [isAuthenticated, user, navigate]);

  if(loading){
    return <Loading/>
  }

  return <Outlet />;
};

export default CheckAdmin;
