import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


export const App = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  );
};

export default App;