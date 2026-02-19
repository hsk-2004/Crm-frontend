import React from 'react';

export function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-box">
          {children}
        </div>
      </div>
    </div>
  );
}

const authLayoutStyles = `
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.auth-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}
`;


if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = authLayoutStyles;
  document.head.appendChild(style);
}
