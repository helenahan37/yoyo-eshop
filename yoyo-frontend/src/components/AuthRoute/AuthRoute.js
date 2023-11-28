import React from 'react';
import Login from '../Users/Forms/Login';

//access to individual component we want to render as a children
const AuthRoute = ({ children }) => {
	//get user from localstorage
	const user = JSON.parse(localStorage.getItem('userInfo'));

	//if user is not logged in, redirect to login page
	const isUserLoggedIn = user?.token ? true : false;

	//if user is not loggin return to login component
	if (!isUserLoggedIn) {
		return <Login />;
	}

	return <div>{children}</div>;
};

export default AuthRoute;
