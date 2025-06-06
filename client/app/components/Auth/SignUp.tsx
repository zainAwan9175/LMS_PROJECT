"use client"

import { type FC, useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { styles } from "../../style/style"
import { useRegisterMutation } from "@/redux/features/auth/authApi"
import toast, { Toaster } from "react-hot-toast"

interface Props {
  setRoute: (route: string) => void
}

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name"),
  email: Yup.string().email("Invalid email").required("Please enter your email"),
  password: Yup.string().required("Please enter your password").min(6),
})

const SignUp: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false)
  const [register, { error, data, isSuccess }] = useRegisterMutation()

  useEffect(() => {
    if (isSuccess && data) {
      const message = data.message || "Registration successful"
      toast.success(message)
      // Delay navigation to allow toast to be visible
      setTimeout(() => {
        setRoute("Verification")
      }, 2000) // 2 seconds delay
    }

    if (error && "data" in error) {
      const errorMessage = (error as any).data.message || "Something went wrong"
      toast.error(errorMessage)
    }
  }, [isSuccess, error, data, setRoute])

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = { name, email, password }
      await register(data)
    },
  })

  const { errors, touched, values, handleChange, handleSubmit } = formik
  return (
    <div className="w-full">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className={styles.title}>Join to ELearning</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className={`${styles.label}`} htmlFor="email">
            Enter your Name
          </label>
          <input
            type="text"
            name=""
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="johndoe"
            className={`${errors.name && touched.name && "border-red-500"} ${styles.input}`}
          />
          {errors.name && touched.name && <span className="text-red-500 pt-2 block">{errors.name}</span>}
        </div>
        <div className="w-full mt-5 relative mb-1">
          <label className={styles.label} htmlFor="email">
            Enter Your Email
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="loginmail@gmail.com"
            className={`${errors.email && touched.email && "border-red-500"} ${styles.input}`}
          ></input>
          {errors.email && touched.email && <span className="text-red-500 pt-2 block">{errors.email}</span>}
        </div>
        <div className="w-full mt-5 relative mb-1">
          <label className={styles.label} htmlFor="password">
            Enter Your Password
          </label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="password!@%"
            className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`}
          ></input>
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer text-black dark:text-white"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>
        {errors.password && touched.password && <span className="text-red-500 pt-2 block">{errors.password}</span>}
        <div className="w-full mt-6">
          <input type="submit" value="Sign Up" className={`${styles.button} hover:bg-[#0b4b8b]`} />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">Or join with</h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          <AiFillGithub size={30} className="cursor-pointer ml-2" />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Already have an account?{" "}
          <span className="text-[#2190ff] pl-1 cursor-pointer " onClick={() => setRoute("Login")}>
            Sign in
          </span>
        </h5>
        <button
          onClick={() => {
            console.log("Test button clicked")
            toast.success("Test toast")
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Toast
        </button>
      </form>
    </div>
  )
}

export default SignUp

