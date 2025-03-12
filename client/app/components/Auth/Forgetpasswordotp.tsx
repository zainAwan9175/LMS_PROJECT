"use client"

import type React from "react"
import { type FC, useEffect, useState, useRef } from "react"
import { styles } from "../../style/style"
import toast, { Toaster } from "react-hot-toast"
import {
  useCheckResetPasswordOtpMutation,
  useForgetpasswordMutation,
  useResetPasswordMutation,
} from "@/redux/features/auth/authApi"

import { useSelector } from "react-redux"

interface Props {
  setRoute: (route: string) => void
  setOpen: (open: boolean) => void
  refetch?: any
}

const Forgetpasswordotp: FC<Props> = ({ setRoute, setOpen, refetch }) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""])
  const [resendTimer, setResendTimer] = useState(60)
  const [showResendButton, setShowResendButton] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [invalidError, setInvalidError] = useState<boolean>(false)
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  // Add a ref to store the timer
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  // Get the activation token from Redux store
  const { token } = useSelector((state: any) => state.auth)
  const { user } = useSelector((state: any) => state.auth)
  console.log(token)
  console.log("tempuser", user)

  const [checkResetPasswordOtp, { isLoading: isVerifying, isSuccess: isVerifySuccess, error: verifyError }] =
    useCheckResetPasswordOtpMutation()
  const [resendOtp, { isLoading: isResending }] = useForgetpasswordMutation()
  const [resetPassword, { isLoading: isResetting, isSuccess: isResetSuccess, error: resetError }] =
    useResetPasswordMutation()

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

  useEffect(() => {
    if (isVerifySuccess) {
      setOtpVerified(true)
      toast.success("OTP verified successfully")
    }
    if (verifyError) {
      if ("data" in verifyError) {
        const errorData = verifyError as any
        toast.error(errorData.data.message || "Invalid OTP")
        setInvalidError(true) 
      }
    }
  }, [isVerifySuccess, verifyError])

  useEffect(() => {
    if (isResetSuccess) {
      toast.success("Password reset successfully")
      setTimeout(() => {
        setRoute("Login")
      }, 1500)
    }
    if (resetError) {
      if ("data" in resetError) {
        const errorData = resetError as any
        toast.error(errorData.data.message || "Failed to reset password")
      }
    }
  }, [isResetSuccess, resetError, setRoute])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (isNaN(Number(value))) return

    const newOtp = [...otp]
    // Consider only the last character if somehow multiple characters are entered
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    // Move to next input if current field is filled
    if (value && index < 3 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs[index - 1].current) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()
    
    // Check if pasted content is a number and has correct length
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("").slice(0, 4)
      const newOtp = [...otp]
      
      digits.forEach((digit, index) => {
        if (index < 4) newOtp[index] = digit
      })
      
      setOtp(newOtp)
      
      // Focus the next empty input or the last input if all are filled
      const nextEmptyIndex = newOtp.findIndex(val => val === "")
      if (nextEmptyIndex !== -1 && inputRefs[nextEmptyIndex].current) {
        inputRefs[nextEmptyIndex].current?.focus()
      } else if (inputRefs[3].current) {
        inputRefs[3].current?.focus()
      }
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join("")

    if (otpCode.length !== 4) {
      toast.error("Please enter the complete 4-digit OTP")
      return
    }

    await checkResetPasswordOtp({
      activation_token: token,
      activation_code: otpCode,
    })
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 4) {
      toast.error("Password must be at least 4 characters long")
      return
    }

    await resetPassword({
      activation_token: token,
      newpassword: passwordData.newPassword,
    })
  }

  const handleResendOtp = async () => {
    try {
      if (user) {
        await resendOtp({
          name: user.name,
          email: user.email,
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

  return (
    <div className="w-full">
      <Toaster position="top-center" reverseOrder={false} />

      <h1 className={styles.title}>{otpVerified ? "Reset Password" : "Verify Email"}</h1>
      <p className="text-center font-Poppins text-[14px] text-black dark:text-white mb-6">
        {otpVerified ? "Enter your new password" : "We've sent a 4-digit verification code to your email"}
      </p>

      {!otpVerified ? (
        <form onSubmit={handleVerifyOtp}>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className={`w-12 h-12 md:w-16 md:h-16 bg-transparent border-2 rounded-md text-center text-lg font-medium outline-none text-white ${
                  invalidError ? "shake border-red-500" : "border-[#3a3a50]"
                } focus:border-blue-500 transition-colors`}
                required
              />
            ))}
          </div>

          {showResendButton ? (
            <div className="text-center mb-4">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-sm text-[#2190ff] hover:text-[#0b4b8b]"
              >
                Resend OTP
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 mb-4">Resend OTP in {resendTimer} seconds</p>
          )}

          <div className="w-full mt-6">
            <input
              type="submit"
              value={isVerifying ? "Verifying..." : "Verify OTP"}
              disabled={isVerifying}
              className={`${styles.button} hover:bg-[#0b4b8b] ${isVerifying ? "opacity-70 cursor-not-allowed" : ""}`}
            />
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div className="w-full mt-5 relative mb-4">
            <label className={styles.label} htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              className={`${styles.input}`}
              required
            />
          </div>

          <div className="w-full mt-5 relative mb-4">
            <label className={styles.label} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              className={`${styles.input}`}
              required
            />
          </div>

          <div className="w-full mt-6">
            <input
              type="submit"
              value={isResetting ? "Resetting..." : "Reset Password"}
              disabled={isResetting}
              className={`${styles.button} hover:bg-[#0b4b8b] ${isResetting ? "opacity-70 cursor-not-allowed" : ""}`}
            />
          </div>
        </form>
      )}

      <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
        Back to{" "}
        <span className="text-[#2190ff] pl-1 cursor-pointer" onClick={() => setRoute("Login")}>
          Login
        </span>
      </h5>
    </div>
  )
}

export default Forgetpasswordotp