import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

function CustomToast(message, type, customOption = undefined)  {
    const toastOptions = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        }
    var options = customOption ? customOption : toastOptions;
  if(type=="success"){
    toast.success(message, {options})
  }
  if(type=="error"){
    toast.error(message, {options})
  }
  
};

export default CustomToast;
