import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "../../../utils/AxiosInstance";



export const VerifyUser = createAsyncThunk("auth/verify_user",
    async (_,{rejectWithValue})=>{
        try {
            const response = await AxiosInstance.get("/auth/verify_user")
            return response.data;
            
        }catch (error) {
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          data: error.response?.data || {},
          message: error.message,
        }); // ✅ only serializable fields
      }
      return rejectWithValue({ message: error.message });
    }
  }

)