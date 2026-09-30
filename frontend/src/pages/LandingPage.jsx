import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { TrustStrip } from '../components/landing/TrustStrip';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { DarkShowcase } from '../components/landing/DarkShowcase';
import { ShowcaseSection } from '../components/landing/ShowcaseSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';

export const LandingPage = () => {
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <FeaturesGrid />
        <DarkShowcase />
        <ShowcaseSection />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};
