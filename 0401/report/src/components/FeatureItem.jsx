import React from 'react';

const FeatureItem = ({ icon, title, description, highlightColor }) => {
  return (
    <div className="feature-item glass" style={{ borderTop: `2px solid ${highlightColor || 'var(--glass-border)'}` }}>
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureItem;
