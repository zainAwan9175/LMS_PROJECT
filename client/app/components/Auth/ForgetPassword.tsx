"use client"

import { type FC, useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import toast, { Toaster } from "react-hot-toast" // Added Toaster import
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { styles } from "../../style/style"
import { useForgetpasswordMutation } from "@/redux/features/auth/authApi"
import { signIn } from "next-auth/react"

interface Props {
  setRoute: (route: string) => void
  setOpen: (open: boolean) => void
  refetch?: any
}
//Validation for email and password input

const schema = Yup.object().shape({
    name: Yup.string().required("Please enter your name"),
  email: Yup.string().email("Invalid email").required("Please enter your email"),

})
const ForgetPassword: FC<Props> = ({ setRoute, setOpen, refetch }) => {
  const [show, setShow] = useState(false)
  const [forgetpassword, { isSuccess, error, data }] = useForgetpasswordMutation()
  useEffect(() => {
    if (isSuccess) {
      const message = data?.message 
      toast.success(message)
      setRoute("forgetpasswordotp")

      // refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any
        toast.error(errorData.data.message)
      }
    }
  }, [isSuccess, error, data, setOpen]) // ✅ All dependencies added

  const formik = useFormik({
    initialValues: { name: "", email: "" },
    validationSchema: schema,
    onSubmit: async ({ name,email }) => {
      await forgetpassword({ name, email })
    },
  })

  const { errors, touched, values, handleChange, handleSubmit } = formik
  return (
    <div className="w-full">
      {/* Add Toaster component here */}
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className={styles.title}>Forget Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="w-full mt-5 relative mb-1">
          <label className={styles.label} htmlFor="email">
            Enter Your Name
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="john doe"
            className={`${errors.name&& touched.name && "border-red-500"} ${styles.input}`}
          ></input>
          {errors.email && touched.email && <span className="text-red-500 pt-2 block">{errors.email}</span>}
        </div>
        <div className="w-full mt-5 relative mb-1">
          <label className={styles.label} htmlFor="password">
            Enter Your Email
          </label>
          <input
            type='email'
            name="email"
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="loginmail@gmail.com"
            className={`${errors.email && touched.email && "border-red-500"} ${styles.input}`}
          ></input>
      
        </div>
     
        <div className="w-full mt-6">
          <input type="submit" value="Send OTP" className={`${styles.button} hover:bg-[#0b4b8b]`} />
        </div>
        <h5 className="text-center pt-2 font-Poppins text-[14px] text-[#2190ff] cursor-pointer" onClick={() => setRoute("Forget")}>Forget Password?</h5>
        <br />
       
        
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white ">
          Not have any account?{" "}
          <span className="text-[#2190ff] pl-1 cursor-pointer" onClick={() => setRoute("Sign-Up")}>
            Sign up
          </span>
        </h5>
      </form>
    </div>
  )
}

export default ForgetPassword
