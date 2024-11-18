import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Protected from "./components/Protected";
import State from "./components/State";
import Profile from "./components/Profile";
import TestSeriesPage from "@/components/ServiceShowPages/TestSeries";
import DoubtSessionPage from "@/components/ServiceShowPages/DoughtSession";
import AdminHome from "@/pages/admin/AdminHome";
import CheckAdmin from "./components/Admin/CheckAdmin";
import AddAdminMentor from "./pages/admin/AddAdminMentor";
import { Toaster } from "./components/ui/toaster";

import { store } from "./redux/store";
import "./index.css";
import TestSeries from "./pages/TestSeries";
import Leaderboard from "./pages/Leaderboard";
import QuizResultPage from "./components/Resultpage";
import ManageQuiz from "./pages/admin/ManageQuiz";
import QuizCreator from "./pages/admin/QuizCreator";

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
          <Protected authentication={false}>
            <Profile />
          </Protected>
        ),
      },
      {
        path: "/signin",
        element: (
          <Protected authentication={false}>
            <SignIn />
          </Protected>
        ),
      },
      {
        path: "/signup",
        element: (
          <Protected authentication={false}>
            <SignUp />
          </Protected>
        ),
      },
      {
        path: "test-series",
        element: <TestSeriesPage />,
      },
      {
        path: "doubt-sessions",
        element: <DoubtSessionPage />,
      },
      {
        path: "test",
        element: <TestSeries />,
      },
      {
        path: "leaderboard/:quizId",
        element: <Leaderboard />,
      },
      {
        path: "quizresult/:quizId",
        element: <QuizResultPage />,
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
          {
            path: "manage-quiz",
            element: <ManageQuiz />,
          },
          {
            path: "add-quiz/:quizId?",
            element: <QuizCreator />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </StrictMode>,
);
