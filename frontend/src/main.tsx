import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Protected from "./components/Protected";
import State from "./components/State.js";
import Profile from "./components/Profile.js";
import TestSeriesPage from "@/components/ServiceShowPages/TestSeries.js";
import AdminHome from "@/pages/admin/AdminHome.js";
import CheckAdmin from "./components/Admin/CheckAdmin.js";
import AddAdminMentor from "./pages/admin/AddAdminMentor.js";
import { Toaster } from "./components/ui/toaster.js";

import { RootState, store } from "./redux/store.js";
import "./index.css";
import TestSeries from "./pages/TestSeries.js";
import Leaderboard from "./pages/Leaderboard.js";
import QuizResultPage from "./components/Resultpage.js";

const App = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <State />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/profile",
          element: (
            <Protected authentication={isAuthenticated}>
              <Profile />
            </Protected>
          ),
        },
        {
          path: "/signin",
          element: (
            <Protected authentication={!isAuthenticated}>
              <SignIn />
            </Protected>
          ),
        },
        {
          path: "/signup",
          element: (
            <Protected authentication={!isAuthenticated}>
              <SignUp />
            </Protected>
          ),
        },
        {
          path: "test-series",
          element: <TestSeriesPage />,
        },
        {
          path: "test",
          element: (
            <Protected authentication={isAuthenticated}>
              <TestSeries />
            </Protected>
          ),
        },
        {
          path: "leaderboard/:quizId",
          element: (
            <Protected authentication={isAuthenticated}>
              <Leaderboard />
            </Protected>
          ),
        },
        {
          path: "quizresult/:quizId",
          element: (
            <Protected authentication={isAuthenticated}>
              <QuizResultPage />
            </Protected>
          ),
        },
        {
          path: "admin",
          element: <CheckAdmin />,
          children: [
            {
              path: "",
              element: <AdminHome />,
            },
            {
              path: "add-admin-mentor/:role",
              element: <AddAdminMentor />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </StrictMode>
);

