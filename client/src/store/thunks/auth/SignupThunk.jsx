import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "../../../utils/AxiosInstance";
// import type { SignupDataType } from "../../../components/interfaces/auth";

export const SignupThunk = createAsyncThunk("auth/signup",
    async (formdata ,{rejectWithValue})=>{
        try {
            const response = await AxiosInstance.post("/auth/signup",formdata)
            return response.data;
            
        } catch (error) {
            return rejectWithValue(error)
            
        }

    }
)