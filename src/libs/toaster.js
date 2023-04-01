import { toast } from "react-hot-toast";
export const toaster = (msg) =>
  toast(msg, {
    icon: "👏",
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  });
