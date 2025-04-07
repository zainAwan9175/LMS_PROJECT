'use client';
import React, { FC, useState } from 'react';
import Header from './components/Header';
import Heading from './utils/Heading';
import Hero from './components/Route/Hero';
import FAQ from './components/FAQ/FAQ';
import Footer from './components/Footer';
import Reviews
 from './components/Route/Reviews';
import Courses from './components/Route/Courses';
interface Props {}

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  

  return (
    <div>
      <Heading
        title="Elearning"
        description="ELearning is the Platform for students to learn and get help from teachers"
        keywords="Programing,Mern,Ai,Ml"
      />
      <Header   open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route} />
    <Hero></Hero>
    <Courses></Courses>
    <Reviews></Reviews>
    <FAQ></FAQ>
    <Footer></Footer>
    </div>
  );
};

export default Page;
