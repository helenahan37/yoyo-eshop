const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');
const { axios } = require('axios');
const baseURL = require('../../../utils/baseURL');

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

//create login action
export const loginUserAction = createAsyncThunk(
	'users/login',
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
	},
});

//create users reducer
const usersReducer = userSlice.reducer;

export default usersReducer;
