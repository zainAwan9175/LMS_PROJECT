import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const initialState={
    token:"",
    user:"",
};

export  const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        userRegistration:(state,action:PayloadAction<{token:string,user:any}>)=>{
            state.token=action.payload.token;
            state.user=action.payload.user

        },
        userLoggedIn:(state,action:PayloadAction<{accessToken:string,user:string}>)=>{
            state.token=action.payload.accessToken ;
            state.user=action.payload.user;

        },
        userLoggedOut:(state)=>{
            state.token="";
            state.user="";

        }
    }
})

export const {userLoggedIn,userRegistration,userLoggedOut}=authSlice.actions