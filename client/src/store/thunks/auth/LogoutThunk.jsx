import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "../../../utils/AxiosInstance";



export const LogoutThunk = createAsyncThunk("auth/logout",
    async (_ ,{rejectWithValue})=>{
        try {
            const response = await AxiosInstance.get("/auth/logout")
            return response.data;
            
        } catch (error) {
            return rejectWithValue(error)
            
        }

    }
)