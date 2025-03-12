import { redirect } from "next/navigation";
import userAuth from "./userAuth";
interface protectedProps{
    children:React.ReactNode
}
export default function Protected({children}:protectedProps){
    const isAuthenticated=userAuth();
    
    return isAuthenticated ? children :redirect("/")
}