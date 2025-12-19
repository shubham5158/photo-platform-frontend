import toast from "react-hot-toast";
import CustomToast from "../components/custom-toast.jsx";

export const toastSuccess = (message) =>
  toast.custom(() => (
    <CustomToast type="success" message={message} icon="✔️" />
  ));

export const toastError = (message) =>
  toast.custom(() => (
    <CustomToast type="error" message={message} icon="❌" />
  ));

export const toastWarning = (message) =>
  toast.custom(() => (
    <CustomToast type="warning" message={message} icon="⚠️" />
  ));

export const toastInfo = (message) =>
  toast.custom(() => (
    <CustomToast type="info" message={message} icon="ℹ️" />
  ));
