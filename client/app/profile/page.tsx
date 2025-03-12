'use client'
import React, { FC, useState } from 'react';
import Protected from '../hooks/useProtected';
import Header from '../components/Header';
import Profile from '../components/Profile/Profile';
import { useSelector } from 'react-redux';
import Heading from '../utils/Heading';
type Props={}
const page:FC<Props> = () => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const [route, setRoute] = useState("Login");
    const {user} =useSelector((state:any)=>state.auth)
  return (
    <div>
      <Protected>
      <Heading
        title={`${user.name} profile`}
        description="ELearning is the Platform for students to learn and get help from teachers"
        keywords="Programing,Mern,Ai,Ml"
      />
      <Header   open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route} />
        <Profile user={user}></Profile>
      </Protected>
    </div>
  )
}

export default page