import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import baseURL from '../../../utils/baseURL';
import { resetErrorAction } from '../globalActions/globalAction';
//initial state
const initialState = {
	loading: false,
	error: null,
	users: [],
	user: {},
	profile: {},
	userAuth: {
		loading: false,
		error: null,
		userInfo: {},
	},
};

//create register action
export const registerUserAction = createAsyncThunk(
	'users/register',
	async ({ email, password, fullname }, { rejectWithValue, getState, dispatch }) => {
		try {
			//make the http request
			const { data } = await axios.post(`${baseURL}/users/register`, {
				email,
				password,
				fullname,
			});
			return data;
		} catch (error) {
			console.log(error);
			return rejectWithValue(error?.response?.data);
		}
	}
);
//create login action
export const loginUserAction = createAsyncThunk(
	'users/login',
	async ({ email, password }, { rejectWithValue, getState, dispatch }) => {
		try {
			//make the http request
			const { data } = await axios.post(`${baseURL}/users/login`, {
				email,
				password,
			});
			//save the user into localstorage
			localStorage.setItem('userInfo', JSON.stringify(data));
			return data;
		} catch (error) {
			console.log(error);
			return rejectWithValue(error?.response?.data);
		}
	}
);

//user slice
export const userSlice = createSlice({
	name: 'users',
	initialState,
	extraReducers: (builder) => {
		//handle login action
		builder.addCase(loginUserAction.pending, (state, action) => {
			state.userAuth.loading = true;
		});
		builder.addCase(loginUserAction.fulfilled, (state, action) => {
			state.userAuth.userInfo = action.payload;
			//loading completed, set loading to false
			state.userAuth.loading = false;
		});
		builder.addCase(loginUserAction.rejected, (state, action) => {
			state.userAuth.error = action.payload;
			state.userAuth.loading = false;
		});
		//handle register action
		builder.addCase(registerUserAction.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(registerUserAction.fulfilled, (state, action) => {
			state.user = action.payload;
			//loading completed, set loading to false
			state.loading = false;
		});
		builder.addCase(registerUserAction.rejected, (state, action) => {
			state.error = action.payload;
			state.loading = false;
		});
		//reset error action
		builder.addCase(resetErrorAction.pending, (state) => {
			state.error = null;
		});
	},
});

//create users reducer
const usersReducer = userSlice.reducer;

export default usersReducer;
