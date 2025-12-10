import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FacilityStats } from '@/components/facility/FacilityStats';
import { SubmitRescueForm } from '@/components/facility/SubmitRescueForm';
import { BulkSubmissionForm } from '@/components/facility/BulkSubmissionForm';
import { SubmissionsList } from '@/components/facility/SubmissionsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/router';

export default function FacilityPortal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [facility, setFacility] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupMode, setSetupMode] = useState(false);
  const [formData, setFormData] = useState({
    facilityName: '',
    contactName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadFacilityData();
  }, [user, router]);

  const loadFacilityData = async () => {
    try {
      const { data: facilityData } = await supabase
        .from('storage_facilities')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (facilityData) {
        setFacility(facilityData);
        loadSubmissions(facilityData.id);
      } else {
        setSetupMode(true);
      }
    } catch (error) {
      console.error('Error loading facility:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async (facilityId: string) => {
    const { data } = await supabase
      .from('facility_submissions')
      .select('*')
      .eq('facility_id', facilityId)
      .order('created_at', { ascending: false });
    setSubmissions(data || []);
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('storage_facilities').insert({
        user_id: user?.id,
        facility_name: formData.facilityName,
        contact_name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip
      }).select().single();

      if (error) throw error;
      setFacility(data);
      setSetupMode(false);
      toast({ title: 'Success!', description: 'Facility profile created successfully.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (setupMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Facility Registration
              </CardTitle>
              <CardDescription>Register your storage facility to start submitting rescue requests</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetup} className="space-y-4">
                <div>
                  <Label htmlFor="facilityName">Facility Name *</Label>
                  <Input id="facilityName" required value={formData.facilityName} onChange={(e) => setFormData({...formData, facilityName: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input id="contactName" required value={formData.contactName} onChange={(e) => setFormData({...formData, contactName: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP *</Label>
                    <Input id="zip" required value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} />
                  </div>
                </div>
                <Button type="submit" className="w-full">Complete Registration</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stats = {
    totalUnits: submissions.length,
    unitsRescued: submissions.filter(s => s.status === 'completed').length,
    familiesHelped: facility?.families_helped || 0,
    activeRequests: submissions.filter(s => s.status === 'pending' || s.status === 'in_progress').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://d64gsuwffb70l.cloudfront.net/690c55f62a1c1509e277d961_1762491300212_845ff4fb.webp)' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">{facility?.facility_name}</h1>
            <p className="text-xl">Partner Facility Portal</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <FacilityStats {...stats} />

        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submit">Submit Request</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
            <TabsTrigger value="history">Submission History</TabsTrigger>
          </TabsList>

          <TabsContent value="submit">
            <SubmitRescueForm facilityId={facility?.id} onSuccess={() => loadSubmissions(facility?.id)} />
          </TabsContent>

          <TabsContent value="bulk">
            <BulkSubmissionForm facilityId={facility?.id} onSuccess={() => loadSubmissions(facility?.id)} />
          </TabsContent>

          <TabsContent value="history">
            <SubmissionsList submissions={submissions} />
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Your Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              Through your partnership with ReFURRM, you've helped <span className="font-bold text-blue-600">{facility?.families_helped || 0} families</span> reunite with their belongings and avoid the trauma of losing their possessions to auction.
            </p>
            <p className="text-muted-foreground">
              Every unit you submit helps us identify families in crisis and provide them with the support they need to recover their belongings before it's too late.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
