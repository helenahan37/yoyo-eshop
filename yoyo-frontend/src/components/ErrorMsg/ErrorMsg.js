import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { resetErrorAction } from '../../redux/slices/globalActions/globalAction';

const ErrorMsg = ({ message }) => {
	const dispatch = useDispatch();
	Swal.fire({
		icon: 'error',
		title: 'Oops...',
		text: message,
	});
	dispatch(resetErrorAction());
};

export default ErrorMsg;
