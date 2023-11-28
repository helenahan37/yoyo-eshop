import React from 'react';

//access to individual component we want to render as a children
const AdminRoute = ({ children }) => {
	//get user from localstorage
	const user = JSON.parse(localStorage.getItem('userInfo'));

	//if user is admin, redirect to admin page
	const isAdmin = user?.userFound?.isAdmin ? true : false;

	//if user is not loggin return to login component
	if (!isAdmin) {
		return <h1>Access denied</h1>;
	}

	return <div>{children}</div>;
};

export default AdminRoute;
