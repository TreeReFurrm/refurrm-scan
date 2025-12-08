import { loadStripe } from '@stripe/stripe-js';
// use process.env.VITE_STRIPE_PUBLISHABLE_KEY in your Vite app
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import SubmissionFilters from '@/components/admin/SubmissionFilters';
import SubmissionCard from '@/components/admin/SubmissionCard';
import AssignmentDialog from '@/components/admin/AssignmentDialog';
import SubmissionDetailsDialog from '@/components/admin/SubmissionDetailsDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    facility: 'all',
    status: 'all',
    priority: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const { toast } = useToast();

  useEffect(() => {
    loadFacilities();
    loadSubmissions();
  }, [filters]);

  const loadFacilities = async () => {
    const { data } = await supabase.from('storage_facilities').select('id, name');
    if (data) setFacilities(data);
  };

  const loadSubmissions = async () => {
    let query = supabase
      .from('facility_submissions')
      .select(`
        *,
        storage_facilities(name),
        submission_assignments(assigned_to, users(email, full_name))
      `)
      .order('created_at', { ascending: false });

    if (filters.facility !== 'all') query = query.eq('facility_id', filters.facility);
    if (filters.status !== 'all') query = query.eq('status', filters.status);
    if (filters.priority !== 'all') query = query.eq('priority', filters.priority);
    if (filters.dateFrom) query = query.gte('created_at', filters.dateFrom);
    if (filters.dateTo) query = query.lte('created_at', filters.dateTo);
    if (filters.search) {
      query = query.or(`unit_number.ilike.%${filters.search}%,tenant_name.ilike.%${filters.search}%`);
    }

    const { data } = await query;
    
    if (data) {
      const formatted = data.map(s => ({
        ...s,
        facility_name: s.storage_facilities?.name,
        assigned_to_name: s.submission_assignments?.[0]?.users?.full_name || 
                         s.submission_assignments?.[0]?.users?.email
      }));
      setSubmissions(formatted);
      
      setStats({
        total: data.length,
        pending: data.filter(s => s.status === 'pending').length,
        inProgress: data.filter(s => s.status === 'in_progress').length,
        completed: data.filter(s => s.status === 'completed').length
      });
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAssign = (id: string) => {
    setSelectedSubmission(id);
    setAssignDialogOpen(true);
  };

  const handleViewDetails = (id: string) => {
    setSelectedSubmission(id);
    setDetailsDialogOpen(true);
  };

  const handleUpdateStatus = async (id: string) => {
    const submission = submissions.find(s => s.id === id);
    const statusOrder = ['pending', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(submission?.status || 'pending');
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    const { error } = await supabase
      .from('facility_submissions')
      .update({ status: nextStatus })
      .eq('id', id);

    if (!error) {
      toast({ title: `Status updated to ${nextStatus}` });
      loadSubmissions();
    }
  };

  const exportReport = () => {
    const csv = [
      ['Unit', 'Tenant', 'Facility', 'Status', 'Priority', 'Date', 'Assigned To'].join(','),
      ...submissions.map(s => [
        s.unit_number,
        s.tenant_name,
        s.facility_name,
        s.status,
        s.priority,
        new Date(s.created_at).toLocaleDateString(),
        s.assigned_to_name || 'Unassigned'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rescue-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F6F4EE] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-['Poppins'] font-bold text-5xl text-[#1C2E25] mb-2">
            Admin Dashboard
          </h1>
          <p className="text-[#315E47] text-lg">Manage rescue operations across all facilities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border-2 border-[#C8BFAE]">
            <p className="text-sm text-[#315E47] mb-1">Total Submissions</p>
            <p className="font-['Poppins'] font-bold text-4xl text-[#1C2E25]">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-[#C8BFAE]">
            <p className="text-sm text-[#315E47] mb-1">Pending</p>
            <p className="font-['Poppins'] font-bold text-4xl text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-[#C8BFAE]">
            <p className="text-sm text-[#315E47] mb-1">In Progress</p>
            <p className="font-['Poppins'] font-bold text-4xl text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-[#C8BFAE]">
            <p className="text-sm text-[#315E47] mb-1">Completed</p>
            <p className="font-['Poppins'] font-bold text-4xl text-green-600">{stats.completed}</p>
          </div>
        </div>

        <div className="mb-6">
          <Button onClick={exportReport} variant="outline">
            Export Report (CSV)
          </Button>
        </div>

        <SubmissionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          facilities={facilities}
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map(submission => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              onViewDetails={handleViewDetails}
              onAssign={handleAssign}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>

        {submissions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No submissions found matching your filters
          </div>
        )}
      </div>

      {selectedSubmission && (
        <>
          <AssignmentDialog
            open={assignDialogOpen}
            onClose={() => setAssignDialogOpen(false)}
            submissionId={selectedSubmission}
            onSuccess={loadSubmissions}
          />
          <SubmissionDetailsDialog
            open={detailsDialogOpen}
            onClose={() => setDetailsDialogOpen(false)}
            submissionId={selectedSubmission}
            onSuccess={loadSubmissions}
          />
        </>
      )}
    </div>
  );
}
