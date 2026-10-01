import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { WhatIsCollabSphere } from '../components/landing/WhatIsCollabSphere';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';

export const LandingPage = () => {
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <Navbar />
      <main>
        <Hero />
        <WhatIsCollabSphere />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};
