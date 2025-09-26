import React from "react";
import "./Notification.css";

const NotificationBox = ({ children, type, onClose }) => {
  if (!children) return null;

  const bgColor =
    {
      success: "#4caf50",
      error: "#f44336",
      warning: "#ff9800",
    }[type] || "#2196f3";

  return (
    <div
      style={{
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "5px 10px",
        borderRadius: "5px",
        backgroundColor: bgColor,
        color: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: 9999,
        minWidth: "200px",
      }}
    >
      {children}
      <button
        style={{
          marginLeft: "10px",
          border: "none",
          background: "transparent",
          color: "#626262ff",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        ✖
      </button>
    </div>
  );
};

export default NotificationBox;
