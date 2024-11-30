import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import Loading from "../ui/Loading";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CheckAdmin = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin"); // Redirect unauthenticated users to login
    } else if (!user?.isAdmin && !user?.isMentor) {
      navigate("/"); // Redirect unauthorized users to the home page
    }
  }, [isAuthenticated, user, navigate]);

  // If loading or user state is not available, show loading
  if (!user) {
    return <Loading />;
  }

  // Skip breadcrumb rendering if on `/admin` route
  const isOnAdminRoot = location.pathname === "/admin";

  // Generate breadcrumbs dynamically from the current path
  const breadcrumbItems = location.pathname
    .split("/")
    .filter(Boolean) // Remove empty parts
    .map((part, index, array) => {
      const path = `/${array.slice(0, index + 1).join("/")}`; // Construct the breadcrumb path
      return (
        <BreadcrumbItem key={path}>
          <BreadcrumbLink href={path}>{part.toUpperCase()}</BreadcrumbLink>
          {index < array.length - 1 && <BreadcrumbSeparator />}
        </BreadcrumbItem>
      );
    });

  return (
    <div className="relative h-full w-full">
      {/* Breadcrumb UI: Render only if not on `/admin` */}
      {!isOnAdminRoot && (
        <Breadcrumb className="absolute left-0 top-20 px-4 py-2 text-xl">
          <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Nested Routes */}
      <Outlet />
    </div>
  );
};

export default CheckAdmin;
