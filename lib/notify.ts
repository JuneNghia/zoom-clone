import { Slide, toast } from "react-toastify";

const notify = (type: "success" | "error" | "info", text: string) => {
  const defaultConfig: any = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Slide,
  };
  if (type === "success") {
    toast.success(text, {
      ...defaultConfig,
    });
  }
  if (type === "error") {
    toast.error(text, {
      ...defaultConfig,
    });
  } else if (type === "info") {
    toast.info(text, {
      ...defaultConfig,
    });
  }
};

export default notify;
