import React from 'react';
import './Loading.css';

export function Loading({ fullscreen = false }) {
  return (
    <div className={`loading ${fullscreen ? 'loading-fullscreen' : ''}`}>
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}
