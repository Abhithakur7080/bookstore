import { useEffect } from "react";

const useTabCloseEffect = () => {
  useEffect(() => {
    const handleBeforeUnload = () => {
        localStorage.removeItem("redirectAfterLogin");
        localStorage.removeItem("guest_cart");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
};

export default useTabCloseEffect;
