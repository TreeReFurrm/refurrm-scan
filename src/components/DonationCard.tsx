import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Heart } from 'lucide-react';

interface DonationCardProps {
  rescueId?: string;
  title?: string;
  description?: string;
}

export function DonationCard({ rescueId, title = "Support Rescue Missions", description = "Every dollar helps reunite families with their belongings" }: DonationCardProps) {
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState<'one-time' | 'monthly' | 'annual'>('one-time');

  const presetAmounts = [25, 50, 100, 250];

  const handleDonate = async () => {
    const donationAmount = amount || parseFloat(customAmount);
    
    if (!donationAmount || donationAmount < 1) {
      alert('Please enter a valid donation amount');
      return;
    }

    setLoading(true);
    try {
      if (frequency === 'one-time') {
        const { data, error } = await supabase.functions.invoke('create-donation-checkout', {
          body: { amount: donationAmount, rescueId: rescueId || null }
        });
        if (error) throw error;
        if (data?.url) window.location.href = data.url;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.functions.invoke('create-recurring-donation', {
          body: { 
            amount: donationAmount, 
            frequency,
            userId: user?.id,
            rescueId: rescueId || null,
            donorEmail: user?.email || '',
            donorName: user?.user_metadata?.full_name || ''
          }
        });
        if (error) throw error;
        if (data?.url) window.location.href = data.url;
      }
    } catch (err) {
      console.error('Donation error:', err);
      alert('Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-bg-primary-500 border-2 border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <Tabs value={frequency} onValueChange={(v) => setFrequency(v as any)} className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="one-time">One-Time</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="annual">Annual</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {presetAmounts.map((preset) => (
          <Button
            key={preset}
            variant={amount === preset ? "default" : "outline"}
            onClick={() => { setAmount(preset); setCustomAmount(''); }}
            className="h-14 text-lg font-semibold"
          >
            ${preset}{frequency !== 'one-time' && `/${frequency === 'monthly' ? 'mo' : 'yr'}`}
          </Button>
        ))}
      </div>

      <Input
        type="number"
        placeholder="Custom amount"
        value={customAmount}
        onChange={(e) => { setCustomAmount(e.target.value); setAmount(null); }}
        className="h-12 text-lg mb-4"
      />

      <Button 
        onClick={handleDonate} 
        disabled={loading || (!amount && !customAmount)}
        className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-bg-primary-500 hover:from-blue-700 hover:to-primary-700"
      >
        {loading ? 'Processing...' : frequency === 'one-time' ? 'Donate Now' : 'Start Recurring Donation'}
      </Button>
    </Card>
  );
}
