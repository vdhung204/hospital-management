import { useEffect } from "react";

interface ToastProps {
  show: boolean;
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({ show, message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 2500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`px-5 py-3 rounded-lg shadow-lg text-white 
          ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
      >
        {message}
      </div>
    </div>
  );
}
