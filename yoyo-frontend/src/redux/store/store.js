import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slices/users/userSlice';

//create store

const store = configureStore({
	reducer: {
		users: usersReducer,
	},
});

export default store;
