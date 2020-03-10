import React from 'react'
import ToastMessage from '../components/presentational/ToastMessage'
import { toast } from 'react-toastify';

const setSuccessMessage = (msg) => {
    return (
        toast.success(<ToastMessage msg={msg} />, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            className: 'toast-success-notice-container',
            bodyClassName: "toast-notice-body",
            hideProgressBar: true,
            closeButton: false,
            draggable: false,
            closeOnClick: false,
        })
    )
}

const setErrorMessage = (msg) => {
    return (
        toast.success(<ToastMessage msg={msg} />, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
            className: 'toast-error-notice-container',
            bodyClassName: "toast-notice-body",
            hideProgressBar: true,
            closeButton: false,
            draggable: false,
            closeOnClick: false,
        })
    )
}

export default {
    setSuccessMessage,
    setErrorMessage
}