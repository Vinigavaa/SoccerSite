import React from 'react';
import ClubHeader from '@/components/ClubHeader';
import NextMatch from '@/components/NextMatch';
import TeamSection from '@/components/TeamSection';
import NewsSection from '@/components/NewsSection';
import TeamStats from '@/components/TeamStats';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <ClubHeader />
        <NextMatch />
        <TeamSection />
        <TeamStats />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
