import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import "./index.css"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./redux/store.js"

import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Protected from "./components/Protected"

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
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
