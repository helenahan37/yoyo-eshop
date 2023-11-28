const { createAsyncThunk } = require('@reduxjs/toolkit');

//reset error action
export const resetErrorAction = createAsyncThunk('resetErrorAction', () => {
	return {};
});

//reset success action
export const resetSuccessAction = createAsyncThunk('resetSuccessAction', () => {
	return {};
});
