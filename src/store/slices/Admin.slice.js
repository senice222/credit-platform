import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from '../../core/axios'

const initialState = {
    loading: true,
    data: null,
    error: null
}
export const fetchAuth = createAsyncThunk('user/fetchAdminData', async (params) => {
    try {
        const {data} = await axios.post('admin/login', params)
        localStorage.setItem("token", data.token)
        return data.admin
    } catch (e) {
        return e.response.data.message
    }
})
export const fetchAuthMe = createAsyncThunk('admin/fetchAuthMe', async () => {
    const {data} = await axios.get('admin/me')
    return data
})
export const userSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            localStorage.removeItem('token')
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAuth.pending, (state, action) => {
            state.data = null
            state.loading = true
        })
        builder.addCase(fetchAuth.fulfilled, (state, action) => {
            if (!action.payload.login) {
                state.data = null
                state.error = 'Errored'
                state.loading = false
            } else {
                state.data = action.payload
                state.loading = false
                state.error = null
            }
        })
        builder.addCase(fetchAuthMe.pending, (state, action) => {
            state.data = null
            state.loading = true
        })
        builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
            state.data = action.payload
            state.loading = false
        })
        builder.addCase(fetchAuthMe.rejected, (state, action) => {
            state.data = null
            state.loading = false
        })

    }
})

export const { logout } = userSlice.actions

export default userSlice.reducer