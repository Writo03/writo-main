import React from "react";
import { Outlet } from "react-router-dom";
import { ReactLenis } from "lenis/react";

import Navbar from "@/MainLayout/NavBar";
import Footer from "@/components/Footer";

// Memoize Navbar to prevent unnecessary re-renders
const MemoizedNavbar = React.memo(Navbar);

// Memoize Footer to prevent unnecessary re-renders
const MemoizedFooter = React.memo(Footer);

export const App = () => {
  return (
    <ReactLenis root options={{ autoRaf: true, smoothWheel: true }}>
      <div className="bg-gradient-to-b from-indigo-50 to-white">
        <MemoizedNavbar />
        {/* <Navbar /> */}
        <Outlet />
        {/* <Footer /> */}
        <MemoizedFooter />
      </div>
    </ReactLenis>
  );
};

export default App;
