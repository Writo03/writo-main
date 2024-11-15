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

import { store } from "./redux/store.js";
import "./index.css";

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
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
