import Hero from "../components/Hero";
import Products from "../components/Products";
import Features from "../components/Features";
import { RootState } from "@/types/state";
import { useSelector } from "react-redux";
import Testimonials from "@/components/Testimonials";

import { memo } from "react";

const HomeUi = () => {
  return (
    <>
      <Hero />
      <Products />
      <Features />
      <Testimonials />
    </>
  );
};

const MamoHome = memo(HomeUi);

const Home = () => {
  const user = useSelector((state: RootState) => state.auth);
  console.log(user);

  return <MamoHome />;
};

export default Home;
