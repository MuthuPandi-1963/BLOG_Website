import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "../../../utils/AxiosInstance";
// import type { OTPDataType } from "../../../components/interfaces/auth";



export const OTPThunk = createAsyncThunk("auth/otp",
    async (formdata  ,{rejectWithValue})=>{
        try {
            const response = await AxiosInstance.post("/auth/verify_otp",formdata)
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