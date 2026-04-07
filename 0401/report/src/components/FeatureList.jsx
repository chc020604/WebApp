import React from 'react';
import FeatureItem from './FeatureItem';

const FeatureList = () => {
  const features = [
    {
      id: 1,
      icon: '🚀',
      title: 'Autonomous Coding',
      description: 'Antigravity understands your context and writes robust code independently, reducing development time by 50%.',
      highlightColor: '#ef4444'
    },
    {
      id: 2,
      icon: '🧠',
      title: 'Intelligent Debugging',
      description: 'Quickly identity and fix complex bugs across your entire codebase with deep semantic understanding.',
      highlightColor: '#3b82f6'
    },
    {
      id: 3,
      icon: '🏗️',
      title: 'Advanced Planning',
      description: 'Generates comprehensive execution plans for large scale architectural refactoring and API integrations.',
      highlightColor: '#10b981'
    }
  ];

  return (
    <section id="features" className="features">
      <h2 className="features-title">Unparalleled Capabilities</h2>
      <div className="features-grid">
        {features.map((feature) => (
          <FeatureItem
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            highlightColor={feature.highlightColor}
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureList;
