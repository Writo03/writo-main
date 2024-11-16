import Hero from '../components/Hero';
import Products from '../components/Products';
import Features from '../components/Features';
import { RootState } from '@/types/state';
import { useSelector } from 'react-redux';
import Testimonials from '@/components/Testimonials';

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