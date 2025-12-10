
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ImpactFeed from '@/components/ImpactFeed';
import SubscriptionPlans from '@/components/SubscriptionPlans';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-20 space-y-16">
        <Hero />
        <div className="max-w-6xl mx-auto px-4">
          <ImpactFeed />
        </div>
        <SubscriptionPlans />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
