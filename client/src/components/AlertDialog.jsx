import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import "./AlertDialog.css";

export const AlertDialog = ({
  isOpen,
  title,
  message,
  type = "info",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getAlertStyles = () => {
    switch (type) {
      case "danger":
        return {
          borderColor: "#ef4444",
          titleColor: "#dc2626",
          iconBg: "#fee2e2",
          iconColor: "#dc2626",
          confirmBg: "#ef4444",
          confirmHover: "#dc2626",
        };
      case "success":
        return {
          borderColor: "#10b981",
          titleColor: "#059669",
          iconBg: "#d1fae5",
          iconColor: "#059669",
          confirmBg: "#10b981",
          confirmHover: "#059669",
        };
      case "warning":
        return {
          borderColor: "#f59e0b",
          titleColor: "#d97706",
          iconBg: "#fef3c7",
          iconColor: "#d97706",
          confirmBg: "#f59e0b",
          confirmHover: "#d97706",
        };
      default: // info
        return {
          borderColor: "#3b82f6",
          titleColor: "#1d4ed8",
          iconBg: "#dbeafe",
          iconColor: "#1d4ed8",
          confirmBg: "#3b82f6",
          confirmHover: "#1d4ed8",
        };
    }
  };

  const styles = getAlertStyles();

  const getAlertIcon = () => {
    switch (type) {
      case "danger":
        return "❌";
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="alertOverlay" onClick={onCancel}>
      <div
        className="alertDialog"
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: styles.borderColor }}
      >
        <div className="alertHeader">
          <div
            className="alertIcon"
            style={{ backgroundColor: styles.iconBg, color: styles.iconColor }}
          >
            {getAlertIcon()}
          </div>
          <h2 className="alertTitle" style={{ color: styles.titleColor }}>
            {title}
          </h2>
        </div>

        <p className="alertMessage">{message}</p>

        <div className="alertActions">
          {type !== "success" && (
            <button className="btn btnCancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button
            className="btn btnConfirm"
            onClick={onConfirm}
            style={{
              backgroundColor: styles.confirmBg,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.confirmHover;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.confirmBg;
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};