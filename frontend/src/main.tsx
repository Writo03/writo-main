import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Protected from "./components/Protected";
import Profile from "./components/Profile";
import TestSeriesPage from "@/components/ServiceShowPages/TestSeries";
import DoubtSessionPage from "@/components/ServiceShowPages/DoughtSession";
import Details from "@/components/TestSeries/Details";
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

import AboutUs from "@/components/About";
import ContactUs from "@/components/Contact";
import ManageServices from "./pages/admin/ManageServices";
import ServiceCreator from "./pages/admin/ServiceCreator";
import ManageMentors from "./pages/admin/ViewMentors";
import ServiceTest from "./components/ServiceTest";
import TestSeriesList from "@/components/TestSeries/SeriesList";
import ContactMessages from "./pages/admin/ContactMessage";
import AddAdminUser from "./pages/admin/Adduser";
import App from "./App";
import { serviceIds } from "@/utils/contants";
import Chat from "./pages/Chat/Chat";
// import Layout from "./pages/admin/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/profile",
        element: (
          <Protected authentication={true}>
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
        element: (
          <>
            <Outlet />
          </>
        ),
        children: [
          { 
            path: "",
            element: <TestSeriesPage />,
          },
          {
            path: "details/:jeeorneet",
            element: <Details />,
          },
          {
            path: "neet/all",
            element: (
              <TestSeriesList
                pageTitle="Neet"
                pageDescription="Neet"
                serviceId={serviceIds.neet}
              />
            ),
          },
          {
            path: "jee/all",
            element: (
              <TestSeriesList
                pageTitle="Jee"
                pageDescription="Jee"
                serviceId={serviceIds.jee}
              />
            ),
          },
        ],
      },
      {
        path: "doubt-sessions",
        element: <DoubtSessionPage />,
      },
      {
        path: "test",
        element: <ServiceTest />,
        children: [
          {
            path: ":quizId",
            element: <TestSeries />,
          },
          {
            path: "leaderboard/:quizId",
            element: <Leaderboard />,
          },
          {
            path: "quizresult/:resultId",
            element: <QuizResultPage />,
          },
        ],
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
          {
            path: "manage-services",
            element: <ManageServices />,
          },
          {
            path: "create-edit-service/:serviceId?",
            element: <ServiceCreator />,
          },
          {
            path: "manage-mentors",
            element: <ManageMentors />,
          },
          {
            path: "adduser",
            element: <AddAdminUser />,
          },
          {
            path: "contact",
            element: <ContactMessages />,
          },
        ],
      },
      {
        path:"chat",
        element:<Chat />
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "contact",
        element: <ContactUs />,
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
