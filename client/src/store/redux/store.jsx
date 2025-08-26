import {configureStore} from '@reduxjs/toolkit'
import { AuthReducers } from '../slices/AuthSlice';

export const store = configureStore({
    
    reducer :{
        auth : AuthReducers,
    },
})
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;