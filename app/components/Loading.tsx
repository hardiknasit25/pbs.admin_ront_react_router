import "./loading.css";

interface LoadingProps {
  message?: string;
}

/**
 * Loading component with a beautiful animated spinner
 */
export function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="spinner-wrapper">
          <div className="spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-dot"></div>
          </div>
        </div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
}
