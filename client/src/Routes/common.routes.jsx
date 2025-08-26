import { Route } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import Landing from "../pages/Landing";
import Home from "../pages/Home";
import Admin from "../pages/admin";
import LoginPage from "../pages/Login";
import SignupPage from "../pages/Signup";

export const commonRoutes = (
    <Route path="/" element={<HomeLayout/>}>
        <Route index element={<Landing/>}/>
        <Route path="home" element= {<Home/>}/>
        <Route path="admin" element={<Admin/>}/>
        <Route path="login" element={<LoginPage/>}/>
        <Route path="signup" element={<SignupPage/>}/>
    </Route>
)