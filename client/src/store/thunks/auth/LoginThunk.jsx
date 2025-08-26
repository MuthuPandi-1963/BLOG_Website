import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "../../../utils/AxiosInstance";
// import type { LoginDataType } from "../../../components/interfaces/auth";



export const LoginThunk = createAsyncThunk("auth/login",
    async (formdata  ,{rejectWithValue})=>{
        try {
            const response = await AxiosInstance.post("/auth/login",formdata)
            return response.data;
            
        } catch (error) {
            return rejectWithValue(error)
            
        }

    }
)