import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeatureList from './components/FeatureList';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Hero />
        <FeatureList />
      </main>
      <Footer />
    </div>
  );
}

export default App;
