import { styles } from "../../style/style";
import { useUpdatePasswordMutation } from "../../../redux/features/user/userApi";
import React, { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const ChangePassword: FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // RTK Query Mutation
  const [updatePassword, { isSuccess, error, isLoading }] =
    useUpdatePasswordMutation();

  // Submit Handler
  const passwordChangeHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Update button clicked!"); // ✅ Debugging

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      console.log("Passwords do not match!"); // ✅ Debugging
      return;
    }

    try {
      console.log("Sending request to API..."); // ✅ Debugging
      await updatePassword({ oldPassword, newPassword }).unwrap();
      console.log("Password updated successfully!"); // ✅ Debugging

      toast.success("Password changed successfully");

      // Clear input fields after success
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.log("Error received:", err); // ✅ Debugging
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  // Toast notifications for RTK mutation
  useEffect(() => {
    if (isSuccess) {
      toast.success("Password changed successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] text-black dark:text-[#fff] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          {/* Old Password Input */}
          <div className="w-[100%] 800px:w-[60%] mt-5">
            <label className="block pb-2 text-black dark:text-[#fff]">
              Enter your old password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 text-black dark:text-[#fff]`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          {/* New Password Input */}
          <div className="w-[100%] 800px:w-[60%] mt-2">
            <label className="block pb-2 text-black dark:text-[#fff]">
              Enter your new password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 text-black dark:text-[#fff]`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="w-[100%] 800px:w-[60%] mt-2">
            <label className="block pb-2 text-black dark:text-[#fff]">
              Enter your confirm password
            </label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 text-black dark:text-[#fff]`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="w-[100%] 800px:w-[60%] mt-4">
            <button
              type="submit"
              className="w-[95%] h-[40px] border border-[#37a39a] text-center text-black dark:text-[#fff] rounded-[3px] mt-8 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
