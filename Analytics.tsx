import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RescueTimeChart } from '@/components/analytics/RescueTimeChart';
import { FacilitySuccessChart } from '@/components/analytics/FacilitySuccessChart';
import { VolunteerPerformanceChart } from '@/components/analytics/VolunteerPerformanceChart';
import { CostAnalysisChart } from '@/components/analytics/CostAnalysisChart';
import { TrendPredictionChart } from '@/components/analytics/TrendPredictionChart';
import { geographicData } from '@/data/analyticsData';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/690c55f62a1c1509e277d961_1762492673236_0ed85f66.webp"
          alt="Analytics Dashboard"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-bg-primary-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="mb-4 text-5xl font-bold">Rescue Analytics</h1>
            <p className="text-xl">Data-driven insights for better operations</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Key Metrics */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Rescues</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">489</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.8 days</div>
              <p className="text-xs text-green-600">-18% improvement</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+8 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Cost Saved</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$35.7K</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RescueTimeChart />
          <FacilitySuccessChart />
          <VolunteerPerformanceChart />
          <CostAnalysisChart />
          <div className="lg:col-span-2">
            <TrendPredictionChart />
          </div>
        </div>

        {/* Geographic Heat Map */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Rescue operations by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geographicData.map((location) => (
                <div key={location.city} className="flex items-center justify-between">
                  <span className="font-medium">{location.city}</span>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                      <div 
                        className="h-full bg-blue-600"
                        style={{ width: `${(location.rescues / 145) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm font-medium">{location.rescues}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
