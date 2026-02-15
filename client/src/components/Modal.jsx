import "./Modal.css";

export const Modal = ({
  isOpen,
  title,
  onClose,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className={`modalContent modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modalHeader">
          <h2 className="modalTitle">{title}</h2>
          {showCloseButton && (
            <button className="modalCloseBtn" onClick={onClose}>
              ✕
            </button>
          )}
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
};