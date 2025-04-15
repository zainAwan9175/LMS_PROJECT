import { apiSlice } from "../api/apiSlice";

export const notificationApi=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getAllnotifications:builder.query({
            query:()=>({
                url:"/notification/get-all-notification",
                method:"GET",
                credentials:"include" as const
            })
        }),
        updateNotificationStatus:builder.mutation({
            query:(id)=>({
                url:`/notification/update-status/${id}`,
                method:"PUT",
                credentials:"include" as const
            })
        })
    })
})
export const {useGetAllnotificationsQuery,useUpdateNotificationStatusMutation}=notificationApi