import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ( data ) => ({
        url: "/course/create-course",
        method: "POST",
        body: data, 
        credentials: "include" as const,
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "/course/get-all-course",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/course/delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),


    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/course/edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),

    getUserAllCourses: builder.query({
      query: () => ({
        url: "/course/get-allCourses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    GetCourseDetails:builder.query({
      query: (id) => ({
        url: `/course/get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    GetCourseContent:builder.query({
      query: (id) => ({
        url: `/course/get-course-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    addNewQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: "/course/add-question",
        body: {
          question,
          courseId,
          contentId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),

    addAnswerInQuestion: builder.mutation({
      query: ({ answer, courseId, contentId, questionId }) => ({
        url: "/course/add-answer",
        body: {
          answer,
          courseId,
          contentId,
          questionId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),

    addReviewInCourse: builder.mutation({
      query: ({ review, rating, courseId }) => ({
        url: `/course/add-review/${courseId}`,
        body: {
          review,
          rating,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),

    addReplyInReview: builder.mutation({
      query: ({ comment, courseId, reviewId }: any) => ({
        url: `/course/add-review-reply`,
        body: {
          comment,
          courseId,
          reviewId,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {useAddReviewInCourseMutation,useAddReplyInReviewMutation,useAddAnswerInQuestionMutation,useAddNewQuestionMutation,useGetCourseContentQuery, useCreateCourseMutation ,useGetAllCoursesQuery,useDeleteCourseMutation,useEditCourseMutation,useGetUserAllCoursesQuery,useGetCourseDetailsQuery} = courseApi; 