import { configureStore } from '@reduxjs/toolkit'
import adminReducer from './slices/Admin.slice'


export const store = configureStore({
    reducer: {
       admin: adminReducer,
    },
})