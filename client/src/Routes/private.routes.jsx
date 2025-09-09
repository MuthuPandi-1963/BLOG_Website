import { Route } from "lucide-react";
import {Navigate, Outlet} from 'react-router-dom'
export const PrivateRoute = ({isAuthenticated = false,isAdmin = false,children})=>{
    if(isAuthenticated) return <Navigate to={"/"} />
    if(isAdmin) return <Navigate to={"/"} />
    return children;
}