import Hero from "../components/Hero";
import Products from "../components/Products";
import Features from "../components/Features";
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
  return <MamoHome />;
};

export default Home;
