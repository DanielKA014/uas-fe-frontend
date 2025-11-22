import { Spinner } from "react-bootstrap";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({
  fullScreen = false,
  size = "md",
}: LoadingSpinnerProps) {
  const containerClasses = fullScreen
    ? "loading-spinner-fullscreen"
    : "loading-spinner-inline";

  const spinnerSize = size === "sm" ? 30 : size === "lg" ? 80 : 50;

  return (
    <div className={containerClasses}>
      <Spinner
        animation="border"
        role="status"
        style={{
          width: `${spinnerSize}px`,
          height: `${spinnerSize}px`,
          borderWidth: "4px",
        }}
        className="spinner-border-primary"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
