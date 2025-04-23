// src/components/ErrorPage.jsx
import React, { useState, useEffect } from "react";
import { useRouteError, Link } from "react-router-dom";

const errorPageStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: '#1e293b', // Dark, professional background
  color: '#f3f4f6', // Light, readable text
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', // Monospace for that tech/game feel
  padding: '2rem',
  textAlign: 'center',
};

const errorContainerStyle = {
  backgroundColor: '#334155', // Slightly lighter dark background for contrast
  borderRadius: '0.5rem',
  padding: '3rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

const statusStyle = {
  fontSize: '6rem',
  fontWeight: 'bold',
  color: '#f97316', // Orange accent color
  marginBottom: '1rem',
  letterSpacing: '-0.1rem',
};

const messageStyle = {
  fontSize: '1.5rem',
  color: '#cbd5e1',
  marginBottom: '2rem',
};

const buttonStyle = {
  backgroundColor: '#6366f1', // Indigo primary color
  color: '#f0f0f0',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.375rem',
  textDecoration: 'none',
  fontWeight: 'medium',
  transition: 'background-color 0.2s ease-in-out',
};

const buttonHoverStyle = {
  backgroundColor: '#4f46e5',
};

const debugButtonStyle = {
  backgroundColor: '#10b981', // Teal accent for debug
  color: '#f0f0f0',
  padding: '0.5rem 1rem',
  borderRadius: '0.375rem',
  textDecoration: 'none',
  fontWeight: 'normal',
  fontSize: '0.875rem',
  marginTop: '1rem',
  transition: 'background-color 0.2s ease-in-out',
};

const debugButtonHoverStyle = {
  backgroundColor: '#059669',
};

const debugInfoStyle = {
  marginTop: '1.5rem',
  padding: '1rem',
  backgroundColor: '#1e293b',
  borderRadius: '0.375rem',
  textAlign: 'left',
  fontSize: '0.875rem',
  whiteSpace: 'pre-wrap',
  color: '#9ca3af',
};

const lamentContainerStyle = {
  marginTop: '1.5rem',
};

const lamentLabelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  color: '#9ca3af',
  marginBottom: '0.5rem',
};

const lamentInputStyle = {
  backgroundColor: '#334155',
  border: '1px solid #475569',
  color: '#cbd5e1',
  borderRadius: '0.375rem',
  padding: '0.5rem',
  width: '100%',
  boxSizing: 'border-box',
};

const lamentNoteStyle = {
  marginTop: '0.25rem',
  fontSize: '0.75rem',
  color: '#64748b',
};

export default function ErrorPage() {
  const error = useRouteError();
  console.error("[System Error Log]: An anomaly has been detected.", error);

  const status = error.status || 500;
  const defaultMessages = [
    "Why was the JavaScript developer sad ? Because he didn’t null his feelings. 😢",
    "I would love to change the world... But they won’t give me the source code. 💻",
    "There are 10 types of people in the world: Those who understand binary and those who don’t. 🧠",
    "A SQL query walks into a bar... He walks up to two tables and asks, “Can I join you?” 🍻",
    "Git commit -m “fixed bug”  — introduces 5 new bugs 🐛🐛🐛🐛🐛",
  ];
  const [message, setMessage] = useState(error.statusText || error.message || defaultMessages[Math.floor(Math.random() * defaultMessages.length)]);
  const [showDebug, setShowDebug] = useState(false);
  const [lament, setLament] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(defaultMessages[Math.floor(Math.random() * defaultMessages.length)]);
    }, 7000); // Slightly longer interval
    return () => clearTimeout(timer);
  }, [defaultMessages]);

  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  const handleLamentChange = (event) => {
    setLament(event.target.value);
  };

  return (
    <div style={errorPageStyle}>
      <div style={errorContainerStyle}>
        <h1 style={statusStyle}>{status}</h1>
        <p style={messageStyle}>{message}</p>

        <Link
          to="/"
          style={buttonStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
        >
          <span role="img" aria-label="home" style={{ marginRight: '0.5rem' }}>
            🏠
          </span>
          Return to Main System
        </Link>

        <button
          onClick={toggleDebug}
          style={debugButtonStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, debugButtonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, debugButtonStyle)}
        >
          <span role="img" aria-label="magnifying glass" style={{ marginRight: '0.5rem' }}>
            🔍
          </span>
          Access System Logs
        </button>

        {showDebug && (
          <div style={debugInfoStyle}>
            <h3 style={{ color: '#94a3b8', marginBottom: '0.75rem' }}>[Debug Data]:</h3>
            <pre style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        <div style={lamentContainerStyle}>
          <label htmlFor="lament" style={lamentLabelStyle}>
            Submit Error Report (Optional):
          </label>
          <input
            type="text"
            id="lament"
            style={lamentInputStyle}
            placeholder="Enter details..."
            value={lament}
            onChange={handleLamentChange}
          />
          {lament && (
            <p style={lamentNoteStyle}>[Report submitted. Analysis pending.]</p>
          )}
        </div>
      </div>
      <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#64748b' }}>
        [System Status: Unexpected Anomaly Detected]
      </p>
    </div>
  );
}