import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import "../styles/AlertDialog.css";

export function AlertDialog({ 
  isOpen, 
  title, 
  message, 
  type = "info", 
  onConfirm, 
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) {
  const { isDark } = useContext(ThemeContext);

  if (!isOpen) return null;

  return (
    <div className="alertOverlay">
      <div className={`alertDialog alertDialog-${type}`}>
        <div className="alertHeader">
          <h3 className="alertTitle">{title}</h3>
          <button 
            className="alertClose" 
            onClick={onCancel}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="alertBody">
          <p className="alertMessage">{message}</p>
        </div>

        <div className="alertFooter">
          <button 
            className="alertBtn alertBtnCancel" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`alertBtn alertBtnConfirm alertBtnConfirm-${type}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}