import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>&copy; {new Date().getFullYear()} Antigravity AI, Inc. All rights reserved.</div>
        <div>Designed with precision by Google Deepmind.</div>
      </div>
    </footer>
  );
};

export default Footer;
