import Hero from '../components/Hero';
import Products from '../components/Products';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import { RootState } from '@/types/state';
import { useSelector } from 'react-redux';

const Home = () => {
  const user= useSelector((state : RootState)=> state.auth)
  console.log(user)
  return (
    <>
      <Hero />
      <Products />
      <Features />
      <Testimonials />
    </>
  );
};

export default Home;