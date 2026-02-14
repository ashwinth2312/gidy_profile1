import "../styles/ErrorMessage.css";

export function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="errorMessage">
      <span className="errorIcon">⚠️</span>
      <span className="errorText">{message}</span>
    </div>
  );
}