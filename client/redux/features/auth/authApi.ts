import { apiSlice } from "../api/apiSlice";
import { userRegistration } from "./authSlice";
import { userLoggedIn } from "./authSlice";
import { userLoggedOut } from "./authSlice";
type RegistrationResponse = {
    message: string;
    activationToken: string;
    user:any
};

type RegistrationData = {}; // Add properties as needed
type forgetresponse={
    message: string;
    activationToken: string;
    user:any
}
type forgetdata={
    name:string,
    email:string,
}
type ActivationData = {
    activation_token: string;
    activation_code: string;
};

type LoginResponse = {
    accessToken: string;
    user: any; // Replace `any` with a proper User type
};

type LoginData = {
    email: string;
    password: string;

};

type socialData = {
    email: string;
    name: string;
    socialimage:string
};
export const authApi = apiSlice.injectEndpoints({
    overrideExisting: true, // To prevent conflicts
    endpoints: (builder) => ({
        register: builder.mutation<RegistrationResponse, RegistrationData>({
            query: (data) => ({
                url: "/user/registration",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userRegistration({
                            token: result.data.activationToken,
                            user:result.data.user
                        })
                    );
                } catch (error) {
                    console.log(error);
                }
            },
        }),

        activation: builder.mutation<void, ActivationData>({
            query: ({ activation_token, activation_code }) => ({
                url: "/user/activate-user",
                method: "POST",
                body: { activation_token, activation_code },
                credentials: "include" as const,
            }),
        }),

        login: builder.mutation<LoginResponse, LoginData>({
            query: ({ email, password }) => ({
                url: "/user/login",
                method: "POST",
                body: { email, password },
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            accessToken: result.data.accessToken,
                            user: result.data.user,
                        })
                    );
                } catch (error) {
                    console.log(error);
                }
            },
        }),


        socialAuth: builder.mutation<LoginResponse, socialData>({
            query: ({ email, name ,socialimage}) => ({
                url: "/user/socialAuth",
                method: "POST",
                body: { email, name,socialimage },
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                            accessToken: result.data.accessToken,
                            user: result.data.user,
                        })
                    );
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        logOut: builder.query({
            query: () => ({
                url: "/user/logout",
                method: "GET",
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                  dispatch(userLoggedOut());
                } catch (error) {
                  console.log(error);
                }
              },
        }),
        forgetpassword: builder.mutation<forgetresponse, forgetdata>({
            query: (data) => ({
              url: "/user/forgetpassword",
              method: "POST",
              body: data,
              credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
              try {
                const result = await queryFulfilled;
                dispatch(
                  userRegistration({
                    token: result.data.activationToken,
                    user: result.data.user,
                  })
                );
              } catch (error) {
                console.log(error);
              }
            },
          }),
          

        checkResetPasswordOtp: builder.mutation({
            query: (data) => ({
              url: "/user/checkResetPasswordOtp",
              method: "POST",
              body: data,
            }),
          }),
          resetPassword: builder.mutation({
            query: (data) => ({
              url: "/user/resetPassword",
              method: "POST",
              body: data,
            }),
          }),
       
        

    }),
});

export const { useRegisterMutation, useActivationMutation, useLoginMutation,useSocialAuthMutation,useLogOutQuery ,useForgetpasswordMutation,  useCheckResetPasswordOtpMutation,
    useResetPasswordMutation,
    } = authApi;
