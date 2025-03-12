import { apiSlice } from "../api/apiSlice";

type UpdateAvatar = {
    avatar: string;
};

type EditProfileData = {
    name: string;
    email: string;
};
type updatePasswordData = {
    oldPassword: string;
    newPassword: string;
};

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAvatar: builder.mutation<void, UpdateAvatar>({
            query: ({ avatar }) => ({
                url: "/user/update-user-profile-picture",
                method: "PUT",
                body: { avatar }, // Fixed incorrect body
                credentials: "include" as const, // Fixed typo
            }),
        }),
        EditProfile: builder.mutation<void, EditProfileData>({
            query: ({ name, email }) => ({
                url: "/user/update-user-info",
                method: "PUT",
                body: { name, email }, // Removed unnecessary parentheses
                credentials: "include" as const, // Fixed typo
            }),
        }),

        updatePassword: builder.mutation<void, updatePasswordData>({
            query: ({ oldPassword, newPassword }) => ({
                url: "/user/update-user-password",
                method: "PUT",
                body: { oldPassword, newPassword }, // Removed unnecessary parentheses
                credentials: "include" as const, // Fixed typo
            }),
        }),
    }),
});

export const { useUpdateAvatarMutation, useEditProfileMutation,useUpdatePasswordMutation } = userApi;
