"use client"

import Image from "next/image"
import { styles } from "../../style/style"
import { type FC, useEffect, useState } from "react"
import { AiOutlineCamera } from "react-icons/ai"
import avatardefault from "../../../public/assests/avatardefault.jpeg"
import { useUpdateAvatarMutation } from "../../../redux/features/user/userApi"
import { useEditProfileMutation } from "../../../redux/features/user/userApi"
import { useLoadUserQuery } from "../../../redux/features/api/apiSlice"
import { toast } from "react-hot-toast"
import Loader from "../Loader/Loader"

type Props = {
  avatar: string
  user: any
}

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name)
  const [updateAvatar, { isSuccess, isLoading, error }] = useUpdateAvatarMutation()

  const [EditProfile, { isSuccess: success, error: updateError, isLoading: updateLoading }] = useEditProfileMutation()

  const [loadUser, setLoadUser] = useState(false)
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true })

  const imageHandler = async (e: any) => {
    const fileReader = new FileReader()

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result
        updateAvatar({ avatar })
      }
    }
    fileReader.readAsDataURL(e.target.files[0])
  }

  useEffect(() => {
    if (isSuccess) {
      // Show success toast for avatar update
      toast.success("Avatar updated successfully!")
      setLoadUser(true)
    }
    if (error) {
      // Show error toast for avatar update
      const errorMessage = error && "data" in error ? (error.data as any)?.message : "Avatar update failed"
      toast.error(errorMessage)
      console.log(error)
    }
    if (success) {
      // Show success toast for profile update
      toast.success("Profile updated successfully!")
      setLoadUser(true)
    }
    if (updateError) {
      // Show error toast for profile update
      const errorMessage =
        updateError && "data" in updateError ? (updateError.data as any)?.message : "Profile update failed"
      toast.error(errorMessage)
      console.log(updateError)
    }
  }, [isSuccess, error, success, updateError])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (name !== "") {
      EditProfile({
        name,
        email: user.email,
      })
    }
  }

  return (
    <>
      <div className="w-full flex justify-center">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="relative">
            <Image
              src={user.avatar || avatar ? user.avatar?.url || avatar : avatardefault}
              alt="User avatar"
              width={120}
              height={120}
              className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
            />
            <input
              type="file"
              name=""
              id="avatar"
              className="hidden"
              onChange={imageHandler}
              accept="image/png,image/jpg,image/jpeg,image/webp"
            />
            <label htmlFor="avatar">
              <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
                <AiOutlineCamera size={20} className="z-1" />
              </div>
            </label>
          </div>
        )}
      </div>
      <br />
      <br />
      {updateLoading ? (
        <Loader />
      ) : (
        <div className="w-full pl-6 800px:pl-10">
          <form onSubmit={handleSubmit}>
            <div className="800px:w-[50%] m-auto block pb-4">
              <div className="w-[100%]">
                <label className="block pb-2 dark:text-white">Full Name</label>
                <input
                  type="text"
                  className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="w-[100%] pt-2">
                <label className="block pb-2 dark:text-white">Email Address</label>
                <input
                  type="text"
                  readOnly
                  className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                  required
                  value={user?.email}
                />
              </div>
              <input
                type="submit"
                className="w-full 800px:w-[250px] h-[40px] border border-[cyan] text-center dark:text-white rounded-[3px] mt-8 cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-500 text-white transition-all duration-300 ease-in-out hover:from-blue-500 hover:to-cyan-500 hover:scale-105"
                required
                value="Update"
              />
            </div>
          </form>
          <br />
        </div>
      )}
    </>
  )
}

export default ProfileInfo

