import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import userAuth from "./userAuth"; 
interface protectedProps{
    children:React.ReactNode
}
export default function AdminProtected({children}:protectedProps){
    const {user}=useSelector((state:any)=>state.auth)
if(user)
{
    const isadmin=user?.role==="admin"
    
    return isadmin ? children :redirect("/")
}
}