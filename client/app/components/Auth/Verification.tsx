"use client"

import { useActivationMutation, useRegisterMutation } from "@/redux/features/auth/authApi"
import { type FC, useEffect, useRef, useState } from "react"
import toast, { Toaster } from "react-hot-toast" // Import Toaster
import { VscWorkspaceTrusted } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { styles } from "../../style/style"

type Props = {
  setRoute: (route: string) => void
}

type VerifyNumber = {
  "0": string
  "1": string
  "2": string
  "3": string
  "4": string
  "5": string
}

const Verification: FC<Props> = ({ setRoute }) => {
  const { token, user } = useSelector((state: any) => state.auth)
  const [activation, { isSuccess, error, data }] = useActivationMutation()
  const [registerUser] = useRegisterMutation()
  const [invalidError, setInvalidError] = useState<boolean>(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [showResendButton, setShowResendButton] = useState(false)
  // Add a ref to store the timer
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  //Handle API responses
  useEffect(() => {
    if (isSuccess && data) {
      toast.success("Account activated successfully")
      // Delay navigation to allow toast to be visible
      setTimeout(() => {
        setRoute("Login")
      }, 2000) // 2 seconds delay
    }
    if (error) {
      const errorData = error as any
      if ("data" in error) {
        toast.error(errorData.data.message)
      } else {
        toast.error("An unexpected error occurred")
      }
      setInvalidError(true) // Trigger shake effect
    }
  }, [isSuccess, error, data, setRoute])

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  })

  // Function to start the timer
  const startTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Start a new timer
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev === 1) {
          setShowResendButton(true)
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
          return 0
        }
        return prev > 0 ? prev - 1 : 0
      })
    }, 1000)
  }

  // Start the timer on component mount
  useEffect(() => {
    startTimer()

    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Handle OTP verification
  const verifyHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("")
    if (verificationNumber.length !== 6) {
      setInvalidError(true) // Trigger shake effect for incomplete code
      toast.error("Please enter a complete 6-digit code")
      return
    }
    console.log({
      activationToken: token,
      activationCode: verificationNumber,
    })
    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    })
  }

  // Handle resend OTP functionality
  const handleResendOtp = async () => {
    try {
      if (user) {
        await registerUser({
          name: user.name,
          email: user.email,
          password: user.password,
        })
        setResendTimer(60)
        setShowResendButton(false)
        // Restart the timer when OTP is resent
        startTimer()
        toast.success("OTP resent successfully")
      } else {
        toast.error("User information not found")
      }
    } catch (err) {
      toast.error("Failed to resend OTP")
    }
  }

  // Handle input change and focus management
  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false) // Reset error state on valid input
    const newVerifyNumber = { ...verifyNumber, [index]: value }
    setVerifyNumber(newVerifyNumber)

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus()
    } else if (value.length === 1 && index < 5) {
      inputRefs[index + 1].current?.focus()
    }
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} /> {/* Add Toaster component */}
      <h1 className={`${styles.title} text-center`}>Verify your account</h1>
      <div className="w-full flex items-center justify-center mt-6">
        <div className="w-[80px] h-[80px] rounded-full bg-blue-600 flex items-center justify-center">
          <VscWorkspaceTrusted size={40} className="text-white" />
        </div>
      </div>
      <div className="mt-10 flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`w-16 h-16 bg-transparent border-[3px] rounded-[10px] text-center text-[18px] font-Poppins outline-none text-black dark:text-white ${
              invalidError ? "shake border-red-500" : "border-gray-400"
            }`}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            maxLength={1}
          />
        ))}
      </div>
      {/* Resend OTP section */}
      {showResendButton ? (
        <div className="w-full flex justify-center mt-5">
          <button className="text-blue-600 hover:text-blue-700 font-Poppins text-[14px]" onClick={handleResendOtp}>
            Resend OTP
          </button>
        </div>
      ) : (
        <p className="text-center mt-5 text-[14px] font-Poppins text-gray-600 dark:text-gray-300">
          Resend OTP in {resendTimer} seconds
        </p>
      )}
      <div className="w-full flex justify-center mt-10">
        <button className={`${styles.button} hover:bg-blue-700`} onClick={verifyHandler}>
          Verify OTP
        </button>
      </div>
      <h5 className="text-center mt-6 text-[14px] font-Poppins text-gray-600 dark:text-gray-300">
        Go back to Sign in?{" "}
        <span className="text-blue-600 cursor-pointer underline" onClick={() => setRoute("Login")}>
          Sign in
        </span>
      </h5>
    </div>
  )
}

export default Verification

