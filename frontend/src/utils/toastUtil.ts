import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

class ToastUtil {
    success(message: string, options: ToastOptions = {}) {
        toast.success(message, {...defaultOptions, ...options});
    }

    error(message: string, options: ToastOptions = {}) {
        toast.error(message, {...defaultOptions, ...options});
    }

    info(message: string, options: ToastOptions = {}) {
        toast.info(message, {...defaultOptions, ...options});
    }

    warn(message: string, options: ToastOptions = {}) {
        toast.warn(message, {...defaultOptions, ...options});
    }
}

export const toastUtil = new ToastUtil();