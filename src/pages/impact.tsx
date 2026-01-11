import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StatsOverview from '@/components/impact/StatsOverview';
import UnitsChart from '@/components/impact/UnitsChart';
import ItemsComparisonChart from '@/components/impact/ItemsComparisonChart';
import FundsChart from '@/components/impact/FundsChart';
import RecentDonationsFeed from '@/components/RecentDonationsFeed';
import { Button } from '@/components/ui/button';


export default function ImpactDashboard() {
  const [timePeriod, setTimePeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-[#F6F4EE]">
      <Navigation />
      
      <div className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-[#315E47] mb-4">
              Impact Dashboard
            </h1>
            <p className="font-['Open_Sans'] text-lg text-gray-700 mb-6">
              Real-time statistics showing the collective impact of the ReFURRM community
            </p>
            
            {/* Time Period Toggle */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setTimePeriod('monthly')}
                variant={timePeriod === 'monthly' ? 'default' : 'outline'}
                className={timePeriod === 'monthly' ? 'bg-[#315E47]' : ''}
              >
                Monthly View
              </Button>
              <Button
                onClick={() => setTimePeriod('yearly')}
                variant={timePeriod === 'yearly' ? 'default' : 'outline'}
                className={timePeriod === 'yearly' ? 'bg-[#315E47]' : ''}
              >
                Yearly View
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <StatsOverview />

          {/* Charts and Donations Grid */}
          <div className="mt-12 space-y-8">
            <UnitsChart />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ItemsComparisonChart />
              <FundsChart />
              <RecentDonationsFeed />
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
