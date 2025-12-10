import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Crown, Zap, Users, Heart, Calendar, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PaymentSuccess } from '@/components/PaymentSuccess';
import { useSearchParams } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Donation {
  id: string;
  amount: number;
  created_at: string;
  rescue_id: string | null;
  status: string;
  is_recurring: boolean;
  frequency: string;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
}



export default function Profile() {
  const { profile, updateProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState<'donation' | 'subscription'>('donation');
  const { toast } = useToast();

  useEffect(() => {
    const upgrade = searchParams.get('upgrade');
    const donation = searchParams.get('donation');
    
    if (upgrade === 'success') {
      setSuccessType('subscription');
      setShowSuccess(true);
      setSearchParams({});
    } else if (donation === 'success') {
      setSuccessType('donation');
      setShowSuccess(true);
      setSearchParams({});
    } else if (upgrade === 'canceled' || donation === 'canceled') {
      toast({
        title: 'Payment Canceled',
        description: 'Your payment was canceled. No charges were made.',
        variant: 'destructive'
      });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, toast]);


  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      fetchDonations();
    }
  }, [profile]);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('user_id', profile?.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setDonationsLoading(false);
    }
  };


  const totalDonated = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const recurringDonations = donations.filter(d => d.is_recurring && d.subscription_status === 'active');
  const activeSubscriptions = recurringDonations.reduce((acc, d) => {
    if (!acc.find(s => s.stripe_subscription_id === d.stripe_subscription_id)) {
      acc.push(d);
    }
    return acc;
  }, [] as Donation[]);

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId }
      });
      
      if (error) throw error;
      
      toast({ 
        title: 'Subscription Canceled', 
        description: 'Your recurring donation has been canceled.' 
      });
      
      fetchDonations();
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ full_name: fullName, phone, address });
      toast({ title: 'Success!', description: 'Your profile has been updated.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'ambassador': return <Badge className="bg-gradient-to-r from-[#315E47] to-[#50E3E3] text-white"><Crown className="w-3 h-3 mr-1" />Ambassador</Badge>;
      case 'admin': return <Badge className="bg-red-600"><Crown className="w-3 h-3 mr-1" />Admin</Badge>;
      case 'buyer': return <Badge className="bg-blue-600"><Zap className="w-3 h-3 mr-1" />Buyer</Badge>;
      case 'volunteer': return <Badge className="bg-green-600"><Users className="w-3 h-3 mr-1" />Volunteer</Badge>;
      case 'family': return <Badge className="bg-primary-500"><Users className="w-3 h-3 mr-1" />Family</Badge>;
      default: return <Badge>{role}</Badge>;
    }
  };

  const getSubscriptionBadge = (tier?: string) => {
    if (tier === 'pro') return <Badge className="bg-[#50E3E3] text-white">Pro - $29/month</Badge>;
    return <Badge variant="outline">Community - Free</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showSuccess && (
        <PaymentSuccess 
          type={successType} 
          onClose={() => setShowSuccess(false)} 
        />
      )}
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>Your ReFURRM membership details</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Role</Label>
                  <div className="mt-1">{getRoleBadge(profile?.role || '')}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Subscription Plan</Label>
                  <div className="mt-1">{getSubscriptionBadge(profile?.subscription_tier)}</div>
                </div>
              </div>
              {profile?.role === 'ambassador' && (
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-800">
                    <Crown className="w-4 h-4 inline mr-1" />
                    You are an approved Ambassador with access to leadership tools and rescue coordination features.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile?.email || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {activeSubscriptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Recurring Donations
                </CardTitle>
                <CardDescription>
                  Manage your automatic monthly or annual donations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeSubscriptions.map((subscription) => (
                    <div key={subscription.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-primary-500 rounded-lg border border-blue-200">
                      <div>
                        <p className="font-bold text-lg text-[#315E47]">
                          ${Number(subscription.amount).toFixed(2)} / {subscription.frequency === 'monthly' ? 'month' : 'year'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Started {new Date(subscription.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <Badge className="mt-2 bg-green-100 text-green-700 border-green-300">
                          Active
                        </Badge>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Recurring Donation?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this ${Number(subscription.amount).toFixed(2)} {subscription.frequency} donation? 
                              You can always set up a new recurring donation later.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Donation</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleCancelSubscription(subscription.stripe_subscription_id!)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Cancel Donation
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Your Donation History
              </CardTitle>
              <CardDescription>
                Total donated: ${totalDonated.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {donationsLoading ? (
                <p className="text-gray-500">Loading donations...</p>
              ) : donations.length === 0 ? (
                <p className="text-gray-500">No donations yet. Thank you for considering supporting our mission!</p>
              ) : (
                <div className="space-y-3">
                  {donations.map((donation) => (
                    <div key={donation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-[#315E47]">${Number(donation.amount).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(donation.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Completed
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
