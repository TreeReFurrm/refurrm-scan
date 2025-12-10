import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, Users, Zap, Crown } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';


const plans = [
  {
    tier: 'free',
    name: 'Community',
    price: 0,
    icon: Users,
    description: 'Open to everyone',
    features: [
      'Access Rescue Network',
      'Submit Help Requests',
      'View Impact Feed',
      'Basic Volunteer Tools',
      'Community Support',
      'Access to Lien Law Library'
    ]
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: 29,
    icon: Zap,
    popular: true,
    description: 'Marketplace Tools',
    features: [
      'Everything in Community',
      'AI Unit Scanner',
      'AI Item Scanner',
      'ROI Analytics',
      'Auction Alerts & Bookmarks',
      'Priority Support',
      'Ethical Buyer Badge'
    ]
  }
];

const SubscriptionPlans = () => {
  const { currentUser, setCurrentUser } = useAppContext();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubscribe = async (tier: string) => {
    if (!user) {
      router.push('/signup');
      return;
    }

    if (tier === 'pro') {
      try {
        const { data, error } = await supabase.functions.invoke('create-pro-subscription', {
          body: { 
            userId: user.id,
            userEmail: user.email,
            userName: user.user_metadata?.full_name || ''
          }
        });
        
        if (error) throw error;
        if (data?.url) {
          window.location.href = data.url;
        }
      } catch (err) {
        console.error('Subscription error:', err);
        toast({
          title: 'Error',
          description: 'Failed to start subscription. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };


  return (
    <section className="py-20 bg-[#F6F4EE]" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1C2E25] mb-4">Choose Your Plan</h2>
          <p className="text-lg text-[#315E47]">Join the movement to reform storage auctions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {plans.map(plan => {
            const Icon = plan.icon;
            return (
              <Card key={plan.tier} className={`relative ${plan.popular ? 'border-[#50E3E3] border-2 shadow-xl' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#50E3E3]">Most Popular</Badge>
                )}
                <CardHeader className="text-center">
                  <Icon className="w-12 h-12 text-[#315E47] mx-auto mb-4" />
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-[#315E47]">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#315E47] flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => handleSubscribe(plan.tier)}
                    className={`w-full ${plan.popular ? 'bg-[#50E3E3] hover:bg-[#50E3E3]/90' : 'bg-[#315E47]'}`}
                    disabled={currentUser?.subscription === plan.tier}
                  >
                    {currentUser?.subscription === plan.tier ? 'Current Plan' : 
                     plan.tier === 'free' ? 'Get Started Free' : 'Upgrade to Pro'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-[#315E47] to-[#1C2E25] text-white">
          <CardHeader className="text-center">
            <Crown className="w-12 h-12 text-[#50E3E3] mx-auto mb-4" />
            <CardTitle className="text-2xl">Ambassador Program</CardTitle>
            <p className="text-sm text-gray-300">Invitation Only - Leadership Role</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">What Ambassadors Get:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#50E3E3] flex-shrink-0 mt-0.5" />
                    <span>Everything in Community (Free)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#50E3E3] flex-shrink-0 mt-0.5" />
                    <span>Access to Admin & Rescue Dashboards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#50E3E3] flex-shrink-0 mt-0.5" />
                    <span>Coordinate Local Rescue Requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#50E3E3] flex-shrink-0 mt-0.5" />
                    <span>Host Donation Drives & Events</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">&nbsp;</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#50E3E3] flex-shrink-0 mt-0.5" />
                    <span>Early Franchise Pilot Participation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#50E3E3] flex-shrink-0 mt-0.5" />
                    <span>Ambassador Badge & Recognition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#50E3E3] flex-shrink-0 mt-0.5" />
                    <span>Dedicated Support from ReFURRM HQ</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm mb-4">Ambassadors are approved lead volunteers managing outreach and pilot programs</p>
              <Button variant="outline" className="bg-white text-[#315E47] hover:bg-gray-100">
                Apply to Become an Ambassador
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SubscriptionPlans;
