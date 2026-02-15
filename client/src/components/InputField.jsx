import { ErrorMessage } from "./ErrorMessage";
import "./InputField.css";

export const InputField = ({
  icon,
  label,
  required = false,
  error,
  value,
  onChange,
  placeholder,
  type = "text",
  name,
  disabled = false,
}) => {
  return (
    <div className="inputContainer">
      <label className="inputLabel">
        {icon && <span className="inputIcon">{icon}</span>}
        <span>{label}</span>
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        className={`input ${error ? "hasError" : ""} ${disabled ? "disabled" : ""}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        maxLength={type === "tel" ? 10 : undefined}
      />
      {error && <span className="errorMessage">{error}</span>}
    </div>
  );
};

export const TextAreaField = ({
  icon,
  label,
  required = false,
  error,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
}) => {
  return (
    <div className="inputContainer">
      <label className="inputLabel">
        {icon && <span className="inputIcon">{icon}</span>}
        <span>{label}</span>
        {required && <span className="required">*</span>}
      </label>
      <textarea
        className={`input textarea ${error ? "hasError" : ""} ${disabled ? "disabled" : ""}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
      />
      {error && <span className="errorMessage">{error}</span>}
    </div>
  );
};