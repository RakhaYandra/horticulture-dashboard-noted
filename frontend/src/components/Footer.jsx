import React from "react";
import logo from "../assets/logo.png";

const Footer = () => {
  const footerStyle = {
    borderTop: "1px solid #dee2e6",
    padding: "10px 0",
    background: "linear-gradient(to right, #f8f9fa, white, #f8f9fa)",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "8px",
    position: "fixed",
    left: "0",
    bottom: "0",
    width: "100%",
    paddingRight: "2rem",
    zIndex: 1000,
  };

  const textStyle = {
    color: "#666",
    margin: 0,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const highlightStyle = {
    color: "#098B2D",
    fontWeight: 600,
  };

  return (
    <footer style={footerStyle}>
      <img
        src={logo}
        alt="logo"
        style={{
          verticalAlign: "middle",
          width: "90px",  
          height: "26.7px",
        }}
      />
      <p style={textStyle}>
        <span>Made with</span>
        <span style={{ color: "#ff0000" }}>♥</span>
        <span>by</span>
        <span style={highlightStyle}>Noted Team</span>
      </p>
    </footer>
  );
};

export default Footer;
