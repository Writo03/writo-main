import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Protected from "./components/Protected";
import State from "./components/State.js";
import Profile from "./components/Profile.js";
import TestSeriesPage from "@/components/ServiceShowPages/TestSeries.js";
import AdminHome from "@/pages/admin/AdminHome.js"
import CheckAdmin from "./components/Admin/CheckAdmin.js";
import AddAdminMentor from "./pages/admin/AddAdminMentor.js";
import { Toaster } from "./components/ui/toaster.js";

import { store } from "./redux/store.js";
import "./index.css";
import TestSeries from "./pages/TestSeries.js";
import Leaderboard from "./pages/Leaderboard.js";
import QuizResultPage from "./components/Resultpage.js";
import ManageQuiz from "./pages/admin/ManageQuiz.js";
import QuizCreator from "./pages/admin/QuizCreator.js";

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
        path: "test",
        element: (
            <TestSeries/>
        ),
      },
      {
        path: "leaderboard/:quizId",
        element: (
            <Leaderboard />
        ),
      },
      {
        path: "quizresult/:quizId",
        element: (
         
            <QuizResultPage />
        ),
      },
      {
        path : "admin",
        element : <CheckAdmin/>,
        children : [
          {
            path : "",
            element : <AdminHome/>
          },
          {
            path : "add-admin-mentor/:role",
            element : <AddAdminMentor/>
          },
          {
            path: "manage-quiz",
            element: <ManageQuiz />,
          },
          {
            path: "add-quiz/:quizId?",
            element: <QuizCreator />,
          }
        ]
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster/>
    </Provider>
  </StrictMode>,
);
