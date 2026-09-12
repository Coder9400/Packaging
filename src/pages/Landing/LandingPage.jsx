import React from 'react';
import {
  LandingNavbar,
  HeroSection,
  MetricsStrip,
  HowItWorks,
  CategoryGrid,
  FeaturedMaterials,
  CircularImpact,
  CtaSection,
  LandingFooter
} from '../../components/landing';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Sticky Navbar */}
      <LandingNavbar />

      {/* 2. Hero Section with custom SVG flow diagram */}
      <HeroSection />

      {/* 3. Verified Trust / Metrics Strip */}
      <MetricsStrip />

      {/* 4. How It Works (01 List, 02 Discover, 03 Connect, 04 Deliver) */}
      <HowItWorks />

      {/* 5. 6 Material Categories with Lucide icons */}
      <CategoryGrid />

      {/* 6. Featured Materials (6 geometric styled cards, no stock images) */}
      <FeaturedMaterials />

      {/* 7. Circular Impact (visually distinct ESG metrics) */}
      <CircularImpact />

      {/* 8. Turn Surplus into Opportunity CTA */}
      <CtaSection />

      {/* 9. Landing Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
